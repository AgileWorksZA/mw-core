#!/usr/bin/env bun
import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { SCHEMA } from "./schema";

const DB_PATH = "./data/tickets.db";

// Ensure data directory exists
mkdirSync(dirname(DB_PATH), { recursive: true });

// Initialize database using Bun's built-in SQLite
const db = new Database(DB_PATH);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

console.log("🔧 Running database migrations...");

try {
	// Execute schema
	db.exec(SCHEMA);

	// Verify tables were created
	const tables = db
		.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `)
		.all() as { name: string }[];

	console.log("✅ Database migration completed successfully!");
	console.log("📊 Created tables:", tables.map((t) => t.name).join(", "));
} catch (error) {
	console.error("❌ Migration failed:", error);
	process.exit(1);
} finally {
	db.close();
}
