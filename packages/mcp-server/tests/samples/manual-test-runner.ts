#!/usr/bin/env bun

/**
 * Manual test runner for MCP tools
 * Executes sample queries and displays results for manual verification
 */

import fs from "node:fs";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import sample queries
const sampleQueriesPath = path.join(__dirname, "sample-queries.json");
const sampleQueries = JSON.parse(fs.readFileSync(sampleQueriesPath, "utf-8"));

// Mock services for testing
const createMockAccountService = () => ({
	async getData(options: any) {
		await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate network delay

		const mockAccounts = [
			{
				Code: "1000",
				Description: "Cash at Bank",
				Type: "A",
				Category: "CASH",
				CurrentBalance: 25000.0,
			},
			{
				Code: "1100",
				Description: "Accounts Receivable",
				Type: "A",
				Category: "RECV",
				CurrentBalance: 15000.0,
			},
			{
				Code: "4000",
				Description: "Sales Revenue",
				Type: "I",
				Category: "SALES",
				CurrentBalance: 0.0,
			},
			{
				Code: "5000",
				Description: "Cost of Goods Sold",
				Type: "E",
				Category: "COGS",
				CurrentBalance: 0.0,
			},
			{
				Code: "6000",
				Description: "Operating Expenses",
				Type: "E",
				Category: "OPEX",
				CurrentBalance: 0.0,
			},
		];

		let filteredAccounts = mockAccounts;

		if (options.search) {
			if (options.search.Code) {
				filteredAccounts = mockAccounts.filter(
					(acc) =>
						acc.Code.includes(options.search.Code) ||
						acc.Description.toLowerCase().includes(
							options.search.Code.toLowerCase(),
						),
				);
			}
			if (options.search.Type) {
				filteredAccounts = filteredAccounts.filter(
					(acc) => acc.Type === options.search.Type,
				);
			}
		}

		const offset = options.offset || 0;
		const limit = options.limit || 50;
		const paginatedAccounts = filteredAccounts.slice(offset, offset + limit);

		return {
			data: paginatedAccounts,
			pagination: {
				total: filteredAccounts.length,
				offset,
				limit,
			},
		};
	},
});

const createMockTransactionService = () => ({
	async getData(options: any) {
		await new Promise((resolve) => setTimeout(resolve, 150)); // Simulate network delay

		const mockTransactions = [
			{
				SequenceNumber: 1001,
				Type: "SI",
				Status: "OP",
				OurRef: "INV-001",
				NameCode: "CUST001",
				TransDate: "2024-01-15",
				Gross: 1200.0,
				AmtPaid: 800.0,
				Period: 1,
			},
			{
				SequenceNumber: 1002,
				Type: "SR",
				Status: "CL",
				OurRef: "RCT-001",
				NameCode: "CUST001",
				TransDate: "2024-01-20",
				Gross: 800.0,
				AmtPaid: 800.0,
				Period: 1,
			},
			{
				SequenceNumber: 1003,
				Type: "PI",
				Status: "OP",
				OurRef: "BILL-001",
				NameCode: "SUPP001",
				TransDate: "2024-01-18",
				Gross: 500.0,
				AmtPaid: 0.0,
				Period: 1,
			},
		];

		let filteredTransactions = mockTransactions;

		if (options.search) {
			if (options.search.Type) {
				filteredTransactions = filteredTransactions.filter(
					(t) => t.Type === options.search.Type,
				);
			}
			if (options.search.Status) {
				filteredTransactions = filteredTransactions.filter(
					(t) => t.Status === options.search.Status,
				);
			}
			if (options.search.NameCode) {
				filteredTransactions = filteredTransactions.filter(
					(t) => t.NameCode === options.search.NameCode,
				);
			}
			if (options.search.SequenceNumber) {
				filteredTransactions = filteredTransactions.filter(
					(t) => t.SequenceNumber === options.search.SequenceNumber,
				);
			}
			if (options.search.OurRef) {
				filteredTransactions = filteredTransactions.filter(
					(t) => t.OurRef === options.search.OurRef,
				);
			}
		}

		const offset = options.offset || 0;
		const limit = options.limit || 50;
		const paginatedTransactions = filteredTransactions.slice(
			offset,
			offset + limit,
		);

		return {
			data: paginatedTransactions,
			pagination: {
				total: filteredTransactions.length,
				offset,
				limit,
			},
		};
	},
});

const createMockContactService = () => ({
	async getData(options: any) {
		await new Promise((resolve) => setTimeout(resolve, 80)); // Simulate network delay

		const mockContacts = [
			{
				Code: "CUST001",
				Description: "ABC Corporation",
				Type: "C",
				Address: "123 Business St",
				Phone: "+1234567890",
				Email: "contact@abc.com",
				IsActive: true,
			},
			{
				Code: "CUST002",
				Description: "XYZ Industries",
				Type: "C",
				Address: "456 Commerce Ave",
				Phone: "+1234567891",
				Email: "info@xyz.com",
				IsActive: true,
			},
			{
				Code: "SUPP001",
				Description: "Office Supplies Ltd",
				Type: "S",
				Address: "789 Supply Road",
				Phone: "+1234567892",
				Email: "orders@office.com",
				IsActive: true,
			},
		];

		let filteredContacts = mockContacts;

		if (options.search) {
			if (options.search.Code) {
				filteredContacts = filteredContacts.filter(
					(c) =>
						c.Code.includes(options.search.Code) ||
						c.Description.toLowerCase().includes(
							options.search.Code.toLowerCase(),
						),
				);
			}
			if (options.search.Type) {
				filteredContacts = filteredContacts.filter(
					(c) => c.Type === options.search.Type,
				);
			}
			if (options.search.Description) {
				filteredContacts = filteredContacts.filter((c) =>
					c.Description.toLowerCase().includes(
						options.search.Description.toLowerCase(),
					),
				);
			}
		}

		const offset = options.offset || 0;
		const limit = options.limit || 50;
		const paginatedContacts = filteredContacts.slice(offset, offset + limit);

		return {
			data: paginatedContacts,
			pagination: {
				total: filteredContacts.length,
				offset,
				limit,
			},
		};
	},
});

// Tool implementations using mock services
const mockAccountService = createMockAccountService();
const mockTransactionService = createMockTransactionService();
const mockContactService = createMockContactService();

const tools = {
	searchAccounts: {
		description: "Search for accounts",
		schema: {
			query: z.string().optional(),
			type: z
				.enum(["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"])
				.optional(),
			category: z.string().optional(),
			limit: z.number().min(1).max(100).default(50),
			offset: z.number().min(0).default(0),
		},
		async execute(args: any) {
			const search: any = {};

			if (args.query) {
				search.Code = args.query;
			}

			// Map type codes
			const typeMapping: Record<string, string> = {
				IN: "I",
				SA: "S",
				EX: "E",
				CS: "C",
				CA: "A",
				CL: "L",
				FA: "F",
				TA: "T",
				TL: "M",
				SF: "H",
			};

			if (args.type) {
				search.Type = typeMapping[args.type];
			}

			const result = await mockAccountService.getData({
				search: Object.keys(search).length > 0 ? search : undefined,
				limit: args.limit,
				offset: args.offset,
			});

			return {
				accounts: result.data,
				total: result.pagination?.total || result.data.length,
				limit: args.limit,
				offset: args.offset,
			};
		},
	},

	getAccount: {
		description: "Get specific account by code",
		schema: {
			code: z.string(),
		},
		async execute(args: any) {
			const result = await mockAccountService.getData({
				search: { Code: args.code },
				limit: 1,
				offset: 0,
			});

			if (!result.data || result.data.length === 0) {
				throw new Error(`Account not found: ${args.code}`);
			}

			return result.data[0];
		},
	},

	listAccountFields: {
		description: "List account fields",
		schema: {},
		async execute() {
			return {
				fields: [
					"Code",
					"Description",
					"Type",
					"Category",
					"CurrentBalance",
					"OpeningBalance",
				],
				description: "Available fields for account queries and filters",
			};
		},
	},

	searchTransactions: {
		description: "Search for transactions",
		schema: {
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
			status: z.enum(["OP", "CL", "PA", "CA", "DR"]).optional(),
			nameCode: z.string().optional(),
			fromDate: z.string().optional(),
			toDate: z.string().optional(),
			period: z.number().optional(),
			minAmount: z.number().optional(),
			maxAmount: z.number().optional(),
			limit: z.number().min(1).max(100).default(50),
			offset: z.number().min(0).default(0),
		},
		async execute(args: any) {
			const search: any = {};

			if (args.query) {
				search.OurRef = args.query;
			}
			if (args.type) search.Type = args.type;
			if (args.status) search.Status = args.status;
			if (args.nameCode) search.NameCode = args.nameCode;
			if (args.period) search.Period = args.period;

			const result = await mockTransactionService.getData({
				search: Object.keys(search).length > 0 ? search : undefined,
				limit: args.limit,
				offset: args.offset,
			});

			let filteredData = result.data;

			// Apply date filtering
			if (args.fromDate || args.toDate) {
				filteredData = filteredData.filter((trans: any) => {
					const transDate = new Date(trans.TransDate);
					if (args.fromDate && transDate < new Date(args.fromDate))
						return false;
					if (args.toDate && transDate > new Date(args.toDate)) return false;
					return true;
				});
			}

			// Apply amount filtering
			if (args.minAmount !== undefined || args.maxAmount !== undefined) {
				filteredData = filteredData.filter((trans: any) => {
					if (args.minAmount !== undefined && trans.Gross < args.minAmount)
						return false;
					if (args.maxAmount !== undefined && trans.Gross > args.maxAmount)
						return false;
					return true;
				});
			}

			return {
				transactions: filteredData,
				total: filteredData.length,
				limit: args.limit,
				offset: args.offset,
			};
		},
	},

	getTransaction: {
		description: "Get transaction by sequence number",
		schema: {
			sequenceNumber: z.number(),
		},
		async execute(args: any) {
			const result = await mockTransactionService.getData({
				search: { SequenceNumber: args.sequenceNumber },
				limit: 1,
				offset: 0,
			});

			if (!result.data || result.data.length === 0) {
				throw new Error(`Transaction not found: ${args.sequenceNumber}`);
			}

			return result.data[0];
		},
	},

	getTransactionByRef: {
		description: "Get transaction by reference",
		schema: {
			reference: z.string(),
		},
		async execute(args: any) {
			const result = await mockTransactionService.getData({
				search: { OurRef: args.reference },
				limit: 1,
				offset: 0,
			});

			if (!result.data || result.data.length === 0) {
				throw new Error(
					`Transaction not found with reference: ${args.reference}`,
				);
			}

			return result.data[0];
		},
	},

	listTransactionFields: {
		description: "List transaction fields",
		schema: {},
		async execute() {
			return {
				fields: [
					"SequenceNumber",
					"Type",
					"Status",
					"OurRef",
					"NameCode",
					"TransDate",
					"Gross",
					"AmtPaid",
					"Period",
				],
				description: "Available fields for transaction queries and filters",
				types: [
					{ code: "SI", description: "Sales Invoice" },
					{ code: "SR", description: "Sales Receipt" },
					{ code: "PI", description: "Purchase Invoice" },
					{ code: "PP", description: "Purchase Payment" },
				],
				statuses: [
					{ code: "OP", description: "Open" },
					{ code: "CL", description: "Closed" },
					{ code: "PA", description: "Partial" },
				],
			};
		},
	},

	getTransactionSummary: {
		description: "Get transaction summary",
		schema: {
			nameCode: z.string().optional(),
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
			fromDate: z.string().optional(),
			toDate: z.string().optional(),
		},
		async execute(args: any) {
			const search: any = {};
			if (args.nameCode) search.NameCode = args.nameCode;
			if (args.type) search.Type = args.type;

			const result = await mockTransactionService.getData({
				search: Object.keys(search).length > 0 ? search : undefined,
				limit: 1000,
				offset: 0,
			});

			let transactions = result.data;

			// Apply date filtering
			if (args.fromDate || args.toDate) {
				transactions = transactions.filter((trans: any) => {
					const transDate = new Date(trans.TransDate);
					if (args.fromDate && transDate < new Date(args.fromDate))
						return false;
					if (args.toDate && transDate > new Date(args.toDate)) return false;
					return true;
				});
			}

			// Calculate summary
			const summary = {
				totalCount: transactions.length,
				byType: {} as Record<string, { count: number; total: number }>,
				byStatus: {} as Record<string, { count: number; total: number }>,
				grandTotal: 0,
				outstandingTotal: 0,
			};

			for (const trans of transactions) {
				// By type
				if (!summary.byType[trans.Type]) {
					summary.byType[trans.Type] = { count: 0, total: 0 };
				}
				summary.byType[trans.Type].count++;
				summary.byType[trans.Type].total += trans.Gross;

				// By status
				if (!summary.byStatus[trans.Status]) {
					summary.byStatus[trans.Status] = { count: 0, total: 0 };
				}
				summary.byStatus[trans.Status].count++;
				summary.byStatus[trans.Status].total += trans.Gross;

				// Totals
				summary.grandTotal += trans.Gross;
				if (trans.Status === "OP" || trans.Status === "PA") {
					summary.outstandingTotal += trans.Gross - trans.AmtPaid;
				}
			}

			return summary;
		},
	},

	searchContacts: {
		description: "Search for contacts",
		schema: {
			query: z.string().optional(),
			type: z.enum(["C", "S", "E", "B"]).optional(),
			code: z.string().optional(),
			description: z.string().optional(),
			isActive: z.boolean().optional(),
			limit: z.number().min(1).max(100).default(50),
			offset: z.number().min(0).default(0),
		},
		async execute(args: any) {
			const search: any = {};

			if (args.code) {
				search.Code = args.code;
			} else if (args.description) {
				search.Description = args.description;
			} else if (args.query) {
				// Determine if query is likely a code or description
				if (args.query.length <= 10) {
					search.Code = args.query;
				} else {
					search.Description = args.query;
				}
			}

			if (args.type) {
				search.Type = args.type;
			}

			const result = await mockContactService.getData({
				search: Object.keys(search).length > 0 ? search : undefined,
				limit: args.limit,
				offset: args.offset,
			});

			let filteredData = result.data;

			// Apply isActive filter if specified
			if (args.isActive !== undefined) {
				filteredData = filteredData.filter(
					(contact: any) => contact.IsActive === args.isActive,
				);
			}

			return {
				contacts: filteredData,
				total: filteredData.length,
				limit: args.limit,
				offset: args.offset,
			};
		},
	},

	getContact: {
		description: "Get contact by code",
		schema: {
			code: z.string().min(1),
		},
		async execute(args: any) {
			const result = await mockContactService.getData({
				search: { Code: args.code },
				limit: 1,
				offset: 0,
			});

			if (!result.data || result.data.length === 0) {
				throw new Error(`Contact not found: ${args.code}`);
			}

			return result.data[0];
		},
	},

	listContactFields: {
		description: "List contact fields",
		schema: {},
		async execute() {
			return {
				fields: [
					"Code",
					"Description",
					"Type",
					"Address",
					"Phone",
					"Email",
					"IsActive",
				],
				description: "Available fields for contact queries and filters",
			};
		},
	},
};

// Test runner functions
async function runSingleTest(
	testName: string,
	toolName: string,
	args: any,
	description: string,
) {
	console.log(`\n${"=".repeat(80)}`);
	console.log(`🧪 Test: ${testName}`);
	console.log(`🔧 Tool: ${toolName}`);
	console.log(`📋 Description: ${description}`);
	console.log(`📥 Arguments: ${JSON.stringify(args, null, 2)}`);
	console.log(`${"=".repeat(80)}`);

	const startTime = Date.now();

	try {
		// Validate schema first
		const tool = tools[toolName as keyof typeof tools];
		if (!tool) {
			throw new Error(`Tool not found: ${toolName}`);
		}

		const schema = z.object(tool.schema);
		const validatedArgs = schema.parse(args);

		console.log("✅ Schema validation passed");

		// Execute tool
		const result = await tool.execute(validatedArgs);
		const duration = Date.now() - startTime;

		console.log(`✅ Tool executed successfully in ${duration}ms`);
		console.log("📤 Result:");
		console.log(JSON.stringify(result, null, 2));

		return { success: true, result, duration };
	} catch (error) {
		const duration = Date.now() - startTime;
		console.log(`❌ Test failed after ${duration}ms`);
		console.log(`💥 Error: ${error.message}`);

		if (error.issues) {
			console.log("📋 Validation issues:");
			for (const issue of error.issues) {
				console.log(`  - ${issue.path.join(".")}: ${issue.message}`);
			}
		}

		return { success: false, error: error.message, duration };
	}
}

async function runTestCategory(categoryName: string, category: any) {
	console.log(`\n${"#".repeat(100)}`);
	console.log(`📂 Category: ${categoryName.toUpperCase()}`);
	console.log(`${"#".repeat(100)}`);

	const results = [];

	for (const [subcategoryName, tests] of Object.entries(category)) {
		console.log(`\n📁 Subcategory: ${subcategoryName}`);

		for (const test of tests as any[]) {
			const result = await runSingleTest(
				test.name,
				test.tool,
				test.args,
				test.description,
			);

			results.push({
				category: categoryName,
				subcategory: subcategoryName,
				test: test.name,
				...result,
			});

			// Brief pause between tests
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}

	return results;
}

async function runWorkflowTest(workflowName: string, workflow: any[]) {
	console.log(`\n${"🔄".repeat(50)}`);
	console.log(`🔄 Workflow: ${workflowName}`);
	console.log(`${"🔄".repeat(50)}`);

	const results = [];
	const context: any = {};

	for (const step of workflow) {
		console.log(`\n📝 Step ${step.sequence}: ${step.name}`);

		// Replace placeholders in args with context values
		const processedArgs = { ...step.args };
		if (step.note?.includes("from step")) {
			// This is a simplified placeholder replacement
			// In a real implementation, you'd have more sophisticated context handling
			console.log(`📎 Note: ${step.note}`);
		}

		const result = await runSingleTest(
			`${workflowName} - Step ${step.sequence}`,
			step.tool,
			processedArgs,
			step.description,
		);

		results.push({
			workflow: workflowName,
			step: step.sequence,
			...result,
		});

		// Store result in context for next steps
		if (result.success) {
			context[`step${step.sequence}`] = result.result;
		}

		// Pause between workflow steps
		await new Promise((resolve) => setTimeout(resolve, 200));
	}

	return results;
}

async function generateSummaryReport(allResults: any[]) {
	console.log(`\n${"📊".repeat(50)}`);
	console.log("📊 TEST SUMMARY REPORT");
	console.log(`${"📊".repeat(50)}`);

	const total = allResults.length;
	const successful = allResults.filter((r) => r.success).length;
	const failed = allResults.filter((r) => !r.success).length;
	const avgDuration =
		allResults.reduce((sum, r) => sum + r.duration, 0) / total;

	console.log("\n📈 Overall Statistics:");
	console.log(`  Total tests: ${total}`);
	console.log(
		`  Successful: ${successful} (${((successful / total) * 100).toFixed(1)}%)`,
	);
	console.log(`  Failed: ${failed} (${((failed / total) * 100).toFixed(1)}%)`);
	console.log(`  Average duration: ${avgDuration.toFixed(0)}ms`);

	// Group by category
	const byCategory = allResults.reduce((acc, result) => {
		const cat = result.category || result.workflow || "other";
		if (!acc[cat]) acc[cat] = { total: 0, success: 0, failed: 0 };
		acc[cat].total++;
		if (result.success) acc[cat].success++;
		else acc[cat].failed++;
		return acc;
	}, {});

	console.log("\n📊 By Category:");
	for (const [category, stats] of Object.entries(byCategory) as any) {
		const successRate = ((stats.success / stats.total) * 100).toFixed(1);
		console.log(
			`  ${category}: ${stats.success}/${stats.total} (${successRate}%)`,
		);
	}

	// Show failures
	const failures = allResults.filter((r) => !r.success);
	if (failures.length > 0) {
		console.log("\n❌ Failed Tests:");
		for (const failure of failures) {
			const testId = failure.category
				? `${failure.category}.${failure.subcategory}.${failure.test}`
				: `${failure.workflow}.step${failure.step}`;
			console.log(`  - ${testId}: ${failure.error}`);
		}
	}

	console.log(`\n${"📊".repeat(50)}`);
}

// Main execution
async function main() {
	const args = process.argv.slice(2);

	console.log("🚀 MCP Tools Manual Test Runner");
	console.log("================================");
	console.log(`📅 Started at: ${new Date().toISOString()}`);

	const allResults: any[] = [];

	try {
		if (args.length === 0 || args.includes("--all")) {
			// Run all test categories
			for (const [categoryName, category] of Object.entries(
				sampleQueries.categories,
			)) {
				const results = await runTestCategory(categoryName, category);
				allResults.push(...results);
			}

			// Run workflow tests
			for (const [workflowName, workflow] of Object.entries(
				sampleQueries.workflow_examples,
			)) {
				const results = await runWorkflowTest(workflowName, workflow as any);
				allResults.push(...results);
			}
		} else {
			// Run specific categories
			for (const categoryName of args) {
				if (sampleQueries.categories[categoryName]) {
					const results = await runTestCategory(
						categoryName,
						sampleQueries.categories[categoryName],
					);
					allResults.push(...results);
				} else if (sampleQueries.workflow_examples[categoryName]) {
					const results = await runWorkflowTest(
						categoryName,
						sampleQueries.workflow_examples[categoryName],
					);
					allResults.push(...results);
				} else {
					console.log(`⚠️  Category not found: ${categoryName}`);
				}
			}
		}

		// Generate summary report
		await generateSummaryReport(allResults);
	} catch (error) {
		console.error("💥 Test runner failed:", error.message);
		process.exit(1);
	}

	console.log(`\n✅ Test run completed at: ${new Date().toISOString()}`);

	// Exit with appropriate code
	const hasFailures = allResults.some((r) => !r.success);
	process.exit(hasFailures ? 1 : 0);
}

// Run if this file is executed directly
if (import.meta.main) {
	main().catch(console.error);
}

export { main, runSingleTest, runTestCategory, runWorkflowTest };
