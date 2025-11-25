#!/usr/bin/env bun
/**
 * Get field labels for a MoneyWorks table
 *
 * Usage:
 *   bun labels.ts --table=Account [--lang=en]
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
		"labels.ts",
		[
			"--table=Name     Table name (required)",
			"--lang=en        Language code (default: en)",
			"--format=json    Output as JSON",
		],
		[
			"bun labels.ts --table=Account",
			"bun labels.ts --table=Account --lang=fr",
			"bun labels.ts --table=Account --format=json",
		]
	);
	process.exit(args.help ? 0 : 1);
}

const token = getToken(args);
const baseUrl = getApiUrl(args);
const table = args.table as string;
const lang = args.lang || "en";

if (!token) {
	exitWithError(
		"No token provided. Use --token=xxx, set MW_TOKEN env var, or add to .env file"
	);
}

const result = await apiRequest<{
	data: {
		language: string;
		table: string;
		labels: Record<string, string>;
		enumerated?: Record<string, Record<string, string>>;
	};
	metadata: any;
}>(`/tables/${encodeURIComponent(table)}/labels?lang=${lang}`, {
	token,
	baseUrl,
});

if (!result.ok) {
	exitWithError(`Failed to get labels for '${table}': ${result.error}`);
}

const labelsData = result.data.data;

if (args.format === "json") {
	console.log(formatJson(labelsData));
	process.exit(0);
}

console.log(`\n🏷️  Labels: ${labelsData.table} (${labelsData.language})\n`);

if (labelsData.labels) {
	const entries = Object.entries(labelsData.labels).sort(([a], [b]) =>
		a.localeCompare(b)
	);

	const headers = ["Field", "Label"];
	const rows = entries.map(([field, label]) => [field, label]);

	console.log(formatTable(headers, rows));
	console.log(`\n   Total: ${entries.length} labels`);
}

if (labelsData.enumerated && Object.keys(labelsData.enumerated).length > 0) {
	console.log(`\n📋 Enumerated Fields:\n`);
	for (const [field, values] of Object.entries(labelsData.enumerated)) {
		console.log(`   ${field}:`);
		for (const [key, label] of Object.entries(values)) {
			console.log(`      ${key}: ${label}`);
		}
	}
}

console.log("");
