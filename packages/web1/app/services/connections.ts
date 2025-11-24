import { randomUUID } from "node:crypto";
import { getDatabaseAsync } from "~/db/client";
import type { MWConnection } from "~/db/schema";
import { createCryptoService } from "./crypto";

export interface CreateConnectionInput {
	clerk_user_id: string;
	connection_name: string;
	connection_type?: "datacentre" | "now";
	mw_username: string;
	mw_password: string;
	mw_folder_name?: string;
	mw_folder_password?: string;
	mw_data_file: string;
	mw_host: string;
	mw_port?: number;
	mw_now_account_id?: string;
	mw_now_file_id?: string;
	mw_now_metadata?: Record<string, any>;
	is_default?: boolean;
}

export interface UpdateConnectionInput extends Partial<CreateConnectionInput> {
	id: string;
}

export class ConnectionService {
	private async getDb() {
		console.log("[ConnectionService] Getting database...");
		try {
			const database = await getDatabaseAsync();
			console.log("[ConnectionService] Got database successfully");
			return database;
		} catch (error) {
			console.error("[ConnectionService] Failed to get database:", error);
			throw error;
		}
	}

	async getConnectionsByUser(userId: string): Promise<MWConnection[]> {
		console.log("[ConnectionService] getConnectionsByUser for:", userId);
		const db = await this.getDb();
		const stmt = db.prepare(`
      SELECT * FROM mw_connections 
      WHERE clerk_user_id = ? 
      ORDER BY is_default DESC, connection_name ASC
    `);

		const connections = stmt.all(userId) as MWConnection[];
		console.log(
			"[ConnectionService] Raw connections found:",
			connections.length,
		);

		if (connections.length === 0) {
			return [];
		}

		const crypto = createCryptoService(userId);

		// Decrypt sensitive fields, filter out corrupted connections
		const validConnections: MWConnection[] = [];

		for (const conn of connections) {
			try {
				console.log(`[ConnectionService] Decrypting connection ${conn.id}:`, {
					usernameLength: conn.mw_username?.length,
					passwordLength: conn.mw_password?.length,
					dataFileLength: conn.mw_data_file?.length,
				});

				const decryptedUsername = crypto.decrypt(conn.mw_username);
				const decryptedPassword = crypto.decrypt(conn.mw_password);
				const decryptedDataFile = crypto.decrypt(conn.mw_data_file);

				console.log("[ConnectionService] Decryption successful:", {
					username: decryptedUsername,
					dataFile: decryptedDataFile,
				});

				const decryptedConn = {
					...conn,
					mw_username: decryptedUsername,
					mw_password: decryptedPassword,
					mw_folder_name: conn.mw_folder_name
						? crypto.decrypt(conn.mw_folder_name)
						: undefined,
					mw_folder_password: conn.mw_folder_password
						? crypto.decrypt(conn.mw_folder_password)
						: undefined,
					mw_data_file: decryptedDataFile,
				};
				validConnections.push(decryptedConn);
			} catch (error) {
				console.error(
					`[ConnectionService] Failed to decrypt connection ${conn.id}:`,
					error,
				);
				console.log(
					`[ConnectionService] Skipping corrupted connection: ${conn.connection_name}`,
				);

				// TODO: Consider auto-deleting corrupted connections
				// await this.deleteConnection(userId, conn.id);
			}
		}

		return validConnections;
	}

	async getConnection(
		userId: string,
		connectionId: string,
	): Promise<MWConnection | null> {
		const db = await this.getDb();
		const stmt = db.prepare(`
      SELECT * FROM mw_connections 
      WHERE id = ? AND clerk_user_id = ?
    `);

		const connection = stmt.get(connectionId, userId) as MWConnection | null;
		if (!connection) return null;

		const crypto = createCryptoService(userId);

		// Decrypt sensitive fields
		return {
			...connection,
			mw_username: crypto.decrypt(connection.mw_username),
			mw_password: crypto.decrypt(connection.mw_password),
			mw_folder_name: connection.mw_folder_name
				? crypto.decrypt(connection.mw_folder_name)
				: undefined,
			mw_folder_password: connection.mw_folder_password
				? crypto.decrypt(connection.mw_folder_password)
				: undefined,
			mw_data_file: crypto.decrypt(connection.mw_data_file),
		};
	}

	async createConnection(input: CreateConnectionInput): Promise<MWConnection> {
		console.log("[ConnectionService] Starting createConnection");
		const db = await this.getDb();
		console.log("[ConnectionService] Got database");
		const crypto = createCryptoService(input.clerk_user_id);
		console.log("[ConnectionService] Created crypto service");
		const id = randomUUID();
		console.log("[ConnectionService] Generated ID:", id);

		// If this is the first connection, make it default
		const existingCount = db
			.prepare(
				"SELECT COUNT(*) as count FROM mw_connections WHERE clerk_user_id = ?",
			)
			.get(input.clerk_user_id) as { count: number };

		const isDefault = input.is_default ?? existingCount.count === 0;

		// If setting as default, unset other defaults
		if (isDefault) {
			db.prepare(
				"UPDATE mw_connections SET is_default = 0 WHERE clerk_user_id = ?",
			).run(input.clerk_user_id);
		}

		// Encrypt sensitive fields
		console.log("[ConnectionService] Starting encryption");
		const encryptedData = {
			mw_username: crypto.encrypt(input.mw_username),
			mw_password: crypto.encrypt(input.mw_password),
			mw_folder_name: input.mw_folder_name
				? crypto.encrypt(input.mw_folder_name)
				: null,
			mw_folder_password: input.mw_folder_password
				? crypto.encrypt(input.mw_folder_password)
				: null,
			mw_data_file: crypto.encrypt(input.mw_data_file),
		};
		console.log("[ConnectionService] Encryption complete");

		const stmt = db.prepare(`
      INSERT INTO mw_connections (
        id, clerk_user_id, connection_name, connection_type, mw_username, mw_password,
        mw_folder_name, mw_folder_password, mw_data_file, mw_host, mw_port, 
        mw_now_account_id, mw_now_file_id, mw_now_metadata,
        is_default, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

		const now = new Date().toISOString();
		console.log("[ConnectionService] About to run INSERT");
		try {
			stmt.run(
				id,
				input.clerk_user_id,
				input.connection_name,
				input.connection_type || "datacentre",
				encryptedData.mw_username,
				encryptedData.mw_password,
				encryptedData.mw_folder_name,
				encryptedData.mw_folder_password,
				encryptedData.mw_data_file,
				input.mw_host,
				input.mw_port || 6710,
				input.mw_now_account_id || null,
				input.mw_now_file_id || null,
				input.mw_now_metadata ? JSON.stringify(input.mw_now_metadata) : null,
				isDefault ? 1 : 0,
				now,
				now,
			);
			console.log("[ConnectionService] INSERT complete");
		} catch (error) {
			console.error("[ConnectionService] INSERT failed:", error);
			throw error;
		}

		const result = await this.getConnection(input.clerk_user_id, id);
		if (!result) {
			throw new Error("Failed to create connection");
		}
		return result;
	}

	async updateConnection(
		userId: string,
		input: UpdateConnectionInput,
	): Promise<MWConnection | null> {
		const db = await this.getDb();
		// Verify connection belongs to user
		const existing = await this.getConnection(userId, input.id);
		if (!existing) return null;

		const crypto = createCryptoService(userId);

		// Build update query dynamically
		const updates: string[] = [];
		const values: any[] = [];

		if (input.connection_name !== undefined) {
			updates.push("connection_name = ?");
			values.push(input.connection_name);
		}

		if (input.mw_username !== undefined) {
			updates.push("mw_username = ?");
			values.push(crypto.encrypt(input.mw_username));
		}

		if (input.mw_password !== undefined) {
			updates.push("mw_password = ?");
			values.push(crypto.encrypt(input.mw_password));
		}

		if (input.mw_folder_name !== undefined) {
			updates.push("mw_folder_name = ?");
			values.push(
				input.mw_folder_name ? crypto.encrypt(input.mw_folder_name) : null,
			);
		}

		if (input.mw_folder_password !== undefined) {
			updates.push("mw_folder_password = ?");
			values.push(
				input.mw_folder_password
					? crypto.encrypt(input.mw_folder_password)
					: null,
			);
		}

		if (input.mw_data_file !== undefined) {
			updates.push("mw_data_file = ?");
			values.push(crypto.encrypt(input.mw_data_file));
		}

		if (input.mw_host !== undefined) {
			updates.push("mw_host = ?");
			values.push(input.mw_host);
		}

		if (input.mw_port !== undefined) {
			updates.push("mw_port = ?");
			values.push(input.mw_port);
		}

		if (input.is_default !== undefined) {
			updates.push("is_default = ?");
			values.push(input.is_default ? 1 : 0);

			// If setting as default, unset other defaults
			if (input.is_default) {
				db.prepare(
					"UPDATE mw_connections SET is_default = 0 WHERE clerk_user_id = ? AND id != ?",
				).run(userId, input.id);
			}
		}

		if (updates.length === 0) return existing;

		values.push(input.id);
		values.push(userId);

		const stmt = db.prepare(`
      UPDATE mw_connections 
      SET ${updates.join(", ")}
      WHERE id = ? AND clerk_user_id = ?
    `);

		stmt.run(...values);

		return this.getConnection(userId, input.id);
	}

	async deleteConnection(
		userId: string,
		connectionId: string,
	): Promise<boolean> {
		const db = await this.getDb();
		const stmt = db.prepare(`
      DELETE FROM mw_connections 
      WHERE id = ? AND clerk_user_id = ?
    `);

		const result = stmt.run(connectionId, userId);
		return result.changes > 0;
	}

	async updateLastUsed(userId: string, connectionId: string): Promise<void> {
		const db = await this.getDb();
		const stmt = db.prepare(`
      UPDATE mw_connections 
      SET last_used_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND clerk_user_id = ?
    `);

		stmt.run(connectionId, userId);
	}

	async getConnectionsByNowAccount(
		userId: string,
		nowAccountId: string,
	): Promise<MWConnection[]> {
		console.log(
			"[ConnectionService] getConnectionsByNowAccount for:",
			nowAccountId,
		);
		const db = await this.getDb();
		const stmt = db.prepare(`
      SELECT * FROM mw_connections 
      WHERE clerk_user_id = ? AND mw_now_account_id = ?
      ORDER BY connection_name ASC
    `);

		const connections = stmt.all(userId, nowAccountId) as MWConnection[];

		if (connections.length === 0) {
			return [];
		}

		const crypto = createCryptoService(userId);

		// Decrypt sensitive fields and parse metadata
		return connections.map((conn) => ({
			...conn,
			mw_username: crypto.decrypt(conn.mw_username),
			mw_password: crypto.decrypt(conn.mw_password),
			mw_folder_name: conn.mw_folder_name
				? crypto.decrypt(conn.mw_folder_name)
				: undefined,
			mw_folder_password: conn.mw_folder_password
				? crypto.decrypt(conn.mw_folder_password)
				: undefined,
			mw_data_file: crypto.decrypt(conn.mw_data_file),
			mw_now_metadata: conn.mw_now_metadata
				? JSON.parse(conn.mw_now_metadata)
				: undefined,
		}));
	}

	async createNowConnections(
		userId: string,
		nowAccountId: string,
		files: Array<{
			file: {
				id: string;
				name: string;
				companyName: string;
				dataFile: string;
				host: string;
				port: number;
				metadata?: any;
			};
			username: string;
			password: string;
		}>,
	): Promise<MWConnection[]> {
		const createdConnections: MWConnection[] = [];

		for (const { file, username, password } of files) {
			const connection = await this.createConnection({
				clerk_user_id: userId,
				connection_name: `${file.companyName} (NOW)`,
				connection_type: "now",
				mw_username: username,
				mw_password: password,
				mw_data_file: file.dataFile,
				mw_host: file.host,
				mw_port: file.port,
				mw_now_account_id: nowAccountId,
				mw_now_file_id: file.id,
				mw_now_metadata: file.metadata,
				is_default: false,
			});

			createdConnections.push(connection);
		}

		return createdConnections;
	}

	async testConnection(
		connection: MWConnection,
	): Promise<{ success: boolean; error?: string }> {
		try {
			// Import MoneyWorksRESTClient dynamically to avoid circular dependencies
			const { MoneyWorksRESTClient } = await import("@moneyworks/data");

			const clientConfig: any = {
				host: connection.mw_host,
				port: connection.mw_port,
				dataFile: connection.mw_data_file,
				username: connection.mw_username,
				password: connection.mw_password,
				timeout: 5000, // 5 second timeout for testing
			};

			// Add folder auth if present
			if (connection.mw_folder_name && connection.mw_folder_password) {
				clientConfig.folderAuth = {
					folderName: connection.mw_folder_name,
					folderPassword: connection.mw_folder_password,
				};
			}

			const client = new MoneyWorksRESTClient(clientConfig);

			// Try to fetch a simple table to test the connection
			console.log("[ConnectionService] Testing connection with TaxRate export");
			try {
				const testResult = await client.export("TaxRate", { limit: 1 });
				console.log(
					"[ConnectionService] Test successful, got result:",
					testResult,
				);
			} catch (testError) {
				console.error("[ConnectionService] Test failed:", testError);
				throw testError;
			}

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Connection test failed",
			};
		}
	}
}

export const connectionService = new ConnectionService();
