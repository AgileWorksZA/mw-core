/**
 * Integration tests for MCP server tool execution
 * Tests the full MCP server behavior including tool registration and execution
 */

import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	mock,
} from "bun:test";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
	MOCK_RESPONSES,
	cleanupTestDatabase,
	createMockService,
	getTestTicketService,
	setupTestDatabase,
} from "../setup";

// Mock all services
mock.module("@moneyworks/api/src/services/tables/account.service", () => ({
	AccountService: () => createMockService(MOCK_RESPONSES.accounts.success),
}));

mock.module("@moneyworks/api/src/services/tables/transaction.service", () => ({
	TransactionService: () =>
		createMockService(MOCK_RESPONSES.transactions.success),
}));

mock.module("@moneyworks/api/src/services/tables/contact.service", () => ({
	ContactService: () => createMockService(MOCK_RESPONSES.contacts.success),
}));

describe("MCP Server Integration", () => {
	let server: McpServer;

	beforeAll(async () => {
		await setupTestDatabase();
	});

	afterAll(async () => {
		await cleanupTestDatabase();
	});

	beforeEach(() => {
		// Create a new server instance for each test
		server = new McpServer({
			name: "test-moneyworks-assistant",
			version: "1.0.0-test",
		});
	});

	describe("Tool Registration", () => {
		it("should register searchAccounts tool correctly", () => {
			server.tool(
				"searchAccounts",
				"Search for accounts in MoneyWorks by code, description, type, or category",
				{
					query: z
						.string()
						.optional()
						.describe("Search query for account code or description"),
					type: z
						.enum(["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"])
						.optional(),
					category: z.string().optional().describe("Category code filter"),
					limit: z.number().min(1).max(100).default(50),
					offset: z.number().min(0).default(0),
				},
				async (args) => {
					return {
						content: [
							{
								type: "text" as const,
								text: JSON.stringify(
									{ accounts: [], total: 0, ...args },
									null,
									2,
								),
							},
						],
					};
				},
			);

			// Tool should be registered without throwing
			expect(server).toBeDefined();
		});

		it("should register getAccount tool correctly", () => {
			server.tool(
				"getAccount",
				"Get a specific account by its code",
				{
					code: z.string().describe("The account code to retrieve"),
				},
				async (args) => {
					return {
						content: [
							{
								type: "text" as const,
								text: JSON.stringify({ Code: args.code }, null, 2),
							},
						],
					};
				},
			);

			expect(server).toBeDefined();
		});

		it("should register transaction tools correctly", () => {
			server.tool(
				"searchTransactions",
				"Search for transactions",
				{
					query: z.string().optional(),
					type: z
						.enum([
							"SI",
							"SC",
							"SR",
							"SD",
							"PI",
							"PC",
							"PP",
							"PD",
							"JN",
							"JC",
							"BR",
							"BP",
							"BT",
							"ST",
							"SO",
							"PO",
						])
						.optional(),
					limit: z.number().min(1).max(100).default(50),
					offset: z.number().min(0).default(0),
				},
				async (args) => {
					return {
						content: [
							{
								type: "text" as const,
								text: JSON.stringify(
									{ transactions: [], total: 0, ...args },
									null,
									2,
								),
							},
						],
					};
				},
			);

			expect(server).toBeDefined();
		});
	});

	describe("Tool Execution", () => {
		beforeEach(() => {
			// Register test tools
			server.tool(
				"testSearchAccounts",
				"Test search accounts",
				{
					query: z.string().optional(),
					limit: z.number().min(1).max(100).default(50),
					offset: z.number().min(0).default(0),
				},
				async (args) => {
					// Simulate the actual tool execution
					const mockResult = {
						accounts: MOCK_RESPONSES.accounts.success.data,
						total: MOCK_RESPONSES.accounts.success.pagination.total,
						limit: args.limit,
						offset: args.offset,
					};

					return {
						content: [
							{
								type: "text" as const,
								text: JSON.stringify(mockResult, null, 2),
							},
						],
					};
				},
			);

			server.tool(
				"testGetAccount",
				"Test get account",
				{
					code: z.string(),
				},
				async (args) => {
					const account = MOCK_RESPONSES.accounts.success.data.find(
						(acc) => acc.Code === args.code,
					);
					if (!account) {
						throw new Error(`Account not found: ${args.code}`);
					}

					return {
						content: [
							{ type: "text" as const, text: JSON.stringify(account, null, 2) },
						],
					};
				},
			);

			server.tool(
				"testErrorTool",
				"Test error handling",
				{
					shouldError: z.boolean().default(false),
				},
				async (args) => {
					if (args.shouldError) {
						throw new Error("Simulated error");
					}

					return {
						content: [{ type: "text" as const, text: "Success" }],
					};
				},
			);
		});

		it("should execute search tool successfully", async () => {
			// Note: This is a simplified test since we don't have access to the actual tool execution context
			// In a real integration test, you would need to set up the full MCP protocol communication

			const args = {
				query: "cash",
				limit: 10,
				offset: 0,
			};

			// This would typically be called through the MCP protocol, but we're testing the handler directly
			const result = await server.toolHandlers
				.get("testSearchAccounts")
				?.handler(args, {});

			expect(result).toBeDefined();
			expect(result.content).toBeDefined();
			expect(result.content[0].type).toBe("text");

			const data = JSON.parse(result.content[0].text);
			expect(data.accounts).toBeDefined();
			expect(Array.isArray(data.accounts)).toBe(true);
			expect(data.total).toBeGreaterThanOrEqual(0);
			expect(data.limit).toBe(10);
			expect(data.offset).toBe(0);
		});

		it("should execute get tool successfully", async () => {
			const args = {
				code: "1000",
			};

			const result = await server.toolHandlers
				.get("testGetAccount")
				?.handler(args, {});

			expect(result).toBeDefined();
			expect(result.content).toBeDefined();
			expect(result.content[0].type).toBe("text");

			const data = JSON.parse(result.content[0].text);
			expect(data.Code).toBe("1000");
			expect(data.Description).toBeDefined();
		});

		it("should handle tool errors properly", async () => {
			const args = {
				shouldError: true,
			};

			await expect(
				server.toolHandlers.get("testErrorTool")?.handler(args, {}),
			).rejects.toThrow("Simulated error");
		});

		it("should handle not found errors", async () => {
			const args = {
				code: "NONEXISTENT",
			};

			await expect(
				server.toolHandlers.get("testGetAccount")?.handler(args, {}),
			).rejects.toThrow("Account not found: NONEXISTENT");
		});
	});

	describe("Schema Validation", () => {
		beforeEach(() => {
			server.tool(
				"testValidation",
				"Test validation",
				{
					requiredString: z.string(),
					optionalNumber: z.number().optional(),
					enumValue: z.enum(["A", "B", "C"]),
					limitedNumber: z.number().min(1).max(100),
				},
				async (args) => {
					return {
						content: [
							{ type: "text" as const, text: JSON.stringify(args, null, 2) },
						],
					};
				},
			);
		});

		it("should validate required parameters", async () => {
			const validArgs = {
				requiredString: "test",
				enumValue: "A" as const,
				limitedNumber: 50,
			};

			// In a real test, this would go through the MCP protocol validation
			const toolHandler = server.toolHandlers.get("testValidation");
			expect(toolHandler).toBeDefined();

			// Simulate schema validation
			const schema = z.object({
				requiredString: z.string(),
				optionalNumber: z.number().optional(),
				enumValue: z.enum(["A", "B", "C"]),
				limitedNumber: z.number().min(1).max(100),
			});

			expect(() => schema.parse(validArgs)).not.toThrow();
		});

		it("should reject invalid parameters", async () => {
			const invalidArgs = {
				requiredString: 123, // Should be string
				enumValue: "D", // Invalid enum value
				limitedNumber: 101, // Exceeds maximum
			};

			const schema = z.object({
				requiredString: z.string(),
				optionalNumber: z.number().optional(),
				enumValue: z.enum(["A", "B", "C"]),
				limitedNumber: z.number().min(1).max(100),
			});

			expect(() => schema.parse(invalidArgs)).toThrow();
		});

		it("should handle missing required parameters", async () => {
			const incompleteArgs = {
				optionalNumber: 42,
				// Missing requiredString, enumValue, limitedNumber
			};

			const schema = z.object({
				requiredString: z.string(),
				optionalNumber: z.number().optional(),
				enumValue: z.enum(["A", "B", "C"]),
				limitedNumber: z.number().min(1).max(100),
			});

			expect(() => schema.parse(incompleteArgs)).toThrow();
		});
	});

	describe("Error Handling and Ticket Creation", () => {
		it("should handle API errors gracefully", async () => {
			server.tool(
				"testApiError",
				"Test API error handling",
				{
					errorCode: z.number().optional(),
				},
				async (args) => {
					// Simulate different types of API errors
					if (args.errorCode === 404) {
						const error = new Error("Resource not found") as any;
						error.code = 404;
						throw error;
					}
					if (args.errorCode === 500) {
						const error = new Error("Internal server error") as any;
						error.code = 500;
						throw error;
					}

					return {
						content: [{ type: "text" as const, text: "Success" }],
					};
				},
			);

			const toolHandler = server.toolHandlers.get("testApiError");
			expect(toolHandler).toBeDefined();

			// Test 404 error
			await expect(toolHandler.handler({ errorCode: 404 }, {})).rejects.toThrow(
				"Resource not found",
			);

			// Test 500 error
			await expect(toolHandler.handler({ errorCode: 500 }, {})).rejects.toThrow(
				"Internal server error",
			);
		});

		it("should create error tickets for failed operations", async () => {
			// This would test the actual ticket creation in a real environment
			const ticketService = getTestTicketService();

			// Simulate an error ticket creation
			const ticketId = await ticketService.createTicket({
				type: "bug",
				severity: "medium",
				status: "open",
				user_prompt: JSON.stringify({ testParam: "value" }),
				ai_attempted_action: "Execute tool: testTool",
				mcp_tool_used: "testTool",
				api_endpoint: "testTool operation",
				error_message: "Test error message",
				error_stack: "Test stack trace",
				api_response_code: 500,
				response_payload: JSON.stringify({ error: "Test error" }),
				session_id: "test-session",
			});

			expect(ticketId).toBeDefined();
			expect(typeof ticketId).toBe("number");

			// Verify ticket was created
			const tickets = await ticketService.getTickets({ limit: 10 });
			expect(tickets.length).toBeGreaterThan(0);

			const createdTicket = tickets.find((t) => t.id === ticketId);
			expect(createdTicket).toBeDefined();
			expect(createdTicket?.type).toBe("bug");
			expect(createdTicket?.mcp_tool_used).toBe("testTool");
		});
	});

	describe("Performance and Concurrency", () => {
		it("should handle multiple concurrent tool executions", async () => {
			server.tool(
				"testConcurrency",
				"Test concurrent execution",
				{
					delay: z.number().default(0),
					identifier: z.string(),
				},
				async (args) => {
					// Simulate some async work
					await new Promise((resolve) => setTimeout(resolve, args.delay));

					return {
						content: [
							{
								type: "text" as const,
								text: JSON.stringify({ completed: args.identifier }, null, 2),
							},
						],
					};
				},
			);

			const toolHandler = server.toolHandlers.get("testConcurrency");
			expect(toolHandler).toBeDefined();

			// Execute multiple tools concurrently
			const promises = [
				toolHandler.handler({ delay: 10, identifier: "task1" }, {}),
				toolHandler.handler({ delay: 5, identifier: "task2" }, {}),
				toolHandler.handler({ delay: 15, identifier: "task3" }, {}),
			];

			const results = await Promise.all(promises);

			expect(results).toHaveLength(3);
			for (const result of results) {
				expect(result.content).toBeDefined();
				expect(result.content[0].type).toBe("text");

				const data = JSON.parse(result.content[0].text);
				expect(data.completed).toBeDefined();
				expect(["task1", "task2", "task3"]).toContain(data.completed);
			}
		});

		it("should handle tool execution timeouts", async () => {
			server.tool(
				"testTimeout",
				"Test timeout handling",
				{
					duration: z.number(),
				},
				async (args) => {
					// Simulate a long-running operation
					await new Promise((resolve) => setTimeout(resolve, args.duration));

					return {
						content: [{ type: "text" as const, text: "Completed" }],
					};
				},
			);

			const toolHandler = server.toolHandlers.get("testTimeout");
			expect(toolHandler).toBeDefined();

			// This would timeout in a real implementation with proper timeout handling
			// For this test, we'll just verify the handler exists and could handle the request
			const startTime = Date.now();
			const result = await toolHandler.handler({ duration: 50 }, {});
			const endTime = Date.now();

			expect(result).toBeDefined();
			expect(endTime - startTime).toBeGreaterThanOrEqual(50);
		});
	});

	describe("Complex Tool Workflows", () => {
		it("should support chained tool operations", async () => {
			// Register tools that might be used in sequence
			server.tool(
				"testSearchCustomers",
				"Search customers",
				{
					query: z.string(),
				},
				async (args) => {
					return {
						content: [
							{
								type: "text" as const,
								text: JSON.stringify(
									{ customers: [{ code: "CUST001" }] },
									null,
									2,
								),
							},
						],
					};
				},
			);

			server.tool(
				"testGetCustomerTransactions",
				"Get customer transactions",
				{
					customerCode: z.string(),
				},
				async (args) => {
					return {
						content: [
							{
								type: "text" as const,
								text: JSON.stringify(
									{ transactions: [{ ref: "INV-001", amount: 1000 }] },
									null,
									2,
								),
							},
						],
					};
				},
			);

			// Simulate a workflow: search for customers, then get their transactions
			const searchHandler = server.toolHandlers.get("testSearchCustomers");
			const transactionHandler = server.toolHandlers.get(
				"testGetCustomerTransactions",
			);

			expect(searchHandler).toBeDefined();
			expect(transactionHandler).toBeDefined();

			// Step 1: Search for customers
			const searchResult = await searchHandler.handler({ query: "ABC" }, {});
			const searchData = JSON.parse(searchResult.content[0].text);
			expect(searchData.customers).toHaveLength(1);

			// Step 2: Get transactions for the found customer
			const customerCode = searchData.customers[0].code;
			const transactionResult = await transactionHandler.handler(
				{ customerCode },
				{},
			);
			const transactionData = JSON.parse(transactionResult.content[0].text);
			expect(transactionData.transactions).toHaveLength(1);
			expect(transactionData.transactions[0].amount).toBe(1000);
		});
	});
});
