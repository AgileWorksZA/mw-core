import type { Database } from "bun:sqlite";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export async function runMigrations(db: Database) {
	console.log("[Migration] Starting database migrations...");

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
		.filter((f) => f.endsWith(".sql"))
		.sort();

	// Get applied migrations
	const appliedMigrations = db
		.prepare("SELECT filename FROM migrations")
		.all() as { filename: string }[];

	const appliedSet = new Set(appliedMigrations.map((m) => m.filename));

	// Run pending migrations
	for (const filename of migrationFiles) {
		if (appliedSet.has(filename)) {
			console.log(`[Migration] Skipping ${filename} (already applied)`);
			continue;
		}

		console.log(`[Migration] Applying ${filename}...`);

		try {
			const sql = readFileSync(join(migrationsDir, filename), "utf8");

			// Run migration in a transaction
			db.transaction(() => {
				// Handle SQL statements - don't split triggers
				const statements: string[] = [];
				let currentStatement = "";
				let inTrigger = false;

				// Split by lines to detect triggers
				const lines = sql.split("\n");

				for (const line of lines) {
					const trimmedLine = line.trim().toUpperCase();

					// Check if we're starting a trigger
					if (trimmedLine.includes("CREATE TRIGGER")) {
						inTrigger = true;
					}

					currentStatement += `${line}\n`;

					// Check if statement ends with semicolon
					if (line.trim().endsWith(";")) {
						// If we're in a trigger, check for END;
						if (inTrigger && trimmedLine.endsWith("END;")) {
							statements.push(currentStatement.trim());
							currentStatement = "";
							inTrigger = false;
						} else if (!inTrigger) {
							statements.push(currentStatement.trim());
							currentStatement = "";
						}
					}
				}

				// Add any remaining statement
				if (currentStatement.trim()) {
					statements.push(currentStatement.trim());
				}

				// Execute each statement
				for (const statement of statements) {
					if (statement.length > 0 && !statement.startsWith("--")) {
						db.exec(statement);
					}
				}

				// Record migration
				db.prepare("INSERT INTO migrations (filename) VALUES (?)").run(
					filename,
				);
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
	import("./client").then(({ getDatabaseAsync }) => {
		getDatabaseAsync().then((db) => {
			runMigrations(db).catch(console.error);
		});
	});
}
