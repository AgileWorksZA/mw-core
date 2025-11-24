#!/usr/bin/env bun

/**
 * Compile all file metadata from agent responses
 * This script consolidates the metadata extracted by Haiku agents
 */

const allMetadata = [
	// Batch 1 (8 files)
	{
		path: "packages/api/src/app.ts",
		purpose:
			"Creates and configures the main ElysiaJS REST API application with middleware, routes, and MoneyWorks client management",
		layer: "config",
		domain: "api",
		keyConcepts: [
			"Elysia",
			"CORS",
			"Swagger",
			"JWT Bearer tokens",
			"Client caching",
			"Middleware chain",
			"MoneyWorks REST client",
		],
		architecturalPatterns: [
			"Plugin system",
			"Middleware chain",
			"Derivative context injection",
			"Client connection pooling",
		],
		exports: {
			main: "createApp",
			types: ["APIConfig"],
			functions: ["createApp"],
		},
		dependencies: {
			internal: [
				"@moneyworks/data",
				"./routes/*",
				"./middleware/*",
				"./services/*",
			],
			external: ["elysia", "@elysiajs/swagger", "@elysiajs/cors"],
		},
		relatedFiles: [
			"packages/api/src/middleware/auth.ts",
			"packages/api/src/routes/auth.ts",
		],
		queries: [
			"How is the MoneyWorks API server configured?",
			"How are MoneyWorks clients cached?",
		],
		complexity: "medium",
		importance: "critical",
	},
	{
		path: "packages/api/src/middleware/auth.ts",
		purpose:
			"Authentication middleware that validates Bearer tokens and attaches MoneyWorks client to request context",
		layer: "service",
		domain: "auth",
		keyConcepts: [
			"Bearer token validation",
			"Client caching",
			"Context injection",
		],
		architecturalPatterns: [
			"Middleware pattern",
			"Client caching",
			"Dependency injection",
		],
		exports: {
			main: "authMiddleware",
			types: [],
			functions: ["authMiddleware"],
		},
		dependencies: {
			internal: ["../services/connection-service", "@moneyworks/data"],
			external: ["elysia"],
		},
		relatedFiles: [
			"packages/api/src/services/connection-service.ts",
			"packages/api/src/app.ts",
		],
		queries: [
			"How is API authentication implemented?",
			"How are MoneyWorks clients cached?",
		],
		complexity: "medium",
		importance: "critical",
	},
	{
		path: "packages/api/src/controllers/base-table.ts",
		purpose:
			"Generic base controller for MoneyWorks table operations with export and schema discovery",
		layer: "service",
		domain: "api",
		keyConcepts: [
			"Abstract base controller",
			"Table export",
			"Schema discovery",
			"Format support",
		],
		architecturalPatterns: [
			"Template Method",
			"Abstract Factory",
			"Strategy Pattern",
		],
		exports: {
			main: "BaseTableController",
			types: ["TableExportParams"],
			functions: [],
		},
		dependencies: { internal: ["@moneyworks/data"], external: [] },
		relatedFiles: [
			"packages/api/src/controllers/tax-rate.ts",
			"packages/api/src/controllers/name.ts",
		],
		queries: [
			"How do I export table data?",
			"What export formats are supported?",
		],
		complexity: "medium",
		importance: "high",
	},
	{
		path: "packages/canonical/src/entities/tax-rates/types.ts",
		purpose:
			"Define canonical MoneyWorks tax rate entity types with strict DSL preservation",
		layer: "schema",
		domain: "canonical",
		keyConcepts: [
			"MoneyWorks DSL",
			"Tax rate entity",
			"Branded types",
			"GST terminology",
		],
		architecturalPatterns: [
			"Canonical DSL",
			"Branded types",
			"Input type separation",
		],
		exports: {
			main: null,
			types: ["MoneyWorksTaxRate", "MoneyWorksTaxRateCreateInput"],
			functions: [],
		},
		dependencies: {
			internal: ["@moneyworks/utilities", "./enums"],
			external: [],
		},
		relatedFiles: [
			"packages/canonical/src/entities/tax-rates/fields.ts",
			"packages/canonical/src/entities/tax-rates/validators.ts",
		],
		queries: [
			"What is the structure of a tax rate?",
			"How are multi-tier taxes modeled?",
		],
		complexity: "low",
		importance: "critical",
	},
	{
		path: "packages/data/src/moneyworks-now-client.ts",
		purpose:
			"HTTP client for MoneyWorks NOW cloud service authentication and file listing",
		layer: "service",
		domain: "data-access",
		keyConcepts: ["OAuth authentication", "Token refresh", "File enumeration"],
		architecturalPatterns: [
			"Client pattern",
			"Type guards",
			"Data transformation",
		],
		exports: {
			main: "MoneyWorksNOWClient",
			types: ["MoneyWorksNOWConfig"],
			functions: [],
		},
		dependencies: { internal: [], external: ["fetch"] },
		relatedFiles: ["packages/data/src/client/moneyworks-smart-client.ts"],
		queries: [
			"How to authenticate with MoneyWorks NOW?",
			"How to list available files?",
		],
		complexity: "medium",
		importance: "high",
	},
	{
		path: "packages/data/src/parsers/smart-tsv-parser.ts",
		purpose:
			"Parses headerless TSV data from MoneyWorks using discovered field structures",
		layer: "util",
		domain: "data-access",
		keyConcepts: [
			"TSV parsing",
			"field discovery",
			"type conversion",
			"headerless data",
		],
		architecturalPatterns: [
			"Field discovery",
			"Type-aware parsing",
			"Validation",
		],
		exports: {
			main: null,
			types: [],
			functions: ["parseTSVWithStructure", "parseFieldValue"],
		},
		dependencies: { internal: ["field-discovery"], external: [] },
		relatedFiles: ["packages/data/src/parsers/field-discovery.ts"],
		queries: [
			"How to parse MoneyWorks TSV without headers?",
			"How to convert field values?",
		],
		complexity: "low",
		importance: "high",
	},
	{
		path: "packages/utilities/src/types/branded.ts",
		purpose: "Defines branded types for type-safe domain primitives",
		layer: "util",
		domain: "utilities",
		keyConcepts: ["branded types", "nominal typing", "type safety"],
		architecturalPatterns: ["Brand pattern", "Nominal type system"],
		exports: {
			main: null,
			types: ["Brand", "YYYYMMDD", "AccountCode", "NameCode"],
			functions: [],
		},
		dependencies: { internal: [], external: [] },
		relatedFiles: ["packages/utilities/src/date/yyyymmdd.ts"],
		queries: [
			"How to create type-safe domain primitives?",
			"What branded types are available?",
		],
		complexity: "low",
		importance: "critical",
	},
	{
		path: "packages/mcp-server/src/index.ts",
		purpose: "Entry point for MoneyWorks MCP server with graceful shutdown",
		layer: "config",
		domain: "mcp-server",
		keyConcepts: ["MCP server", "graceful shutdown", "signal handling"],
		architecturalPatterns: ["Entry point", "Signal handling"],
		exports: { main: null, types: [], functions: [] },
		dependencies: { internal: ["./server"], external: ["node:process"] },
		relatedFiles: ["packages/mcp-server/src/tools/index.ts"],
		queries: ["How does the MCP server start?"],
		complexity: "low",
		importance: "critical",
	},
];

console.log(JSON.stringify(allMetadata, null, 2));
