#!/usr/bin/env bun
/**
 * Evaluate template against MoneyWorks table
 *
 * Usage:
 *   bun template.ts --table=Account --template="[Code] - [Description]"
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

if (args.help || !args.table || !args.template) {
	printUsage(
		"template.ts",
		[
			"--table=Name         Table name (required)",
			"--template=str       Template with [FieldName] placeholders (required)",
			"--limit=100          Max records (default: 100)",
			"--filter=expr        MoneyWorks filter expression",
			"--format=json        Output as JSON",
		],
		[
			'bun template.ts --table=Account --template="[Code] - [Description]"',
			'bun template.ts --table=Account --template="[Code]: [Description]" --limit=5',
			'bun template.ts --table=Account --template="[Code]" --filter="Active=true"',
		]
	);
	process.exit(args.help ? 0 : 1);
}

const token = getToken(args);
const baseUrl = getApiUrl(args);
const table = args.table as string;
const template = args.template as string;
const limit = args.limit ? Number(args.limit) : 100;
const filter = args.filter as string | undefined;

if (!token) {
	exitWithError(
		"No token provided. Use --token=xxx, set MW_TOKEN env var, or add to .env file"
	);
}

const body: any = { template, limit };
if (filter) body.filter = filter;

const result = await apiRequest<{
	data: {
		table: string;
		template: string;
		results: string[];
		count: number;
	};
	metadata: any;
}>(`/eval/template/${encodeURIComponent(table)}`, {
	method: "POST",
	token,
	baseUrl,
	body,
});

if (!result.ok) {
	exitWithError(`Template evaluation failed: ${result.error}`);
}

const evalResult = result.data.data;

if (args.format === "json") {
	console.log(formatJson(evalResult));
	process.exit(0);
}

console.log(`\n📝 Template Evaluation: ${evalResult.table}\n`);
console.log(`   Template: ${evalResult.template}`);
console.log(`   Records:  ${evalResult.count}`);
console.log(`\n   Results:`);

for (let i = 0; i < evalResult.results.length; i++) {
	console.log(`   ${(i + 1).toString().padStart(3)}. ${evalResult.results[i]}`);
}

console.log("");
