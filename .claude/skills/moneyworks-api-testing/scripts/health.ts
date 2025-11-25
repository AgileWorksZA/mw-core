#!/usr/bin/env bun
/**
 * Check MoneyWorks API health status
 *
 * Usage:
 *   bun health.ts [--token=xxx] [--url=xxx]
 */

import {
	parseArgs,
	getToken,
	getApiUrl,
	apiRequest,
	exitWithError,
	printUsage,
} from "./utils";

const args = parseArgs(process.argv);

if (args.help) {
	printUsage(
		"health.ts",
		[],
		[
			"bun health.ts",
			"bun health.ts --token=YOUR_TOKEN",
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

console.log(`\n🔍 Checking API health at ${baseUrl}...\n`);

const result = await apiRequest<{
	status: string;
	timestamp: string;
	uptime: number;
	checks: {
		api: string;
		moneyworks: string;
	};
	version: {
		api: string;
		moneyworks?: string;
	};
}>("/health", { token, baseUrl });

if (!result.ok) {
	exitWithError(`API health check failed: ${result.error}`);
}

const health = result.data;

// Display status with color
const statusIcon =
	health.status === "healthy"
		? "✅"
		: health.status === "degraded"
			? "⚠️"
			: "❌";

console.log(`${statusIcon} Status: ${health.status.toUpperCase()}`);
console.log(`\n📊 Checks:`);
console.log(
	`   API:        ${health.checks.api === "ok" ? "✅ ok" : "❌ " + health.checks.api}`
);
console.log(
	`   MoneyWorks: ${health.checks.moneyworks === "ok" ? "✅ ok" : health.checks.moneyworks === "timeout" ? "⚠️ timeout" : "❌ " + health.checks.moneyworks}`
);

console.log(`\n📋 Info:`);
console.log(`   Timestamp: ${health.timestamp}`);
console.log(`   Uptime:    ${Math.round(health.uptime / 1000)}s`);
console.log(`   API Ver:   ${health.version.api}`);
if (health.version.moneyworks) {
	console.log(`   MW Ver:    ${health.version.moneyworks}`);
}

console.log("");
