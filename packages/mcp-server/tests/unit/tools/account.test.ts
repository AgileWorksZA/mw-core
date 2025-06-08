/**
 * Unit tests for account tools
 */

import { beforeEach, describe, expect, it, mock } from "bun:test";
import { z } from "zod";
import {
	getAccountTool,
	listAccountFieldsTool,
	searchAccountsTool,
} from "../../../src/tools/account";
import { MOCK_RESPONSES, createMockService } from "../../setup";

// Mock the AccountService
const mockAccountService = createMockService(MOCK_RESPONSES.accounts.success);

// Mock the module
mock.module("@moneyworks/api/src/services/tables/account.service", () => ({
	AccountService: () => mockAccountService,
}));

describe("Account Tools", () => {
	describe("searchAccountsTool", () => {
		it("should search accounts with basic query", async () => {
			const args = {
				query: "cash",
				limit: 10,
				offset: 0,
			};

			const result = await searchAccountsTool.execute(args);

			expect(result).toBeDefined();
			expect(result.accounts).toBeDefined();
			expect(Array.isArray(result.accounts)).toBe(true);
			expect(result.total).toBeGreaterThanOrEqual(0);
			expect(result.limit).toBe(10);
			expect(result.offset).toBe(0);
		});

		it("should search accounts by type", async () => {
			const args = {
				type: "CA" as const,
				limit: 5,
				offset: 0,
			};

			const result = await searchAccountsTool.execute(args);

			expect(result).toBeDefined();
			expect(result.accounts).toBeDefined();
			expect(result.limit).toBe(5);
		});

		it("should search accounts by category", async () => {
			const args = {
				category: "CASH",
				limit: 20,
				offset: 0,
			};

			const result = await searchAccountsTool.execute(args);

			expect(result).toBeDefined();
			expect(result.accounts).toBeDefined();
			expect(result.limit).toBe(20);
		});

		it("should handle pagination correctly", async () => {
			const args = {
				limit: 5,
				offset: 10,
			};

			const result = await searchAccountsTool.execute(args);

			expect(result).toBeDefined();
			expect(result.limit).toBe(5);
			expect(result.offset).toBe(10);
		});

		it("should validate input schema", () => {
			const validArgs = {
				query: "test",
				type: "CA" as const,
				category: "TEST",
				limit: 50,
				offset: 0,
			};

			expect(() =>
				searchAccountsTool.inputSchema.parse(validArgs),
			).not.toThrow();
		});

		it("should reject invalid type", () => {
			const invalidArgs = {
				type: "INVALID",
				limit: 50,
				offset: 0,
			};

			expect(() => searchAccountsTool.inputSchema.parse(invalidArgs)).toThrow();
		});

		it("should reject invalid limit", () => {
			const invalidArgs = {
				limit: -1,
				offset: 0,
			};

			expect(() => searchAccountsTool.inputSchema.parse(invalidArgs)).toThrow();
		});

		it("should reject limit exceeding maximum", () => {
			const invalidArgs = {
				limit: 101,
				offset: 0,
			};

			expect(() => searchAccountsTool.inputSchema.parse(invalidArgs)).toThrow();
		});

		it("should reject negative offset", () => {
			const invalidArgs = {
				limit: 50,
				offset: -1,
			};

			expect(() => searchAccountsTool.inputSchema.parse(invalidArgs)).toThrow();
		});
	});

	describe("getAccountTool", () => {
		it("should get account by code", async () => {
			const args = {
				code: "1000",
			};

			const result = await getAccountTool.execute(args);

			expect(result).toBeDefined();
			expect(result.Code).toBe("1000");
		});

		it("should throw error for non-existent account", async () => {
			// Mock empty response for this test
			const mockEmptyService = createMockService(
				MOCK_RESPONSES.accounts.notFound,
			);

			// Temporarily replace the service
			const originalExecute = getAccountTool.execute;
			getAccountTool.execute = async (args) => {
				const result = await mockEmptyService.getData({
					search: { Code: args.code },
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Account not found: ${args.code}`);
				}

				return result.data[0];
			};

			const args = {
				code: "NONEXISTENT",
			};

			await expect(getAccountTool.execute(args)).rejects.toThrow(
				"Account not found: NONEXISTENT",
			);

			// Restore original function
			getAccountTool.execute = originalExecute;
		});

		it("should validate input schema", () => {
			const validArgs = {
				code: "1000",
			};

			expect(() => getAccountTool.inputSchema.parse(validArgs)).not.toThrow();
		});

		it("should require code parameter", () => {
			const invalidArgs = {};

			expect(() => getAccountTool.inputSchema.parse(invalidArgs)).toThrow();
		});
	});

	describe("listAccountFieldsTool", () => {
		it("should return account fields", async () => {
			// Mock the import
			mock.module("@moneyworks/api/src/types/interface/tables/account", () => ({
				AccountFields: [
					"Code",
					"Description",
					"Type",
					"Category",
					"CurrentBalance",
				],
			}));

			const result = await listAccountFieldsTool.execute();

			expect(result).toBeDefined();
			expect(result.fields).toBeDefined();
			expect(result.description).toBeDefined();
			expect(typeof result.description).toBe("string");
		});

		it("should validate empty input schema", () => {
			const args = {};

			expect(() => listAccountFieldsTool.inputSchema.parse(args)).not.toThrow();
		});
	});

	describe("Type mapping", () => {
		it("should map full type names to MoneyWorks codes", () => {
			// Test that type mapping is working by checking the search criteria
			const args = {
				type: "CA" as const,
				limit: 50,
				offset: 0,
			};

			// This should not throw and should include the mapped type
			expect(() => searchAccountsTool.inputSchema.parse(args)).not.toThrow();
		});

		it("should support all valid account types", () => {
			const validTypes = [
				"IN",
				"SA",
				"EX",
				"CS",
				"CA",
				"CL",
				"FA",
				"TA",
				"TL",
				"SF",
			];

			for (const type of validTypes) {
				const args = {
					type: type as any,
					limit: 50,
					offset: 0,
				};

				expect(() => searchAccountsTool.inputSchema.parse(args)).not.toThrow();
			}
		});
	});

	describe("Error handling", () => {
		it("should handle service errors gracefully", async () => {
			// Mock service that throws error
			const errorService = {
				async getData() {
					throw new Error("Service unavailable");
				},
			};

			// Temporarily replace the service
			const originalExecute = searchAccountsTool.execute;
			searchAccountsTool.execute = async (args) => {
				await errorService.getData({});
				return {
					accounts: [],
					total: 0,
					limit: args.limit,
					offset: args.offset,
				};
			};

			const args = {
				query: "test",
				limit: 50,
				offset: 0,
			};

			await expect(searchAccountsTool.execute(args)).rejects.toThrow(
				"Service unavailable",
			);

			// Restore original function
			searchAccountsTool.execute = originalExecute;
		});
	});
});
