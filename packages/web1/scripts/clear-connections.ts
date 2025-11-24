#!/usr/bin/env bun

import { getDatabaseAsync } from "../app/db/client";

async function clearConnections() {
	const userId = process.argv[2];

	if (!userId) {
		console.error("Usage: bun run scripts/clear-connections.ts <userId>");
		console.error("Example: bun run scripts/clear-connections.ts user_2abc123");
		process.exit(1);
	}

	try {
		const db = await getDatabaseAsync();

		// First, show existing connections
		const connections = db
			.prepare(`
      SELECT id, connection_name, created_at 
      FROM mw_connections 
      WHERE clerk_user_id = ?
    `)
			.all(userId);

		console.log(`Found ${connections.length} connections for user ${userId}:`);
		connections.forEach((conn: any) => {
			console.log(
				`- ${conn.connection_name} (${conn.id}) created at ${conn.created_at}`,
			);
		});

		if (connections.length === 0) {
			console.log("No connections to delete.");
			process.exit(0);
		}

		// Delete connections
		const result = db
			.prepare(`
      DELETE FROM mw_connections 
      WHERE clerk_user_id = ?
    `)
			.run(userId);

		console.log(`\nDeleted ${result.changes} connections.`);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}

	process.exit(0);
}

clearConnections();
