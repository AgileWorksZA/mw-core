#!/usr/bin/env bun

import * as fs from "node:fs/promises";
import * as path from "node:path";

const CLOUDIOS_SERVER = process.env.CLOUDIOS_SERVER || "http://localhost:4000";
const PROJECT_PATH = process.cwd();
const PROJECT_NAME = path.basename(PROJECT_PATH);

type TodoItem = {
  content: string;
  status: "pending" | "in_progress" | "completed";
  priority: "high" | "medium" | "low";
  id: string;
};

type Input = {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
  tool_name: string;
  tool_input: {
    todos?: TodoItem[];
    [key: string]: any;
  };
  tool_response: any;
};

async function main() {
  try {
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
    }
    
    const data: Input = JSON.parse(input);
    
    if (data.tool_name !== "TodoWrite" || !data.tool_input?.todos) {
      process.exit(0);
    }

    const payload = {
      session_id: data.session_id,
      tool_name: "TodoWrite",
      tool_input: {
        todos: data.tool_input.todos
      },
      repo_name: PROJECT_NAME,
      project_path: PROJECT_PATH,
      transcript_path: data.transcript_path
    };
    
    const response = await fetch(`${CLOUDIOS_SERVER}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.error(`✅ Tasks synced to CLOUDIOS`);
    } else {
      const errorText = await response.text();
      console.error(`❌ CLOUDIOS sync failed: ${errorText}`);
    }
  } catch (error: any) {
    console.error(`❌ CLOUDIOS sync error: ${error.message}`);
  }
  process.exit(0);
}

main();