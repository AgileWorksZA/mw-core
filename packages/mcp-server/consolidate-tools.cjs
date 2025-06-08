#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

// List of table tools that need consolidation (excluding already done ones)
const tableTools = [
	"product",
	"job",
	"detail",
	"tax-rate",
	"department",
	"payment",
	"bank-rec",
	"ledger",
	"job-sheet",
	"contact",
	"inventory",
	"general",
	"login",
	"message",
	"list",
	"user",
	"filter",
	"memo",
	"user2",
	"stickie",
	"off-ledger",
	"auto-split",
	"link",
	"log",
	"asset",
	"asset-cat",
	"asset-log",
];

// Template for consolidated tool
function generateConsolidatedTool(
	tableName,
	serviceName,
	interfaceName,
	fieldsName,
) {
	const capitalizedName =
		tableName.charAt(0).toUpperCase() + tableName.slice(1);
	const toolName = `${tableName.toLowerCase()}Tool`;

	return `import { ${serviceName} } from "@moneyworks/api/src/services/tables/${tableName}.service";
import type { ${interfaceName} } from "@moneyworks/api/src/types/interface/tables/${tableName}";
import { z } from "zod";

const ${tableName}Service = new ${serviceName}();

// Consolidated ${tableName} tool schema
const ${tableName}ToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for ${tableName}s, get specific ${tableName}, or list available fields"),
	
	// Search operation parameters
	query: z
		.string()
		.optional()
		.describe("Search query (search operation only)"),
	limit: z
		.number()
		.min(1)
		.max(100)
		.default(50)
		.describe("Maximum number of results (search operation only)"),
	offset: z.number().min(0).default(0).describe("Number of results to skip (search operation only)"),
	
	// Get operation parameters (adjust based on primary key)
	sequenceNumber: z.number().optional().describe("The ${tableName} sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The ${tableName} code to retrieve (get operation only)"),
});

export const ${toolName} = {
	description: "Unified tool for ${tableName} operations: search ${tableName}s, get specific ${tableName}, or list available fields",
	inputSchema: ${tableName}ToolSchema,

	async execute(args: z.infer<typeof ${tableName}ToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<${interfaceName}> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await ${tableName}Service.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					${tableName}s: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				// Try sequence number first, then code
				let searchCriteria;
				if (args.sequenceNumber) {
					searchCriteria = { SequenceNumber: args.sequenceNumber };
				} else if (args.code) {
					searchCriteria = { Code: args.code };
				} else {
					throw new Error("Either sequenceNumber or code is required for get operation");
				}

				const result = await ${tableName}Service.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(\`${capitalizedName} not found\`);
				}

				return {
					operation: "get",
					${tableName}: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { ${fieldsName} } = await import(
					"@moneyworks/api/src/types/interface/tables/${tableName}"
				);
				return {
					operation: "listFields",
					fields: ${fieldsName},
					description: "Available fields for ${tableName} queries and filters",
				};
			}

			default:
				throw new Error(\`Unsupported operation: \${args.operation}\`);
		}
	},
};`;
}

// Function to consolidate a single tool file
function consolidateToolFile(toolName) {
	const filePath = path.join(__dirname, "src", "tools", `${toolName}.ts`);

	if (!fs.existsSync(filePath)) {
		console.log(`Skipping ${toolName}.ts - file not found`);
		return false;
	}

	try {
		// Generate names based on conventions
		const capitalizedName =
			toolName.charAt(0).toUpperCase() +
			toolName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
		const serviceName = `${capitalizedName}Service`;
		const interfaceName = capitalizedName;
		const fieldsName = `${capitalizedName}Fields`;

		// Generate consolidated content
		const consolidatedContent = generateConsolidatedTool(
			toolName.replace(/-/g, ""), // Remove hyphens for import paths
			serviceName,
			interfaceName,
			fieldsName,
		);

		// Write the consolidated file
		fs.writeFileSync(filePath, consolidatedContent);
		console.log(`✓ Consolidated ${toolName}.ts`);
		return true;
	} catch (error) {
		console.error(`✗ Failed to consolidate ${toolName}.ts:`, error.message);
		return false;
	}
}

// Main execution
console.log("Starting tool consolidation...");
let consolidated = 0;
let failed = 0;

for (const toolName of tableTools) {
	if (consolidateToolFile(toolName)) {
		consolidated++;
	} else {
		failed++;
	}
}

console.log("\nConsolidation complete:");
console.log(`✓ Successfully consolidated: ${consolidated} tools`);
console.log(`✗ Failed: ${failed} tools`);
console.log(
	`\nEstimated tool reduction: ${consolidated * 2} tools (assuming 3 → 1 consolidation)`,
);
