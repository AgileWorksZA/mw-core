#!/usr/bin/env bun run ${PWD}/.claude/commands/cloudios/complete.ts

# Mark a task as complete

Moves a kanban task card to the Review column after completion.

Usage: `/cloudios-complete "<agent-name>" <card-id> "<message>"`

Example: `/cloudios-complete "herman-cloudios" 123 "Added error handling and tests"`