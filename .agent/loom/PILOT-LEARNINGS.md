# Loom Pilot Run 1 - Learnings (Before Clean Slate)

## What Was Tested
- US-001: Product entity (canonical + data only)
- US-002: Account entity (full-stack, incomplete)
- State management system (not used by agent)

## Key Discoveries

### 1. State Management Not Executed ❌
**Issue:** Agent didn't run state-init.ts commands despite markdown instructions
**Root Cause:** Bash commands in markdown treated as advisory, not mandatory
**Fix Applied:** Added 🚨 MANDATORY warnings + added to Success Criteria
**Status:** Ready for take 3 (clean slate)

### 2. Legacy Story IDs Used
**Issue:** Stories created as US-001, US-002, US-003 (legacy format)
**Root Cause:** mw-core deployed with Loom v1.0, not v2.0 feature-scoped IDs
**Decision:** Roll back, deploy Loom v2.0 from start
**Next:** Use PROD-001, ACCT-001 format from beginning

### 3. Incomplete Features (Product API Missing)
**Issue:** US-001 completed without API layer, US-003 discovered dependency
**Pattern:** Small focused stories better than large incomplete ones
**Learning:** Full-stack from start (canonical + data + API + UI) OR explicitly mark as "Part 1"

### 4. Librarian Integration ✅
**Success:** Incremental update script works perfectly
**Success:** Stop hook integration already existed
**Success:** Tested with Account files, updates shards correctly
**Status:** Production ready

### 5. Knowledge Lifecycle Documented ✅
**Success:** Clear strategy for Librarian (update eagerly) vs Shadow (reload lazily)
**Success:** Cost analysis shows updates are effectively free
**Artifact:** .agent/KNOWLEDGE-LIFECYCLE.md created

## Commits to Preserve

### mw-core
- `cb427c3` - feat(librarian): Add automatic incremental updates via Stop hook
  - Keep: .agent/librarian/update-incremental.ts
  - Keep: .agent/KNOWLEDGE-LIFECYCLE.md

### claude-loom
- `230059b` - feat(loom): Make state management MANDATORY with prominent warnings
- `4fd176c` - feat(loom): Add persistent state management for compaction recovery
- `6f79b50` - fix(loom): Add mandatory /loom:complete recommendation to close SDLC loop

## What Works (Keep)
- ✅ Slash command structure (ideate/plan/start/complete)
- ✅ Shadow Advisor consultation during ideation
- ✅ Librarian consultation during planning
- ✅ Task dependency graph generation
- ✅ State management scripts (just not executed yet)
- ✅ Retrospective generation
- ✅ Weave knowledge extraction
- ✅ Stop hook with librarian updates

## What Needs Testing (Clean Slate)
- 🔄 State management actually executed by agent
- 🔄 Feature-scoped story IDs (PROD-001, ACCT-001)
- 🔄 Feature-based directory structure
- 🔄 Full SDLC loop from ideate → complete
- 🔄 Compaction recovery (manually trigger /compact)
- 🔄 Multi-story session (if time permits)

## Recommended Clean Slate Approach

### Phase 1: Deploy Loom v2.0
1. Clear .agent/loom/ and .claude/loom/ directories
2. Run loom bootstrap with v2.0 config
3. Verify feature-scoped structure created

### Phase 2: First Feature (Product)
1. `/loom:ideate` "Implement Product entity with full API"
   - Should create PROD-001
   - Include API layer from start
2. `/loom:plan PROD-001`
   - Should create 15-20 tasks (canonical + data + API)
3. `/loom:start PROD-001`
   - Watch for state-init.ts execution
   - Verify state files created
4. `/loom:complete PROD-001`
   - Verify retrospective generation
   - Verify Weave extraction

### Phase 3: Second Feature (Account)
1. `/loom:ideate` "Implement Account entity with full-stack UI"
   - Should create ACCT-001
   - Depend on PROD-001 if needed
2. Execute full cycle
3. Test librarian sees Product files from PROD-001

### Phase 4: Stress Test (Optional)
1. Manually run `/compact` during `/loom:start`
2. Type "continue"
3. Verify agent reads state file and resumes
4. Verify no duplicate work

## Success Criteria for Clean Slate
- [ ] Feature-scoped IDs used (PROD-001, ACCT-001)
- [ ] State management executed automatically
- [ ] State files created in .agent/loom/state/
- [ ] Checkpoints created at critical steps
- [ ] Librarian updates work automatically
- [ ] Retrospectives generated
- [ ] Weave knowledge extracted
- [ ] No US-XXX legacy IDs

## Timeline
- Pilot Run 1: Nov 24, 2025 01:00-08:00 (7 hours)
- Learnings captured: Nov 24, 2025 08:30
- Clean slate planned: Nov 24, 2025 09:00+

## Notes
This pilot was valuable for:
- Identifying state management execution issue
- Testing librarian integration (works!)
- Validating slash command UX
- Discovering need for feature-scoped IDs from start
- Building confidence in autonomous execution

Ready for clean slate with all fixes in place.
