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
    // Server-side without Bun - use better-sqlite3 for Node.js compatibility
    try {
      // Use dynamic import for ES modules
      const BetterSqlite3 = await import('better-sqlite3');
      const Database = BetterSqlite3.default;
      db = new Database(dbPath);
      console.log("Using better-sqlite3 database");
    } catch (e1) {
      throw new Error(`Failed to initialize database with better-sqlite3: ${e1}`);
    }
  } else {
    // Client-side
    throw new Error("SQLite database driver not available on client-side.");
  }
  
  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON");
  
  // Run migrations
  await runMigrations(db);
  
  // Seed automation data
  try {
    const { seedAutomationData } = await import('./seed-automation');
    await seedAutomationData();
  } catch (error) {
    console.warn("Failed to seed automation data:", error);
  }
  
  return db;
}

async function runMigrations(database: any) {
  console.log("[Migration] Starting database migrations...");
  
  // Create schema tables
  database.exec(SCHEMA_SQL);
  
  // Check for migration files
  const migrationsDir = path.join(process.cwd(), "app", "db", "migrations");
  
  if (!fs.existsSync(migrationsDir)) {
    console.log("[Migration] No migrations directory found");
    return;
  }
  
  // Get list of migration files
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  // Create migrations table if it doesn't exist
  database.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Get applied migrations
  const appliedMigrations = database.prepare("SELECT id FROM migrations").all().map((row: any) => row.id);
  
  // Apply new migrations
  for (const file of migrationFiles) {
    const migrationId = file.replace('.sql', '');
    
    if (appliedMigrations.includes(migrationId)) {
      console.log(`[Migration] Skipping ${file} (already applied)`);
      continue;
    }
    
    console.log(`[Migration] Applying ${file}...`);
    
    const migrationPath = path.join(migrationsDir, file);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    try {
      database.exec(migrationSQL);
      // Use a transaction to ensure the migration record is saved correctly
      const insertMigration = database.prepare("INSERT INTO migrations (id) VALUES (?)");
      insertMigration.run(migrationId);
      console.log(`[Migration] Applied ${file} successfully`);
    } catch (error) {
      console.error(`[Migration] Failed to apply ${file}:`, error);
      // Skip problematic migrations but don't crash the app
      console.warn(`[Migration] Skipping failed migration ${file}, continuing...`);
    }
  }
  
  console.log("[Migration] Database migrations complete");
}

export async function getDatabaseAsync(): Promise<any> {
  if (db) {
    console.log("[DB] Returning existing database instance");
    return db;
  }
  
  if (dbInitPromise) {
    console.log("[DB] Waiting for database initialization");
    return await dbInitPromise;
  }
  
  console.log("[DB] Starting database initialization");
  dbInitPromise = initDatabase();
  
  try {
    db = await dbInitPromise;
    console.log("[DB] Database initialization complete");
    return db;
  } catch (error) {
    console.error("[DB] Database initialization failed:", error);
    dbInitPromise = null;
    throw error;
  } finally {
    console.log("[DB] Returning database instance");
  }
}

export function getDatabase(): any {
  if (!db) {
    throw new Error("Database not initialized. Call getDatabaseAsync() first.");
  }
  return db;
}