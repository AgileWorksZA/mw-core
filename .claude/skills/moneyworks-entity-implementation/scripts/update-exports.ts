#!/usr/bin/env bun
/**
 * MoneyWorks Entity Export Update Script
 *
 * Updates all 4 export locations required after scaffolding a new entity:
 * 1. packages/canonical/src/index.ts - Export entity types
 * 2. packages/data/src/repositories/index.ts - Export repository
 * 3. packages/data/src/index.ts - Export + factory functions
 * 4. packages/api/src/registry/table-registry.ts - Register controller
 *
 * Usage:
 *   bun .claude/skills/moneyworks-entity-implementation/scripts/update-exports.ts \
 *     --entity="Transaction"
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Parse CLI arguments
const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
	const arg = args.find((a) => a.startsWith(`--${name}=`));
	return arg?.split("=")[1];
};

const entity = getArg("entity");
const table = getArg("table") || entity;
const dryRun = args.includes("--dry-run");

if (!entity) {
	console.error(`
Usage: bun update-exports.ts --entity=EntityName [options]

Required:
  --entity        Entity name (PascalCase, e.g., "Transaction")

Optional:
  --table         MoneyWorks table name (default: same as entity)
  --dry-run       Preview changes without writing files

Example:
  bun update-exports.ts --entity="Job"
  bun update-exports.ts --entity="Transaction" --table="Transaction" --dry-run
`);
	process.exit(1);
}

const entityLower = entity.toLowerCase();
const projectRoot = process.cwd();

console.log(`\n🔄 Updating exports for ${entity} Entity${dryRun ? " (DRY RUN)" : ""}\n`);

// Helper to update a file
function updateFile(
	filePath: string,
	description: string,
	updateFn: (content: string) => { updated: string; changes: string[] }
): boolean {
	if (!existsSync(filePath)) {
		console.log(`⚠️  File not found: ${filePath}`);
		return false;
	}

	const content = readFileSync(filePath, "utf-8");
	const { updated, changes } = updateFn(content);

	if (content === updated) {
		console.log(`⏭️  No changes needed: ${description}`);
		return false;
	}

	if (dryRun) {
		console.log(`📝 Would update: ${description}`);
		for (const change of changes) {
			console.log(`   + ${change}`);
		}
	} else {
		writeFileSync(filePath, updated, "utf-8");
		console.log(`✅ Updated: ${description}`);
		for (const change of changes) {
			console.log(`   + ${change}`);
		}
	}
	return true;
}

// =============================================================================
// 1. Update packages/canonical/src/index.ts
// =============================================================================
const canonicalIndexPath = join(projectRoot, "packages/canonical/src/index.ts");

updateFile(canonicalIndexPath, "packages/canonical/src/index.ts", (content) => {
	const exportLine = `export * from "./entities/${entityLower}";`;
	const changes: string[] = [];

	if (content.includes(exportLine)) {
		return { updated: content, changes: [] };
	}

	// Find the entities section and add export
	const lines = content.split("\n");
	let insertIndex = -1;

	// Look for existing entity exports
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('export * from "./entities/')) {
			insertIndex = i + 1;
		}
	}

	if (insertIndex === -1) {
		// No entity exports yet, find a good spot
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes("export") && !lines[i].includes("//")) {
				insertIndex = i + 1;
				break;
			}
		}
	}

	if (insertIndex === -1) {
		insertIndex = lines.length;
	}

	lines.splice(insertIndex, 0, exportLine);
	changes.push(exportLine);

	return { updated: lines.join("\n"), changes };
});

// =============================================================================
// 2. Update packages/data/src/repositories/index.ts
// =============================================================================
const repoIndexPath = join(
	projectRoot,
	"packages/data/src/repositories/index.ts"
);

updateFile(repoIndexPath, "packages/data/src/repositories/index.ts", (content) => {
	const exportLine = `export { ${entity}Repository } from "./${entityLower}.repository";`;
	const changes: string[] = [];

	if (content.includes(`${entity}Repository`)) {
		return { updated: content, changes: [] };
	}

	const lines = content.split("\n");
	let insertIndex = lines.length;

	// Find last export line
	for (let i = lines.length - 1; i >= 0; i--) {
		if (lines[i].trim().startsWith("export")) {
			insertIndex = i + 1;
			break;
		}
	}

	lines.splice(insertIndex, 0, exportLine);
	changes.push(exportLine);

	return { updated: lines.join("\n"), changes };
});

// =============================================================================
// 3. Update packages/data/src/index.ts (export + factory functions)
// =============================================================================
const dataIndexPath = join(projectRoot, "packages/data/src/index.ts");

updateFile(dataIndexPath, "packages/data/src/index.ts", (content) => {
	const changes: string[] = [];
	let updated = content;

	// Add export line if missing
	const exportLine = `export { ${entity}Repository } from "./repositories/${entityLower}.repository";`;
	if (!updated.includes(`${entity}Repository`)) {
		// Find the repositories export section
		const repoExportMatch = updated.match(
			/export \{ \w+Repository \} from "\.\/repositories\//
		);
		if (repoExportMatch) {
			const insertPos = updated.lastIndexOf(
				'export { ',
				updated.indexOf('from "./repositories/')
			);
			// Find the line and insert after
			const lines = updated.split("\n");
			for (let i = 0; i < lines.length; i++) {
				if (lines[i].includes('Repository } from "./repositories/')) {
					lines.splice(i + 1, 0, exportLine);
					updated = lines.join("\n");
					changes.push(exportLine);
					break;
				}
			}
		}
	}

	// Add to createMoneyWorksClient factory
	const factoryPattern1 = /createMoneyWorksClient.*?repositories:\s*\{([^}]+)\}/s;
	const match1 = updated.match(factoryPattern1);
	if (match1 && !match1[1].includes(`${entityLower}:`)) {
		const repoLine = `\t\t\t${entityLower}: new ${entity}Repository(client),`;
		// Find the repositories object in createMoneyWorksClient
		const lines = updated.split("\n");
		let inCreateMoneyWorksClient = false;
		let braceDepth = 0;
		let foundRepositories = false;

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes("createMoneyWorksClient")) {
				inCreateMoneyWorksClient = true;
			}
			if (inCreateMoneyWorksClient) {
				if (lines[i].includes("repositories:")) {
					foundRepositories = true;
				}
				if (foundRepositories && lines[i].includes("{")) {
					braceDepth++;
				}
				if (foundRepositories && lines[i].includes("}")) {
					braceDepth--;
					if (braceDepth === 0) {
						// Insert before closing brace
						lines.splice(i, 0, repoLine);
						updated = lines.join("\n");
						changes.push(`createMoneyWorksClient: ${entityLower}: new ${entity}Repository(client)`);
						break;
					}
				}
			}
		}
	}

	// Add to createDataLayer factory
	const factoryPattern2 = /createDataLayer.*?repositories:\s*\{([^}]+)\}/s;
	const match2 = updated.match(factoryPattern2);
	if (match2 && !match2[1].includes(`${entityLower}:`)) {
		const repoLine = `\t\t\t${entityLower}: new ${entity}Repository(client),`;
		const lines = updated.split("\n");
		let inCreateDataLayer = false;
		let braceDepth = 0;
		let foundRepositories = false;

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes("createDataLayer")) {
				inCreateDataLayer = true;
			}
			if (inCreateDataLayer) {
				if (lines[i].includes("repositories:")) {
					foundRepositories = true;
				}
				if (foundRepositories && lines[i].includes("{")) {
					braceDepth++;
				}
				if (foundRepositories && lines[i].includes("}")) {
					braceDepth--;
					if (braceDepth === 0) {
						lines.splice(i, 0, repoLine);
						updated = lines.join("\n");
						changes.push(`createDataLayer: ${entityLower}: new ${entity}Repository(client)`);
						break;
					}
				}
			}
		}
	}

	// Also need to add import for the repository
	if (!updated.includes(`import { ${entity}Repository }`)) {
		const importLine = `import { ${entity}Repository } from "./repositories/${entityLower}.repository";`;
		// Find imports section
		const lines = updated.split("\n");
		let lastImportIndex = 0;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].startsWith("import ")) {
				lastImportIndex = i;
			}
		}
		lines.splice(lastImportIndex + 1, 0, importLine);
		updated = lines.join("\n");
		changes.push(`import: ${entity}Repository`);
	}

	return { updated, changes };
});

// =============================================================================
// 4. Update packages/api/src/registry/table-registry.ts
// =============================================================================
const registryPath = join(
	projectRoot,
	"packages/api/src/registry/table-registry.ts"
);

updateFile(registryPath, "packages/api/src/registry/table-registry.ts", (content) => {
	const changes: string[] = [];
	let updated = content;

	const controllerName = `${entity}Controller`;
	const importLine = `import { ${controllerName} } from "../controllers/${entityLower}";`;
	const registerLine = `\t\tthis.register(new ${controllerName}(this.client));`;

	// Add import if missing
	if (!updated.includes(controllerName)) {
		const lines = updated.split("\n");
		let lastImportIndex = 0;

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].startsWith("import ")) {
				lastImportIndex = i;
			}
		}

		lines.splice(lastImportIndex + 1, 0, importLine);
		updated = lines.join("\n");
		changes.push(importLine);
	}

	// Add registration in registerTables() method
	if (!updated.includes(`new ${controllerName}`)) {
		const lines = updated.split("\n");
		let inRegisterTables = false;

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes("registerTables()")) {
				inRegisterTables = true;
			}
			if (inRegisterTables && lines[i].includes("this.register(new ")) {
				// Find the last registration line
				let lastRegisterIndex = i;
				while (
					lines[lastRegisterIndex + 1] &&
					lines[lastRegisterIndex + 1].includes("this.register(new ")
				) {
					lastRegisterIndex++;
				}
				lines.splice(lastRegisterIndex + 1, 0, registerLine);
				updated = lines.join("\n");
				changes.push(`registerTables(): this.register(new ${controllerName}(this.client))`);
				break;
			}
		}
	}

	// Remove from upcoming array if present
	const upcomingMatch = updated.match(/upcoming:\s*\[[^\]]*\]/);
	if (upcomingMatch && upcomingMatch[0].toLowerCase().includes(entityLower)) {
		const originalUpcoming = upcomingMatch[0];
		// Parse the array and remove the entity
		const arrayContent = originalUpcoming.match(/\[(.*)\]/s)?.[1] || "";
		const items = arrayContent
			.split(",")
			.map((s) => s.trim())
			.filter((s) => s && !s.toLowerCase().includes(entityLower.toLowerCase()));
		const newUpcoming = `upcoming: [${items.join(", ")}]`;
		updated = updated.replace(originalUpcoming, newUpcoming);
		changes.push(`Removed "${entity}" from upcoming array`);
	}

	return { updated, changes };
});

// =============================================================================
// Summary
// =============================================================================
console.log(`
📊 Export Update Complete${dryRun ? " (DRY RUN - no files modified)" : ""}

📝 Next Steps:
   1. Customize the generated files with actual MoneyWorks field data
   2. Run typecheck: bun tsc --project packages/canonical/tsconfig.json --noEmit
   3. Run tests: bun test
   4. Test API endpoint: GET /api/tables/${table?.toLowerCase() || entityLower}

   Full entity implementation checklist:
   ✅ Step 1: Create canonical types (scaffold-entity.ts)
   ✅ Step 2: Create repository (scaffold-entity.ts)
   ✅ Step 3: Create controller (scaffold-entity.ts)
   ✅ Step 4: Update canonical exports (this script)
   ✅ Step 5: Update repository exports (this script)
   ✅ Step 6: Update data layer exports + factories (this script)
   ✅ Step 7: Register controller in TableRegistry (this script)
   ⬜ Step 8: Run typecheck
   ⬜ Step 9: Test and customize
`);
