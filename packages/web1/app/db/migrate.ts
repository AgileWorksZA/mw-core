import { getDatabaseAsync } from "./client";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

export async function runMigrations() {
  console.log("[Migration] Starting database migrations...");
  
  const db = await getDatabaseAsync();
  
  // Create migrations table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Get list of migration files
  const migrationsDir = join(process.cwd(), "app", "db", "migrations");
  
  if (!existsSync(migrationsDir)) {
    console.log("[Migration] No migrations directory found");
    return;
  }
  
  const migrationFiles = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  // Get applied migrations
  const appliedMigrations = db.prepare(
    "SELECT filename FROM migrations"
  ).all() as { filename: string }[];
  
  const appliedSet = new Set(appliedMigrations.map(m => m.filename));
  
  // Run pending migrations
  for (const filename of migrationFiles) {
    if (appliedSet.has(filename)) {
      console.log(`[Migration] Skipping ${filename} (already applied)`);
      continue;
    }
    
    console.log(`[Migration] Applying ${filename}...`);
    
    try {
      const sql = readFileSync(join(migrationsDir, filename), 'utf8');
      
      // Run migration in a transaction
      db.transaction(() => {
        // Split by semicolons and run each statement
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        for (const statement of statements) {
          db.exec(statement);
        }
        
        // Record migration
        db.prepare(
          "INSERT INTO migrations (filename) VALUES (?)"
        ).run(filename);
      })();
      
      console.log(`[Migration] Successfully applied ${filename}`);
    } catch (error) {
      console.error(`[Migration] Failed to apply ${filename}:`, error);
      throw error;
    }
  }
  
  console.log("[Migration] Database migrations complete");
}

// Run migrations on import if this is the main module
if (import.meta.main) {
  runMigrations().catch(console.error);
}