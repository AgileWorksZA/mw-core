import { ElevenLabsClient } from "elevenlabs";

// Initialize the client with your API key
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY, // Or pass directly
});

// Example: Get all available voices
async function getModels() {
  try {
    const models = await elevenlabs.models.getAll();
    console.log(JSON.stringify(models, null, 2));
  } catch (error) {
    console.error("Error fetching voices:", error);
  }
}

getModels();
