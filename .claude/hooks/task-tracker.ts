#!/usr/bin/env bun

import { spawn } from "node:child_process";
import * as fs from "node:fs/promises";
import { join } from "node:path";

const JARVIS_API_URL = "http://localhost:5174/api/tasks"; // Remix dev server
const PROJECT_NAME = "jarvis";
const PROJECT_PATH = process.cwd();

interface PostToolPayload {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
  tool_name: string;
  tool_input: any;
  tool_response: any;
}

async function postToJarvisAPI(payload: PostToolPayload, retries = 3): Promise<boolean> {
  const enhancedPayload = {
    ...payload,
    agent_name: `JARVIS-${payload.session_id.slice(0, 8)}`,
    agent_role: "system",
    repo_name: PROJECT_NAME,
    project_path: PROJECT_PATH,
    timestamp: new Date().toISOString()
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(JARVIS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enhancedPayload),
      });

      if (response.ok) {
        const result = await response.json();
        console.error(`✅ Task data posted to JARVIS API (attempt ${attempt}):`, {
          success: result.success,
          tasks_updated: result.tasks_updated,
          events_logged: result.events_logged
        });
        return true;
      } else {
        const errorText = await response.text();
        console.error(`❌ JARVIS API error (attempt ${attempt}):`, response.status, errorText);
      }
    } catch (error) {
      console.error(`🔄 Failed to post to JARVIS API (attempt ${attempt}):`, error);
    }

    // Wait before retry (exponential backoff)
    if (attempt < retries) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return false;
}

async function saveLocalFallback(payload: PostToolPayload): Promise<void> {
  try {
    // Ensure temp directory exists
    const tempDir = join(PROJECT_PATH, "temp", "task-tracker");
    await fs.mkdir(tempDir, { recursive: true });
    
    // Save with timestamp
    const filename = `failed-post-${Date.now()}-${payload.session_id.slice(0, 8)}.json`;
    const filepath = join(tempDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(payload, null, 2));
    console.error(`💾 Saved task data locally as fallback: ${filepath}`);
  } catch (error) {
    console.error("❌ Failed to save local fallback:", error);
  }
}

async function main() {
  try {
    // Read input from stdin
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
    }
    
    const data: PostToolPayload = JSON.parse(input);
    
    console.error(`🎯 PostTool hook received: ${data.tool_name} (${data.hook_event_name})`);

    // Only process TodoWrite events
    if (data.tool_name !== "TodoWrite") {
      console.error(`⏭️  Skipping non-TodoWrite event: ${data.tool_name}`);
      return;
    }

    // Save to temp for debugging
    const tempDir = join(PROJECT_PATH, "temp");
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(
      join(tempDir, `post-tool-${Date.now()}.json`), 
      JSON.stringify(data, null, 2)
    );

    // Try to post to JARVIS API
    const posted = await postToJarvisAPI(data);
    
    if (!posted) {
      // Save as fallback if API posting failed
      await saveLocalFallback(data);
    }

    // Play notification sound on successful task updates
    if (posted && data.tool_input?.todos?.length > 0) {
      const soundFile = "/System/Library/Sounds/Tink.aiff";
      spawn("afplay", [soundFile], { detached: true }).unref();
    }
    
  } catch (error) {
    console.error("❌ Task tracker hook error:", error);
    
    // Still try to save raw input as fallback
    try {
      const tempDir = join(PROJECT_PATH, "temp", "errors");
      await fs.mkdir(tempDir, { recursive: true });
      const errorFile = join(tempDir, `error-${Date.now()}.txt`);
      await fs.writeFile(errorFile, `Error: ${error}\nInput: ${input || 'null'}`);
    } catch (saveError) {
      console.error("❌ Failed to save error log:", saveError);
    }
  }
  
  process.exit(0);
}

main();