/**
 * MoneyWorks Gold UI Automation
 *
 * Uses AppleScript and cliclick for controlling MoneyWorks Gold on macOS.
 * Requires Accessibility permissions for Terminal/iTerm.
 */

import { $ } from "bun";

const MW_GOLD_PROCESS = "MoneyWorks Gold";

/**
 * Execute AppleScript and return result
 */
export async function runAppleScript(script: string): Promise<string> {
  const result = await $`osascript -e ${script}`.text();
  return result.trim();
}

/**
 * Execute multi-line AppleScript
 */
export async function runAppleScriptFile(script: string): Promise<string> {
  const result = await $`osascript -e ${script}`.text();
  return result.trim();
}

/**
 * Activate MoneyWorks Gold (bring to front)
 */
export async function activateMWGold(): Promise<void> {
  await runAppleScript(`tell application "${MW_GOLD_PROCESS}" to activate`);
  // Small delay to ensure window is focused
  await Bun.sleep(300);
}

/**
 * Check if MoneyWorks Gold is running
 */
export async function isMWGoldRunning(): Promise<boolean> {
  const script = `
    tell application "System Events"
      return (name of processes) contains "${MW_GOLD_PROCESS}"
    end tell
  `;
  const result = await runAppleScript(script);
  return result === "true";
}

/**
 * Get MoneyWorks Gold window bounds
 */
export async function getWindowBounds(): Promise<{ x: number; y: number; width: number; height: number }> {
  const script = `
    tell application "System Events"
      tell process "${MW_GOLD_PROCESS}"
        set winPos to position of window 1
        set winSize to size of window 1
        return (item 1 of winPos) & "," & (item 2 of winPos) & "," & (item 1 of winSize) & "," & (item 2 of winSize)
      end tell
    end tell
  `;
  const result = await runAppleScript(script);
  const [x, y, width, height] = result.split(",").map(Number);
  return { x, y, width, height };
}

/**
 * Take screenshot of MoneyWorks Gold window
 */
export async function screenshotWindow(outputPath: string): Promise<string> {
  await activateMWGold();
  await Bun.sleep(200);

  // Get window ID
  const windowIdScript = `
    tell application "System Events"
      tell process "${MW_GOLD_PROCESS}"
        return id of window 1
      end tell
    end tell
  `;

  // Try window capture first, fall back to screen capture
  try {
    // Capture the frontmost window
    await $`screencapture -l $(osascript -e 'tell app "${MW_GOLD_PROCESS}" to id of window 1') ${outputPath}`.quiet();
  } catch {
    // Fallback: capture entire screen
    await $`screencapture -x ${outputPath}`.quiet();
  }

  return outputPath;
}

/**
 * Take screenshot and return as base64
 */
export async function screenshotWindowBase64(): Promise<string> {
  const tmpPath = `/tmp/mw-gold-screenshot-${Date.now()}.png`;
  await screenshotWindow(tmpPath);
  const file = Bun.file(tmpPath);
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  await $`rm ${tmpPath}`.quiet();
  return base64;
}

/**
 * Click at specific coordinates
 */
export async function click(x: number, y: number): Promise<void> {
  await activateMWGold();
  try {
    await $`cliclick c:${x},${y}`.quiet();
  } catch {
    // Fallback to AppleScript if cliclick not installed
    const script = `
      tell application "System Events"
        click at {${x}, ${y}}
      end tell
    `;
    await runAppleScript(script);
  }
}

/**
 * Double-click at specific coordinates
 */
export async function doubleClick(x: number, y: number): Promise<void> {
  await activateMWGold();
  try {
    await $`cliclick dc:${x},${y}`.quiet();
  } catch {
    const script = `
      tell application "System Events"
        click at {${x}, ${y}}
        delay 0.1
        click at {${x}, ${y}}
      end tell
    `;
    await runAppleScript(script);
  }
}

/**
 * Type text into focused field
 */
export async function typeText(text: string): Promise<void> {
  try {
    await $`cliclick t:${text}`.quiet();
  } catch {
    const script = `
      tell application "System Events"
        keystroke "${text.replace(/"/g, '\\"')}"
      end tell
    `;
    await runAppleScript(script);
  }
}

/**
 * Press a key or key combination
 */
export async function pressKey(key: string): Promise<void> {
  const keyMap: Record<string, string> = {
    "enter": "return",
    "return": "return",
    "tab": "tab",
    "escape": "escape",
    "esc": "escape",
    "delete": "delete",
    "backspace": "delete",
    "up": "up arrow",
    "down": "down arrow",
    "left": "left arrow",
    "right": "right arrow",
  };

  const mappedKey = keyMap[key.toLowerCase()] || key;

  // Check for modifier keys
  const hasCmd = key.toLowerCase().includes("cmd+") || key.toLowerCase().includes("command+");
  const hasShift = key.toLowerCase().includes("shift+");
  const hasAlt = key.toLowerCase().includes("alt+") || key.toLowerCase().includes("option+");
  const hasCtrl = key.toLowerCase().includes("ctrl+") || key.toLowerCase().includes("control+");

  let baseKey = key
    .replace(/cmd\+/i, "")
    .replace(/command\+/i, "")
    .replace(/shift\+/i, "")
    .replace(/alt\+/i, "")
    .replace(/option\+/i, "")
    .replace(/ctrl\+/i, "")
    .replace(/control\+/i, "");

  baseKey = keyMap[baseKey.toLowerCase()] || baseKey;

  let modifiers: string[] = [];
  if (hasCmd) modifiers.push("command down");
  if (hasShift) modifiers.push("shift down");
  if (hasAlt) modifiers.push("option down");
  if (hasCtrl) modifiers.push("control down");

  const modifierStr = modifiers.length > 0 ? ` using {${modifiers.join(", ")}}` : "";

  const script = `
    tell application "System Events"
      key code ${getKeyCode(baseKey)}${modifierStr}
    end tell
  `;

  // Simpler approach for common keys
  if (modifiers.length === 0 && keyMap[key.toLowerCase()]) {
    const simpleScript = `
      tell application "System Events"
        keystroke ${mappedKey}
      end tell
    `;
    try {
      await runAppleScript(simpleScript);
      return;
    } catch {
      // Fall through to key code approach
    }
  }

  // Use keystroke for simple keys
  if (modifiers.length === 0 && baseKey.length === 1) {
    const script = `
      tell application "System Events"
        keystroke "${baseKey}"
      end tell
    `;
    await runAppleScript(script);
  } else if (hasCmd && baseKey.length === 1) {
    const script = `
      tell application "System Events"
        keystroke "${baseKey.toLowerCase()}" using command down
      end tell
    `;
    await runAppleScript(script);
  } else {
    // For special keys
    const script = `
      tell application "System Events"
        key code ${getKeyCode(baseKey)}${modifierStr}
      end tell
    `;
    await runAppleScript(script);
  }
}

/**
 * Get key code for special keys
 */
function getKeyCode(key: string): number {
  const codes: Record<string, number> = {
    "return": 36,
    "tab": 48,
    "space": 49,
    "delete": 51,
    "escape": 53,
    "up arrow": 126,
    "down arrow": 125,
    "left arrow": 123,
    "right arrow": 124,
    "f1": 122,
    "f2": 120,
    "f3": 99,
    "f4": 118,
    "f5": 96,
    "f6": 97,
    "f7": 98,
    "f8": 100,
  };
  return codes[key.toLowerCase()] || 0;
}

/**
 * Open a menu item by path
 */
export async function openMenu(menuPath: string): Promise<void> {
  await activateMWGold();
  await Bun.sleep(200);

  const parts = menuPath.split("/").map(p => p.trim());

  if (parts.length === 1) {
    // Just click the menu
    const script = `
      tell application "System Events"
        tell process "${MW_GOLD_PROCESS}"
          click menu bar item "${parts[0]}" of menu bar 1
        end tell
      end tell
    `;
    await runAppleScript(script);
  } else if (parts.length === 2) {
    // Menu > Item
    const script = `
      tell application "System Events"
        tell process "${MW_GOLD_PROCESS}"
          click menu item "${parts[1]}" of menu "${parts[0]}" of menu bar 1
        end tell
      end tell
    `;
    await runAppleScript(script);
  } else if (parts.length >= 3) {
    // Menu > Submenu > Item
    let script = `
      tell application "System Events"
        tell process "${MW_GOLD_PROCESS}"
          click menu bar item "${parts[0]}" of menu bar 1
          delay 0.2
    `;

    for (let i = 1; i < parts.length - 1; i++) {
      script += `
          click menu item "${parts[i]}" of menu "${parts[i-1] || parts[0]}" of menu bar 1
          delay 0.2
      `;
    }

    script += `
          click menu item "${parts[parts.length - 1]}" of menu "${parts[parts.length - 2]}" of menu bar 1
        end tell
      end tell
    `;
    await runAppleScript(script);
  }
}

/**
 * Get list of menu items
 */
export async function getMenuItems(menuName: string): Promise<string[]> {
  const script = `
    tell application "System Events"
      tell process "${MW_GOLD_PROCESS}"
        set menuItems to name of every menu item of menu "${menuName}" of menu bar 1
        set AppleScript's text item delimiters to "|||"
        return menuItems as text
      end tell
    end tell
  `;
  const result = await runAppleScript(script);
  return result.split("|||").filter(Boolean);
}

/**
 * Get all UI elements (buttons, fields, etc.) in the frontmost window
 */
export async function getUIElements(): Promise<string> {
  const script = `
    tell application "System Events"
      tell process "${MW_GOLD_PROCESS}"
        set windowElements to entire contents of window 1
        set elementList to {}
        repeat with elem in windowElements
          try
            set elemClass to class of elem as text
            set elemName to ""
            try
              set elemName to name of elem
            end try
            set elemDesc to ""
            try
              set elemDesc to description of elem
            end try
            set end of elementList to elemClass & ": " & elemName & " (" & elemDesc & ")"
          end try
        end repeat
        set AppleScript's text item delimiters to "\\n"
        return elementList as text
      end tell
    end tell
  `;
  return await runAppleScript(script);
}

/**
 * Click a button by name
 */
export async function clickButton(buttonName: string): Promise<void> {
  await activateMWGold();
  const script = `
    tell application "System Events"
      tell process "${MW_GOLD_PROCESS}"
        click button "${buttonName}" of window 1
      end tell
    end tell
  `;
  await runAppleScript(script);
}

/**
 * Click a button in a dialog/sheet
 */
export async function clickDialogButton(buttonName: string): Promise<void> {
  await activateMWGold();
  const script = `
    tell application "System Events"
      tell process "${MW_GOLD_PROCESS}"
        try
          click button "${buttonName}" of sheet 1 of window 1
        on error
          try
            click button "${buttonName}" of window 1
          on error
            click button "${buttonName}" of front window
          end try
        end try
      end tell
    end tell
  `;
  await runAppleScript(script);
}

/**
 * Set value of a text field by name or index
 */
export async function setTextField(fieldIdentifier: string | number, value: string): Promise<void> {
  await activateMWGold();
  const fieldSelector = typeof fieldIdentifier === "number"
    ? `text field ${fieldIdentifier}`
    : `text field "${fieldIdentifier}"`;

  const script = `
    tell application "System Events"
      tell process "${MW_GOLD_PROCESS}"
        set value of ${fieldSelector} of window 1 to "${value.replace(/"/g, '\\"')}"
      end tell
    end tell
  `;
  await runAppleScript(script);
}

/**
 * Wait for a window/dialog with specific title
 */
export async function waitForWindow(titleContains: string, timeoutMs: number = 5000): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const script = `
      tell application "System Events"
        tell process "${MW_GOLD_PROCESS}"
          try
            set winTitle to name of window 1
            return winTitle
          on error
            return ""
          end try
        end tell
      end tell
    `;
    const title = await runAppleScript(script);
    if (title.toLowerCase().includes(titleContains.toLowerCase())) {
      return true;
    }
    await Bun.sleep(200);
  }

  return false;
}

/**
 * Get current window title
 */
export async function getWindowTitle(): Promise<string> {
  const script = `
    tell application "System Events"
      tell process "${MW_GOLD_PROCESS}"
        try
          return name of window 1
        on error
          return ""
        end try
      end tell
    end tell
  `;
  return await runAppleScript(script);
}

/**
 * List all windows
 */
export async function listWindows(): Promise<string[]> {
  const script = `
    tell application "System Events"
      tell process "${MW_GOLD_PROCESS}"
        set windowNames to name of every window
        set AppleScript's text item delimiters to "|||"
        return windowNames as text
      end tell
    end tell
  `;
  const result = await runAppleScript(script);
  return result.split("|||").filter(Boolean);
}
