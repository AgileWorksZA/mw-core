/**
 * Action Map Generator
 * Generates markdown documentation of what changes an operation caused
 *
 * Usage: bun action-map <before> <after> --operation "description"
 *
 * @moneyworks-dsl PURE
 */

import { parseArgs } from "node:util";
import type { SmartMoneyWorksClient, GlobalOptions } from "@moneyworks/data";
import { compareSnapshots } from "./diff-engine";
import type { DiffResult, DiffOptions, TableDiff } from "./diff-types";

/**
 * Default output directory for action maps
 */
const DEFAULT_ACTION_MAP_DIR = ".snapshots/action-maps";

/**
 * Generate markdown for a table's changes
 */
function formatTableChanges(table: TableDiff): string {
	const lines: string[] = [];

	const hasChanges =
		table.counts.added > 0 ||
		table.counts.deleted > 0 ||
		table.counts.modified > 0;

	if (!hasChanges) {
		return "";
	}

	lines.push(`### ${table.tableName}`);
	lines.push("");
	lines.push(`| Metric | Count |`);
	lines.push(`|--------|-------|`);
	lines.push(`| Added | ${table.counts.added} |`);
	lines.push(`| Deleted | ${table.counts.deleted} |`);
	lines.push(`| Modified | ${table.counts.modified} |`);
	lines.push(`| Unchanged | ${table.counts.unchanged} |`);
	lines.push("");

	// Show added records
	if (table.added.length > 0) {
		lines.push(`#### Added Records (${table.added.length})`);
		lines.push("");
		for (const added of table.added) {
			lines.push(`<details>`);
			lines.push(`<summary><code>${added.primaryKey}</code></summary>`);
			lines.push("");
			lines.push("```json");
			lines.push(JSON.stringify(added.record, null, 2));
			lines.push("```");
			lines.push("");
			lines.push(`</details>`);
			lines.push("");
		}
	}

	// Show deleted records
	if (table.deleted.length > 0) {
		lines.push(`#### Deleted Records (${table.deleted.length})`);
		lines.push("");
		for (const deleted of table.deleted) {
			lines.push(`<details>`);
			lines.push(`<summary><code>${deleted.primaryKey}</code></summary>`);
			lines.push("");
			lines.push("```json");
			lines.push(JSON.stringify(deleted.record, null, 2));
			lines.push("```");
			lines.push("");
			lines.push(`</details>`);
			lines.push("");
		}
	}

	// Show modified records with field-level changes
	if (table.modified.length > 0) {
		lines.push(`#### Modified Records (${table.modified.length})`);
		lines.push("");

		for (const modified of table.modified) {
			lines.push(`<details>`);
			lines.push(`<summary><code>${modified.primaryKey}</code> - ${modified.changes.length} field(s) changed</summary>`);
			lines.push("");
			lines.push(`| Field | Before | After |`);
			lines.push(`|-------|--------|-------|`);
			for (const change of modified.changes) {
				const oldVal = JSON.stringify(change.oldValue);
				const newVal = JSON.stringify(change.newValue);
				lines.push(`| \`${change.field}\` | ${oldVal} | ${newVal} |`);
			}
			lines.push("");
			lines.push(`</details>`);
			lines.push("");
		}
	}

	return lines.join("\n");
}

/**
 * Generate a full action map markdown document
 */
export function generateActionMap(
	result: DiffResult,
	operationName: string,
	operationDescription?: string,
): string {
	const lines: string[] = [];

	// Header
	lines.push(`# Action Map: ${operationName}`);
	lines.push("");
	lines.push(`> Comparing snapshot \`${result.beforeLabel}\` to \`${result.afterLabel}\``);
	lines.push("");

	// Metadata
	lines.push(`## Metadata`);
	lines.push("");
	lines.push(`| Property | Value |`);
	lines.push(`|----------|-------|`);
	lines.push(`| Before Snapshot | \`${result.beforeLabel}\` |`);
	lines.push(`| After Snapshot | \`${result.afterLabel}\` |`);
	lines.push(`| Computed At | ${result.computedAt} |`);
	lines.push(`| Operation | ${operationName} |`);
	if (operationDescription) {
		lines.push(`| Description | ${operationDescription} |`);
	}
	lines.push("");

	// Summary
	lines.push(`## Summary`);
	lines.push("");
	lines.push(`| Metric | Value |`);
	lines.push(`|--------|-------|`);
	lines.push(`| Tables Compared | ${result.summary.tablesCompared} |`);
	lines.push(`| Tables With Changes | ${result.summary.tablesWithChanges} |`);
	lines.push(`| Total Added | ${result.summary.totalAdded} |`);
	lines.push(`| Total Deleted | ${result.summary.totalDeleted} |`);
	lines.push(`| Total Modified | ${result.summary.totalModified} |`);
	lines.push(`| Total Unchanged | ${result.summary.totalUnchanged} |`);
	lines.push("");

	// Quick overview of tables with changes
	const tablesWithChanges = result.tables.filter(
		(t) => t.counts.added > 0 || t.counts.deleted > 0 || t.counts.modified > 0,
	);

	if (tablesWithChanges.length > 0) {
		lines.push(`## Tables Changed`);
		lines.push("");
		lines.push(`| Table | Added | Deleted | Modified |`);
		lines.push(`|-------|-------|---------|----------|`);
		for (const table of tablesWithChanges) {
			lines.push(`| ${table.tableName} | ${table.counts.added} | ${table.counts.deleted} | ${table.counts.modified} |`);
		}
		lines.push("");
	}

	// Detailed changes per table
	lines.push(`## Detailed Changes`);
	lines.push("");

	for (const table of result.tables) {
		const tableMarkdown = formatTableChanges(table);
		if (tableMarkdown) {
			lines.push(tableMarkdown);
		}
	}

	// Footer
	lines.push(`---`);
	lines.push("");
	lines.push(`*Generated by MoneyWorks Snapshot & Diff System*`);

	return lines.join("\n");
}

/**
 * CLI command handler for action-map
 */
export async function actionMapCommand(
	_client: SmartMoneyWorksClient,
	args: string[],
	_globalOptions: GlobalOptions,
): Promise<void> {
	// Parse arguments
	const { values, positionals } = parseArgs({
		args,
		options: {
			operation: {
				type: "string",
				short: "n",
			},
			description: {
				type: "string",
				short: "d",
			},
			output: {
				type: "string",
				short: "o",
			},
			dir: {
				type: "string",
				default: ".snapshots",
			},
			tables: {
				type: "string",
				short: "t",
			},
		},
		strict: false,
		allowPositionals: true,
	});

	// Get labels from positional arguments
	const beforeLabel = positionals[0];
	const afterLabel = positionals[1];

	if (!beforeLabel || !afterLabel) {
		console.error("Usage: mw action-map <before> <after> --operation <name> [options]");
		console.error("");
		console.error("Options:");
		console.error("  -n, --operation <name>       Operation name (required)");
		console.error("  -d, --description <text>     Operation description");
		console.error("  -o, --output <file>          Output file path");
		console.error("  --dir <dir>                  Snapshot directory (default: .snapshots)");
		console.error("  -t, --tables <list>          Comma-separated list of tables");
		console.error("");
		console.error("Examples:");
		console.error("  mw action-map baseline after-invoice --operation create-invoice");
		console.error("  mw action-map before after -n import-customers -d 'Bulk customer import'");
		process.exit(1);
	}

	const operationName = values.operation as string;
	if (!operationName) {
		console.error("Error: --operation is required");
		console.error("Run 'mw action-map --help' for usage");
		process.exit(1);
	}

	// Build diff options
	const diffOptions: DiffOptions = {
		detailed: true, // Always detailed for action maps
	};

	if (values.tables) {
		diffOptions.tables = (values.tables as string).split(",").map((t) => t.trim());
	}

	try {
		// Get diff result
		const result = await compareSnapshots(
			beforeLabel,
			afterLabel,
			diffOptions,
			values.dir as string,
		);

		// Generate action map
		const markdown = generateActionMap(
			result,
			operationName,
			values.description as string,
		);

		// Determine output path
		let outputPath: string;
		if (values.output) {
			outputPath = values.output as string;
		} else {
			// Default: .snapshots/action-maps/<operation>.md
			const sanitizedName = operationName.replace(/[^a-zA-Z0-9-_]/g, "-");
			outputPath = `${DEFAULT_ACTION_MAP_DIR}/${sanitizedName}.md`;
		}

		// Ensure directory exists
		const dirPath = outputPath.substring(0, outputPath.lastIndexOf("/"));
		if (dirPath) {
			await Bun.write(`${dirPath}/.keep`, "");
		}

		// Write action map
		await Bun.write(outputPath, markdown);
		console.log(`Action map saved to: ${outputPath}`);
	} catch (error) {
		console.error(
			"Action map generation failed:",
			error instanceof Error ? error.message : error,
		);
		process.exit(1);
	}
}
