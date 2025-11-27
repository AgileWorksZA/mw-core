---
description: Finalize story, extract learnings, update Weave (Loom: Completion Phase)
---

# Loom: Completion and Learning

You are executing the **Completion and Learning** workflow in Loom, the autonomous SDLC orchestration system.

## Context Loading

1. **Load Loom Config**:
   ```bash
   cat .agent/loom/config.json
   ```

2. **Load Weave Extension**:
   - Read `.agent/weave/extensions/loom/praxeology.json` for completion workflow
   - Read `.agent/weave/extensions/loom/deontics.json` for DoD (Definition of Done)

3. **Load Target Story**:
   - User will specify which story to complete (e.g., "US-001")
   - Read `.claude/loom/stories/US-{XXX}.json`
   - Verify story status is `in-progress`

## Workflow: Completion and Learning

Follow the workflow defined in `loom/praxeology.json > workflows > completion-and-learning`:

### Step 1: Final AC Verification
**Hard gate** - story cannot be completed unless all AC pass.

- For each acceptance criterion:
  - Verify `tested=true` and `status=pass`
  - If any AC is not tested or failing:
    - **STOP** - return to `/loom:start` to fix
    - Report which AC are failing
    - Do NOT proceed

### Step 2: Update Documentation
Delegate to appropriate agents to update:

- **README.md**: If new user-facing features added
- **ARCHITECTURE.md**: If architectural patterns changed
- **.claude/CLAUDE.md**: If new important patterns emerged
- **API docs**: If API endpoints changed

Use appropriate specialist:
- Backend docs → backend-dev
- Frontend docs → frontend-dev
- CLI docs → cli-dev

### Step 3: Generate Retrospective
Run the story retrospective script:
```bash
bun .agent/loom/scripts/story-retrospective.ts US-{XXX}
```

This will:
- Load all sessions for the story
- Parse transcript files by transactionId
- Analyze hook events
- Generate comprehensive retrospective at `.claude/loom/retrospectives/US-{XXX}.md`

Retrospective format:
```markdown
# Retrospective: US-{XXX} - {Title}

## Summary
- **Status**: Complete
- **Sessions**: {N}
- **Duration**: {start} to {end}
- **Complexity**: {actual vs estimated}

## What Went Well ✅
- [Extracted from transcripts and events]

## What Could Be Improved ⚠️
- [Extracted pain points]

## Key Decisions 🎯
- [List all decisions from story.decisions]

## Learnings 💡
- [Patterns discovered]
- [Pain points encountered]
- [Best practices identified]

## Session Details
### Session 1: {sessionName} ({sessionId})
- **Phase**: {phase}
- **Duration**: {duration}
- **Significant Events**: {count}
- **Tools Used**: [list]

## Weave Recommendations
[Suggest what should go into Weave dimensions]
```

### Step 4: Extract Learnings (Shadow Advisor)
Use Task tool with `subagent_type='shadow-advisor'` to analyze retrospective and extract:

- **Patterns** (E:Epistemology): New patterns discovered
- **Pain Points** (Q:Qualia): Problems encountered
- **Best Practices** (Π:Praxeology): What worked well
- **Decisions** (Μ:Modality): Why we chose X over Y

### Step 5: Extract Bayesian Facts
Analyze the story learnings and identify verifiable facts learned during development.

For each fact discovered:
```typescript
import { weave } from '.agent/weave/index';

// Record new facts
await weave.observeFact('fact-id', 'Description of the fact', {
  evidence: 'How we learned this',
  basis: 'empirical' // or 'validated', 'documented'
});

// Validate existing facts that were confirmed during this story
await weave.validateFact('existing-fact-id', 'test-passed', 'Evidence from story');
```

**Look for facts in:**
- Story decisions: "We discovered that X works this way"
- Error resolutions: "The bug was caused by Y"
- Implementation insights: "Z requires A to be true"
- Integration learnings: "Service X expects format Y"

**Example facts from a typical story:**
```
await weave.observeFact('api-timeout-30s', 'API requests timeout after 30 seconds', {
  evidence: 'Discovered during integration testing in FEAT-001'
});
await weave.validateFact('sse-requires-heartbeat', 'test-passed', 'SSE tests added in story');
```

### Step 6: Weave Reflection
Execute the `/weave:reflect` slash command to update Weave knowledge base.

Focus areas:
- **What worked well?** → Best practices, successful patterns
- **What pain points emerged?** → Qualia (things to avoid)
- **What patterns were discovered?** → Epistemology
- **What decisions were made and why?** → Modality, rationale
- **What facts were learned or validated?** → Bayesian knowledge tracking

### Step 7: Create Commit
Use Task tool with `subagent_type='prd-commit-writer'` to create comprehensive commit:

```bash
git add .
git commit -m "$(cat <<'EOF'
feat(feature-area): US-{XXX} - {Title}

## Why
{story.why - the root motivation}

## What
- {Summary of what was built}
- {Key changes made}

## Context
- Complexity: {story.estimatedComplexity}
- Sessions: {N}
- AC tested: {N}/{N} passing

## Learnings
- {Key learnings from retrospective}

## References
- Story: .claude/loom/stories/US-{XXX}.md
- Retrospective: .claude/loom/retrospectives/US-{XXX}.md
- Sessions: {list sessionIds}

Closes US-{XXX}
EOF
)"
```

### Step 8: Mark Complete
- Update story status: `in-progress` → `complete`
- Set `completedAt` timestamp
- Update session end time
- Save story JSON

## Definition of Done Verification
From `loom/deontics.json > definition_of_done > story-dod`:

Check each criterion:
- ✓ All tasks completed
- ✓ All acceptance criteria tested and passing
- ✓ Code committed to repository
- ✓ Documentation updated (README, ARCHITECTURE, etc.)
- ✓ Retrospective generated
- ✓ Learnings extracted to Weave
- ✓ Story status = complete
- ✓ completedAt timestamp set

**If any criterion not met**: Report to user and ask whether to proceed anyway or return to fix.

## Success Criteria
From `loom/praxeology.json > workflows > completion-and-learning > success_criteria`:
- ✓ All AC verified passing
- ✓ Documentation updated
- ✓ Retrospective generated
- ✓ Weave updated with learnings
- ✓ Changes committed
- ✓ Story marked complete

## Output to User

After completion, provide summary:

```markdown
## ✅ Story US-{XXX} Complete!

### Summary
- **Title**: {story.title}
- **Why**: {story.why}
- **Complexity**: {story.estimatedComplexity}
- **Duration**: {start} to {end}

### Results
- ✅ All {N} acceptance criteria passing
- ✅ {N} tasks completed
- ✅ Documentation updated
- ✅ Learnings extracted to Weave
- ✅ Changes committed

### Artifacts
- Story: .claude/loom/stories/US-{XXX}.md
- Retrospective: .claude/loom/retrospectives/US-{XXX}.md
- Commit: {commit hash}

### Key Learnings
- {Top 3 learnings from retrospective}

### Next Story
Ready to start another story? Use `/loom:ideate` for a new idea.
```

## Important Notes
- **AC must pass** - hard gate, no exceptions
- **Extract learnings** - don't skip Weave reflection
- **Comprehensive commits** - include WHY, not just WHAT
- **Update docs** - keep project documentation current
- **Celebrate success** - acknowledge completion
