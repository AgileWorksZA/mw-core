# Loom - Autonomous SDLC Orchestration

**Version**: 1.0.0
**Status**: Core infrastructure complete (Phase 1)

Loom is an autonomous software development lifecycle orchestration system that enables AI agents to manage feature development from ideation through completion with continuous learning and minimal human intervention.

---

## 🎯 What is Loom?

Loom weaves stories together using **Weave** as its knowledge fabric. It's designed to:

- **Autonomous Execution**: Execute planned work with minimal interruptions
- **Knowledge-Driven**: Leverage Weave's 11-dimensional knowledge framework
- **Self-Improving**: Learn from every feature and update institutional knowledge
- **Traceable**: Complete audit trail from idea → sessions → events → learnings
- **Project-Agnostic**: Bootstrap to any stack through progressive definition

---

## 🏗️ Architecture

### Three Layers

1. **Weave Extension** (`.agent/weave/extensions/loom/`)
   - Ontology: Entities (UserStory, Task, Session, etc.)
   - Praxeology: Workflows (Ideation, Planning, Execution, etc.)
   - Deontics: Rules (DoD, DoR, obligations, prohibitions)

2. **Core System** (`.agent/loom/`)
   - Config: Bootstrap configuration
   - Templates: Agent templates with hydration points
   - Scripts: Bootstrap, hydration, retrospectives

3. **Claude Code Integration** (`.claude/loom/`)
   - Commands: Slash commands for workflows
   - Active work: Ideas, stories, retrospectives (ephemeral)

### File Structure

```
.agent/
  ├── weave/extensions/loom/         # Loom as Weave extension
  │   ├── manifest.json               # Extension metadata
  │   ├── ontology.json               # Entities & relations
  │   ├── praxeology.json             # Workflows & processes
  │   ├── deontics.json               # Rules & obligations
  │   └── hooks/                      # Session tracking
  │       ├── session-start.ts
  │       ├── post-tool-use.ts
  │       └── session-end.ts
  └── loom/                           # Loom core
      ├── config.json                 # Bootstrap config
      ├── templates/agents/           # Agent templates
      │   └── backend-dev.md
      └── scripts/
          ├── bootstrap.ts            # Initial setup
          ├── hydrate-agents.ts       # Inject Weave context
          └── story-retrospective.ts  # Generate retrospectives

.claude/
  ├── commands/loom/                  # Slash commands
  │   ├── ideate.md                   # /loom:ideate
  │   ├── plan.md                     # /loom:plan
  │   ├── start.md                    # /loom:start
  │   ├── complete.md                 # /loom:complete
  │   ├── investigate.md              # /loom:investigate
  │   ├── tweak.md                    # /loom:tweak
  │   └── retrospective.md            # /loom:retrospective
  └── loom/                           # Active work
      ├── features/                   # Feature-first organization
      │   └── {feature-name}/
      │       ├── manifest.json       # Feature metadata
      │       ├── README.md           # Feature documentation
      │       ├── docs/               # Feature-specific docs
      │       └── stories/
      │           └── {story-id}/
      │               ├── story.json  # Story metadata
      │               ├── story.md    # Progressive disclosure
      │               ├── notes.md    # Additional context
      │               └── retrospective.md
      ├── archive/                    # Completed features
      └── ideas/                      # Unstructured ideation
```

---

## 🚀 Getting Started

### Step 1: Bootstrap Loom

Initialize Loom for your project:

```bash
bun .agent/loom/scripts/bootstrap.ts
```

This will:
- Detect your project stack (runtime, frameworks, database)
- Scan for architectural patterns (CQRS, SSE, workers, etc.)
- Ask about Way of Working preferences
- Create initial configuration
- Register as Weave extension

### Step 2: Review Configuration

Check the generated config:

```bash
cat .agent/loom/config.json
```

Customize if needed (or use `/loom:configure` when implemented).

### Step 3: Start Your First Story

Use the ideation workflow:

```bash
# In Claude Code
/loom:ideate
```

---

## 📖 Workflows

Loom provides five main workflows:

### 1. Ideation (`/loom:ideate`)
Transform rough idea into detailed, testable requirements.

**Process**:
1. Capture rough idea
2. Extract WHY using 5 Whys
3. Consult Weave for patterns/pain points
4. Draft user story with acceptance criteria
5. Get user approval
6. Create story artifacts (JSON + MD)

**Output**: Story ready for planning (status: `planned`)

---

### 2. Planning (`/loom:plan`)
Break down story into tasks and prepare for execution.

**Process**:
1. Load story context
2. Consult Librarian for relevant files
3. Decompose into discrete tasks
4. Assign tasks to agent roles
5. Sequence tasks by dependencies
6. Get user approval

**Output**: Execution plan with task graph

---

### 3. Execution (`/loom:start`)
Execute planned tasks autonomously.

**Process**:
1. Initialize session tracking
2. Hydrate agents with Weave context
3. Execute tasks in sequence/parallel
4. Track significant events automatically
5. Validate acceptance criteria
6. Iterate on failures

**Output**: Implementation complete, all AC passing

---

### 4. Completion (`/loom:complete`)
Finalize story, extract learnings, update Weave.

**Process**:
1. Final AC verification (hard gate)
2. Update documentation
3. Generate retrospective
4. Extract learnings via Shadow Advisor
5. Weave reflection (`/weave:reflect`)
6. Create comprehensive commit
7. Mark story complete

**Output**: Story complete, knowledge captured

---

### 5. Adhoc Operations

**Investigate** (`/loom:investigate`):
- Debug issues outside story context
- Search scrolls and Weave
- Diagnose root cause
- Create story or quick fix

**Tweak** (`/loom:tweak`):
- Small modifications (1-3 files)
- Single role changes
- Quick wins
- Auto-suggest story if scope grows

**Retrospective** (`/loom:retrospective`):
- View or regenerate retrospective
- Analyze sessions and events
- Extract learnings

---

## 🧬 Progressive Definition

Loom evolves through four levels:

### Level 0: Universal (Shipped)
- Core entities (UserStory, Task, Session)
- Standard workflows (Ideation → Completion)
- Generic agent roles

### Level 1: Bootstrap (First Run)
- Detect project stack
- Scan architectural patterns
- Configure Way of Working
- Map stack → agent roles

### Level 2: Hydration (Every Execution)
- Load Weave context
- Inject into agent templates
- Generate role-specific prompts
- Fresh knowledge every time

### Level 3: Evolution (Continuous)
- Learn from every story
- Update Weave with patterns/pain points
- Improve templates
- Refine workflows

---

## 🎯 Key Concepts

### Feature-Scoped Story IDs
Stories use feature codes for unique identification:

- **Format**: `{CODE}-{nnn}` (e.g., `MD-001`, `AUTH-003`)
- **Auto-generation**: Feature codes derived from feature names
  - Multi-word: First letters (metrics-dashboard → MD)
  - Single-word: First 4 chars (analytics → ANAL)
- **Manual codes**: Specify with `--code` parameter
- **Benefits**: Prevents ID collisions when planning multiple features concurrently
- **Counter**: Each feature maintains its own `storyCounter` in manifest
- **Legacy support**: Stories without features use global `US-XXX` format

### Hybrid Artifacts
Every story has two representations:

- **JSON** (`.claude/loom/features/{feature}/stories/{id}/story.json`): Machine-readable metadata
- **Markdown** (`.claude/loom/features/{feature}/stories/{id}/story.md`): Human-readable progressive disclosure

### Session Tracking
Automatic correlation of:
- `sessionId`: Claude Code session UUID
- `transactionId`: Transaction ID from claude-hooks-sdk
- `transcriptPath`: Path to conversation transcript
- `hookEvents`: Significant tool uses (Write, Edit, git, tests)

### Weave Integration
Loom **extends** Weave with:
- **Ontology**: SDLC entities
- **Praxeology**: Development workflows
- **Deontics**: Quality gates and rules

But **depends on** Weave for:
- Patterns and best practices
- Pain points to avoid
- Historical learnings
- Architectural decisions

### Agent Hydration
Templates + Context Injection = Specialized Agents

```
backend-dev.md (template)
+ Weave context (patterns, pain points)
+ Story context (why, what, AC)
+ Stack context (ElysiaJS, PostgreSQL)
= backend-dev prompt (hydrated)
```

---

## 🔧 Scripts

### Bootstrap
```bash
bun .agent/loom/scripts/bootstrap.ts
```
Initialize Loom for project.

### Feature Management

**Feature-Scoped Story IDs**: Stories created within features use feature codes for unique IDs (e.g., `MD-001`, `AUTH-001`). This prevents ID collisions when planning multiple features concurrently.

```bash
# Create new feature with explicit code
bun .agent/loom/scripts/feature-create.ts metrics-dashboard \
  --code "MD" \
  --epic "EPIC-ANALYTICS" \
  --description "Real-time session metrics dashboard" \
  --phase "MVP"

# Create new feature with auto-generated code
# "metrics-dashboard" → "MD" (first letters)
# "analytics" → "ANAL" (first 4 chars)
bun .agent/loom/scripts/feature-create.ts user-profile

# Create story in feature (generates feature-scoped ID: MD-001, MD-002, etc.)
bun .agent/loom/scripts/story-create.ts \
  --feature metrics-dashboard \
  --title "Add session metrics dashboard" \
  --description "..." \
  --why "..." \
  --ac "Criterion 1" \
  --ac "Criterion 2" \
  --ac "Criterion 3"

# View board
bun .agent/loom/scripts/board-view.ts
bun .agent/loom/scripts/board-view.ts --feature metrics-dashboard
bun .agent/loom/scripts/board-view.ts --json
```

### Task Management
```bash
# Update task status during execution
bun .agent/loom/scripts/task-status.ts US-001 US-001-T-001 in-progress
bun .agent/loom/scripts/task-status.ts US-001 US-001-T-001 completed --session-id "abc-123"
bun .agent/loom/scripts/task-status.ts US-001 US-001-T-001 failed --error "Database migration failed"
```

### Acceptance Criteria Validation
```bash
# List all AC for a story
bun .agent/loom/scripts/validate-ac.ts US-001 --list

# Update AC status
bun .agent/loom/scripts/validate-ac.ts US-001 US-001-AC-001 pass --evidence "Test passing"
bun .agent/loom/scripts/validate-ac.ts US-001 US-001-AC-002 fail --evidence "SSE returns 404"

# Show validation suggestions
bun .agent/loom/scripts/validate-ac.ts US-001 --validate-all
```

### Hydrate Agents
```bash
bun .agent/loom/scripts/hydrate-agents.ts US-001 backend-dev
bun .agent/loom/scripts/hydrate-agents.ts US-001 --all
```
Generate agent prompts with injected context.

### Story Retrospective
```bash
bun .agent/loom/scripts/story-retrospective.ts US-001
bun .agent/loom/scripts/story-retrospective.ts US-001 --verbose
```
Analyze completed story and generate retrospective.

---

## 📊 Status

### ✅ Phase 1: Core Infrastructure (COMPLETE)
- [x] Directory structure
- [x] Weave extension manifest
- [x] Ontology (entities, relations, constraints)
- [x] Praxeology (workflows, delegation)
- [x] Deontics (DoD, DoR, rules)
- [x] Bootstrap script
- [x] Session tracking hooks
- [x] Slash commands (7 workflows)
- [x] Agent hydration script
- [x] Retrospective script
- [x] Agent templates (backend-dev)

### ✅ Phase 2: Ideation & Planning (COMPLETE)
- [x] Story creation utility with DoR validation
- [x] Story activation for session tracking
- [x] Task creation utility with role validation
- [x] Dependency graph validation and visualization
- [x] Topological sort for execution sequence
- [x] Agent hydration tested and working
- [x] End-to-end workflow tested with US-001
- [x] **Improvement #1**: Feature-first board structure
  - [x] Feature creation utility (feature-create.ts)
  - [x] Updated story creation for feature organization
  - [x] Dynamic board view generator (board-view.ts)
  - [x] Visual + JSON output modes
  - [x] Feature filtering support

### ✅ Pre-Phase 3 Improvements (COMPLETE)
- [x] **Improvement #1**: Feature-first board structure (COMPLETE)
  - Eliminates dual status tracking (status in metadata only)
  - All story artifacts together in feature directories
  - Dynamic board generation (no manual board.json sync)
  - Scalable and git-friendly organization
- [x] **Improvement #2**: Bootstrap stack detection for monorepos (COMPLETE)
  - Scans all workspace packages (apps/*, packages/*)
  - Detects backend/frontend frameworks across monorepo
  - Improved pattern detection with Librarian catalog integration
  - Fallback to file scanning when Librarian unavailable
  - Correctly identifies: ElysiaJS, React, React Router, Drizzle, PostgreSQL
  - Detects patterns: CQRS, SSE, Workers, Real-time
- [x] **Improvement #3**: Weave Shadow Advisor integration (COMPLETE)
  - Reads Weave 11D dimensions during agent hydration
  - Injects patterns, pain points, best practices into agent prompts
  - Supports specific Weave references (e.g., "E:pattern-sse", "Q:painpoint-001")
  - `/loom:ideate` workflow instructs to consult Shadow Advisor
  - `/loom:plan` workflow instructs to consult Librarian for files
  - Agent templates include **Weave Knowledge** section with institutional knowledge
- [x] **Improvement #4**: Feature-scoped story IDs (COMPLETE)
  - Feature codes prevent ID collisions (MD-001, AUTH-001 vs global US-001)
  - Auto-generation from feature names (metrics-dashboard → MD)
  - Manual codes via `--code` parameter
  - Feature-scoped counters in feature manifests
  - Story dependencies support via `storyDependencies` field
  - Backward compatible with legacy US-XXX format
  - Tested end-to-end with multiple features

### ✅ Phase 3: Execution (COMPLETE)
- [x] Task orchestration engine in `/loom:start`
- [x] Pre-flight checks and execution planning
- [x] Topological sort for dependency resolution
- [x] User confirmation before execution
- [x] Layer-by-layer task execution
- [x] Parallel execution support (multiple Task tool calls)
- [x] Task status tracking (`task-status.ts`)
- [x] Progress tracking and display
- [x] AC validation framework (`validate-ac.ts`)
- [x] Error handling with retry logic
- [x] Context management guidelines
- [x] Session/transaction tracking integration

### 🚧 Phase 4: Completion & Learning (TODO)
- [ ] Documentation updates
- [ ] Transcript analysis
- [ ] Learning extraction
- [ ] Weave reflection integration
- [ ] Commit generation

### 🚧 Phase 5: Adhoc & Evolution (TODO)
- [ ] Investigation workflow
- [ ] Tweak workflow
- [ ] Scope assessment logic
- [ ] Template evolution
- [ ] Metrics collection

### 🚧 Phase 6: Polish & Documentation (TODO)
- [ ] Error handling refinement
- [ ] User experience polish
- [ ] Complete documentation
- [ ] Examples and guides
- [ ] Performance optimization

---

## 🎓 Design Principles

1. **Knowledge-Driven**: Weave first, always
2. **Autonomous with Guardrails**: Execute confidently, ask when truly ambiguous
3. **Progressive Disclosure**: Load summary, query details on demand
4. **Hybrid Artifacts**: JSON for machines, MD for humans
5. **Complete Audit Trail**: Sessions → Events → Learnings → Weave
6. **Self-Improving**: Learn from every story
7. **Project-Agnostic**: Bootstrap to any stack

---

## 🤝 Related Systems

- **Weave**: 11D knowledge framework (Q+E+O+M+C+A+T+Η+Π+Μ+Δ)
- **Shadow Advisor**: Query Weave for institutional knowledge
- **Librarian**: Semantic file index for structural knowledge
- **Scrolls**: Conversation transcripts (searchable memory)
- **claude-hooks-sdk**: Session and transaction tracking

---

## 📝 Notes

- Loom is a **product**, not just a tool - standalone and reusable
- Designed for **autonomous** operation with minimal interruption
- **Depends on** Weave and claude-hooks-sdk
- Uses **progressive definition** to adapt to any project
- Captures **complete audit trail** for retrospectives
- **Self-improving** through continuous learning

---

**Next Steps**: Implement Phase 2 (Ideation & Planning) workflows.
