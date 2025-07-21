#!/usr/bin/env bun

// JARVIS Agent Registration Script
import { spawn } from "node:child_process";
import * as os from "node:os";
import * as path from "node:path";

const JARVIS_SERVER = process.env.JARVIS_SERVER || "http://localhost:4000";
const JARVIS_API_URL = `${JARVIS_SERVER}/api/identify`;

const PROJECT_PATH = process.cwd();
const PROJECT_NAME = path.basename(PROJECT_PATH);
const AGENT_NAME = `${os.userInfo().username}-${PROJECT_NAME}`;
const AGENT_ROLE = "developer";
const PREFERRED_VOICE = "";

// Get IP address
function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'unknown';
}

async function identifyAgent() {
  const sessionId = process.env.CLAUDE_SESSION_ID || 
                    process.argv[2] || 
                    `session-${Date.now()}`;
  
  const payload = {
    session_id: sessionId,
    agent_name: AGENT_NAME,
    agent_role: AGENT_ROLE,
    repo_name: PROJECT_NAME,
    project_path: PROJECT_PATH,
    preferred_voice: PREFERRED_VOICE || undefined,
    ip_address: getIPAddress(),
    username: os.userInfo().username,
    timestamp: new Date().toISOString()
  };

  console.log(`🎯 Registering with JARVIS at ${JARVIS_SERVER}...`);
  console.log(`   Project: ${PROJECT_NAME}`);
  console.log(`   Agent: ${AGENT_NAME} (${AGENT_ROLE})`);

  try {
    const response = await fetch(JARVIS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Successfully registered with JARVIS!`);
      console.log(`   Session: ${result.agent.session_id}`);
      
      try {
        spawn("afplay", ["/System/Library/Sounds/Glass.aiff"], { detached: true }).unref();
      } catch {}
      
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ Registration failed: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Network error: ${error.message}`);
    console.error(`   Is JARVIS running at ${JARVIS_SERVER}?`);
    return false;
  }
}

identifyAgent().then(success => {
  process.exit(success ? 0 : 1);
});