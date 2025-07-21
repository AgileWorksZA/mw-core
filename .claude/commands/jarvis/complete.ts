#!/usr/bin/env bun

import * as fs from "node:fs/promises";
import * as path from "node:path";

const JARVIS_SERVER = process.env.JARVIS_SERVER || "http://localhost:4000";

// Parse arguments
const [agentName, cardId, ...messageParts] = process.argv.slice(2);
const message = messageParts.join(" ");

if (!agentName || !cardId || !message) {
  console.error("Usage: complete.ts <agent-name> <card-id> <message>");
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

// Move card to Review
try {
  const response = await fetch(`${JARVIS_SERVER}/api/kanban/cards/${cardId}/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to_column: "Review",
      feedback: message,
      session_id: sessionId,
      agent_name: agentName,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to move card: ${response.statusText}`);
  }

  const result = await response.json();
  console.log(`✅ Card #${cardId} moved to Review`);
  console.log(`   Title: ${result.card.title}`);
  console.log(`   Feedback: ${message}`);
  
  // Clean up kanban card file
  try {
    await fs.unlink(`.claude/kanban-card-${cardId}.md`);
  } catch {
    // File might not exist, that's okay
  }
} catch (error: any) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}