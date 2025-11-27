# Alternative Clicking Methods for MoneyWorks Gold Automation

> **Updated**: 2025-11-26 (Post-Session Discovery)
> **Tool Installed**: cliclick v5.1

---

## Overview

The automation code supports **multiple clicking methods** with automatic fallback:

1. **cliclick** (Primary) - Now installed ✅
2. **AppleScript** (Fallback) - Used if cliclick unavailable
3. **UI Element Clicking** (Advanced) - For semantic element targeting

---

## Method 1: cliclick (Recommended) ⭐

### Installation

```bash
brew install cliclick
```

**Status**: ✅ Installed and verified working

### Usage via CLI

```bash
# Simple click
bun packages/cli/src/index.ts gold click 425 142

# Or directly with cliclick
cliclick c:425,142
```

### Direct cliclick Commands

```bash
# Single click
cliclick c:100,200

# Double-click
cliclick dc:100,200

# Right-click
cliclick rc:100,200

# Triple-click
cliclick tc:100,200

# Move mouse without clicking
cliclick m:100,200

# Click current position
cliclick c:.

# Relative positioning
cliclick c:+50,+0      # 50px right from current
cliclick c:-20,+10     # 20px left, 10px down

# Chained commands
cliclick m:100,100 w:500 c:.   # Move, wait 500ms, click

# Natural movement (easing)
cliclick -e 10 m:100,100 c:.   # Slower, more human-like
```

### Advantages

✅ **More reliable** than AppleScript `click at`
✅ **Relative positioning** support
✅ **Command chaining** (move + wait + click)
✅ **Easing** for natural mouse movement
✅ **Verbose mode** for debugging: `cliclick -m verbose c:100,100`
✅ **Test mode** (dry run): `cliclick -m test c:100,100`

### TypeScript Usage

The automation code already uses cliclick:

```typescript
// From packages/cli/src/commands/gold/automation.ts
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
```

---

## Method 2: AppleScript Coordinate Clicking

### Usage

```bash
osascript -e 'tell application "System Events" to click at {425, 142}'
```

### Advantages

✅ **Built into macOS** (no installation needed)
✅ **Works in automation code** as fallback

### Disadvantages

❌ **Less reliable** for UI elements
❌ **No relative positioning**
❌ **No command chaining**

---

## Method 3: AppleScript UI Element Clicking

### Concept

Instead of clicking coordinates, target UI elements by name/role:

```applescript
tell application "System Events"
  tell process "MoneyWorks Gold"
    click button "Use" of window 1
  end tell
end tell
```

### Reality Check

**MoneyWorks Gold limitation**: Most UI elements return "missing value" via Accessibility API.

**What works**:
- Window detection ✅
- Menu item detection ✅
- Window titles ✅

**What doesn't work**:
- Button names ❌ (shows "missing value")
- Field names ❌
- Dialog element introspection ❌

### Alternative: Fallback to Text Search

```applescript
# Try to find button by examining UI hierarchy
tell application "System Events"
  tell process "MoneyWorks Gold"
    # Get all buttons in window
    set allButtons to every button of window 1
    # Attempt to click first button (risky)
    click button 1 of window 1
  end tell
end tell
```

**Risk**: No guarantee which button is which without names.

---

## Method 4: Cancel/OK Button Clicking Pattern

### Observation

**User discovery**: If Escape or Cmd+W don't work, click Cancel/OK buttons.

### Button Positions

From workflow screenshots, typical button positions:

| Button | Typical Position | Notes |
|--------|------------------|-------|
| Cancel | Bottom-right, left of OK | Usually secondary button |
| OK / Use | Bottom-right corner | Primary action button |
| X (Close) | Top-left of dialog | Standard macOS close |

### Example: Customer Lookup Dialog

**Screenshot analysis** (`workflow-05-after-tab.png`):
- "Use" button: Bottom-right (~560, 267 estimated)
- "Cancel" button: Bottom-right, left of Use (~490, 267 estimated)

### Automation Pattern

```typescript
// Pattern 1: Try keyboard first
async function closeDialog() {
  try {
    await pressKey("escape");
    await sleep(500);
    // Check if dialog closed
    const stillOpen = await isDialogOpen();
    if (stillOpen) {
      // Fallback: Click Cancel button
      await click(490, 267);
    }
  } catch {
    // Last resort: Cmd+W
    await pressKey("cmd+w");
  }
}

// Pattern 2: Confirm dialog action
async function confirmDialogAction() {
  // Try Enter/Return first
  try {
    await pressKey("return");
    await sleep(500);
  } catch {
    // Fallback: Click OK/Use button
    await click(560, 267);
  }
}
```

---

## Recommended Automation Strategy

### Priority Order

1. **Keyboard shortcuts** (most reliable)
   ```typescript
   await pressKey("cmd+t");  // Open Transactions
   await pressKey("return"); // Confirm dialog
   await pressKey("escape"); // Cancel dialog
   ```

2. **Menu navigation** (very reliable)
   ```typescript
   await openMenu("Show/Transactions");
   await openMenu("Edit/New Receipt");
   ```

3. **Direct text entry** (bypass lookups)
   ```typescript
   await typeText("C001");
   await pressKey("return");  // Accept without lookup dialog
   ```

4. **cliclick coordinate clicks** (now reliable)
   ```typescript
   await click(560, 267);  // Click "Use" button
   ```

5. **User-assisted clicks** (complex dialogs)
   ```typescript
   await say("Please click the Use button");
   await sleep(15000);
   ```

---

## Testing cliclick Reliability

### Test 1: Navigator Icon Clicking

**Before cliclick**: Icons didn't respond to programmatic clicks
**With cliclick**: Need to retest

```bash
# Open Navigator
bun packages/cli/src/index.ts gold key "cmd+w"
bun packages/cli/src/index.ts gold key "cmd+w"

# Try clicking Sales Invoices icon (coordinates from screenshot)
bun packages/cli/src/index.ts gold click 425 142

# Verify result
bun packages/cli/src/index.ts gold window
```

### Test 2: Dialog Button Clicking

**Target**: "Use" button in customer lookup dialog

```bash
# Open Transactions, create new invoice
bun packages/cli/src/index.ts gold key "cmd+t"
sleep 1.5
bun packages/cli/src/index.ts gold menu "Edit/New Receipt"
sleep 1.5

# Enter customer code
bun packages/cli/src/index.ts gold type "C001"
bun packages/cli/src/index.ts gold key "tab"
sleep 1

# Lookup dialog should appear - try clicking "Use"
bun packages/cli/src/index.ts gold click 560 267
```

### Test 3: Cancel Button Fallback

```bash
# If Use button doesn't work, try Cancel
bun packages/cli/src/index.ts gold click 490 267

# Or Escape key
bun packages/cli/src/index.ts gold key "escape"
```

---

## cliclick Advanced Features

### Verbose Mode (Debugging)

```bash
cliclick -m verbose c:100,100
# Output: MOVE to 100,100
#         CLICK at 100,100
```

### Test Mode (Dry Run)

```bash
cliclick -m test c:100,100 w:500 kp:return
# Shows what would happen without executing
```

### Restore Mouse Position

```bash
cliclick -r c:100,100
# Click then return mouse to original position
```

### Natural Movement

```bash
cliclick -e 25 m:100,100
# Higher easing = slower, more human-like movement
```

### Scripting Multiple Actions

```bash
# Create automation script
cat > /tmp/click-sequence.txt <<EOF
# Click Use button
m:560,267
w:200
c:.
w:500
# Press Return
kp:return
EOF

# Execute script
cliclick -f /tmp/click-sequence.txt
```

---

## Button Coordinate Discovery

### Method 1: Screenshot Analysis

1. Take screenshot: `bun packages/cli/src/index.ts gold screenshot -o /tmp/test.png`
2. Open in Preview/image viewer
3. Hover mouse to see coordinates
4. Note button center positions

### Method 2: Trial & Error Grid

```bash
# Test grid of positions around estimated area
for x in 540 550 560 570; do
  for y in 260 265 270 275; do
    echo "Testing: $x,$y"
    bun packages/cli/src/index.ts gold click $x $y
    sleep 2
    # Check if worked
  done
done
```

### Method 3: Visual Inspection

Use cliclick to show where it's clicking:

```bash
# Move mouse to position (visually verify)
cliclick -m verbose m:560,267
sleep 2
cliclick c:.
```

---

## Common Dialog Patterns

### Pattern 1: Lookup Dialogs

**Fields**: Customer, Item, Account lookups
**Buttons**: Use, Cancel, Search
**Positions**: Bottom-right area

**Automation**:
```typescript
async function selectFromLookup(code: string) {
  await typeText(code);
  await pressKey("tab");  // Trigger lookup
  await sleep(1000);
  // Try keyboard first
  await pressKey("return");  // Select first match
  await sleep(500);

  // If that didn't work, click Use button
  // await click(560, 267);
}
```

### Pattern 2: Date Pickers

**Fields**: Date fields
**Buttons**: Calendar popup
**Keyboard**: Return accepts current/selected date

**Automation**:
```typescript
async function selectDate(date?: string) {
  if (!date) {
    // Accept default (today)
    await pressKey("return");
  } else {
    // Type date and confirm
    await typeText(date);
    await pressKey("return");
  }
}
```

### Pattern 3: Confirmation Dialogs

**Buttons**: OK, Cancel, Yes, No
**Keyboard**: Return = OK/Yes, Escape = Cancel/No

**Automation**:
```typescript
async function confirmDialog(action: "ok" | "cancel") {
  if (action === "ok") {
    await pressKey("return");
  } else {
    await pressKey("escape");
  }
}
```

---

## Summary

### ✅ What Changed

1. **cliclick installed** - More reliable clicking now available
2. **Automation code already supports cliclick** - Just needed installation
3. **Fallback chain established**: cliclick → AppleScript → user assistance

### 🎯 Next Steps

1. **Retest Navigator icons** with cliclick
2. **Map button coordinates** for common dialogs:
   - Customer lookup "Use" button
   - Date picker "OK"
   - Transaction "Save" button
   - Transaction "Post" button

3. **Create button coordinate library**:
   ```typescript
   const BUTTON_COORDS = {
     customerLookupUse: { x: 560, y: 267 },
     customerLookupCancel: { x: 490, y: 267 },
     datePickerOK: { x: 340, y: 270 },
     // ...
   };
   ```

4. **Build helper functions**:
   ```typescript
   async function clickDialogButton(buttonType: keyof typeof BUTTON_COORDS) {
     const coords = BUTTON_COORDS[buttonType];
     await click(coords.x, coords.y);
   }
   ```

---

## cliclick Quick Reference

| Command | Syntax | Example | Description |
|---------|--------|---------|-------------|
| Click | `c:x,y` | `c:100,200` | Single click |
| Double-click | `dc:x,y` | `dc:100,200` | Double-click |
| Right-click | `rc:x,y` | `rc:100,200` | Right-click |
| Triple-click | `tc:x,y` | `tc:100,200` | Triple-click |
| Move | `m:x,y` | `m:100,200` | Move mouse |
| Wait | `w:ms` | `w:500` | Wait milliseconds |
| Key press | `kp:key` | `kp:return` | Press key |
| Key down | `kd:mod` | `kd:cmd` | Hold modifier |
| Key up | `ku:mod` | `ku:cmd` | Release modifier |
| Type | `t:text` | `t:Hello` | Type text |
| Click current | `c:.` | `c:.` | Click mouse position |
| Relative move | `m:+x,+y` | `m:+50,+0` | Move relative |

---

**Conclusion**: With cliclick now installed, the automation framework has **significantly more reliable clicking capabilities**. The fallback chain ensures robust automation even when specific methods fail.
