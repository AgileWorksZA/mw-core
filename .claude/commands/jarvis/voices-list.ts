#!/usr/bin/env bun

const JARVIS_SERVER = process.env.JARVIS_SERVER || "http://localhost:4000";

// Parse provider filter from arguments
const provider = process.argv[2]?.toLowerCase();

async function listVoices() {
  try {
    const response = await fetch(`${JARVIS_SERVER}/api/voices`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log("\n🎤 Available TTS Voices in JARVIS\n");
    
    // Group voices by provider
    const providers = ["macos", "elevenlabs", "azure", "google", "aws"];
    
    for (const p of providers) {
      if (provider && p !== provider) continue;
      
      const voices = data.voices.filter((v: any) => v.provider === p);
      if (voices.length === 0) continue;
      
      console.log(`\n[${p.toUpperCase()}]\n`);
      
      for (const voice of voices) {
        const activeIndicator = voice.is_active ? "✅" : "❌";
        const defaultIndicator = data.defaults?.[voice.role] === voice.name ? " (default)" : "";
        console.log(`  ${activeIndicator} ${voice.name}${defaultIndicator}`);
        console.log(`     ID: ${voice.voice_id}`);
        console.log(`     Language: ${voice.language || "en"}`);
        if (voice.description) {
          console.log(`     Description: ${voice.description}`);
        }
        console.log();
      }
    }
    
    // Show current configuration
    if (data.tts_config) {
      console.log("\n⚙️  Current TTS Configuration:\n");
      console.log(`  Provider: ${data.tts_config.provider}`);
      console.log(`  Model: ${data.tts_config.model || "default"}`);
      console.log(`  Speed: ${data.tts_config.speed || 1.0}x`);
      
      if (data.defaults) {
        console.log("\n  Role Defaults:");
        for (const [role, voice] of Object.entries(data.defaults)) {
          console.log(`    ${role}: ${voice}`);
        }
      }
    }
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

listVoices();