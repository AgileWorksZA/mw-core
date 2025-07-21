#!/usr/bin/env bun

import * as fs from "node:fs/promises";
import * as path from "node:path";

const JARVIS_SERVER = process.env.JARVIS_SERVER || "http://localhost:4000";

// Parse arguments
const [agentName, voiceName] = process.argv.slice(2);

if (!agentName || !voiceName) {
  console.error("Usage: change-voice.ts <agent-name> <voice-name>");
  console.error("Example: change-voice.ts herman-jarvis Samantha");
  process.exit(1);
}

async function changeVoice() {
  try {
    // Read agent file
    const agentFile = path.join(".claude/agents/names", `${agentName}.json`);
    let agentData: any;
    
    try {
      agentData = JSON.parse(await fs.readFile(agentFile, "utf-8"));
    } catch {
      console.error(`❌ Agent '${agentName}' not found`);
      console.error("Make sure you've registered with /jarvis:register first");
      process.exit(1);
    }
    
    // Check if voice exists
    const voicesResponse = await fetch(`${JARVIS_SERVER}/api/voices`);
    if (!voicesResponse.ok) {
      throw new Error("Failed to fetch available voices");
    }
    
    const voicesData = await voicesResponse.json();
    const voice = voicesData.voices.find((v: any) => 
      v.name.toLowerCase() === voiceName.toLowerCase()
    );
    
    if (!voice) {
      console.error(`❌ Voice '${voiceName}' not found`);
      console.error("\nAvailable voices:");
      const voiceNames = voicesData.voices
        .filter((v: any) => v.is_active)
        .map((v: any) => `  • ${v.name} (${v.provider})`)
        .join("\n");
      console.error(voiceNames);
      process.exit(1);
    }
    
    // Update voice preference
    const response = await fetch(`${JARVIS_SERVER}/api/agents/${agentData.session_id}/voice`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferred_voice: voice.name
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update voice: ${response.statusText}`);
    }
    
    // Update local agent file
    agentData.preferred_voice = voice.name;
    await fs.writeFile(agentFile, JSON.stringify(agentData, null, 2));
    
    console.log(`✅ Voice changed to '${voice.name}' (${voice.provider})`);
    console.log(`   This will take effect for new audio messages`);
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

changeVoice();