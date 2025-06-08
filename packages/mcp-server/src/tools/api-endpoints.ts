import { z } from "zod";
import type { TicketService } from "../services/ticket-service";

let ticketService: TicketService | undefined;

// Initialize ticket service
export function initializeApiEndpointsTools(ticketSvc: TicketService) {
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

// API endpoint information
interface ApiEndpoint {
	path: string;
	method: string;
	description: string;
	parameters?: Array<{
		name: string;
		type: string;
		required: boolean;
		description: string;
		location: "path" | "query" | "body";
	}>;
	responseType: string;
	category: string;
	requiresAuth: boolean;
}

// List all available endpoints
const listEndpointsInputSchema = z.object({
	category: z
		.string()
		.optional()
		.describe(
			"Filter endpoints by category (tables, system, metadata, evaluate, reports)",
		),
	method: z
		.enum(["GET", "POST", "PUT", "DELETE"])
		.optional()
		.describe("Filter by HTTP method"),
});

export const listEndpointsTool = {
	description:
		"List all available MoneyWorks API endpoints and their basic information",
	inputSchema: listEndpointsInputSchema,

	async execute(args: z.infer<typeof listEndpointsInputSchema>) {
		try {
			const endpoints = getAllEndpoints();

			let filteredEndpoints = endpoints;

			if (args.category) {
				const category = args.category.toLowerCase();
				filteredEndpoints = endpoints.filter((e) =>
					e.category.toLowerCase().includes(category),
				);
			}

			if (args.method) {
				filteredEndpoints = filteredEndpoints.filter(
					(e) => e.method === args.method,
				);
			}

			// Group by category
			const byCategory: Record<string, ApiEndpoint[]> = {};

			for (const endpoint of filteredEndpoints) {
				if (!byCategory[endpoint.category]) {
					byCategory[endpoint.category] = [];
				}
				byCategory[endpoint.category].push(endpoint);
			}

			// Sort endpoints within each category
			for (const category of Object.keys(byCategory)) {
				byCategory[category].sort((a, b) => a.path.localeCompare(b.path));
			}

			return {
				endpoints: filteredEndpoints.map((e) => ({
					path: e.path,
					method: e.method,
					description: e.description,
					category: e.category,
					requiresAuth: e.requiresAuth,
				})),
				totalEndpoints: filteredEndpoints.length,
				byCategory: byCategory,
				summary: {
					totalAvailable: endpoints.length,
					filtered: filteredEndpoints.length,
					categories: Object.keys(byCategory),
					methods: [...new Set(filteredEndpoints.map((e) => e.method))].sort(),
				},
			};
		} catch (error) {
			await trackError(error, "listEndpoints", args);
			throw error;
		}
	},
};

// Describe a specific endpoint
const describeEndpointInputSchema = z.object({
	path: z
		.string()
		.describe(
			"The API endpoint path (e.g., '/tables/{table}/search', '/system/company-info')",
		),
	method: z
		.enum(["GET", "POST", "PUT", "DELETE"])
		.optional()
		.describe("HTTP method (defaults to most common for the path)"),
});

export const describeEndpointTool = {
	description:
		"Get detailed information about a specific MoneyWorks API endpoint including parameters and response schema",
	inputSchema: describeEndpointInputSchema,

	async execute(args: z.infer<typeof describeEndpointInputSchema>) {
		try {
			const endpoints = getAllEndpoints();

			let endpoint = endpoints.find(
				(e) =>
					e.path === args.path && (!args.method || e.method === args.method),
			);

			if (!endpoint && !args.method) {
				// Try to find any endpoint with this path
				endpoint = endpoints.find((e) => e.path === args.path);
			}

			if (!endpoint) {
				throw new Error(
					`Endpoint not found: ${args.method || "ANY"} ${args.path}`,
				);
			}

			// Provide usage examples
			const examples = getEndpointExamples(endpoint);

			return {
				endpoint: {
					...endpoint,
					examples: examples,
					relatedEndpoints: getRelatedEndpoints(endpoint, endpoints),
				},
			};
		} catch (error) {
			await trackError(error, "describeEndpoint", args);
			throw error;
		}
	},
};

// Get all endpoints definition
function getAllEndpoints(): ApiEndpoint[] {
	return [
		// Table endpoints
		{
			path: "/tables/{table}/search",
			method: "POST",
			description:
				"Search for records in a specific table with filters and pagination",
			parameters: [
				{
					name: "table",
					type: "string",
					required: true,
					description: "Table name (e.g., Account, Name, Transaction)",
					location: "path",
				},
				{
					name: "query",
					type: "object",
					required: false,
					description: "Search filters and conditions",
					location: "body",
				},
				{
					name: "limit",
					type: "number",
					required: false,
					description: "Maximum number of results (default: 50)",
					location: "body",
				},
				{
					name: "offset",
					type: "number",
					required: false,
					description: "Number of results to skip (default: 0)",
					location: "body",
				},
			],
			responseType: "SearchResult<T>",
			category: "tables",
			requiresAuth: true,
		},
		{
			path: "/tables/{table}/{id}",
			method: "GET",
			description: "Get a single record by its primary identifier",
			parameters: [
				{
					name: "table",
					type: "string",
					required: true,
					description: "Table name",
					location: "path",
				},
				{
					name: "id",
					type: "string|number",
					required: true,
					description: "Record identifier (Code or SequenceNumber)",
					location: "path",
				},
			],
			responseType: "TableRecord<T>",
			category: "tables",
			requiresAuth: true,
		},
		{
			path: "/tables/{table}/fields",
			method: "GET",
			description: "List all available fields for a table",
			parameters: [
				{
					name: "table",
					type: "string",
					required: true,
					description: "Table name",
					location: "path",
				},
			],
			responseType: "FieldList",
			category: "tables",
			requiresAuth: true,
		},

		// System endpoints
		{
			path: "/system/company-info",
			method: "GET",
			description:
				"Get company information including name, address, and configuration",
			parameters: [],
			responseType: "CompanyInfo",
			category: "system",
			requiresAuth: true,
		},
		{
			path: "/system/labels",
			method: "GET",
			description:
				"Get system labels for tables and fields in specified language",
			parameters: [
				{
					name: "table",
					type: "string",
					required: true,
					description: "Table name",
					location: "query",
				},
				{
					name: "language",
					type: "string",
					required: false,
					description: "Language code (default: 'en')",
					location: "query",
				},
			],
			responseType: "SystemLabels",
			category: "system",
			requiresAuth: true,
		},
		{
			path: "/system/info",
			method: "GET",
			description:
				"Get MoneyWorks system information including version and capabilities",
			parameters: [],
			responseType: "SystemInfo",
			category: "system",
			requiresAuth: true,
		},

		// Metadata endpoints
		{
			path: "/metadata/schema/{table}",
			method: "GET",
			description:
				"Get the Eden schema definition for a table including types and constraints",
			parameters: [
				{
					name: "table",
					type: "string",
					required: true,
					description: "Table name",
					location: "path",
				},
				{
					name: "includeRelationships",
					type: "boolean",
					required: false,
					description: "Include foreign key relationships",
					location: "query",
				},
			],
			responseType: "TableSchema",
			category: "metadata",
			requiresAuth: true,
		},
		{
			path: "/metadata/tables",
			method: "GET",
			description: "List all available tables with categorization",
			parameters: [],
			responseType: "TableList",
			category: "metadata",
			requiresAuth: true,
		},
		{
			path: "/metadata/field/{table}/{field}",
			method: "GET",
			description: "Get detailed metadata for a specific field",
			parameters: [
				{
					name: "table",
					type: "string",
					required: true,
					description: "Table name",
					location: "path",
				},
				{
					name: "field",
					type: "string",
					required: true,
					description: "Field name",
					location: "path",
				},
			],
			responseType: "FieldMetadata",
			category: "metadata",
			requiresAuth: true,
		},
		{
			path: "/metadata/relationships/{table}",
			method: "GET",
			description: "Get foreign key relationships for a table",
			parameters: [
				{
					name: "table",
					type: "string",
					required: true,
					description: "Table name",
					location: "path",
				},
			],
			responseType: "TableRelationships",
			category: "metadata",
			requiresAuth: true,
		},
		{
			path: "/metadata/validation/{table}/{field}",
			method: "GET",
			description: "Get validation rules for a specific field",
			parameters: [
				{
					name: "table",
					type: "string",
					required: true,
					description: "Table name",
					location: "path",
				},
				{
					name: "field",
					type: "string",
					required: true,
					description: "Field name",
					location: "path",
				},
			],
			responseType: "ValidationRules",
			category: "metadata",
			requiresAuth: true,
		},
		{
			path: "/metadata/enums/{table}/{field}",
			method: "GET",
			description: "Get enumerated values for enum fields",
			parameters: [
				{
					name: "table",
					type: "string",
					required: true,
					description: "Table name",
					location: "path",
				},
				{
					name: "field",
					type: "string",
					required: true,
					description: "Field name",
					location: "path",
				},
			],
			responseType: "EnumValues",
			category: "metadata",
			requiresAuth: true,
		},

		// Evaluate endpoints
		{
			path: "/evaluate/expression",
			method: "POST",
			description: "Evaluate a MWScript expression",
			parameters: [
				{
					name: "expression",
					type: "string",
					required: true,
					description: "MWScript expression to evaluate",
					location: "body",
				},
				{
					name: "context",
					type: "object",
					required: false,
					description: "Context variables for evaluation",
					location: "body",
				},
			],
			responseType: "EvaluationResult",
			category: "evaluate",
			requiresAuth: true,
		},
		{
			path: "/evaluate/template",
			method: "POST",
			description: "Evaluate a MWScript template with variable substitution",
			parameters: [
				{
					name: "template",
					type: "string",
					required: true,
					description: "Template string with placeholders",
					location: "body",
				},
				{
					name: "variables",
					type: "object",
					required: true,
					description: "Variables for template substitution",
					location: "body",
				},
			],
			responseType: "TemplateResult",
			category: "evaluate",
			requiresAuth: true,
		},

		// Reports endpoints
		{
			path: "/reports",
			method: "GET",
			description: "List all available reports",
			parameters: [
				{
					name: "category",
					type: "string",
					required: false,
					description: "Filter by report category",
					location: "query",
				},
			],
			responseType: "ReportList",
			category: "reports",
			requiresAuth: true,
		},
		{
			path: "/reports/{reportId}/run",
			method: "POST",
			description: "Run a specific report with parameters",
			parameters: [
				{
					name: "reportId",
					type: "string",
					required: true,
					description: "Report identifier",
					location: "path",
				},
				{
					name: "parameters",
					type: "object",
					required: false,
					description: "Report parameters",
					location: "body",
				},
				{
					name: "format",
					type: "string",
					required: false,
					description: "Output format (HTML, PDF, CSV)",
					location: "body",
				},
			],
			responseType: "ReportOutput",
			category: "reports",
			requiresAuth: true,
		},
	];
}

// Get usage examples for an endpoint
function getEndpointExamples(endpoint: ApiEndpoint): Array<{
	title: string;
	description: string;
	request: object;
	response?: object;
}> {
	const examples: Array<{
		title: string;
		description: string;
		request: object;
		response?: object;
	}> = [];

	switch (endpoint.path) {
		case "/tables/{table}/search":
			examples.push({
				title: "Search accounts by code",
				description: "Find accounts with codes starting with '1'",
				request: {
					path: "/tables/Account/search",
					body: {
						query: { Code: { startsWith: "1" } },
						limit: 10,
					},
				},
				response: {
					results: [{ Code: "1100", Description: "Cash at Bank" }],
					total: 15,
					limit: 10,
					offset: 0,
				},
			});
			break;

		case "/tables/{table}/{id}":
			examples.push({
				title: "Get account by code",
				description: "Retrieve a specific account",
				request: {
					path: "/tables/Account/1100",
				},
				response: {
					Code: "1100",
					Description: "Cash at Bank",
					Type: "A",
				},
			});
			break;

		case "/system/company-info":
			examples.push({
				title: "Get company information",
				description: "Retrieve basic company details",
				request: {
					path: "/system/company-info",
				},
				response: {
					name: "ACME Corporation",
					address: "123 Main St",
					currency: "USD",
				},
			});
			break;

		case "/evaluate/expression":
			examples.push({
				title: "Evaluate calculation",
				description: "Calculate tax amount",
				request: {
					path: "/evaluate/expression",
					body: {
						expression: "Amount * TaxRate / 100",
						context: { Amount: 1000, TaxRate: 8.25 },
					},
				},
				response: {
					result: 82.5,
					type: "number",
				},
			});
			break;
	}

	return examples;
}

// Get related endpoints
function getRelatedEndpoints(
	endpoint: ApiEndpoint,
	allEndpoints: ApiEndpoint[],
): Array<{
	path: string;
	method: string;
	relationship: string;
}> {
	const related: Array<{
		path: string;
		method: string;
		relationship: string;
	}> = [];

	// Find endpoints in the same category
	const sameCategory = allEndpoints.filter(
		(e) => e.category === endpoint.category && e.path !== endpoint.path,
	);

	for (const ep of sameCategory.slice(0, 3)) {
		related.push({
			path: ep.path,
			method: ep.method,
			relationship: "same category",
		});
	}

	// Find complementary endpoints
	if (endpoint.path.includes("/search")) {
		const getEndpoint = allEndpoints.find(
			(e) =>
				e.path.includes("/{id}") &&
				e.path.includes(endpoint.path.split("/")[2]),
		);
		if (getEndpoint) {
			related.push({
				path: getEndpoint.path,
				method: getEndpoint.method,
				relationship: "individual record retrieval",
			});
		}
	}

	return related;
}
