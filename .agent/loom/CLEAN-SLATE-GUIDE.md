# Clean Slate Setup - Loom v2.0 (Feature-Scoped)

## Phase 1: Rollback Pilot Run

### Step 1: Commit Current State (for reference)
```bash
cd /Users/hgeldenhuys/WebstormProjects/mw-core

# Commit pilot learnings
git add .agent/loom/PILOT-LEARNINGS.md .agent/loom/CLEAN-SLATE-GUIDE.md
git commit -m "docs(loom): Capture pilot run 1 learnings before rollback"

# Stash all other changes (they'll be recreated)
git stash push -u -m "Pilot run 1 - before clean slate"
```

### Step 2: Clean Loom Directories
```bash
# Remove all pilot stories and state
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/loom/stories/
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/loom/retrospectives/
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/loom/state/*.json
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/loom/state/*.md

# Keep scripts (they're good)
# Keep config.json (will update version)

# Clean product/account implementation files (throwaway code)
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/packages/canonical/src/entities/products/
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/packages/canonical/src/entities/accounts/
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/packages/data/src/repositories/product.repository.*
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/packages/data/src/repositories/account.repository.*
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/packages/api/src/controllers/product.ts
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/packages/api/src/controllers/account.ts
rm -rf /Users/hgeldenhuys/WebstormProjects/mw-core/packages/web1/app/routes/accounts*.tsx

# Verify clean slate
git status
```

### Step 3: Update Loom Config to v2.0
```bash
# Edit .agent/loom/config.json
# Change "version": "1.0.0" → "2.0.0"
# Add features array
# Keep storyCounter: 0, taskCounter: 0
```

Expected config.json:
```json
{
  "version": "2.0.0",
  "initialized": "2025-11-24T09:00:00.000Z",
  "project": {
    "name": "@moneyworks/monorepo",
    "path": "/Users/hgeldenhuys/WebstormProjects/mw-core"
  },
  "stack": {
    "runtime": "bun",
    "packageManager": "bun",
    "backend": ["ElysiaJS"],
    "frontend": ["React", "React Router"],
    "database": [],
    "testing": [],
    "other": ["TanStack Query"]
  },
  "patterns": {
    "cqrs": true,
    "sse": true,
    "workers": false,
    "adapters": false,
    "realtime": true
  },
  "wayOfWorking": {
    "testingApproach": "test-after",
    "prReviewProcess": "optional",
    "workflowStyle": "autonomous",
    "documentationLevel": "standard"
  },
  "definitionOfDone": [
    "All tasks completed",
    "All acceptance criteria tested and passing",
    "Code committed to repository",
    "Documentation updated",
    "Tests written and passing",
    "Retrospective generated",
    "Learnings extracted to Weave"
  ],
  "roles": [
    "main-agent",
    "backend-dev",
    "backend-qa",
    "frontend-dev",
    "frontend-qa",
    "system-architect",
    "requirements-planner",
    "spec-writer"
  ],
  "features": [],
  "storyCounter": 0,
  "taskCounter": 0
}
```

---

## Phase 2: Verify Latest Loom Deployed

### Check Symlinks
```bash
# Commands should point to latest claude-loom
ls -la /Users/hgeldenhuys/WebstormProjects/mw-core/.claude/commands/loom
# Should show: → /Users/hgeldenhuys/WebstormProjects/claude-loom/.claude/commands/loom

# Scripts should point to state management location
ls -la /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/loom/scripts
# Should show: → /Users/hgeldenhuys/WebstormProjects/claude-loom/.agent/loom/scripts
```

### Verify State Management Scripts
```bash
# Should exist (5 files):
ls /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/loom/scripts/state-*.ts
# Expected:
# - state-init.ts
# - state-update.ts
# - state-read.ts
# - state-checkpoint.ts
# - state-types.ts
```

### Verify MANDATORY Warnings in Commands
```bash
# Should show 🚨 MANDATORY in all workflows
grep "🚨 MANDATORY" /Users/hgeldenhuys/WebstormProjects/mw-core/.claude/commands/loom/start.md
grep "🚨 MANDATORY" /Users/hgeldenhuys/WebstormProjects/mw-core/.claude/commands/loom/complete.md
grep "🚨 MANDATORY" /Users/hgeldenhuys/WebstormProjects/mw-core/.claude/commands/loom/plan.md
```

### Verify Librarian Incremental Update
```bash
# Should exist
ls /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/librarian/update-incremental.ts

# Should be executable
test -x /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/librarian/update-incremental.ts && echo "Executable ✅"

# Test it
bun /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/librarian/update-incremental.ts
# Should output: Usage: bun update-incremental.ts <file1> <file2> ...
```

---

## Phase 3: First Feature Run (PROD-001)

### Step 1: Ideate Product Entity (with API)
```bash
# In Claude agent session:
/loom:ideate

# When prompted, provide:
"Implement Product canonical entity with full API layer. Include canonical types
(enums, types, fields, validators), ProductRepository with read-only operations,
ProductController extending BaseTableController, and TableRegistry registration.
Support all 4 export formats (compact, compact-headers, full, schema)."

# Expected output:
# - Story created: PROD-001 (NOT US-001!)
# - Location: .claude/loom/features/PROD/stories/PROD-001/
# - Status: "planned"
# - ~12-15 ACs defined
# - Weave references included
```

### Step 2: Plan Execution
```bash
/loom:plan PROD-001

# Watch for:
# ✅ Librarian consultation (optional but recommended)
# ✅ Task decomposition (~15-20 tasks)
# ✅ Dependency graph generated
# ✅ User approval requested

# Expected task structure:
# Phase 1: Canonical (5 tasks)
#   - T-001: Enums
#   - T-002: Types (→T-001)
#   - T-003: Fields (→T-002)
#   - T-004: Validators (→T-002)
#   - T-005: Barrel exports (→T-001,002,003,004)
# Phase 2: Data Layer (3 tasks)
#   - T-006: Base repository (→T-005)
#   - T-007: Core operations (→T-006)
#   - T-008: Specialized queries (→T-007)
# Phase 3: API Layer (3 tasks)
#   - T-009: Controller (→T-008)
#   - T-010: Registry registration (→T-009)
#   - T-011: Test endpoints (→T-010)
# Phase 4: QA (2 tasks)
#   - T-012: Unit tests (→T-008)
#   - T-013: Type safety check (→T-012)
```

### Step 3: Execute with State Management
```bash
/loom:start PROD-001

# 🚨 CRITICAL: Watch for state management initialization!
# First output should show:
🆕 Initializing execution state...
✅ State initialized:
   JSON: .agent/loom/state/PROD-001-execution.json
   MD:   .agent/loom/state/PROD-001-execution.md

# If NOT shown, STOP and investigate!
```

**During execution, monitor:**
```bash
# In separate terminal, watch state updates:
watch -n 5 'cat /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/loom/state/PROD-001-execution.md'

# Should see progress:
# ✅ Step 0: Pre-flight Checks - COMPLETED
# ✅ Step 1: Session Initialization - COMPLETED
# 🔄 Step 3: Execute Tasks - IN PROGRESS
#    Progress: Task 5/13 completed
```

### Step 4: Complete Cycle
```bash
/loom:complete PROD-001

# Watch for:
# ✅ State initialized for completion workflow
# ✅ All 7 completion steps executed
# ✅ Retrospective generated
# ✅ Shadow Advisor extracts learnings
# ✅ Weave reflection updates knowledge base
# ✅ Comprehensive commit created

# Expected artifacts:
# - .agent/loom/retrospectives/PROD-001.md
# - Git commit with WHY + WHAT + Learnings
# - Story status: "completed"
```

---

## Phase 4: Second Feature (ACCT-001)

### Ideate Full-Stack Account
```bash
/loom:ideate

# Prompt:
"Implement Account entity with complete full-stack implementation. Include canonical
types, AccountRepository, AccountController, React UI routes (list + detail views),
shadcn/ui components, and navigation integration. This is the Chart of Accounts -
the backbone of accounting."

# Expected:
# - Story: ACCT-001 (feature-scoped!)
# - Location: .claude/loom/features/ACCT/stories/ACCT-001/
# - ~25-30 ACs (canonical + data + API + UI)
# - May reference PROD-001 patterns
```

### Execute Full Cycle
```bash
/loom:plan ACCT-001
/loom:start ACCT-001
/loom:complete ACCT-001
```

### Verify Librarian Sees Product Files
```bash
# After ACCT-001 planning, agent should reference Product implementation:
# "Similar to Product entity (PROD-001), implement Account with..."

# Check librarian shards were updated:
grep -r "Product" /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/librarian/shards/
# Should find entries in:
# - domain-products.json
# - layer-schema.json
# - layer-repository.json
```

---

## Phase 5: Stress Test (Optional)

### Test Compaction Recovery
```bash
/loom:start ACCT-001

# Let it run for ~5-10 tasks, then:
/compact

# Wait for compaction to complete, then:
continue

# Expected behavior:
# 📄 Resuming from previous state...
# 🔄 Step 3: Execute Tasks - IN PROGRESS (resuming)
#    Current task: 12/25
# [Agent continues from where it left off, no duplicate work]
```

### Verify State Persistence
```bash
# After compaction, check state file:
cat /Users/hgeldenhuys/WebstormProjects/mw-core/.agent/loom/state/ACCT-001-execution.json

# Should show:
# - currentStep: 3
# - steps[3].status: "in_progress"
# - steps[0-2].status: "completed"
# - checkpoint data preserved
```

---

## Success Criteria Checklist

After clean slate run, verify:

### Story IDs
- [ ] PROD-001 created (NOT US-001)
- [ ] ACCT-001 created (NOT US-002)
- [ ] Stories in `.claude/loom/features/PROD/` and `ACCT/`
- [ ] Config shows `features` array with PROD and ACCT

### State Management
- [ ] state-init.ts executed at start of workflows
- [ ] State files created: `.agent/loom/state/*.json` and `*.md`
- [ ] state-update.ts called after each step
- [ ] Checkpoints created at critical steps (Step 3, Step 6)
- [ ] Progress visible in human-readable .md files

### Knowledge Lifecycle
- [ ] Librarian updated automatically via Stop hook
- [ ] Product files indexed after PROD-001
- [ ] Account planning references Product patterns
- [ ] Weave updated after each completion

### SDLC Loop
- [ ] Ideation generates comprehensive stories
- [ ] Planning creates dependency graphs
- [ ] Execution follows phases
- [ ] Completion generates retrospectives
- [ ] Learnings extracted to Weave

### Compaction Recovery (if tested)
- [ ] State persists through /compact
- [ ] Agent resumes from correct step
- [ ] No duplicate work performed
- [ ] Checkpoint data preserved

---

## If Something Goes Wrong

### State Management Not Executed
**Symptom:** No state files created
**Check:**
```bash
ls .agent/loom/state/*.json
# If empty, state management wasn't run
```
**Debug:**
- Check agent output for "🆕 Initializing execution state..."
- Grep logs for "state-init.ts"
- Verify 🚨 MANDATORY warnings in slash commands
- Report to developers for further investigation

### Legacy IDs Still Used
**Symptom:** Stories created as US-004, US-005
**Check:**
```bash
cat .agent/loom/config.json | grep version
# Should show: "version": "2.0.0"
```
**Fix:**
- Verify config.json has "version": "2.0.0"
- Verify config.json has "features": [] array
- Re-run bootstrap if needed

### Files in Wrong Location
**Symptom:** Stories in `.agent/loom/stories/` instead of `.claude/loom/features/`
**Check:**
```bash
ls .agent/loom/stories/
# Should be empty or non-existent

ls .claude/loom/features/
# Should show PROD/, ACCT/ directories
```

---

## Post-Pilot Actions

After successful clean slate run:

1. **Document Results**
   - Create PILOT-RUN-2-RESULTS.md
   - Compare with PILOT-LEARNINGS.md
   - Note improvements and remaining issues

2. **Commit Everything**
   - All product/account code
   - All retrospectives
   - All state files
   - Updated config

3. **Create Final Summary**
   - State management: ✅ or ❌
   - Feature-scoped IDs: ✅ or ❌
   - Compaction recovery: ✅ or ❌
   - Librarian updates: ✅ or ❌

4. **Plan Next Steps**
   - Deploy to production projects?
   - Additional features needed?
   - Documentation updates?
   - Training materials?

---

## Quick Reference Commands

```bash
# Check current state
cat .agent/loom/config.json | grep version
ls .claude/loom/features/

# Monitor execution
tail -f .agent/weave.log
watch -n 5 'cat .agent/loom/state/PROD-001-execution.md'

# Verify state management
ls -la .agent/loom/scripts/state-*.ts
grep "state-init" .claude/commands/loom/start.md

# Check librarian updates
tail -20 .agent/weave.log | grep Librarian

# View retrospectives
ls .agent/loom/retrospectives/
cat .agent/loom/retrospectives/PROD-001.md
```

---

Ready for clean slate! 🚀
