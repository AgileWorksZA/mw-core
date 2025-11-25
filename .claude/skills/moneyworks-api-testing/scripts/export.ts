#!/usr/bin/env bun
/**
 * Export MoneyWorks table data
 *
 * Usage:
 *   bun export.ts --table=Account [options]
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

if (args.help || !args.table) {
	printUsage(
		"export.ts",
		[
			"--table=Name       Table name (required)",
			"--limit=100        Max records (default: 100)",
			"--offset=0         Skip records (default: 0)",
			"--filter=expr      MoneyWorks filter expression",
			"--format=fmt       compact, compact-headers, full, schema (default: full)",
			"--orderBy=field    Sort by field",
		],
		[
			"bun export.ts --table=Account --limit=5",
			'bun export.ts --table=Account --filter=\'left(Code,2)="BA"\'',
			"bun export.ts --table=Account --format=compact-headers",
			"bun export.ts --table=Transaction --orderBy=TransDate",
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

// Build query string
const params = new URLSearchParams();
if (args.limit) params.set("limit", String(args.limit));
if (args.offset) params.set("offset", String(args.offset));
if (args.filter) params.set("filter", String(args.filter));
if (args.format) params.set("format", String(args.format));
if (args.orderBy) params.set("orderBy", String(args.orderBy));

const queryString = params.toString();
const endpoint = `/tables/${encodeURIComponent(table)}${queryString ? `?${queryString}` : ""}`;

const result = await apiRequest<any>(endpoint, { token, baseUrl });

if (!result.ok) {
	exitWithError(`Failed to export '${table}': ${result.error}`);
}

const format = args.format || "full";

// Handle different response formats
if (format === "compact" || format === "compact-headers") {
	// TSV format - print directly
	if (typeof result.data === "string") {
		console.log(result.data);
	} else if (result.data.data) {
		// Wrapped in metadata
		console.log(result.data.data);
	}
} else {
	// JSON formats
	const data = result.data.data || result.data;
	const metadata = result.data.metadata;

	// Pretty print
	console.log(formatJson(data));

	// Show metadata summary
	if (metadata) {
		console.error(`\n--- Metadata ---`);
		console.error(`Records: ${metadata.count || "?"}`);
		console.error(`Table: ${metadata.table || table}`);
		if (metadata.pagination) {
			console.error(
				`Pagination: offset=${metadata.pagination.offset}, limit=${metadata.pagination.limit}, hasMore=${metadata.pagination.hasMore}`
			);
		}
	}
}
