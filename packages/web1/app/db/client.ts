import { SCHEMA_SQL } from "./schema";
import path from "path";
import fs from "fs";

let db: any = null;
let dbInitPromise: Promise<any> | null = null;

async function initDatabase() {
  // Check if already initialized
  if (db) {
    console.log("Database already initialized");
    return db;
  }
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(process.cwd(), "data");
  const dbPath = path.join(dataDir, "mw-connections.db");
  
  console.log("Initializing database...");
  console.log("Runtime check - Bun:", typeof Bun !== 'undefined');
  console.log("Runtime check - global.Bun:", !!global.Bun);
  console.log("Runtime check - window:", typeof window !== 'undefined');
  
  // Ensure data directory exists
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, ".gitkeep"), "", { flag: 'wx' });
  } catch (e) {
    // Directory might already exist or file already exists
  }
  
  // Check if we have Bun runtime available
  if (typeof Bun !== 'undefined' || global.Bun) {
    // @ts-ignore - Bun-specific import
    const { Database } = await import("bun:sqlite");
    db = new Database(dbPath, { create: true });
    console.log("Using Bun SQLite database");
  } else if (typeof window === 'undefined') {
    // Server-side without Bun - we're in a React Router action/loader
    // Try to use the bun:sqlite module if available
    try {
      // @ts-ignore - Dynamic import
      const { Database } = await import("bun:sqlite");
      db = new Database(dbPath, { create: true });
      console.log("Using Bun SQLite database (dynamic import)");
    } catch (e) {
      // If bun:sqlite is not available, create a mock
      console.warn("SQLite not available on server, using mock database");
      db = {
        prepare: () => ({
          all: () => [],
          get: () => null,
          run: () => ({ changes: 0 }),
        }),
        exec: () => {},
      };
      return db;
    }
  } else {
    // Client-side without Bun
    throw new Error("SQLite database driver not available on client-side.");
  }
  
  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON");
  
  // Create tables
  db.exec(SCHEMA_SQL);
  
  // Set WAL mode for better concurrency
  db.exec("PRAGMA journal_mode = WAL");
  
  // Clear the init promise since we're done
  dbInitPromise = null;
  
  // Schedule automation seeding after initialization completes
  if (process.env.VITE_AUTOMATION === "true" || process.env.AUTOMATION === "true") {
    // Use setImmediate or setTimeout to run after current execution
    setImmediate(async () => {
      console.log("Running automation seeding...");
      const { seedAutomationData } = await import("./seed-automation");
      await seedAutomationData();
    });
  }
  
  return db;
}

export function getDatabase() {
  if (!db && !dbInitPromise) {
    dbInitPromise = initDatabase();
  }
  
  if (!db) {
    // Database is still initializing
    // For synchronous access, we need to have initialized the database already
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  
  return db;
}

export async function getDatabaseAsync() {
  if (!db && !dbInitPromise) {
    console.log("[DB] Starting database initialization");
    dbInitPromise = initDatabase();
  }
  
  if (dbInitPromise) {
    console.log("[DB] Waiting for database initialization");
    await dbInitPromise;
    console.log("[DB] Database initialization complete");
  }
  
  console.log("[DB] Returning database instance");
  return db;
}

export { initDatabase };

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Ensure database is closed on process exit
process.on("beforeExit", () => {
  closeDatabase();
});