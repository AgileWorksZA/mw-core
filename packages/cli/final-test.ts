#!/usr/bin/env bun

// Run the CLI to test XML export
import { spawnSync } from "node:child_process";

console.log("Testing CLI XML export...\n");

// Test 1: Export Name table as XML
console.log("1. Testing Name table with xml-verbose:");
const result1 = spawnSync(
	"bun",
	[
		"src/index.ts",
		"-c",
		"../core/mw-config.json",
		"export",
		"name", // lowercase name
		"--format",
		"xml-verbose",
		"--limit",
		"1",
	],
	{ encoding: "utf-8" },
);

console.log("Exit code:", result1.status);
console.log("Output type check:");
const output1 = result1.stdout?.trim() || "";
console.log("- Starts with '<':", output1.startsWith("<"));
console.log("- Contains 'xml':", output1.toLowerCase().includes("xml"));
console.log("- First 200 chars:", output1.substring(0, 200));

// Test 2: Export without format (should default to JSON)
console.log("\n2. Testing Name table without format (default JSON):");
const result2 = spawnSync(
	"bun",
	[
		"src/index.ts",
		"-c",
		"../core/mw-config.json",
		"export",
		"Name", // uppercase Name
		"--limit",
		"1",
	],
	{ encoding: "utf-8" },
);

console.log("Exit code:", result2.status);
const output2 = result2.stdout?.trim() || "";
console.log("- Starts with '[':", output2.startsWith("["));
console.log("- First 100 chars:", output2.substring(0, 100));
