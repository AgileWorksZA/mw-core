---
description: Review completed story and analyze learnings (Loom: Retrospective)
---

# Loom: Story Retrospective

Generate or view retrospective for a completed story in Loom.

## Context Loading

1. **Load Loom Config**:
   ```bash
   cat .agent/loom/config.json
   ```

2. **Load Target Story**:
   - User will specify which story (e.g., "US-001")
   - Read `.claude/loom/stories/US-{XXX}.json`

## Two Modes

### Mode 1: View Existing Retrospective
If retrospective already exists at `.claude/loom/retrospectives/US-{XXX}.md`:
- Read and display it to user
- Optionally offer to regenerate if user wants updated analysis

### Mode 2: Generate New Retrospective
If retrospective doesn't exist or user wants regeneration:

Run the retrospective script:
```bash
bun .agent/loom/scripts/story-retrospective.ts US-{XXX}
```

This will analyze:
- All sessions associated with the story
- All hook events captured
- Conversation transcripts (scrolls)
- Decisions made
- Tasks completed
- Acceptance criteria results

## Retrospective Format

The generated retrospective follows this structure:

```markdown
# Retrospective: US-{XXX} - {Story Title}

**Generated**: {timestamp}
**Status**: {story.status}

---

## 📊 Summary

- **Duration**: {start date} to {end date} ({total days})
- **Sessions**: {count} sessions over {count} days
- **Tasks**: {completed}/{total}
- **Acceptance Criteria**: {passed}/{total}
- **Complexity**: {estimated} (actual: {assessed})
- **Phases**: {list phases encountered}

---

## 🎯 Story Context

### Why (Motivation)
{story.why}

### What (Description)
{story.description}

### Acceptance Criteria
{for each AC}
- [{status}] AC-{id}: {description}
  - Tested: {yes/no}
  - Evidence: {path or description}

---

## ✅ What Went Well

{Extracted from transcript analysis:}
- {Pattern that worked}
- {Successful approach}
- {Smooth execution}
- {Effective tool usage}

---

## ⚠️ What Could Be Improved

{Extracted from pain points:}
- {Blocker encountered}
- {Time sink}
- {Confusion or ambiguity}
- {Inefficient approach}

---

## 🎯 Key Decisions

{For each decision in story.decisions:}

### D-{id}: {question}
- **Options Considered**: {list}
- **Chosen**: {choice}
- **Rationale**: {why}
- **Session**: {sessionName} ({sessionId})

---

## 💡 Learnings

### Patterns Discovered
{New patterns identified:}
- {Pattern name}: {description}

### Pain Points Encountered
{Issues to avoid next time:}
- {Pain point}: {description} → {how to avoid}

### Best Practices Validated
{What worked well:}
- {Practice}: {why it worked}

### Skills/Tools Used
{Technologies/approaches:}
- {Skill}: {how used} → {outcome}

---

## 📈 Session Breakdown

{For each session:}

### Session {N}: {sessionName}
- **ID**: {sessionId} (short: {first 8 chars})
- **Phase**: {phase}
- **Started**: {timestamp}
- **Ended**: {timestamp}
- **Duration**: {calculated}
- **Transcript**: {path}
- **Transaction ID**: {transactionId}

**Significant Events** ({count}):
{For each significant hook event:}
- [{timestamp}] {eventType}: {toolName} - {metadata.file or summary}

**Summary**:
{Brief narrative of what happened in this session}

---

## 🧵 Conversation Highlights

{Using deep-memory-search on transcript:}

**Key Moments**:
1. {timestamp}: {user question or important exchange}
2. {timestamp}: {decision point or clarification}
3. {timestamp}: {blocker or breakthrough}

---

## 🔗 Weave Recommendations

Based on this retrospective, recommend adding to Weave:

### Qualia (Q:)
{Pain points that should be documented:}
- `painpoint:{id}`: {description}

### Epistemology (E:)
{Patterns discovered:}
- `pattern:{id}`: {description}

### Praxeology (Π:)
{Best practices identified:}
- `bestpractice:{id}`: {description}

### Modality (Μ:)
{Alternatives considered:}
- `decision:{id}`: {what we chose vs what we rejected and why}

---

## 📦 Artifacts

- **Story**: `.claude/loom/stories/US-{XXX}.json` + `.md`
- **Retrospective**: `.claude/loom/retrospectives/US-{XXX}.md`
- **Transcripts**: {list transcript paths}
- **Commits**: {list commit hashes if available}

---

## 🎓 Takeaways

{3-5 key takeaways for future stories:}
1. {Actionable insight}
2. {Process improvement}
3. {Technical learning}

---

**Next Action**: Use `/weave:reflect` to add these learnings to the institutional knowledge base.
```

## Script Usage
The retrospective script can be called with options:

```bash
# Basic retrospective
bun .agent/loom/scripts/story-retrospective.ts US-001

# With verbose output
bun .agent/loom/scripts/story-retrospective.ts US-001 --verbose

# Regenerate existing
bun .agent/loom/scripts/story-retrospective.ts US-001 --force
```

## When to Use
- After completing a story (automatic in `/loom:complete`)
- When reviewing past work
- Before planning similar stories
- When extracting learnings for Weave

## Value
Retrospectives provide:
- **Accountability**: Complete record of what happened
- **Learning**: Extract patterns and pain points
- **Context**: Future reference for similar work
- **Knowledge**: Input for Weave reflection
- **Improvement**: Identify process enhancements

## Important Notes
- **Automatic in completion** - `/loom:complete` generates retrospective automatically
- **Manual when needed** - Use this command to view or regenerate
- **Feeds Weave** - Retrospectives are input for institutional learning
- **Session correlation** - All events linked by transactionId
- **Narrative focus** - Not just data, but story of what happened
