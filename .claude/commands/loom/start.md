---
description: Begin executing planned story autonomously (Loom: Execution Phase)
---

# Loom: Execution

You are executing the **Execution** workflow in Loom, the autonomous SDLC orchestration system.

## Context Loading

1. **Load Loom Config**:
   ```bash
   cat .agent/loom/config.json
   ```

2. **Load Weave Extension**:
   - Read `.agent/weave/extensions/loom/praxeology.json` for execution workflow and interruption policy
   - Read `.agent/weave/extensions/loom/deontics.json` for obligations and prohibitions

3. **Load Target Story**:
   - User will specify which story to execute (e.g., "US-001")
   - Find story JSON (supports both structures):
     - Flat: `.claude/loom/stories/{story-id}.json`
     - Feature: `.claude/loom/features/*/stories/{story-id}/story.json`
   - Load story JSON
   - Verify story.status === 'planned'
   - Verify story.tasks.length > 0
   - Load all task definitions

## Workflow: Execution

Follow the workflow defined in `loom/praxeology.json > workflows > execution`:

### Step 0: Pre-flight Checks & Planning

**CRITICAL**: Before starting execution, generate and display the execution plan to the user.

1. **Validate Story State**:
   ```typescript
   // Check pre-conditions
   if (story.status !== 'planned') {
     ERROR: "Story must be in 'planned' status"
     SUGGEST: "Use /loom:ideate and /loom:plan first"
   }

   if (story.tasks.length === 0) {
     ERROR: "No tasks defined for story"
     SUGGEST: "Use /loom:plan to create tasks"
   }
   ```

2. **Build Dependency Graph**:
   - Create adjacency list from task dependencies
   - Detect circular dependencies (MUST be acyclic)
   - Perform topological sort to determine execution layers

3. **Generate Execution Plan**:
   ```typescript
   // Example output structure
   {
     layers: [
       {
         level: 0,
         tasks: [{id: 'US-001-T-001', agent: 'backend-dev', title: '...'}]
       },
       {
         level: 1,
         tasks: [{id: 'US-001-T-002', agent: 'backend-dev', title: '...'}]
       }
     ],
     estimatedPhases: 5,
     totalTasks: 5,
     roles: ['backend-dev', 'frontend-dev', 'frontend-qa']
   }
   ```

4. **Display Execution Plan to User**:
   ```markdown
   ## 🎯 Execution Plan for US-001

   **Story**: Add session metrics dashboard
   **Total Tasks**: 5
   **Execution Phases**: 5 (sequential)
   **Agents Required**: backend-dev (2), frontend-dev (2), frontend-qa (1)

   ### Execution Sequence

   **Phase 1**: Foundation
   ├─ US-001-T-001 [backend-dev]: Create session metrics database schema

   **Phase 2**: API Layer
   ├─ US-001-T-002 [backend-dev]: Implement session metrics API endpoint
       └─ Depends on: T-001

   **Phase 3**: UI Components
   ├─ US-001-T-003 [frontend-dev]: Create dashboard UI component
       └─ Depends on: T-002

   **Phase 4**: Integration
   ├─ US-001-T-004 [frontend-dev]: Add dashboard route and navigation
       └─ Depends on: T-003

   **Phase 5**: Validation
   ├─ US-001-T-005 [frontend-qa]: Test dashboard functionality
       └─ Depends on: T-004

   **Acceptance Criteria** (5):
   - AC-001: Dashboard displays list of recent sessions
   - AC-002: Real-time metrics update using SSE
   - AC-003: Tool usage statistics shown
   - AC-004: Session duration analytics shown
   - AC-005: Dashboard accessible from navigation

   **Estimated Execution Time**: 15-25 minutes (varies by complexity)
   ```

5. **Get User Confirmation**:
   ```typescript
   // Use AskUserQuestion tool
   askUser({
     question: "Proceed with execution?",
     options: [
       {label: "Yes - Execute all tasks", description: "Run full execution plan"},
       {label: "Dry run - Show what would happen", description: "Don't execute, just preview"},
       {label: "Cancel", description: "Return to planning"}
     ]
   })
   ```

6. **Handle User Response**:
   - **"Yes"**: Proceed to Step 1 (Session Initialization)
   - **"Dry run"**: Display detailed plan, exit
   - **"Cancel"**: Exit without changes

---

### Step 1: Session Initialization
- **Update story status**: `planned` → `in-progress`
- **Capture session info** (automatically via SessionStart hook):
  - sessionId (from claude-hooks-sdk)
  - transactionId (from claude-hooks-sdk)
  - transcriptPath
- **Add session to story**:
  ```json
  {
    "sessionId": "d0d5f5d4-488d-46e1-b097-2e06042016bd",
    "sessionName": "brave-elephant",
    "transactionId": "tx_1732377600_abc123def",
    "transcriptPath": "~/.claude/projects/-Users-name-agios/d0d5f5d4.jsonl",
    "storyId": "US-001",
    "phase": "implementation",
    "started": "2024-11-23T12:00:00Z",
    "ended": null,
    "significant": true
  }
  ```

### Step 2: Hydrate Agents
- For each unique role in tasks:
  - Load agent template from `.agent/loom/templates/agents/{role}.md`
  - Inject Weave context (patterns, pain points, best practices)
  - Prepare agent prompt with story context

### Step 3: Execute Tasks (Main Loop)

**IMPORTANT**: Execute tasks layer-by-layer (based on topological sort from Step 0).

For each layer in execution plan:

#### A. Layer Execution Strategy

**If layer has 1 task** (sequential):
- Execute task using detailed pattern below
- Wait for completion
- Move to next layer

**If layer has 2+ tasks** (parallel):
- Build prompts for ALL tasks in layer
- Spawn ALL agents in **SINGLE message** (multiple Task tool calls)
- Wait for ALL to complete
- Validate ALL results
- Move to next layer

Example parallel execution:
```xml
<function_calls>
<invoke name="Task">
  <parameter name="subagent_type">backend-dev</parameter>
  <parameter name="description">Create auth service</parameter>
  <parameter name="prompt">...</parameter>
</invoke>
<invoke name="Task">
  <parameter name="subagent_type">backend-dev</parameter>
  <parameter name="description">Create user service</parameter>
  <parameter name="prompt">...</parameter>
</invoke>
</function_calls>
```

#### B. Task Execution Pattern (for each task):

1. **Pre-Task Setup**:
   ```bash
   # Update task status in story.json
   bun .agent/loom/scripts/task-status.ts US-001 US-001-T-001 in-progress
   ```

   Display progress:
   ```
   🔄 Executing Phase {N}/{Total}: {Phase Name}
   ├─ Task: {task.id}
   ├─ Role: {task.assignedAgent}
   └─ Description: {task.title}
   ```

2. **Build Task Execution Prompt**:

   Load context:
   - Story WHY, WHAT, AC (from story.json)
   - Task details (id, title, description, dependencies)
   - Weave knowledge (patterns, pain points, best practices)
   - Stack context (from config.json)
   - Related files (from Librarian if available)

   Construct prompt:
   ```markdown
   # Task Execution: {task.id}

   You are a **{task.assignedAgent}** agent executing a task in the Loom SDLC system.

   ## Story Context

   **Story**: {story.id} - {story.title}

   **Why** (Root Motivation):
   {story.why}

   **What** (Description):
   {story.description}

   **Priority**: {story.priority}
   **Complexity**: {story.estimatedComplexity}

   ## Your Task

   **Task ID**: {task.id}
   **Title**: {task.title}
   **Description**: {task.description}
   **Dependencies**: {task.dependencies} (already completed)

   ## Acceptance Criteria

   Your implementation contributes to these story-level acceptance criteria:
   {story.acceptanceCriteria.map(ac => `- ${ac.description}`)}

   ## Technology Stack

   **Runtime**: {config.stack.runtime}
   **Backend**: {config.stack.backend}
   **Frontend**: {config.stack.frontend}
   **Database**: {config.stack.database}

   **Patterns in Use**: {config.patterns}

   ## Weave Knowledge

   {weaveContext.patterns}
   {weaveContext.painPoints}
   {weaveContext.bestPractices}

   ## Definition of Done

   {config.definitionOfDone}

   ## Instructions

   1. Implement the task requirements
   2. Follow project patterns and conventions
   3. Write tests for your implementation
   4. Verify your work before completing
   5. Commit your changes with clear message
   6. Report completion status and artifacts created

   **Important**: Work autonomously. Ask questions only if requirements are ambiguous.
   ```

3. **Spawn Agent**:
   ```typescript
   // Use Task tool
   await Task({
     subagent_type: task.assignedAgent, // e.g., 'backend-dev'
     description: task.title,
     prompt: taskExecutionPrompt, // Built above
     model: 'sonnet' // Use Sonnet for implementation tasks
   })
   ```

4. **Capture Agent Output**:
   - Agent returns final report with:
     - What was implemented
     - Files created/modified
     - Tests written/run
     - Commit hash (if committed)
     - Any blockers or issues

5. **Post-Task Cleanup**:
   ```bash
   # Update task status to completed
   bun .agent/loom/scripts/task-status.ts US-001 US-001-T-001 completed

   # Summarize result (for context management)
   SUMMARY: "✅ T-001 completed. Created database schema with 3 tables,
            wrote migration, tested locally. Committed: abc123"
   ```

   Display progress:
   ```
   ✅ Phase {N}/{Total} Complete: {Phase Name}
      Duration: {elapsed}
      Artifacts: {files created/modified}
   ```

6. **Error Handling**:

   If agent reports failure or error:
   ```typescript
   // Mark task as failed
   bun .agent/loom/scripts/task-status.ts US-001 US-001-T-001 failed

   // Analyze error
   if (isTransientError) {
     // Retry once
     retryTask(task)
   } else if (isBlocker) {
     // Escalate to user
     askUser("Task {task.id} blocked: {error}. How to proceed?")
   } else {
     // Create remediation task
     createFixTask(task, error)
   }
   ```

#### C. Progress Tracking

After each task completes:
- Update story.json with task status
- Capture session/transaction IDs
- Store task artifacts (files, commits, tests)
- Summarize result in 2-3 sentences (context management)
- Continue to next task/layer

Display overall progress:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Execution Progress for US-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Phase 1/5: Foundation - COMPLETE (2 min)
✅ Phase 2/5: API Layer - COMPLETE (3 min)
🔄 Phase 3/5: UI Components - IN PROGRESS
⏳ Phase 4/5: Integration - PENDING
⏳ Phase 5/5: Validation - PENDING

Tasks: 2/5 completed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 4: Track Events (Automatic)
- PostToolUse hook captures significant tool uses
- Events stored with transactionId for correlation
- Example event:
  ```json
  {
    "transactionId": "tx_1732377600_abc123def",
    "sessionId": "d0d5f5d4-...",
    "eventType": "PostToolUse",
    "toolName": "Write",
    "metadata": {
      "file": "src/adapters/twilio.ts",
      "timestamp": "2024-11-23T12:15:00Z"
    },
    "timestamp": "2024-11-23T12:15:00Z"
  }
  ```

### Step 5: Validate Acceptance Criteria
After all implementation tasks complete:
1. **For each AC**:
   - Delegate to appropriate QA agent (backend-qa, frontend-qa, cli-qa)
   - Run tests, check UI, validate behavior
   - Capture evidence (test output, screenshots, etc.)
   - Mark AC as `pass` or `fail`

2. **Record Results**:
   - Update AC objects in story JSON
   - Set `tested=true` and `status=pass|fail`
   - Store `evidence` path

### Step 6: Iterate on Failures
- If any AC fails:
  - Analyze failure
  - Create fix tasks
  - Delegate to appropriate agent
  - Re-test
- Repeat until all AC pass OR max iterations reached (3)
- If still failing after 3 iterations:
  - Ask user for guidance using `AskUserQuestion`

## Interruption Policy
From `loom/praxeology.json > workflows > execution > interruption_policy`:

**ASK USER WHEN**:
- ✋ Ambiguous requirement encountered
- ✋ Multiple valid approaches (user preference needed)
- ✋ AC failing after reasonable attempts (3)
- ✋ Unexpected blocker

**DON'T ASK WHEN**:
- ✅ Implementation details clear from context
- ✅ Single obvious solution
- ✅ Temporary errors (retry automatically)

## Autonomous Execution Guidelines
- **Trust the plan**: User approved it, execute confidently
- **Delegate deeply**: Let subagents handle details
- **Preserve context**: Keep high-level overview, delegate implementation
- **Batch updates**: Update story JSON after completing each task, not during
- **Fail fast**: Report blockers early, don't waste cycles

## Success Criteria
From `loom/praxeology.json > workflows > execution > success_criteria`:
- ✓ All tasks completed
- ✓ All acceptance criteria tested and passing
- ✓ Changes committed
- ✓ Session events captured

## Next Steps
After completing execution, inform user:
> "Story US-{XXX} implementation complete! All {N} acceptance criteria passing. Use `/loom:complete` to finalize and extract learnings."

## Important Notes
- **Work autonomously** - minimize interruptions
- **Test everything** - all AC must pass
- **Track events** - hooks do this automatically
- **Update story JSON** - keep metadata current
- **Commit incrementally** - don't wait until end
- **Ask when stuck** - follow interruption policy
