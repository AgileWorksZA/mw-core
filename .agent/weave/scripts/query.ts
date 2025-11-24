#!/usr/bin/env bun
import { readFileSync } from "node:fs";
import path from "node:path";

// Usage: bun query.ts <dimension>:<entity-id>
// Example: bun query.ts ontology:agios-platform
// Example: bun query.ts praxeology:context-preservation-through-delegation

const weaveDir = path.join(import.meta.dir, "..");
const [query] = process.argv.slice(2);

if (!query || !query.includes(":")) {
	console.error("Usage: bun query.ts <dimension>:<entity-id>");
	console.error("Example: bun query.ts ontology:agios-platform");
	process.exit(1);
}

const [dimensionAbbrev, entityId] = query.split(":");

// Map abbreviations to full names
const dimensionMap: Record<string, string> = {
	q: "qualia",
	e: "epistemology",
	o: "ontology",
	m: "mereology",
	c: "causation",
	a: "axiology",
	t: "teleology",
	h: "history",
	η: "history",
	p: "praxeology",
	π: "praxeology",
	mod: "modality",
	μ: "modality",
	d: "deontics",
	δ: "deontics",
};

const dimension =
	dimensionMap[dimensionAbbrev.toLowerCase()] || dimensionAbbrev;

try {
	const filePath = path.join(weaveDir, `${dimension}.json`);
	const data = JSON.parse(readFileSync(filePath, "utf-8"));

	// Search all collections for the entity
	let found = false;
	for (const [collection, items] of Object.entries(data)) {
		if (
			collection === "metadata" ||
			collection === "$schema" ||
			typeof items !== "object"
		)
			continue;

		if (items[entityId]) {
			console.log(`\n📍 Found in ${dimension}.${collection}:`);
			console.log(JSON.stringify(items[entityId], null, 2));
			found = true;
			break;
		}
	}

	if (!found) {
		console.error(`❌ Entity '${entityId}' not found in ${dimension}`);
		console.log("\nAvailable collections:");
		Object.keys(data).forEach((key) => {
			if (
				key !== "metadata" &&
				key !== "$schema" &&
				typeof data[key] === "object"
			) {
				console.log(`  - ${key} (${Object.keys(data[key]).length} items)`);
			}
		});
	}
} catch (error) {
	console.error(`❌ Error: ${error.message}`);
	process.exit(1);
}
