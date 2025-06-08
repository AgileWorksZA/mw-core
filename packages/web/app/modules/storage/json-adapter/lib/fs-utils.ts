import { promises as fs, readdirSync } from "node:fs";

export function getFsTimestamps(storagePath: string): number[] {
  try {
    const files = readdirSync(storagePath);
    const timestamps = files
      .filter((file) => {
        // Match numeric timestamp files (with optional compression)
        const match = file.match(/^(\d+)\.json(?:\.gz)?$/);
        return match && !file.startsWith("_");
      })
      .map((file) => {
        const match = file.match(/^(\d+)\.json(?:\.gz)?$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((ts): ts is number => ts !== null && !isNaN(ts));
    
    // Sort numerically
    timestamps.sort((a, b) => a - b);
    
    return timestamps;
  } catch (error: any) {
    if (error.code === "ENOENT") return []; // Directory doesn't exist yet
    console.warn(
      `Warning: Could not read timestamps from ${storagePath}: ${error.message}`,
    );
    return []; // Return empty on other errors to prevent crashes, but log it
  }
}

export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}