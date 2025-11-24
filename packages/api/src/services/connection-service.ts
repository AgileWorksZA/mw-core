/**
 * Connection Service
 *
 * Manages MoneyWorks connections with encrypted storage
 */

import { Database } from "bun:sqlite";
import {
	createCipheriv,
	createDecipheriv,
	randomBytes,
	scryptSync,
} from "node:crypto";
import type { MoneyWorksConfig } from "@moneyworks/data";

interface StoredConnection {
	id: string;
	encrypted_config: string;
	description: string;
	created_at: string;
	last_used_at: string;
	access_token_hash: string;
	refresh_token_hash: string;
}

interface ConnectionTokens {
	accessToken: string;
	refreshToken: string;
	connectionId: string;
}

export class ConnectionService {
	private db: Database;
	private encryptionKey: Buffer;
	private cache: Map<string, MoneyWorksConfig> = new Map();
	private tokenCache: Map<string, string> = new Map(); // token -> connectionId

	constructor(dbPath = "./connections.db") {
		// Initialize database
		this.db = new Database(dbPath);
		this.initDatabase();

		// Generate encryption key from environment or create one
		const secret =
			process.env.API_ENCRYPTION_SECRET ||
			"default-dev-secret-change-in-production";
		this.encryptionKey = scryptSync(secret, "salt", 32);
	}

	private initDatabase() {
		this.db.exec(`
      CREATE TABLE IF NOT EXISTS connections (
        id TEXT PRIMARY KEY,
        encrypted_config TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        access_token_hash TEXT NOT NULL,
        refresh_token_hash TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_access_token ON connections(access_token_hash);
      CREATE INDEX IF NOT EXISTS idx_refresh_token ON connections(refresh_token_hash);
    `);
	}

	private encrypt(data: string): string {
		const iv = randomBytes(16);
		const cipher = createCipheriv("aes-256-gcm", this.encryptionKey, iv);

		let encrypted = cipher.update(data, "utf8", "hex");
		encrypted += cipher.final("hex");

		const authTag = cipher.getAuthTag();

		return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
	}

	private decrypt(encryptedData: string): string {
		const parts = encryptedData.split(":");
		const iv = Buffer.from(parts[0], "hex");
		const authTag = Buffer.from(parts[1], "hex");
		const encrypted = parts[2];

		const decipher = createDecipheriv("aes-256-gcm", this.encryptionKey, iv);
		decipher.setAuthTag(authTag);

		let decrypted = decipher.update(encrypted, "hex", "utf8");
		decrypted += decipher.final("utf8");

		return decrypted;
	}

	private hashToken(token: string): string {
		return Bun.hash(token).toString();
	}

	private generateToken(): string {
		return randomBytes(32).toString("hex");
	}

	async createConnection(
		config: MoneyWorksConfig & { description?: string },
	): Promise<ConnectionTokens> {
		const connectionId = randomBytes(16).toString("hex");
		const accessToken = this.generateToken();
		const refreshToken = this.generateToken();

		const { description, ...mwConfig } = config;

		// Encrypt the config
		const encryptedConfig = this.encrypt(JSON.stringify(mwConfig));

		// Store in database
		const stmt = this.db.prepare(`
      INSERT INTO connections (id, encrypted_config, description, access_token_hash, refresh_token_hash)
      VALUES (?, ?, ?, ?, ?)
    `);

		stmt.run(
			connectionId,
			encryptedConfig,
			description || "",
			this.hashToken(accessToken),
			this.hashToken(refreshToken),
		);

		// Cache the tokens
		this.tokenCache.set(accessToken, connectionId);
		this.cache.set(connectionId, mwConfig);

		return { accessToken, refreshToken, connectionId };
	}

	async getConnectionByToken(token: string): Promise<MoneyWorksConfig | null> {
		// Check cache first
		const cachedConnectionId = this.tokenCache.get(token);
		if (cachedConnectionId) {
			const cachedConfig = this.cache.get(cachedConnectionId);
			if (cachedConfig) {
				// Update last used
				this.updateLastUsed(cachedConnectionId);
				return cachedConfig;
			}
		}

		// Look up in database
		const tokenHash = this.hashToken(token);
		const stmt = this.db.prepare(`
      SELECT * FROM connections 
      WHERE access_token_hash = ?
    `);

		const connection = stmt.get(tokenHash) as StoredConnection | undefined;

		if (!connection) {
			return null;
		}

		// Decrypt config
		const config = JSON.parse(
			this.decrypt(connection.encrypted_config),
		) as MoneyWorksConfig;

		// Update caches
		this.tokenCache.set(token, connection.id);
		this.cache.set(connection.id, config);

		// Update last used
		this.updateLastUsed(connection.id);

		return config;
	}

	async refreshToken(refreshToken: string): Promise<ConnectionTokens | null> {
		const tokenHash = this.hashToken(refreshToken);
		const stmt = this.db.prepare(`
      SELECT * FROM connections 
      WHERE refresh_token_hash = ?
    `);

		const connection = stmt.get(tokenHash) as StoredConnection | undefined;

		if (!connection) {
			return null;
		}

		// Generate new tokens
		const newAccessToken = this.generateToken();
		const newRefreshToken = this.generateToken();

		// Update in database
		const updateStmt = this.db.prepare(`
      UPDATE connections 
      SET access_token_hash = ?, refresh_token_hash = ?, last_used_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

		updateStmt.run(
			this.hashToken(newAccessToken),
			this.hashToken(newRefreshToken),
			connection.id,
		);

		// Update cache
		this.tokenCache.set(newAccessToken, connection.id);

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			connectionId: connection.id,
		};
	}

	async deleteConnection(
		connectionId: string,
		token: string,
	): Promise<boolean> {
		// Verify token matches connection
		const tokenConnectionId = this.tokenCache.get(token);
		if (tokenConnectionId !== connectionId) {
			// Check database
			const config = await this.getConnectionByToken(token);
			if (!config) {
				return false;
			}
		}

		// Delete from database
		const stmt = this.db.prepare("DELETE FROM connections WHERE id = ?");
		const result = stmt.run(connectionId);

		// Clear caches
		this.cache.delete(connectionId);
		// Remove all tokens for this connection from cache
		for (const [token, id] of this.tokenCache.entries()) {
			if (id === connectionId) {
				this.tokenCache.delete(token);
			}
		}

		return result.changes > 0;
	}

	private updateLastUsed(connectionId: string) {
		const stmt = this.db.prepare(`
      UPDATE connections 
      SET last_used_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
		stmt.run(connectionId);
	}

	// Cleanup old connections (optional)
	async cleanupOldConnections(daysOld = 30) {
		const stmt = this.db.prepare(`
      DELETE FROM connections 
      WHERE last_used_at < datetime('now', '-' || ? || ' days')
    `);
		const result = stmt.run(daysOld);
		return result.changes;
	}
}

// Export singleton instance
export const connectionService = new ConnectionService();
