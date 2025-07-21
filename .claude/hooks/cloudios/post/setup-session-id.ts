#!/usr/bin/env bun

import * as fs from "node:fs/promises";
import * as path from "node:path";

const CLOUDIOS_SERVER = process.env.CLOUDIOS_SERVER || "http://localhost:4000";

type Input = {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
  tool_name?: string;
  tool_input?: any;
  tool_response?: any;
  command?: string;
  args?: string[];
};

async function main() {
  try {
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
    }
    
    const data: Input = JSON.parse(input);
    
    // Only process if this is a register command
    if (!data.command || !data.command.includes("register.ts")) {
      process.exit(0);
    }
    
    // Extract agent name from command
    const match = data.command.match(/bun.*register\.ts\s+(\S+)/);
    if (!match || !match[1]) {
      process.exit(0);
    }
    
    const agentName = match[1];
    const agentDir = path.join(".claude/agents/names");
    const linksDir = path.join(".claude/agents/links");
    
    // Create directories
    await fs.mkdir(agentDir, { recursive: true });
    await fs.mkdir(linksDir, { recursive: true });
    
    // Store session info
    const agentData = {
      session_id: data.session_id,
      agent_name: agentName,
      transcript_path: data.transcript_path,
      registered_at: new Date().toISOString()
    };
    
    await fs.writeFile(
      path.join(agentDir, `${agentName}.json`),
      JSON.stringify(agentData, null, 2)
    );
    
    // Create session link
    await fs.writeFile(
      path.join(linksDir, data.session_id),
      agentName
    );
    
    // Register with CLOUDIOS
    const response = await fetch(`${CLOUDIOS_SERVER}/api/identify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: data.session_id,
        agent_name: agentName,
        agent_role: "developer",
        repo_name: path.basename(process.cwd()),
        project_path: process.cwd(),
        timestamp: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      console.error(`✅ Agent '${agentName}' registered with CLOUDIOS`);
    } else {
      console.error(`⚠️  Failed to register with CLOUDIOS: ${response.statusText}`);
    }
    
  } catch (error: any) {
    console.error(`❌ Session setup error: ${error.message}`);
  }
  process.exit(0);
}

main();