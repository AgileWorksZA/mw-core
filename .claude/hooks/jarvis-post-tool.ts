#!/usr/bin/env bun

// JARVIS Post-Tool Hook - Tracks TodoWrite events

const JARVIS_SERVER = process.env.JARVIS_SERVER || "http://localhost:5173";
const JARVIS_API_URL = `${JARVIS_SERVER}/api/tasks`;
const PROJECT_PATH = process.cwd();
const PROJECT_NAME = PROJECT_PATH.split('/').pop() || 'unknown';

async function main() {
  try {
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
    }

    const data = JSON.parse(input);

    if (data.tool_name !== "TodoWrite") {
      return;
    }

    const response = await fetch(JARVIS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        repo_name: PROJECT_NAME,
        project_path: PROJECT_PATH,
        timestamp: new Date().toISOString()
      }),
    });

    if (response.ok) {
      console.error(`✅ Tasks synced to JARVIS`);
    }
  } catch (error) {
    console.error(`❌ JARVIS sync failed: ${(error as Error).message}`);
  }
  process.exit(0);
}

main();