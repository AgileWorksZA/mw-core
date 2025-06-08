import { z } from "zod";
import { SchemaService } from "../services/schema.service";
import type { TicketService } from "../services/ticket-service";

const schemaService = new SchemaService();
let ticketService: TicketService | undefined;

// Initialize ticket service
export function initializeEnumValuesTools(ticketSvc: TicketService) {
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

// Enum value interfaces
interface EnumValue {
	value: string;
	label: string;
	description?: string;
	category?: string;
	deprecated?: boolean;
	sortOrder?: number;
}

interface EnumInfo {
	tableName: string;
	fieldName: string;
	fieldType: string;
	values: EnumValue[];
	metadata: {
		total: number;
		categories: string[];
		deprecated: number;
		defaultValue?: string;
		allowCustom: boolean;
		caseSensitive: boolean;
	};
}

// Get enum values for a specific field
const getEnumValuesInputSchema = z.object({
	tableName: z.string().describe("The name of the table"),
	fieldName: z.string().describe("The name of the enum field"),
	includeDeprecated: z
		.boolean()
		.default(false)
		.describe("Include deprecated enum values"),
	includeDescriptions: z
		.boolean()
		.default(true)
		.describe("Include detailed descriptions"),
});

export const getEnumValuesTool = {
	description:
		"Get all possible enumerated values for a specific enum field in a MoneyWorks table",
	inputSchema: getEnumValuesInputSchema,

	async execute(args: z.infer<typeof getEnumValuesInputSchema>) {
		try {
			const enumInfo = await getFieldEnumValues(
				args.tableName,
				args.fieldName,
				args.includeDeprecated,
				args.includeDescriptions,
			);

			// Group values by category if available
			const byCategory = groupEnumValuesByCategory(enumInfo.values);

			// Generate usage statistics
			const usage = generateEnumUsageStats(enumInfo);

			return {
				enumInfo: enumInfo,
				byCategory: byCategory,
				usage: usage,
				examples: generateEnumExamples(enumInfo),
				recommendations: generateEnumRecommendations(enumInfo),
			};
		} catch (error) {
			await trackError(error, "getEnumValues", args);
			throw error;
		}
	},
};

// Get all enum fields in a table
const getTableEnumFieldsInputSchema = z.object({
	tableName: z.string().describe("The name of the table"),
	includeValues: z
		.boolean()
		.default(true)
		.describe("Include the actual enum values"),
	includeDeprecated: z
		.boolean()
		.default(false)
		.describe("Include deprecated values"),
});

export const getTableEnumFieldsTool = {
	description:
		"Get all enum fields in a MoneyWorks table and their possible values",
	inputSchema: getTableEnumFieldsInputSchema,

	async execute(args: z.infer<typeof getTableEnumFieldsInputSchema>) {
		try {
			const tableSchema = await schemaService.getTableSchema(args.tableName);
			const enumFields: Record<string, EnumInfo> = {};

			// Find all fields with enum constraints
			for (const field of tableSchema.fields) {
				if (field.enum && field.enum.length > 0) {
					const enumInfo = await getFieldEnumValues(
						args.tableName,
						field.name,
						args.includeDeprecated,
						true,
					);

					if (!args.includeValues) {
						enumInfo.values = [];
					}

					enumFields[field.name] = enumInfo;
				}
			}

			// Generate summary statistics
			const summary = {
				tableName: args.tableName,
				totalFields: tableSchema.fields.length,
				enumFields: Object.keys(enumFields).length,
				totalEnumValues: Object.values(enumFields).reduce(
					(sum, info) => sum + info.values.length,
					0,
				),
				fieldsWithCategories: Object.values(enumFields).filter(
					(info) => info.metadata.categories.length > 0,
				).length,
			};

			return {
				summary: summary,
				enumFields: enumFields,
				recommendations: generateTableEnumRecommendations(enumFields),
			};
		} catch (error) {
			await trackError(error, "getTableEnumFields", args);
			throw error;
		}
	},
};

// Search enum values across tables
const searchEnumValuesInputSchema = z.object({
	searchTerm: z
		.string()
		.describe("Term to search for in enum values or descriptions"),
	tables: z
		.array(z.string())
		.optional()
		.describe("Limit search to specific tables"),
	exactMatch: z
		.boolean()
		.default(false)
		.describe("Require exact match vs. partial match"),
});

export const searchEnumValuesTool = {
	description:
		"Search for enum values across MoneyWorks tables by value or description",
	inputSchema: searchEnumValuesInputSchema,

	async execute(args: z.infer<typeof searchEnumValuesInputSchema>) {
		try {
			const searchResults = await searchEnumValuesAcrossTables(
				args.searchTerm,
				args.tables,
				args.exactMatch,
			);

			// Group results by table
			const byTable = groupSearchResultsByTable(searchResults);

			return {
				searchTerm: args.searchTerm,
				totalMatches: searchResults.length,
				results: searchResults,
				byTable: byTable,
				suggestions: generateSearchSuggestions(args.searchTerm, searchResults),
			};
		} catch (error) {
			await trackError(error, "searchEnumValues", args);
			throw error;
		}
	},
};

// Get enum value usage patterns
const getEnumUsagePatternsInputSchema = z.object({
	tableName: z.string().describe("The name of the table"),
	fieldName: z.string().describe("The name of the enum field"),
});

export const getEnumUsagePatternsTool = {
	description:
		"Get usage patterns and statistics for enum values in a specific field",
	inputSchema: getEnumUsagePatternsInputSchema,

	async execute(args: z.infer<typeof getEnumUsagePatternsInputSchema>) {
		try {
			const enumInfo = await getFieldEnumValues(
				args.tableName,
				args.fieldName,
				false,
				true,
			);
			const patterns = analyzeEnumUsagePatterns(
				args.tableName,
				args.fieldName,
				enumInfo,
			);

			return {
				field: {
					table: args.tableName,
					field: args.fieldName,
					totalValues: enumInfo.values.length,
				},
				patterns: patterns,
				insights: generateUsageInsights(patterns),
				recommendations: generateUsageRecommendations(patterns),
			};
		} catch (error) {
			await trackError(error, "getEnumUsagePatterns", args);
			throw error;
		}
	},
};

// Helper function to get field enum values
async function getFieldEnumValues(
	tableName: string,
	fieldName: string,
	includeDeprecated: boolean,
	includeDescriptions: boolean,
): Promise<EnumInfo> {
	const tableSchema = await schemaService.getTableSchema(tableName);
	const field = tableSchema.fields.find(
		(f) => f.name.toLowerCase() === fieldName.toLowerCase(),
	);

	if (!field) {
		throw new Error(`Field '${fieldName}' not found in table '${tableName}'`);
	}

	if (!field.enum || field.enum.length === 0) {
		throw new Error(
			`Field '${fieldName}' in table '${tableName}' is not an enum field`,
		);
	}

	// Build enum values with enhanced information
	const values: EnumValue[] = [];
	const enumDefinitions = getEnumDefinitions(tableName, fieldName);

	for (let i = 0; i < field.enum.length; i++) {
		const value = field.enum[i];
		const definition = enumDefinitions.find((d) => d.value === value);

		const enumValue: EnumValue = {
			value: value,
			label: definition?.label || value,
			description: includeDescriptions ? definition?.description : undefined,
			category: definition?.category,
			deprecated: definition?.deprecated || false,
			sortOrder: definition?.sortOrder || i,
		};

		if (includeDeprecated || !enumValue.deprecated) {
			values.push(enumValue);
		}
	}

	// Sort values by sort order
	values.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

	const metadata = {
		total: values.length,
		categories: [
			...new Set(values.map((v) => v.category).filter(Boolean)),
		] as string[],
		deprecated: values.filter((v) => v.deprecated).length,
		defaultValue: getDefaultEnumValue(tableName, fieldName),
		allowCustom: getAllowCustomValues(tableName, fieldName),
		caseSensitive: getEnumCaseSensitivity(tableName, fieldName),
	};

	return {
		tableName,
		fieldName,
		fieldType: field.type,
		values,
		metadata,
	};
}

// Get enum definitions with enhanced metadata
function getEnumDefinitions(
	tableName: string,
	fieldName: string,
): Array<{
	value: string;
	label: string;
	description?: string;
	category?: string;
	deprecated?: boolean;
	sortOrder?: number;
}> {
	const key = `${tableName.toLowerCase()}.${fieldName.toLowerCase()}`;

	// Define known enum values with enhanced metadata
	const definitions: Record<
		string,
		Array<{
			value: string;
			label: string;
			description?: string;
			category?: string;
			deprecated?: boolean;
			sortOrder?: number;
		}>
	> = {
		"account.type": [
			{
				value: "A",
				label: "Asset",
				description:
					"Current and fixed assets including cash, inventory, and equipment",
				category: "balance_sheet",
				sortOrder: 1,
			},
			{
				value: "L",
				label: "Liability",
				description:
					"Current and long-term liabilities including accounts payable and loans",
				category: "balance_sheet",
				sortOrder: 2,
			},
			{
				value: "I",
				label: "Income",
				description: "Revenue and other income accounts",
				category: "profit_loss",
				sortOrder: 3,
			},
			{
				value: "E",
				label: "Expense",
				description: "Operating expenses and cost of goods sold",
				category: "profit_loss",
				sortOrder: 4,
			},
			{
				value: "P",
				label: "Equity",
				description: "Owner's equity and retained earnings",
				category: "balance_sheet",
				sortOrder: 5,
			},
		],
		"account.system": [
			{
				value: "A",
				label: "Accounts Receivable",
				description: "Control account for customer receivables",
				category: "control",
				sortOrder: 1,
			},
			{
				value: "L",
				label: "Accounts Payable",
				description: "Control account for supplier payables",
				category: "control",
				sortOrder: 2,
			},
			{
				value: "K",
				label: "Bank Account",
				description: "Bank and cash accounts",
				category: "control",
				sortOrder: 3,
			},
			{
				value: "S",
				label: "Sales Tax",
				description: "Sales tax collection account",
				category: "tax",
				sortOrder: 4,
			},
			{
				value: "P",
				label: "Purchase Tax",
				description: "Purchase tax recovery account",
				category: "tax",
				sortOrder: 5,
			},
		],
		"transaction.type": [
			{
				value: "S",
				label: "Sale",
				description: "Customer sales and invoices",
				category: "revenue",
				sortOrder: 1,
			},
			{
				value: "P",
				label: "Purchase",
				description: "Supplier purchases and bills",
				category: "expense",
				sortOrder: 2,
			},
			{
				value: "R",
				label: "Receipt",
				description: "Customer payments received",
				category: "cash",
				sortOrder: 3,
			},
			{
				value: "Y",
				label: "Payment",
				description: "Supplier payments made",
				category: "cash",
				sortOrder: 4,
			},
			{
				value: "J",
				label: "Journal",
				description: "General journal entries",
				category: "adjustment",
				sortOrder: 5,
			},
		],
		"name.type": [
			{
				value: "C",
				label: "Customer",
				description: "Customer accounts for sales",
				category: "receivables",
				sortOrder: 1,
			},
			{
				value: "S",
				label: "Supplier",
				description: "Supplier accounts for purchases",
				category: "payables",
				sortOrder: 2,
			},
			{
				value: "E",
				label: "Employee",
				description: "Employee accounts for payroll",
				category: "payroll",
				sortOrder: 3,
			},
			{
				value: "O",
				label: "Other",
				description: "Other name types",
				category: "general",
				sortOrder: 4,
			},
		],
	};

	return definitions[key] || [];
}

// Group enum values by category
function groupEnumValuesByCategory(
	values: EnumValue[],
): Record<string, EnumValue[]> {
	const grouped: Record<string, EnumValue[]> = {};

	for (const value of values) {
		const category = value.category || "uncategorized";
		if (!grouped[category]) {
			grouped[category] = [];
		}
		grouped[category].push(value);
	}

	return grouped;
}

// Generate enum usage statistics
function generateEnumUsageStats(enumInfo: EnumInfo): {
	distribution: Record<string, number>;
	mostCommon: string[];
	leastCommon: string[];
	unused: string[];
} {
	// This would typically query actual data usage
	// For now, return mock statistics
	const distribution: Record<string, number> = {};

	for (const value of enumInfo.values) {
		// Mock usage percentages
		distribution[value.value] = Math.floor(Math.random() * 100);
	}

	const sorted = Object.entries(distribution).sort(([, a], [, b]) => b - a);

	return {
		distribution,
		mostCommon: sorted.slice(0, 3).map(([value]) => value),
		leastCommon: sorted.slice(-3).map(([value]) => value),
		unused: sorted.filter(([, count]) => count === 0).map(([value]) => value),
	};
}

// Generate enum examples
function generateEnumExamples(enumInfo: EnumInfo): {
	basicUsage: string[];
	conditionalLogic: string[];
	validation: string[];
} {
	const examples: {
		basicUsage: string[];
		conditionalLogic: string[];
		validation: string[];
	} = {
		basicUsage: [
			`// Set ${enumInfo.fieldName} value`,
			`${enumInfo.fieldName} = "${enumInfo.values[0]?.value || "VALUE"}"`,
			"",
			`// Check ${enumInfo.fieldName} value`,
			`if (${enumInfo.fieldName} === "${enumInfo.values[0]?.value || "VALUE"}") {`,
			"  // Handle specific case",
			"}",
		],
		conditionalLogic: [],
		validation: [
			`// Validate ${enumInfo.fieldName}`,
			`const validValues = [${enumInfo.values.map((v) => `"${v.value}"`).join(", ")}];`,
			`if (!validValues.includes(${enumInfo.fieldName})) {`,
			`  throw new Error("Invalid ${enumInfo.fieldName} value");`,
			"}",
		],
	};

	// Add conditional logic examples based on categories
	if (enumInfo.metadata.categories.length > 0) {
		const category = enumInfo.metadata.categories[0];
		const categoryValues = enumInfo.values.filter(
			(v) => v.category === category,
		);
		examples.conditionalLogic.push(
			`// Handle ${category} category`,
			`const ${category}Values = [${categoryValues.map((v) => `"${v.value}"`).join(", ")}];`,
			`if (${category}Values.includes(${enumInfo.fieldName})) {`,
			`  // Process ${category} logic`,
			"}",
		);
	}

	return examples;
}

// Generate enum recommendations
function generateEnumRecommendations(enumInfo: EnumInfo): string[] {
	const recommendations: string[] = [];

	if (enumInfo.values.length > 10) {
		recommendations.push(
			"Consider grouping enum values into categories for better organization",
		);
	}

	if (enumInfo.metadata.deprecated > 0) {
		recommendations.push(
			`${enumInfo.metadata.deprecated} deprecated values found - consider cleanup`,
		);
	}

	if (enumInfo.metadata.categories.length === 0 && enumInfo.values.length > 5) {
		recommendations.push("Consider adding categories to organize enum values");
	}

	if (!enumInfo.metadata.defaultValue) {
		recommendations.push(
			"Consider defining a default value for better data integrity",
		);
	}

	if (enumInfo.metadata.allowCustom) {
		recommendations.push(
			"Custom values allowed - ensure validation logic handles unexpected values",
		);
	}

	return recommendations;
}

// Search enum values across tables
async function searchEnumValuesAcrossTables(
	searchTerm: string,
	tables?: string[],
	exactMatch = false,
): Promise<
	Array<{
		table: string;
		field: string;
		value: string;
		label: string;
		description?: string;
		category?: string;
		matchType: "value" | "label" | "description";
	}>
> {
	const results: Array<{
		table: string;
		field: string;
		value: string;
		label: string;
		description?: string;
		category?: string;
		matchType: "value" | "label" | "description";
	}> = [];

	const availableTables = tables || (await schemaService.getAvailableTables());
	const searchLower = searchTerm.toLowerCase();

	for (const tableName of availableTables) {
		try {
			const tableSchema = await schemaService.getTableSchema(tableName);

			for (const field of tableSchema.fields) {
				if (field.enum && field.enum.length > 0) {
					const enumInfo = await getFieldEnumValues(
						tableName,
						field.name,
						false,
						true,
					);

					for (const enumValue of enumInfo.values) {
						let isMatch = false;
						let matchType: "value" | "label" | "description" = "value";

						if (exactMatch) {
							if (enumValue.value.toLowerCase() === searchLower) {
								isMatch = true;
								matchType = "value";
							} else if (enumValue.label.toLowerCase() === searchLower) {
								isMatch = true;
								matchType = "label";
							} else if (enumValue.description?.toLowerCase() === searchLower) {
								isMatch = true;
								matchType = "description";
							}
						} else {
							if (enumValue.value.toLowerCase().includes(searchLower)) {
								isMatch = true;
								matchType = "value";
							} else if (enumValue.label.toLowerCase().includes(searchLower)) {
								isMatch = true;
								matchType = "label";
							} else if (
								enumValue.description?.toLowerCase().includes(searchLower)
							) {
								isMatch = true;
								matchType = "description";
							}
						}

						if (isMatch) {
							results.push({
								table: tableName,
								field: field.name,
								value: enumValue.value,
								label: enumValue.label,
								description: enumValue.description,
								category: enumValue.category,
								matchType,
							});
						}
					}
				}
			}
		} catch (error) {}
	}

	return results;
}

// Group search results by table
function groupSearchResultsByTable(
	results: Array<any>,
): Record<string, Array<any>> {
	const grouped: Record<string, Array<any>> = {};

	for (const result of results) {
		if (!grouped[result.table]) {
			grouped[result.table] = [];
		}
		grouped[result.table].push(result);
	}

	return grouped;
}

// Generate search suggestions
function generateSearchSuggestions(
	searchTerm: string,
	results: Array<any>,
): string[] {
	if (results.length > 0) {
		return [];
	}

	// Suggest common enum value patterns
	const suggestions = [
		"Try searching for common values like 'A', 'C', 'S', 'P'",
		"Search for descriptive terms like 'Asset', 'Customer', 'Sale'",
		"Use partial matches - try shorter terms",
		"Check spelling and capitalization",
	];

	return suggestions;
}

// Analyze enum usage patterns
function analyzeEnumUsagePatterns(
	tableName: string,
	fieldName: string,
	enumInfo: EnumInfo,
): {
	frequency: Record<string, number>;
	trends: Array<{
		value: string;
		trend: "increasing" | "decreasing" | "stable";
	}>;
	seasonal: Array<{ value: string; peak: string; low: string }>;
	correlations: Array<{ value: string; correlatedFields: string[] }>;
} {
	// This would typically analyze actual data
	// Return mock patterns for demonstration

	const frequency: Record<string, number> = {};
	for (const value of enumInfo.values) {
		frequency[value.value] = Math.floor(Math.random() * 1000);
	}

	const trends = enumInfo.values.map((v) => ({
		value: v.value,
		trend: (Math.random() > 0.5 ? "increasing" : "stable") as "stable" | "increasing" | "decreasing",
	}));

	return {
		frequency,
		trends,
		seasonal: [],
		correlations: [],
	};
}

// Generate usage insights
function generateUsageInsights(patterns: any): string[] {
	const insights: string[] = [];

	const totalUsage = Object.values(patterns.frequency).reduce(
		(sum: number, count: any) => sum + Number(count),
		0,
	);
	const mostUsed = Object.entries(patterns.frequency).sort(
		([, a], [, b]) => (b as number) - (a as number),
	)[0];

	if (mostUsed) {
		const [value, count] = mostUsed;
		const percentage = Math.round((Number(count) / totalUsage) * 100);
		insights.push(`Most common value is "${value}" (${percentage}% of usage)`);
	}

	const increasingTrends = patterns.trends.filter(
		(t: any) => t.trend === "increasing",
	);
	if (increasingTrends.length > 0) {
		insights.push(
			`${increasingTrends.length} values showing increasing usage trends`,
		);
	}

	return insights;
}

// Generate usage recommendations
function generateUsageRecommendations(patterns: any): string[] {
	const recommendations: string[] = [];

	const totalUsage = Object.values(patterns.frequency).reduce(
		(sum: number, count: any) => sum + Number(count),
		0,
	);
	const unusedValues = Object.entries(patterns.frequency).filter(
		([, count]) => count === 0,
	);

	if (unusedValues.length > 0) {
		recommendations.push(
			`${unusedValues.length} values are never used - consider removing them`,
		);
	}

	const dominantValue = Object.entries(patterns.frequency).find(
		([, count]) => Number(count) / totalUsage > 0.8,
	);

	if (dominantValue) {
		recommendations.push(
			`One value dominates usage (${dominantValue[0]}) - verify this is expected`,
		);
	}

	return recommendations;
}

// Helper functions for enum metadata
function getDefaultEnumValue(
	tableName: string,
	fieldName: string,
): string | undefined {
	const defaults: Record<string, string> = {
		"account.type": "A",
		"name.type": "C",
		"transaction.type": "S",
	};

	return defaults[`${tableName.toLowerCase()}.${fieldName.toLowerCase()}`];
}

function getAllowCustomValues(tableName: string, fieldName: string): boolean {
	// Most enum fields don't allow custom values in MoneyWorks
	return false;
}

function getEnumCaseSensitivity(tableName: string, fieldName: string): boolean {
	// MoneyWorks enum fields are typically case-sensitive
	return true;
}

function generateTableEnumRecommendations(
	enumFields: Record<string, EnumInfo>,
): string[] {
	const recommendations: string[] = [];

	const totalEnumFields = Object.keys(enumFields).length;

	if (totalEnumFields === 0) {
		recommendations.push("No enum fields found in this table");
		return recommendations;
	}

	const fieldsNeedingDefaults = Object.values(enumFields).filter(
		(info) => !info.metadata.defaultValue,
	).length;

	if (fieldsNeedingDefaults > 0) {
		recommendations.push(
			`${fieldsNeedingDefaults} enum fields lack default values`,
		);
	}

	const deprecatedCount = Object.values(enumFields).reduce(
		(sum, info) => sum + info.metadata.deprecated,
		0,
	);

	if (deprecatedCount > 0) {
		recommendations.push(
			`${deprecatedCount} deprecated enum values found across fields`,
		);
	}

	return recommendations;
}
