import { z } from "zod";
import { SchemaService } from "../services/schema.service";
import type { TicketService } from "../services/ticket-service";

const schemaService = new SchemaService();
let ticketService: TicketService | undefined;

// Initialize ticket service
export function initializeTableSchemaTools(ticketSvc: TicketService) {
	ticketService = ticketSvc;
}

// Helper function for error tracking
async function trackError(error: unknown, toolName: string, args: unknown) {
	if (!ticketService) return;

	try {
		await ticketService.createTicket({
			type: "bug",
			severity: "medium",
			status: "open",
			user_prompt: `Tool ${toolName} failed with args: ${JSON.stringify(args)}`,
			ai_attempted_action: `Execute ${toolName}`,
			mcp_tool_used: toolName,
			error_message: error instanceof Error ? error.message : String(error),
			error_stack: error instanceof Error ? error.stack : undefined,
			session_id: process.env.SESSION_ID,
		});
	} catch (trackingError) {
		console.error("Failed to track error:", trackingError);
	}
}

// Describe table schema
const describeTableSchemaInputSchema = z.object({
	tableName: z
		.string()
		.describe(
			"The name of the table to describe (e.g., 'Account', 'Transaction', 'Name')",
		),
	includeRelationships: z
		.boolean()
		.default(true)
		.describe("Whether to include foreign key relationships"),
});

export const describeTableSchemaTool = {
	description:
		"Get the full Eden schema for a MoneyWorks table, including field types, descriptions, and constraints",
	inputSchema: describeTableSchemaInputSchema,

	async execute(args: z.infer<typeof describeTableSchemaInputSchema>) {
		try {
			const tableInfo = await schemaService.getTableSchema(args.tableName);

			const result: any = {
				tableName: tableInfo.name,
				fields: tableInfo.fields.map((field) => ({
					name: field.name,
					type: field.type,
					description: field.description,
					required: field.required,
					nullable: field.nullable,
					constraints: {
						maxLength: field.maxLength,
						minimum: field.minimum,
						maximum: field.maximum,
						enum: field.enum,
					},
				})),
				totalFields: tableInfo.fields.length,
			};

			if (args.includeRelationships) {
				const relationships = await schemaService.getTableRelationships(
					args.tableName,
				);
				result.relationships = relationships;
			}

			// Add summary statistics
			result.summary = {
				requiredFields: tableInfo.fields.filter((f) => f.required).length,
				nullableFields: tableInfo.fields.filter((f) => f.nullable).length,
				stringFields: tableInfo.fields.filter((f) => f.type === "string")
					.length,
				numericFields: tableInfo.fields.filter(
					(f) => f.type === "integer" || f.type === "number",
				).length,
				enumFields: tableInfo.fields.filter((f) => f.enum && f.enum.length > 0)
					.length,
			};

			return result;
		} catch (error) {
			await trackError(error, "describeTableSchema", args);
			throw error;
		}
	},
};

// List available tables
const listTablesInputSchema = z.object({});

export const listTablesTool = {
	description: "List all available MoneyWorks tables that can be queried",
	inputSchema: listTablesInputSchema,

	async execute() {
		try {
			const tables = await schemaService.getAvailableTables();

			// Group tables by category
			const categories = {
				core: ["account", "name", "transaction", "product"],
				financial: ["bankrecs", "payments", "ledger", "offledger"],
				operational: ["job", "jobsheet", "department", "detail"],
				inventory: ["inventory", "build"],
				system: ["general", "login", "user", "user2", "filter", "list"],
				reference: ["taxrate", "contacts"],
				assets: ["asset", "assetcat", "assetlog"],
				other: ["memo", "message", "stickies", "link", "log", "autosplit"],
			};

			const categorizedTables: Record<string, string[]> = {};

			for (const [category, tableList] of Object.entries(categories)) {
				categorizedTables[category] = tables
					.filter((t) => tableList.includes(t.toLowerCase()))
					.sort();
			}

			return {
				tables: tables.sort(),
				totalTables: tables.length,
				byCategory: categorizedTables,
				description:
					"Use describeTableSchema to get detailed information about any table",
			};
		} catch (error) {
			await trackError(error, "listTables", {});
			throw error;
		}
	},
};

// Get field metadata for a specific field
const getFieldMetadataInputSchema = z.object({
	tableName: z.string().describe("The name of the table"),
	fieldName: z.string().describe("The name of the field to get metadata for"),
});

export const getFieldMetadataTool = {
	description:
		"Get detailed metadata about a specific field in a MoneyWorks table",
	inputSchema: getFieldMetadataInputSchema,

	async execute(args: z.infer<typeof getFieldMetadataInputSchema>) {
		try {
			const tableInfo = await schemaService.getTableSchema(args.tableName);
			const field = tableInfo.fields.find(
				(f) => f.name.toLowerCase() === args.fieldName.toLowerCase(),
			);

			if (!field) {
				throw new Error(
					`Field '${args.fieldName}' not found in table '${args.tableName}'`,
				);
			}

			// Get relationships for this specific field
			const relationships = await schemaService.getTableRelationships(
				args.tableName,
			);
			const fieldRelationships = relationships.filter(
				(r) => r.field.toLowerCase() === args.fieldName.toLowerCase(),
			);

			// Analyze field usage patterns
			const usagePatterns: string[] = [];

			if (field.name === "Code" || field.name === "SequenceNumber") {
				usagePatterns.push("Primary identifier");
			}

			if (fieldRelationships.length > 0) {
				usagePatterns.push("Foreign key reference");
			}

			if (field.name.includes("Date") || field.name.includes("Time")) {
				usagePatterns.push("Temporal data");
			}

			if (
				field.name.includes("Amount") ||
				field.name.includes("Total") ||
				field.name.includes("Balance")
			) {
				usagePatterns.push("Monetary value");
			}

			if (field.enum && field.enum.length > 0) {
				usagePatterns.push("Enumerated value");
			}

			if (field.nullable) {
				usagePatterns.push("Optional field");
			}

			if (field.required) {
				usagePatterns.push("Required field");
			}

			return {
				table: args.tableName,
				field: {
					...field,
					relationships: fieldRelationships,
					usagePatterns: usagePatterns,
					examples: getFieldExamples(args.tableName, field),
				},
			};
		} catch (error) {
			await trackError(error, "getFieldMetadata", args);
			throw error;
		}
	},
};

// Helper function to get field examples
function getFieldExamples(tableName: string, field: any): string[] {
	const examples: string[] = [];

	// Add examples based on field name and type
	if (field.name === "Code") {
		switch (tableName.toLowerCase()) {
			case "account":
				examples.push("1100", "2000", "4100-01");
				break;
			case "name":
				examples.push("CUST001", "SUPP100");
				break;
			case "product":
				examples.push("WIDGET-01", "SERVICE-HOUR");
				break;
		}
	} else if (field.name === "Type" && tableName.toLowerCase() === "account") {
		examples.push("I (Income)", "E (Expense)", "A (Current Asset)");
	} else if (field.type === "string" && field.maxLength) {
		if (field.maxLength <= 10) {
			examples.push("SHORT01", "ABC123");
		} else if (field.maxLength <= 50) {
			examples.push("Sample Description", "Example Text Value");
		}
	} else if (field.enum) {
		examples.push(...(field.enum.slice(0, 3) as string[]));
	}

	return examples;
}

// Get table relationships
const getTableRelationshipsInputSchema = z.object({
	tableName: z
		.string()
		.describe("The name of the table to get relationships for"),
});

export const getTableRelationshipsTool = {
	description: "Get all foreign key relationships for a MoneyWorks table",
	inputSchema: getTableRelationshipsInputSchema,

	async execute(args: z.infer<typeof getTableRelationshipsInputSchema>) {
		try {
			const relationships = await schemaService.getTableRelationships(
				args.tableName,
			);

			// Group relationships by referenced table
			const byReferencedTable: Record<string, typeof relationships> = {};

			for (const rel of relationships) {
				if (!byReferencedTable[rel.referencedTable]) {
					byReferencedTable[rel.referencedTable] = [];
				}
				byReferencedTable[rel.referencedTable].push(rel);
			}

			return {
				tableName: args.tableName,
				relationships: relationships,
				totalRelationships: relationships.length,
				referencedTables: Object.keys(byReferencedTable),
				byReferencedTable: byReferencedTable,
				description:
					"These relationships indicate how this table connects to other tables in the MoneyWorks database",
			};
		} catch (error) {
			await trackError(error, "getTableRelationships", args);
			throw error;
		}
	},
};
