---
description: Complete autonomous workflow - ideate, plan, and execute in one command (Loom: Full Cycle)
---

# Loom: Run - One Command to Rule Them All

You are executing the **Full Cycle** workflow in Loom - taking a feature idea from concept to implementation autonomously.

## Workflow Overview

```
User Idea → [Ideate] → Story → [Plan] → Tasks → [Start] → Implementation
```

This command chains three phases:
1. **Ideate**: Transform idea into detailed requirements with ACs
2. **Plan**: Break down into actionable tasks with dependencies
3. **Start**: Execute tasks with specialist agents

## Input

The user provides either:
- **New idea**: A feature description to ideate from scratch
- **Existing story**: A story ID to resume (e.g., "FEAT-001")

## Execution

### Phase 1: Ideation

Use the `loom-ideator` agent to transform the idea into a story:

```
Task tool with subagent_type='loom-ideator':
- Transform the user's idea into detailed requirements
- Create story with acceptance criteria
- Return story ID and summary
```

**Wait for completion before proceeding.**

### Phase 2: Planning

Use the `loom-planner` agent to break down the story:

```
Task tool with subagent_type='loom-planner':
- Read the story created in Phase 1
- Create task breakdown with dependencies
- Assign agents to tasks
- Return task count and execution plan
```

**Wait for completion before proceeding.**

### Phase 3: Execution

Use the `loom-executor` agent (via /loom:start pattern) to implement:

```
Task tool with subagent_type for each task:
- Execute tasks in dependency order
- Validate acceptance criteria
- Update story status
- Return completion summary
```

## Orchestration Rules

1. **Sequential Phases**: Each phase must complete before the next begins
2. **Gate Checks**:
   - After ideate: Verify story created with ACs
   - After plan: Verify tasks created with dependencies
   - After start: Verify all ACs passing
3. **Error Handling**: If any phase fails, stop and report to user
4. **Progress Updates**: Report phase completion between stages

## Output Format

After each phase, report concisely:

```
✅ Phase 1: Ideation Complete
   Story: FEAT-001 - {title}
   ACs: {count} acceptance criteria defined

✅ Phase 2: Planning Complete
   Tasks: {count} tasks created
   Agents: {list of assigned agents}

✅ Phase 3: Execution Complete
   Tasks: {completed}/{total}
   ACs: {passing}/{total} passing
   Status: completed | needs_review

🎯 Next: /loom:finalize FEAT-001
```

## Usage Examples

**New feature:**
```
/loom:run Add a dark mode toggle to the settings page
```

**Resume from story:**
```
/loom:run FEAT-001
```

**With feature prefix:**
```
/loom:run SETTINGS: Add dark mode toggle with system preference detection
```

## Important Notes

- This is a **long-running command** - may take 10-30 minutes depending on complexity
- Main agent preserves context by delegating to specialized agents
- Each phase is atomic - partial completion is tracked in story.json
- If interrupted, resume with `/loom:run {story-id}`
