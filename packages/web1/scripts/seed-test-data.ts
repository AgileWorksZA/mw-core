#!/usr/bin/env bun

import { nanoid } from "nanoid";
import { getDatabaseAsync } from "../app/db/client";
import { createCryptoService } from "../app/services/crypto";

async function seedTestData() {
	const testUserId = process.argv[2] || `user_test_${nanoid(8)}`;

	console.log(`Creating test data for user: ${testUserId}`);

	try {
		const db = await getDatabaseAsync();

		// Check if user already has connections
		const existing = db
			.prepare(`
      SELECT id FROM mw_connections 
      WHERE clerk_user_id = ?
      LIMIT 1
    `)
			.get(testUserId);

		if (existing) {
			console.log("User already has connections. Skipping...");
			return;
		}

		// Create a test connection
		const connectionId = nanoid();
		const cryptoService = createCryptoService(testUserId);
		const encryptedPassword = await cryptoService.encrypt("testpassword");

		const result = db
			.prepare(`
      INSERT INTO mw_connections (
        id,
        clerk_user_id,
        connection_name,
        mw_host,
        mw_port,
        mw_data_file,
        mw_username,
        mw_password,
        mw_folder_name,
        mw_folder_password,
        is_default,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
			.run(
				connectionId,
				testUserId,
				"Test Connection",
				"localhost",
				6710,
				"Test.moneyworks",
				"testuser",
				encryptedPassword,
				null,
				null,
				1, // is_default
				new Date().toISOString(),
				new Date().toISOString(),
			);

		console.log(`Created test connection with ID: ${connectionId}`);
		console.log(`Rows affected: ${result.changes}`);

		// Show the created connection
		const created = db
			.prepare(`
      SELECT * FROM mw_connections 
      WHERE id = ?
    `)
			.get(connectionId);

		console.log("\nCreated connection:");
		console.log(JSON.stringify(created, null, 2));
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}

	process.exit(0);
}

seedTestData();
