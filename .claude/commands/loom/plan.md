---
description: Break down story into tasks and prepare for execution (Loom: Planning Phase)
---

# Loom: Planning to Execution

You are executing the **Planning to Execution** workflow in Loom, the autonomous SDLC orchestration system.

## Context Loading

1. **Load Loom Config**:
   ```bash
   cat .agent/loom/config.json
   ```

2. **Load Weave Extension**:
   - Read `.agent/weave/extensions/loom/praxeology.json` for the planning workflow
   - Read `.agent/weave/extensions/loom/ontology.json` for task structure

3. **Load Target Story**:
   - User will specify which story to plan (e.g., "US-001")
   - Read `.claude/loom/stories/US-{XXX}.json`
   - Read `.claude/loom/stories/US-{XXX}.md`

## Workflow: Planning to Execution

Follow the workflow defined in `loom/praxeology.json > workflows > planning-to-execution`:

### Step 1: Load Story
- Read story JSON and MD
- Verify story status is `planned`
- Display story summary to user

### Step 2: Consult Librarian
- Use Librarian to find relevant files and patterns
- Query:
  - "Which files handle similar features?"
  - "Where are relevant patterns implemented?"
- Load relevant shards from `.agent/librarian/shards/`

### Step 3: Decompose Tasks
- Use Task tool with `subagent_type='system-architect'` to break story into discrete tasks
- Each task should be:
  - Assignable to single role
  - Have dependencies explicitly declared
  - Be a testable unit of work
- Create tasks in this format:
  ```json
  {
    "id": "T-001",
    "storyId": "US-001",
    "title": "Task title",
    "description": "What needs to be done",
    "status": "pending",
    "assignedAgent": "backend-dev",
    "dependencies": [],
    "sessionId": null,
    "transactionId": null,
    "createdAt": "2024-11-23T12:00:00Z",
    "completedAt": null
  }
  ```

### Step 4: Assign Roles
- Map each task to appropriate agent role based on:
  - Task type (backend, frontend, CLI, testing)
  - Required capabilities
  - Available roles in config
- Use role mapping from config.roles

### Step 5: Sequence Tasks
- Order tasks based on dependencies
- Create DAG (Directed Acyclic Graph) of execution
- Identify tasks that can run in parallel
- Validate no circular dependencies

### Step 6: User Approval
- Present plan to user:
  ```markdown
  ## Execution Plan for US-{XXX}

  ### Task Breakdown ({N} tasks)

  1. **T-001**: Task title (backend-dev)
     - Dependencies: none
     - Can start immediately

  2. **T-002**: Task title (frontend-dev)
     - Dependencies: T-001
     - Starts after T-001 completes

  ### Execution Order
  - Phase 1 (parallel): T-001, T-003
  - Phase 2 (sequential): T-002
  - Phase 3 (parallel): T-004, T-005

  ### Estimated Complexity
  [Based on story.estimatedComplexity and task count]
  ```
- Get user approval using `AskUserQuestion` if needed

### Step 7: Finalize Plan
- Update story JSON with tasks array
- Update task counter in config
- Keep story status as `planned` (will change to `in-progress` when /loom:start is called)

## Task Assignment Guidelines

Use these role assignments based on task type:

| Task Type | Assigned Role |
|-----------|--------------|
| Backend API | backend-dev |
| Frontend UI | frontend-dev |
| CLI commands | cli-dev |
| Database schema | backend-dev |
| Testing (backend) | backend-qa |
| Testing (frontend) | frontend-qa |
| Testing (CLI) | cli-qa |
| Architecture design | system-architect |
| Documentation | backend-dev or frontend-dev (depending on context) |

## Success Criteria
From `loom/praxeology.json > workflows > planning-to-execution > success_criteria`:
- ✓ All tasks have assigned roles
- ✓ Dependencies resolved
- ✓ Execution order defined
- ✓ User approved plan

## Next Steps
After completing planning, inform user:
> "Story US-{XXX} is now planned with {N} tasks. Use `/loom:start` to begin execution."

## Important Notes
- **No circular dependencies** - validate task graph
- **Parallel when possible** - identify independent tasks
- **Clear dependencies** - explicit before implicit
- **Right-sized tasks** - not too big, not too small
- **Consult Librarian** - find relevant patterns and files first
