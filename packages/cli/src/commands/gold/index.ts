/**
 * MoneyWorks Gold CLI Commands
 *
 * Commands for automating MoneyWorks Gold UI
 */

import * as automation from "./automation";
import * as path from "path";

const HELP = `
MoneyWorks Gold UI Automation (requires Accessibility permissions)

Usage: mw gold <command> [options]

Commands:
  status              Check if MoneyWorks Gold is running
  screenshot          Take screenshot of MW Gold window
  activate            Bring MW Gold to front
  menu <path>         Open a menu item (e.g., 'Transactions/New Transaction…')
  menu-items <menu>   List items in a menu
  click <x> <y>       Click at coordinates
  double-click <x> <y> Double-click at coordinates
  button <name>       Click a button by name
  type <text>         Type text into focused field
  key <key>           Press a key (enter, tab, escape, cmd+s)
  window              Get window information
  ui-elements         List UI elements in window
  wait <title>        Wait for window with title

Options:
  -o, --output <file>  Output path for screenshot
  -d, --dialog         Button is in a dialog (for button command)
  -t, --timeout <ms>   Timeout for wait command (default: 5000)
  -h, --help           Show help

Examples:
  mw gold status
  mw gold screenshot -o invoice.png
  mw gold menu "Transactions/New Transaction…"
  mw gold button OK -d
  mw gold type "CUST001"
  mw gold key enter
  mw gold wait "Sales Invoice"
`;

export async function goldCommand(args: string[]): Promise<void> {
  const subcommand = args[0];

  if (!subcommand || subcommand === "--help" || subcommand === "-h") {
    console.log(HELP);
    return;
  }

  switch (subcommand) {
    case "status":
      await statusCommand();
      break;

    case "screenshot":
      await screenshotCommand(args.slice(1));
      break;

    case "activate":
      await activateCommand();
      break;

    case "menu":
      await menuCommand(args.slice(1));
      break;

    case "menu-items":
      await menuItemsCommand(args.slice(1));
      break;

    case "click":
      await clickCommand(args.slice(1));
      break;

    case "double-click":
      await doubleClickCommand(args.slice(1));
      break;

    case "button":
      await buttonCommand(args.slice(1));
      break;

    case "type":
      await typeCommand(args.slice(1));
      break;

    case "key":
      await keyCommand(args.slice(1));
      break;

    case "window":
      await windowCommand();
      break;

    case "ui-elements":
      await uiElementsCommand();
      break;

    case "wait":
      await waitCommand(args.slice(1));
      break;

    default:
      console.error(`Unknown gold command: ${subcommand}`);
      console.error(`Run 'mw gold --help' for available commands`);
      process.exit(1);
  }
}

async function requireMWGold(): Promise<void> {
  const running = await automation.isMWGoldRunning();
  if (!running) {
    console.error("❌ MoneyWorks Gold is not running");
    process.exit(1);
  }
}

async function statusCommand(): Promise<void> {
  const running = await automation.isMWGoldRunning();
  if (running) {
    console.log("✅ MoneyWorks Gold is running");
    const title = await automation.getWindowTitle();
    console.log(`   Window: ${title}`);
    const windows = await automation.listWindows();
    if (windows.length > 1) {
      console.log(`   All windows: ${windows.join(", ")}`);
    }
  } else {
    console.log("❌ MoneyWorks Gold is not running");
  }
}

async function screenshotCommand(args: string[]): Promise<void> {
  await requireMWGold();

  let outputPath = "./mw-gold-screenshot.png";
  const outputIdx = args.indexOf("-o");
  if (outputIdx !== -1 && args[outputIdx + 1]) {
    outputPath = args[outputIdx + 1];
  }
  const outputIdx2 = args.indexOf("--output");
  if (outputIdx2 !== -1 && args[outputIdx2 + 1]) {
    outputPath = args[outputIdx2 + 1];
  }

  const fullPath = path.resolve(outputPath);
  console.log("📸 Taking screenshot...");
  await automation.screenshotWindow(fullPath);
  console.log(`✅ Screenshot saved to: ${fullPath}`);
}

async function activateCommand(): Promise<void> {
  await automation.activateMWGold();
  console.log("✅ MoneyWorks Gold activated");
}

async function menuCommand(args: string[]): Promise<void> {
  await requireMWGold();

  const menuPath = args[0];
  if (!menuPath) {
    console.error("Usage: mw gold menu <path>");
    console.error("Example: mw gold menu 'Transactions/New Transaction…'");
    process.exit(1);
  }

  console.log(`📋 Opening menu: ${menuPath}`);
  try {
    await automation.openMenu(menuPath);
    console.log("✅ Menu opened");
  } catch (error) {
    console.error("❌ Failed to open menu:", error);
    process.exit(1);
  }
}

async function menuItemsCommand(args: string[]): Promise<void> {
  await requireMWGold();

  const menuName = args[0];
  if (!menuName) {
    console.error("Usage: mw gold menu-items <menu>");
    console.error("Example: mw gold menu-items File");
    process.exit(1);
  }

  console.log(`📋 Items in '${menuName}' menu:`);
  try {
    const items = await automation.getMenuItems(menuName);
    for (const item of items) {
      console.log(`   - ${item || "(separator)"}`);
    }
  } catch (error) {
    console.error("❌ Failed to get menu items:", error);
    process.exit(1);
  }
}

async function clickCommand(args: string[]): Promise<void> {
  await requireMWGold();

  const [x, y] = args;
  if (!x || !y) {
    console.error("Usage: mw gold click <x> <y>");
    process.exit(1);
  }

  console.log(`🖱️ Clicking at (${x}, ${y})...`);
  await automation.click(parseInt(x), parseInt(y));
  console.log("✅ Clicked");
}

async function doubleClickCommand(args: string[]): Promise<void> {
  await requireMWGold();

  const [x, y] = args;
  if (!x || !y) {
    console.error("Usage: mw gold double-click <x> <y>");
    process.exit(1);
  }

  console.log(`🖱️ Double-clicking at (${x}, ${y})...`);
  await automation.doubleClick(parseInt(x), parseInt(y));
  console.log("✅ Double-clicked");
}

async function buttonCommand(args: string[]): Promise<void> {
  await requireMWGold();

  const buttonName = args.filter(a => !a.startsWith("-"))[0];
  if (!buttonName) {
    console.error("Usage: mw gold button <name> [-d|--dialog]");
    process.exit(1);
  }

  const isDialog = args.includes("-d") || args.includes("--dialog");

  console.log(`🖱️ Clicking button: ${buttonName}`);
  try {
    if (isDialog) {
      await automation.clickDialogButton(buttonName);
    } else {
      await automation.clickButton(buttonName);
    }
    console.log("✅ Button clicked");
  } catch (error) {
    console.error("❌ Failed to click button:", error);
    process.exit(1);
  }
}

async function typeCommand(args: string[]): Promise<void> {
  await requireMWGold();

  const text = args.join(" ");
  if (!text) {
    console.error("Usage: mw gold type <text>");
    process.exit(1);
  }

  console.log(`⌨️ Typing: ${text}`);
  await automation.typeText(text);
  console.log("✅ Typed");
}

async function keyCommand(args: string[]): Promise<void> {
  await requireMWGold();

  const key = args[0];
  if (!key) {
    console.error("Usage: mw gold key <key>");
    console.error("Examples: enter, tab, escape, cmd+s");
    process.exit(1);
  }

  console.log(`⌨️ Pressing: ${key}`);
  await automation.pressKey(key);
  console.log("✅ Key pressed");
}

async function windowCommand(): Promise<void> {
  await requireMWGold();

  const title = await automation.getWindowTitle();
  console.log(`Window Title: ${title}`);

  try {
    const bounds = await automation.getWindowBounds();
    console.log(`Position: (${bounds.x}, ${bounds.y})`);
    console.log(`Size: ${bounds.width} x ${bounds.height}`);
  } catch {
    console.log("Could not get window bounds");
  }

  const windows = await automation.listWindows();
  console.log(`\nAll Windows (${windows.length}):`);
  for (const win of windows) {
    console.log(`   - ${win}`);
  }
}

async function uiElementsCommand(): Promise<void> {
  await requireMWGold();

  console.log("🔍 Scanning UI elements...");
  try {
    const elements = await automation.getUIElements();
    console.log(elements);
  } catch (error) {
    console.error("❌ Failed to get UI elements:", error);
    console.log("\nNote: This requires Accessibility permissions.");
    console.log("Go to System Preferences → Privacy & Security → Accessibility");
    console.log("and add Terminal/iTerm to the allowed apps.");
  }
}

async function waitCommand(args: string[]): Promise<void> {
  const title = args.filter(a => !a.startsWith("-"))[0];
  if (!title) {
    console.error("Usage: mw gold wait <title> [-t|--timeout <ms>]");
    process.exit(1);
  }

  let timeout = 5000;
  const timeoutIdx = args.indexOf("-t");
  if (timeoutIdx !== -1 && args[timeoutIdx + 1]) {
    timeout = parseInt(args[timeoutIdx + 1]);
  }
  const timeoutIdx2 = args.indexOf("--timeout");
  if (timeoutIdx2 !== -1 && args[timeoutIdx2 + 1]) {
    timeout = parseInt(args[timeoutIdx2 + 1]);
  }

  console.log(`⏳ Waiting for window containing: "${title}"...`);
  const found = await automation.waitForWindow(title, timeout);
  if (found) {
    console.log("✅ Window found!");
  } else {
    console.log("❌ Timeout - window not found");
    process.exit(1);
  }
}
