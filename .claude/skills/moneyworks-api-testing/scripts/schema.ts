#!/usr/bin/env bun
/**
 * Get MoneyWorks table schema
 *
 * Usage:
 *   bun schema.ts --table=Account [--format=json|table]
 */

import {
	parseArgs,
	getToken,
	getApiUrl,
	apiRequest,
	exitWithError,
	printUsage,
	formatJson,
	formatTable,
} from "./utils";

const args = parseArgs(process.argv);

if (args.help || !args.table) {
	printUsage(
		"schema.ts",
		[
			"--table=Name     Table name (required)",
			"--format=json    Output as JSON instead of table",
		],
		[
			"bun schema.ts --table=Account",
			"bun schema.ts --table=Transaction --format=json",
		]
	);
	process.exit(args.help ? 0 : 1);
}

const token = getToken(args);
const baseUrl = getApiUrl(args);
const table = args.table as string;

if (!token) {
	exitWithError(
		"No token provided. Use --token=xxx, set MW_TOKEN env var, or add to .env file"
	);
}

const result = await apiRequest<{
	data: {
		table: string;
		primaryKey?: string;
		fields: Array<{
			name: string;
			type: string;
			description?: string;
			required?: boolean;
		}>;
	};
	metadata: any;
}>(`/tables/${encodeURIComponent(table)}/schema`, { token, baseUrl });

if (!result.ok) {
	exitWithError(`Failed to get schema for '${table}': ${result.error}`);
}

const schema = result.data.data;

if (args.format === "json") {
	console.log(formatJson(schema));
	process.exit(0);
}

console.log(`\n📋 Schema: ${schema.table}\n`);

if (schema.primaryKey) {
	console.log(`   Primary Key: ${schema.primaryKey}\n`);
}

if (schema.fields && schema.fields.length > 0) {
	const headers = ["Field", "Type", "Required", "Description"];
	const rows = schema.fields.map((f) => [
		f.name,
		f.type || "?",
		f.required ? "Yes" : "No",
		(f.description || "").slice(0, 30),
	]);

	console.log(formatTable(headers, rows));
	console.log(`\n   Total: ${schema.fields.length} fields`);
}

console.log("");
