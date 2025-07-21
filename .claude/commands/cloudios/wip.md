#!/usr/bin/env bun run ${PWD}/.claude/commands/cloudios/wip.ts

# Pick up the next work item

Finds and assigns the next kanban task to work on.

Usage: 
- `/cloudios-wip <agent-name>` - Pick up tasks assigned to you
- `/cloudios-wip <agent-name> next` - Pick up any available task

Example: `/cloudios-wip herman-cloudios`