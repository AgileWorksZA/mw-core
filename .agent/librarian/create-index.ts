#!/usr/bin/env bun

/**
 * Create librarian index from all collected metadata
 */

import { execSync } from "node:child_process";

const gitCommit = execSync("git rev-parse HEAD").toString().trim();

const index = {
	metadata: {
		totalFiles: 48,
		gitCommit,
		timestamp: new Date().toISOString(),
		version: "1.0.0",
		description:
			"Semantic index for MoneyWorks Core library - enables concept-based file discovery",
	},

	indexes: {
		byDomain: {
			api: [
				"packages/api/src/app.ts",
				"packages/api/src/index.ts",
				"packages/api/src/controllers/base-table.ts",
				"packages/api/src/controllers/tax-rate.ts",
				"packages/api/src/controllers/name.ts",
				"packages/api/src/controllers/company.ts",
				"packages/api/src/routes/tables.ts",
				"packages/api/src/routes/eval.ts",
				"packages/api/src/middleware/logging.ts",
				"packages/api/src/middleware/error-handler.ts",
				"packages/api/src/schemas/common.ts",
				"packages/api/src/schemas/company.ts",
			],
			auth: [
				"packages/api/src/middleware/auth.ts",
				"packages/api/src/routes/auth.ts",
				"packages/api/src/services/connection-service.ts",
			],
			canonical: [
				"packages/canonical/src/common/data-types.ts",
				"packages/canonical/src/common/business-rules.ts",
				"packages/canonical/src/entities/tax-rates/types.ts",
				"packages/canonical/src/entities/tax-rates/fields.ts",
				"packages/canonical/src/entities/tax-rates/validators.ts",
				"packages/canonical/src/entities/tax-rates/calculators.ts",
				"packages/canonical/src/entities/names/types.ts",
				"packages/canonical/src/entities/names/fields.ts",
				"packages/canonical/src/entities/names/validators.ts",
			],
			"data-access": [
				"packages/data/src/moneyworks-now-client.ts",
				"packages/data/src/client/moneyworks-smart-client.ts",
				"packages/data/src/parsers/smart-tsv-parser.ts",
				"packages/data/src/parsers/field-discovery.ts",
				"packages/data/src/parsers/xml/moneyworks-xml-parser.ts",
				"packages/data/src/parsers/data-parser.ts",
				"packages/data/src/repositories/base.repository.ts",
				"packages/data/src/repositories/tax-rate.repository.ts",
				"packages/data/src/repositories/name.repository.ts",
				"packages/data/src/converters/export-format-converter.ts",
			],
			utilities: [
				"packages/utilities/src/types/branded.ts",
				"packages/utilities/src/date/yyyymmdd.ts",
				"packages/utilities/src/json/revivers.ts",
			],
			"mcp-server": [
				"packages/mcp-server/src/index.ts",
				"packages/mcp-server/src/tools/export.tool.ts",
				"packages/mcp-server/src/tools/eval.tool.ts",
				"packages/mcp-server/src/tools/schema.tool.ts",
				"packages/mcp-server/src/tools/names.tool.ts",
			],
			cli: [
				"packages/cli/src/index.ts",
				"packages/cli/src/commands/export.ts",
				"packages/cli/src/commands/eval.ts",
				"packages/cli/src/commands/import.ts",
			],
			documentation: [
				".claude/skills/librarian.md",
				".claude/skills/shadow-advisor.md",
			],
		},

		byLayer: {
			config: [
				"packages/api/src/app.ts",
				"packages/api/src/index.ts",
				"packages/mcp-server/src/index.ts",
				"packages/cli/src/index.ts",
			],
			routes: [
				"packages/api/src/routes/auth.ts",
				"packages/api/src/routes/tables.ts",
				"packages/api/src/routes/eval.ts",
				"packages/api/src/controllers/tax-rate.ts",
				"packages/api/src/controllers/name.ts",
				"packages/api/src/controllers/company.ts",
			],
			service: [
				"packages/api/src/middleware/auth.ts",
				"packages/api/src/services/connection-service.ts",
				"packages/api/src/controllers/base-table.ts",
				"packages/data/src/moneyworks-now-client.ts",
				"packages/data/src/client/moneyworks-smart-client.ts",
				"packages/data/src/repositories/base.repository.ts",
				"packages/data/src/repositories/tax-rate.repository.ts",
				"packages/data/src/repositories/name.repository.ts",
			],
			schema: [
				"packages/api/src/schemas/common.ts",
				"packages/api/src/schemas/company.ts",
				"packages/canonical/src/entities/tax-rates/types.ts",
				"packages/canonical/src/entities/tax-rates/fields.ts",
				"packages/canonical/src/entities/names/types.ts",
				"packages/canonical/src/entities/names/fields.ts",
				"packages/data/src/parsers/xml/moneyworks-xml-parser.ts",
				"packages/mcp-server/src/tools/schema.tool.ts",
			],
			util: [
				"packages/utilities/src/types/branded.ts",
				"packages/utilities/src/date/yyyymmdd.ts",
				"packages/utilities/src/json/revivers.ts",
				"packages/canonical/src/common/data-types.ts",
				"packages/canonical/src/common/business-rules.ts",
				"packages/canonical/src/entities/tax-rates/validators.ts",
				"packages/canonical/src/entities/tax-rates/calculators.ts",
				"packages/canonical/src/entities/names/validators.ts",
				"packages/data/src/parsers/smart-tsv-parser.ts",
				"packages/data/src/parsers/field-discovery.ts",
				"packages/data/src/parsers/data-parser.ts",
				"packages/data/src/converters/export-format-converter.ts",
			],
			component: [
				"packages/mcp-server/src/tools/export.tool.ts",
				"packages/mcp-server/src/tools/eval.tool.ts",
				"packages/mcp-server/src/tools/names.tool.ts",
				"packages/cli/src/commands/export.ts",
				"packages/cli/src/commands/eval.ts",
				"packages/cli/src/commands/import.ts",
			],
		},

		byConcept: {
			authentication: [
				"packages/api/src/middleware/auth.ts",
				"packages/api/src/routes/auth.ts",
				"packages/api/src/services/connection-service.ts",
			],
			"field-discovery": [
				"packages/data/src/parsers/field-discovery.ts",
				"packages/data/src/client/moneyworks-smart-client.ts",
			],
			"branded-types": [
				"packages/utilities/src/types/branded.ts",
				"packages/utilities/src/date/yyyymmdd.ts",
			],
			"repository-pattern": [
				"packages/data/src/repositories/base.repository.ts",
				"packages/data/src/repositories/tax-rate.repository.ts",
				"packages/data/src/repositories/name.repository.ts",
			],
			"export-formats": [
				"packages/api/src/controllers/base-table.ts",
				"packages/data/src/converters/export-format-converter.ts",
			],
			"canonical-dsl": [
				"packages/canonical/src/entities/tax-rates/types.ts",
				"packages/canonical/src/entities/names/types.ts",
			],
			"tax-calculations": [
				"packages/canonical/src/entities/tax-rates/calculators.ts",
				"packages/canonical/src/entities/tax-rates/validators.ts",
			],
			"mcp-tools": [
				"packages/mcp-server/src/tools/export.tool.ts",
				"packages/mcp-server/src/tools/eval.tool.ts",
				"packages/mcp-server/src/tools/schema.tool.ts",
				"packages/mcp-server/src/tools/names.tool.ts",
			],
		},

		byPattern: {
			"Repository Pattern": [
				"packages/data/src/repositories/base.repository.ts",
				"packages/data/src/repositories/tax-rate.repository.ts",
				"packages/data/src/repositories/name.repository.ts",
			],
			"Middleware Pattern": [
				"packages/api/src/middleware/auth.ts",
				"packages/api/src/middleware/logging.ts",
				"packages/api/src/middleware/error-handler.ts",
			],
			"Plugin System": ["packages/api/src/app.ts"],
			"Template Method": ["packages/api/src/controllers/base-table.ts"],
			"Branded Types": [
				"packages/utilities/src/types/branded.ts",
				"packages/utilities/src/date/yyyymmdd.ts",
			],
			"Client Pattern": [
				"packages/data/src/moneyworks-now-client.ts",
				"packages/data/src/client/moneyworks-smart-client.ts",
			],
			"Field Discovery": [
				"packages/data/src/parsers/field-discovery.ts",
				"packages/data/src/parsers/xml/moneyworks-xml-parser.ts",
			],
		},
	},

	conceptMap: {
		authentication: {
			description:
				"Bearer token authentication, connection management, encrypted credential storage",
			primaryFiles: [
				"packages/api/src/middleware/auth.ts",
				"packages/api/src/services/connection-service.ts",
			],
			relatedConcepts: [
				"JWT",
				"Bearer tokens",
				"Client caching",
				"AES-256-GCM encryption",
			],
		},
		"data-access": {
			description:
				"MoneyWorks data client with smart field discovery, TSV parsing, and multiple export formats",
			primaryFiles: [
				"packages/data/src/client/moneyworks-smart-client.ts",
				"packages/data/src/parsers/field-discovery.ts",
				"packages/data/src/repositories/base.repository.ts",
			],
			relatedConcepts: [
				"Field discovery",
				"Repository pattern",
				"Export formats",
				"TSV parsing",
			],
		},
		"canonical-dsl": {
			description:
				"Pure MoneyWorks type definitions preserving exact field names and business terminology",
			primaryFiles: [
				"packages/canonical/src/entities/tax-rates/types.ts",
				"packages/canonical/src/entities/names/types.ts",
				"packages/canonical/src/common/data-types.ts",
			],
			relatedConcepts: [
				"Branded types",
				"GST terminology",
				"Field metadata",
				"Business rules",
			],
		},
		"api-layer": {
			description:
				"REST API with Elysia framework, Swagger docs, and multi-format export support",
			primaryFiles: [
				"packages/api/src/app.ts",
				"packages/api/src/routes/tables.ts",
				"packages/api/src/controllers/base-table.ts",
			],
			relatedConcepts: [
				"Elysia",
				"REST endpoints",
				"Schema discovery",
				"Format negotiation",
			],
		},
		"type-safety": {
			description:
				"Type-safe domain primitives using branded types for dates, codes, and identifiers",
			primaryFiles: [
				"packages/utilities/src/types/branded.ts",
				"packages/utilities/src/date/yyyymmdd.ts",
			],
			relatedConcepts: [
				"YYYYMMDD dates",
				"AccountCode",
				"NameCode",
				"Proxy pattern",
			],
		},
	},
};

await Bun.write(".agent/librarian/index.json", JSON.stringify(index, null, 2));

console.log("✅ Librarian Index Created\n");
console.log(`Files Indexed: ${index.metadata.totalFiles}`);
console.log(`Git Commit: ${index.metadata.gitCommit.substring(0, 8)}`);
console.log(`Timestamp: ${index.metadata.timestamp}`);
console.log("\nDomains:");
for (const [domain, files] of Object.entries(index.indexes.byDomain)) {
	console.log(`  - ${domain}: ${files.length} files`);
}
console.log("\nLayers:");
for (const [layer, files] of Object.entries(index.indexes.byLayer)) {
	console.log(`  - ${layer}: ${files.length} files`);
}
console.log("\nConcept Map:");
for (const concept of Object.keys(index.conceptMap)) {
	console.log(`  - ${concept}`);
}
console.log("\nReady for queries via /librarian:find <concept>");
