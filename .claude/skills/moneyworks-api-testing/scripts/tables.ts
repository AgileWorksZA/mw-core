#!/usr/bin/env bun
/**
 * List available MoneyWorks tables
 *
 * Usage:
 *   bun tables.ts [--token=xxx] [--format=json|table]
 */

import {
	parseArgs,
	getToken,
	getApiUrl,
	apiRequest,
	exitWithError,
	printUsage,
	formatJson,
} from "./utils";

const args = parseArgs(process.argv);

if (args.help) {
	printUsage(
		"tables.ts",
		["--format=json    Output as JSON instead of formatted text"],
		[
			"bun tables.ts",
			"bun tables.ts --format=json",
		]
	);
	process.exit(0);
}

const token = getToken(args);
const baseUrl = getApiUrl(args);

if (!token) {
	exitWithError(
		"No token provided. Use --token=xxx, set MW_TOKEN env var, or add to .env file"
	);
}

const result = await apiRequest<{
	data: {
		available: string[];
		vetted: string[];
		upcoming: string[];
	};
	metadata: any;
}>("/tables", { token, baseUrl });

if (!result.ok) {
	exitWithError(`Failed to list tables: ${result.error}`);
}

const tables = result.data.data;

if (args.format === "json") {
	console.log(formatJson(tables));
	process.exit(0);
}

console.log(`\n📋 MoneyWorks Tables\n`);

if (tables.available && tables.available.length > 0) {
	console.log(`✅ Available (${tables.available.length}):`);
	for (const table of tables.available.sort()) {
		console.log(`   - ${table}`);
	}
}

if (tables.vetted && tables.vetted.length > 0) {
	console.log(`\n🔍 Vetted (${tables.vetted.length}):`);
	for (const table of tables.vetted.sort()) {
		console.log(`   - ${table}`);
	}
}

if (tables.upcoming && tables.upcoming.length > 0) {
	console.log(`\n⏳ Upcoming (${tables.upcoming.length}):`);
	for (const table of tables.upcoming.sort()) {
		console.log(`   - ${table}`);
	}
}

console.log("");
