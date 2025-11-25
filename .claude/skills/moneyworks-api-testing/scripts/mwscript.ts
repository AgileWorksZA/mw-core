#!/usr/bin/env bun
/**
 * Execute MWScript expression
 *
 * Usage:
 *   bun mwscript.ts --expr="1+1"
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

if (args.help || !args.expr) {
	printUsage(
		"mwscript.ts",
		[
			"--expr=string    MWScript expression to evaluate (required)",
			"--format=json    Output as JSON",
		],
		[
			'bun mwscript.ts --expr="1+1"',
			'bun mwscript.ts --expr="Today()"',
			'bun mwscript.ts --expr="Format(Today(), \\"YYYY-MM-DD\\")"',
		]
	);
	process.exit(args.help ? 0 : 1);
}

const token = getToken(args);
const baseUrl = getApiUrl(args);
const expression = args.expr as string;

if (!token) {
	exitWithError(
		"No token provided. Use --token=xxx, set MW_TOKEN env var, or add to .env file"
	);
}

const result = await apiRequest<{
	data: {
		expression: string;
		result: string;
		dataType: string;
		executionTime: number;
	};
	metadata: any;
}>("/eval", {
	method: "POST",
	token,
	baseUrl,
	body: { expression },
});

if (!result.ok) {
	exitWithError(`MWScript evaluation failed: ${result.error}`);
}

const evalResult = result.data.data;

if (args.format === "json") {
	console.log(formatJson(evalResult));
	process.exit(0);
}

console.log(`\n🔢 MWScript Evaluation\n`);
console.log(`   Expression:     ${evalResult.expression}`);
console.log(`   Result:         ${evalResult.result}`);
console.log(`   Data Type:      ${evalResult.dataType}`);
console.log(`   Execution Time: ${evalResult.executionTime}ms`);
console.log("");
