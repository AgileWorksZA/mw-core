#!/usr/bin/env bun

import * as fs from "node:fs/promises";
import * as path from "node:path";

const JARVIS_SERVER = process.env.JARVIS_SERVER || "http://localhost:4000";

// Parse arguments
const [agentName, mode] = process.argv.slice(2);

if (!agentName) {
  console.error("Usage: wip.ts <agent-name> [next]");
  console.error("  next - pick up any available task");
  process.exit(1);
}

// Read agent session from .claude/agents/{name}.json
const agentFile = path.join(".claude/agents/names", `${agentName}.json`);
let sessionId: string;

try {
  const agentData = JSON.parse(await fs.readFile(agentFile, "utf-8"));
  sessionId = agentData.session_id;
} catch (error) {
  console.error(`❌ Could not read agent file: ${agentFile}`);
  console.error("Make sure you've registered with /jarvis-register first");
  process.exit(1);
}

// Find next card
try {
  const endpoint = mode === "next" 
    ? `${JARVIS_SERVER}/api/kanban/cards/next`
    : `${JARVIS_SERVER}/api/kanban/cards/next?assigned_to=${agentName}`;
    
  const response = await fetch(endpoint);
  
  if (!response.ok) {
    throw new Error(`Failed to get next card: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (!result.card) {
    console.log("📭 No cards available");
    if (mode !== "next") {
      console.log("Try: /jarvis-wip ${agentName} next");
    }
    process.exit(0);
  }

  // Move card to In Progress
  const moveResponse = await fetch(`${JARVIS_SERVER}/api/kanban/cards/${result.card.id}/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to_column: "In Progress",
      session_id: sessionId,
      agent_name: agentName,
    }),
  });

  if (!moveResponse.ok) {
    throw new Error(`Failed to move card: ${moveResponse.statusText}`);
  }

  const card = result.card;
  
  // Create kanban card file
  const cardContent = `# Kanban Card #${card.id}: ${card.title}

## Description
${card.description || 'No description provided'}

## Assigned To
${card.assigned_to || 'Unassigned'}

## Column
In Progress

## Created
${new Date(card.created_at).toLocaleString()}

## Feedback History
${card.feedback_history?.map((f: any) => `- [${new Date(f.timestamp).toLocaleString()}] ${f.agent_name}: ${f.feedback}`).join('\n') || 'No feedback yet'}

---

To complete this task:
1. Work on the implementation
2. Run: /jarvis-complete "${agentName}" ${card.id} "Your completion message"
`;

  await fs.writeFile(`.claude/kanban-card-${card.id}.md`, cardContent);
  
  console.log(`\n📋 Picked up card #${card.id}: ${card.title}\n`);
  console.log(cardContent);
  
} catch (error: any) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}