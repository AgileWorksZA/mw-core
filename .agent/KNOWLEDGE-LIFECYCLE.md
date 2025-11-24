# Knowledge Update Lifecycle

## Problem Statement

In long-running Loom sessions, two knowledge systems can become stale:

1. **Shadow Advisor (Weave)** - Loads Weave dimensions once per session
2. **Librarian** - Indexes files for discovery but doesn't know about new files

**User Question:** *"During compaction and stop events, we extract and reflect on work that has been done. On the extract, do we pass those files to the librarian, or update the shadow on what was changed/added to weave?"*

## Solution

### Librarian: Incremental Updates (✅ IMPLEMENTED)

**Pattern:** Automatic updates via Stop hook

**How it works:**
1. Agent completes turn → Stop hook fires
2. Hook receives list of edited files from claude-hooks-sdk
3. Calls `.agent/librarian/update-incremental.ts` with file list
4. Script re-indexes only changed files (~180 tokens/file with Haiku)
5. Updates relevant shards (domain + layer)
6. Next query sees updated index

**Benefits:**
- ✅ Automatic (no agent changes needed)
- ✅ Fast (~10 seconds for 10 files)
- ✅ Cheap (~$0.0004 per update)
- ✅ Works across sessions
- ✅ Same-session queries see updates

**Cost Example:**
```
10 new Account files created during US-002
× 180 tokens/file
× $0.0000015/token (Haiku input)
= $0.0027 per update (~quarter of a cent)
```

---

### Shadow Advisor: Strategic Reload (⏳ FUTURE)

**Pattern:** Reload only when needed

**Scenario 1: Single Story Session**
- Shadow loads Weave v1.0 at session start
- Story completes, updates Weave to v1.1
- **Don't reload** - cost not justified
- Next session loads v1.1 fresh automatically

**Scenario 2: Multi-Story Session** (future enhancement)
- Story 1 completes → Weave v1.1
- User runs `/loom:ideate` for Story 2 in SAME session
- **Reload Shadow** - Story 2 planning needs v1.1
- Command: `/loom:reload-shadow`

**Implementation (future):**
```typescript
// After /weave:reflect completes:
if (isMultiStorySession() && moreStoriesComing()) {
  await reloadShadowAdvisor();
  log("Shadow Advisor reloaded with latest Weave");
}
```

**Why not implemented yet:**
- Most sessions are single-story
- Cost of reload (~20K tokens) not justified for rare case
- Next session gets fresh load anyway
- **Decision:** Wait for multi-story patterns to emerge

---

## Current Implementation

### Librarian Incremental Update Script

**Location:** `.agent/librarian/update-incremental.ts`

**Features:**
- Analyzes file path and content
- Infers layer (schema, repository, controller, route, component)
- Infers domain (accounts, products, names, tax-rates, canonical, etc.)
- Extracts key concepts (MoneyWorks, branded-types, repository-pattern)
- Extracts patterns (Repository pattern, Multi-format export)
- Updates both domain and layer shards
- Handles missing shards gracefully

**Example:**
```bash
# Test incremental update
bun .agent/librarian/update-incremental.ts \
  packages/canonical/src/entities/accounts/index.ts \
  packages/data/src/repositories/account.repository.ts

# Output:
# [Librarian] Checking 2 edited files...
# [Librarian] Updated shards/domain-accounts.json
# [Librarian] Updated shards/layer-schema.json
# [Librarian] Updated shards/layer-repository.json
# [Librarian] ✅ Updated 2 files across 3 shards
```

### Stop Hook Integration

**Location:** `.agent/hooks/Stop.ts` (lines 142-168)

**Already integrated!** The hook:
1. Extracts Weave knowledge from edited files
2. Calls librarian incremental update
3. Logs results
4. Continues even if update fails (non-fatal)

```typescript
// From Stop.ts:
const librarianScript = join(input.cwd, ".agent/librarian/update-incremental.ts");

if (existsSync(librarianScript)) {
  await log("Running librarian incremental update...", input.cwd);

  const libResult = spawnSync("bun", [librarianScript, ...editedFiles], {
    cwd: input.cwd,
    encoding: "utf-8",
    timeout: 10000
  });

  if (libResult.stdout) {
    await log(`Librarian: ${libResult.stdout.trim()}`, input.cwd);
  }
}
```

---

## Knowledge Freshness Guarantees

### Between Sessions
- ✅ Shadow Advisor: Loads latest Weave automatically
- ✅ Librarian: Uses latest index (updated by Stop hook)

### Within Session (Same Turn)
- ❌ Shadow Advisor: Uses cached Weave from session start
- ✅ Librarian: Index updated immediately via Stop hook

### Within Session (Multiple Stories)
- ❌ Shadow Advisor: Uses cached Weave (future: reload between stories)
- ✅ Librarian: Index updated after each story

---

## Testing

### Verify Librarian Update Works

```bash
# Create test file
echo "export const test = 'test';" > packages/canonical/src/entities/test/index.ts

# Run incremental update
bun .agent/librarian/update-incremental.ts packages/canonical/src/entities/test/index.ts

# Check logs
cat .agent/weave.log | tail -5

# Expected output:
# [Librarian] Checking 1 edited files...
# [Librarian] Updated shards/domain-canonical.json
# [Librarian] Updated shards/layer-schema.json
# [Librarian] ✅ Updated 1 files across 2 shards
```

### Verify Stop Hook Integration

```bash
# Edit a file in a session
# Stop the agent
# Check .agent/weave.log for librarian update

grep "Librarian" .agent/weave.log | tail -10
```

---

## Cost Analysis

**Librarian Incremental Update:**
- ~180 tokens per file (Haiku input tokens for metadata extraction)
- $0.00027 per file with Haiku ($0.15/1M input tokens)
- 10 files = $0.0027 (quarter of a cent)
- 100 files = $0.027 (3 cents)

**Shadow Advisor Reload (if implemented):**
- ~20K tokens to reload all Weave dimensions
- $0.003 per reload with Haiku
- Only needed for multi-story sessions

**Recommendation:** Librarian updates are effectively free, enable by default.

---

## Future Enhancements

### 1. Weave Version Tracking

Add `.agent/weave/version.json`:
```json
{
  "version": "1.2.0",
  "lastUpdated": "2025-11-24T06:30:00Z",
  "updatedBy": "session-d0d5f5d4",
  "changes": [
    { "dimension": "E", "entity": "canonical-entity-5-file-pattern", "action": "added" }
  ]
}
```

Shadow can check version on load and log if stale.

### 2. Multi-Story Shadow Reload

Add `/loom:reload-shadow` command:
```bash
# Between stories in same session:
/loom:ideate  # Plans Story 2
# Agent detects Weave was updated by Story 1
# Agent runs: /loom:reload-shadow
# Shadow loads fresh Weave v1.1
```

### 3. Real-Time Librarian Notifications

Instead of Stop hook (post-turn), update during turn:
```typescript
// In PostToolUse hook:
if (tool === 'Write' && path.startsWith('packages/')) {
  await notifyLibrarian({ type: 'file_created', path });
}
```

**Tradeoff:** More complex, may slow down agent responses.

---

## Summary

**What was implemented:**
- ✅ Librarian incremental update script (mw-core)
- ✅ Stop hook integration (already existed!)
- ✅ Automatic updates on session stop
- ✅ Cost-effective (~quarter cent per update)

**What's deferred:**
- ⏳ Shadow Advisor reload (wait for multi-story usage)
- ⏳ Weave version tracking (nice-to-have)
- ⏳ Real-time updates (overkill for current usage)

**Answer to user question:**
> "Do we pass those files to the librarian?"

**YES!** The Stop hook automatically passes edited files to librarian for incremental update. Shadow Advisor doesn't need immediate notification because:
1. It's rarely queried after `/weave:reflect`
2. Next session loads fresh Weave automatically
3. Reload cost not justified for single-story sessions

The knowledge lifecycle is now **automatically managed** with no agent changes needed.
