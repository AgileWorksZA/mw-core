# Agent Prompt for MoneyWorks Gold Mapping

> **Copy everything below this line and paste as your first prompt to the agent**

---

I need you to complete a comprehensive UI mapping job for MoneyWorks Gold (macOS accounting software). This is a large autonomous task that will take several hours.

## Your Mission

Map the entire MoneyWorks Gold user interface so we can build automation scripts. This includes:
1. All keyboard shortcuts
2. All menu items and submenus
3. Navigator dashboard clickable areas (with coordinates)
4. Transaction entry workflows (step-by-step)
5. Dialog field layouts
6. Error dialogs

## Setup

1. First, read these files for context:
   - `.claude/remote-jobs/MW-GOLD-MAPPING-JOB.md` - Full job specification
   - `.claude/remote-jobs/PRIOR-DISCOVERIES.md` - What's already known

2. Run the quick-start script:
   ```bash
   bash .claude/remote-jobs/quick-start.sh
   ```

3. If MoneyWorks Gold isn't running, start it and open `acme.moneyworks`

## Key Commands

```bash
# Check status
bun packages/cli/src/index.ts gold status

# Take screenshot
bun packages/cli/src/index.ts gold screenshot -o /tmp/mw-screenshots/name.png

# Open menu
bun packages/cli/src/index.ts gold menu "Show/Transactions"

# List menu items
bun packages/cli/src/index.ts gold menu-items "Command"

# Press key/shortcut
bun packages/cli/src/index.ts gold key "cmd+1"
bun packages/cli/src/index.ts gold key "tab"
bun packages/cli/src/index.ts gold key "enter"

# Type text
bun packages/cli/src/index.ts gold type "CUST001"

# Click at coordinates
bun packages/cli/src/index.ts gold click 400 300

# Close window
bun packages/cli/src/index.ts gold key "cmd+w"
```

## Execution Order

### Phase 1: Keyboard Shortcuts (30 min)
Map Cmd+1 through Cmd+0, then Cmd+Shift, Cmd+Option variants, then function keys.

### Phase 2: Complete Menu Structure (30 min)
Get all items from all menus, including submenus.

### Phase 3: Navigator Mapping (1 hour)
Take clean screenshot of Navigator dashboard. Identify and test clicking on each icon. Record coordinates.

### Phase 4: Transaction Workflows (2 hours)
Document step-by-step:
- Creating new sales invoice
- Recording customer payment
- Creating credit note
- Creating journal entry

Screenshot EVERY step. Note timing requirements.

### Phase 5: Data Export (30 min)
```bash
bun packages/cli/src/index.ts snapshot remote-baseline
```

### Phase 6: Documentation (30 min)
Create all result files in `.claude/remote-jobs/results/`

## Deliverables

Create these files in `.claude/remote-jobs/results/`:

1. `KEYBOARD-SHORTCUTS.md` - All shortcuts mapped
2. `MENU-STRUCTURE.md` - Complete menu hierarchy
3. `NAVIGATOR-MAP.md` - Icon coordinates and functions
4. `TRANSACTION-WORKFLOWS.md` - Step-by-step workflows
5. `DIALOG-FIELDS.md` - Field layouts for dialogs
6. `AUTOMATION-SEQUENCES.md` - Ready-to-use sequences
7. `SUMMARY.md` - Overview of findings

## Important Notes

- Always add `sleep 0.5` (500ms) after menu/click/key actions
- Screenshot after every significant action
- If something fails, document it and try alternatives
- Use `cmd+w` to close windows between tests
- The Navigator dashboard shows when all windows are closed

## When Done

```bash
git add .claude/remote-jobs/results/
git add .snapshots/
git commit -m "feat: Complete MW Gold UI mapping"
```

Start now with Phase 1. Work autonomously through all phases. Ask questions only if truly stuck.
