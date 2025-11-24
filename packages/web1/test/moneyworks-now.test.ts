import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "bun:test";
import { MoneyWorksNOWClient } from "@moneyworks/data";
import { getDatabaseAsync } from "../app/db/client";
import { connectionService } from "../app/services/connections";
import { nowAccountService } from "../app/services/now-accounts";

describe("MoneyWorks NOW Integration", () => {
	let db: any;
	const testUserId = "test-user-123";

	beforeAll(async () => {
		db = await getDatabaseAsync();
	});

	beforeEach(async () => {
		// Clean up test data
		await db
			.prepare("DELETE FROM mw_connections WHERE clerk_user_id = ?")
			.run(testUserId);
		await db
			.prepare("DELETE FROM mw_now_accounts WHERE clerk_user_id = ?")
			.run(testUserId);
	});

	afterAll(async () => {
		// Final cleanup
		await db
			.prepare("DELETE FROM mw_connections WHERE clerk_user_id = ?")
			.run(testUserId);
		await db
			.prepare("DELETE FROM mw_now_accounts WHERE clerk_user_id = ?")
			.run(testUserId);
	});

	describe("NOW Account Service", () => {
		test("should create a NOW account", async () => {
			const account = await nowAccountService.createNowAccount({
				clerk_user_id: testUserId,
				account_name: "Test NOW Account",
				mw_now_username: "test@example.com",
				mw_now_password: "test-password",
			});

			expect(account).toBeDefined();
			expect(account.account_name).toBe("Test NOW Account");
			expect(account.mw_now_username).toBe("test@example.com");
			expect(account.id).toBeDefined();
		});

		test("should retrieve NOW accounts for user", async () => {
			// Create test account
			await nowAccountService.createNowAccount({
				clerk_user_id: testUserId,
				account_name: "Test Account 1",
				mw_now_username: "test1@example.com",
				mw_now_password: "password1",
			});

			await nowAccountService.createNowAccount({
				clerk_user_id: testUserId,
				account_name: "Test Account 2",
				mw_now_username: "test2@example.com",
				mw_now_password: "password2",
			});

			const accounts = await nowAccountService.getNowAccountsByUser(testUserId);

			expect(accounts).toHaveLength(2);
			expect(accounts[0].account_name).toBe("Test Account 1");
			expect(accounts[1].account_name).toBe("Test Account 2");
		});

		test("should update NOW account tokens", async () => {
			const account = await nowAccountService.createNowAccount({
				clerk_user_id: testUserId,
				account_name: "Test Token Account",
				mw_now_username: "test@example.com",
				mw_now_password: "password",
			});

			const updated = await nowAccountService.updateNowAccount(testUserId, {
				id: account.id,
				mw_now_token: "test-token",
				mw_now_refresh_token: "test-refresh-token",
			});

			expect(updated).toBeDefined();
			expect(updated?.mw_now_token).toBe("test-token");
			expect(updated?.mw_now_refresh_token).toBe("test-refresh-token");
		});

		test("should delete NOW account and associated connections", async () => {
			// Create NOW account
			const account = await nowAccountService.createNowAccount({
				clerk_user_id: testUserId,
				account_name: "Test Delete Account",
				mw_now_username: "delete@example.com",
				mw_now_password: "password",
			});

			// Create associated connection
			await connectionService.createConnection({
				clerk_user_id: testUserId,
				connection_name: "Test NOW Connection",
				connection_type: "now",
				mw_username: "user",
				mw_password: "pass",
				mw_data_file: "test.mwd",
				mw_host: "now.example.com",
				mw_port: 6710,
				mw_now_account_id: account.id,
				mw_now_file_id: "file-123",
			});

			// Delete account
			const deleted = await nowAccountService.deleteNowAccount(
				testUserId,
				account.id,
			);
			expect(deleted).toBe(true);

			// Verify account deleted
			const accounts = await nowAccountService.getNowAccountsByUser(testUserId);
			expect(accounts).toHaveLength(0);

			// Verify connections deleted
			const connections =
				await connectionService.getConnectionsByUser(testUserId);
			expect(connections).toHaveLength(0);
		});
	});

	describe("Connection Service - NOW Support", () => {
		test("should create NOW connections", async () => {
			const account = await nowAccountService.createNowAccount({
				clerk_user_id: testUserId,
				account_name: "Test NOW Account",
				mw_now_username: "test@example.com",
				mw_now_password: "password",
			});

			const files = [
				{
					file: {
						id: "file-1",
						name: "Company A",
						companyName: "Company A Ltd",
						dataFile: "companya.mwd",
						host: "now.moneyworks.com",
						port: 6710,
					},
					username: "user1",
					password: "pass1",
				},
				{
					file: {
						id: "file-2",
						name: "Company B",
						companyName: "Company B Ltd",
						dataFile: "companyb.mwd",
						host: "now.moneyworks.com",
						port: 6710,
					},
					username: "user2",
					password: "pass2",
				},
			];

			const connections = await connectionService.createNowConnections(
				testUserId,
				account.id,
				files,
			);

			expect(connections).toHaveLength(2);
			expect(connections[0].connection_type).toBe("now");
			expect(connections[0].connection_name).toBe("Company A Ltd (NOW)");
			expect(connections[0].mw_now_account_id).toBe(account.id);
			expect(connections[0].mw_now_file_id).toBe("file-1");

			expect(connections[1].connection_name).toBe("Company B Ltd (NOW)");
			expect(connections[1].mw_now_file_id).toBe("file-2");
		});

		test("should retrieve connections by NOW account", async () => {
			const account = await nowAccountService.createNowAccount({
				clerk_user_id: testUserId,
				account_name: "Test Account",
				mw_now_username: "test@example.com",
				mw_now_password: "password",
			});

			// Create NOW connections
			await connectionService.createConnection({
				clerk_user_id: testUserId,
				connection_name: "NOW Connection 1",
				connection_type: "now",
				mw_username: "user",
				mw_password: "pass",
				mw_data_file: "file1.mwd",
				mw_host: "now.example.com",
				mw_port: 6710,
				mw_now_account_id: account.id,
				mw_now_file_id: "file-1",
			});

			await connectionService.createConnection({
				clerk_user_id: testUserId,
				connection_name: "NOW Connection 2",
				connection_type: "now",
				mw_username: "user",
				mw_password: "pass",
				mw_data_file: "file2.mwd",
				mw_host: "now.example.com",
				mw_port: 6710,
				mw_now_account_id: account.id,
				mw_now_file_id: "file-2",
			});

			// Create regular connection (should not be included)
			await connectionService.createConnection({
				clerk_user_id: testUserId,
				connection_name: "Regular Connection",
				connection_type: "datacentre",
				mw_username: "user",
				mw_password: "pass",
				mw_data_file: "regular.mwd",
				mw_host: "localhost",
				mw_port: 6710,
			});

			const nowConnections = await connectionService.getConnectionsByNowAccount(
				testUserId,
				account.id,
			);

			expect(nowConnections).toHaveLength(2);
			expect(nowConnections.every((c) => c.connection_type === "now")).toBe(
				true,
			);
			expect(
				nowConnections.every((c) => c.mw_now_account_id === account.id),
			).toBe(true);
		});
	});

	describe("MoneyWorks NOW Client", () => {
		test("should create client instance", () => {
			const client = new MoneyWorksNOWClient({
				username: "test@example.com",
				password: "password",
			});

			expect(client).toBeDefined();
		});

		test("should handle authentication error gracefully", async () => {
			const client = new MoneyWorksNOWClient({
				username: "invalid@example.com",
				password: "wrong-password",
				baseUrl: "http://localhost:9999/invalid", // Invalid URL
			});

			try {
				await client.authenticate();
				expect(true).toBe(false); // Should not reach here
			} catch (error) {
				expect(error).toBeDefined();
			}
		});
	});

	describe("Database Schema", () => {
		test("should have correct mw_now_accounts table structure", async () => {
			const tableInfo = db
				.prepare(
					"SELECT sql FROM sqlite_master WHERE type='table' AND name='mw_now_accounts'",
				)
				.get();

			expect(tableInfo).toBeDefined();
			expect(tableInfo.sql).toContain("id TEXT PRIMARY KEY");
			expect(tableInfo.sql).toContain("clerk_user_id TEXT NOT NULL");
			expect(tableInfo.sql).toContain("account_name TEXT NOT NULL");
			expect(tableInfo.sql).toContain("mw_now_username TEXT NOT NULL");
			expect(tableInfo.sql).toContain("mw_now_password TEXT NOT NULL");
		});

		test("should have NOW fields in mw_connections table", async () => {
			const tableInfo = db
				.prepare(
					"SELECT sql FROM sqlite_master WHERE type='table' AND name='mw_connections'",
				)
				.get();

			expect(tableInfo).toBeDefined();
			expect(tableInfo.sql).toContain("connection_type TEXT");
			expect(tableInfo.sql).toContain("mw_now_account_id TEXT");
			expect(tableInfo.sql).toContain("mw_now_file_id TEXT");
			expect(tableInfo.sql).toContain("mw_now_metadata TEXT");
		});
	});
});
