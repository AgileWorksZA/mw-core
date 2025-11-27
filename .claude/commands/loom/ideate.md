---
description: Transform rough idea into detailed, testable requirements (Loom: Ideation Phase)
---

# Loom: Ideation to Requirements

You are executing the **Ideation to Requirements** workflow in Loom, the autonomous SDLC orchestration system.

## Context Loading

1. **Load Loom Config**:
   ```bash
   cat .agent/loom/config.json
   ```
   This provides:
   - Project stack and patterns
   - Way of Working preferences
   - Definition of Done
   - Available agent roles

2. **Load Weave Extension**:
   - Read `.agent/weave/extensions/loom/praxeology.json` for the detailed ideation workflow
   - Read `.agent/weave/extensions/loom/ontology.json` for story structure
   - Read `.agent/weave/extensions/loom/deontics.json` for DoR (Definition of Ready)

3. **Check Story Counter**:
   - Next story ID will be `US-{counter+1}` (zero-padded to 3 digits)

## Workflow: Ideation to Requirements

Follow the workflow defined in `loom/praxeology.json > workflows > ideation-to-requirements`:

### Step 1: Capture Idea
- Listen to user's rough idea
- Capture it in `.claude/loom/ideas/{timestamp}.md`
- Keep it raw - don't refine yet

### Step 2: Extract the WHY
- Use **5 Whys** or similar technique to extract root motivation
- Focus on:
  - Business value
  - User impact
  - Root problem being solved
- Ask clarifying questions using `AskUserQuestion` tool

### Step 3: Consult Weave (Shadow Advisor)
- Use the Task tool with `subagent_type='shadow-advisor'` to query:
  - "Have we implemented similar features before?"
  - "What pain points should we avoid?"
  - "Are there relevant architectural patterns?"
- Capture Weave references for the story

### Step 4: Draft Requirements
- Use Task tool with `subagent_type='requirements-planner'` to:
  - Draft user story with clear title and description
  - Define 3-7 testable acceptance criteria
  - Estimate complexity (trivial|simple|moderate|complex|epic)
  - Set priority (critical|high|medium|low)
- Output: Draft story in JSON + MD format

### Step 5: User Approval
- Present requirements to user
- Use `AskUserQuestion` if multiple approaches exist
- Get explicit approval before finalizing

### Step 6: Finalize Story
- Increment story counter in config
- Create finalized story artifacts:
  - `.claude/loom/stories/US-{XXX}.json` (machine-readable metadata)
  - `.claude/loom/stories/US-{XXX}.md` (human-readable progressive disclosure)
- Update config with new counter
- Set story status to `planned`

## Story Artifact Format

### US-XXX.json (Metadata)
```json
{
  "id": "US-001",
  "title": "Feature title",
  "description": "Brief description",
  "why": "Root motivation extracted via 5 Whys",
  "status": "planned",
  "priority": "high",
  "estimatedComplexity": "moderate",
  "sessions": [],
  "hookEvents": [],
  "tasks": [],
  "acceptanceCriteria": [
    {
      "id": "AC-001",
      "storyId": "US-001",
      "description": "Clear, testable criterion",
      "testable": true,
      "tested": false,
      "evidence": null,
      "status": "pending"
    }
  ],
  "decisions": [],
  "learnings": [],
  "weaveRefs": ["E:pattern-xxx", "Q:painpoint-yyy"],
  "createdAt": "2024-11-23T12:00:00Z",
  "completedAt": null
}
```

### US-XXX.md (Progressive Disclosure)
```markdown
# US-001: Feature Title

## Why (Root Motivation)
[The WHY extracted via 5 Whys - business value, user impact]

## Description
[Detailed description of what needs to be built]

## Acceptance Criteria
- [ ] AC-001: Clear, testable criterion
- [ ] AC-002: Another testable criterion
- [ ] AC-003: Third criterion

## Weave Knowledge
- **Patterns**: [List relevant patterns from Weave]
- **Pain Points**: [List known pain points to avoid]
- **Best Practices**: [List relevant best practices]

## Complexity: Moderate
## Priority: High

## Notes
[Any additional context, decisions, or considerations]
```

## Success Criteria (DoR - Definition of Ready)
From `loom/deontics.json > definition_of_ready > story-dor`:
- ✓ WHY extracted (business motivation clear)
- ✓ 3-7 testable acceptance criteria defined
- ✓ Weave consulted for relevant knowledge
- ✓ User approved requirements
- ✓ Story status = planned

## Next Steps
After completing ideation, inform user:
> "Story US-{XXX} is now planned and ready for execution. Use `/loom:plan` to break it down into tasks, or `/loom:start` to begin immediately."

## Important Notes
- **Always extract the WHY** - this is critical for understanding true value
- **Make AC testable** - each must be verifiable
- **Consult Weave** - leverage institutional knowledge
- **Get user approval** - don't assume requirements
- **Create both JSON and MD** - hybrid artifacts for machine + human
