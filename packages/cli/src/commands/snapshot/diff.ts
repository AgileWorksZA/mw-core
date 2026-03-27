/**
 * Diff Command
 * Compare two snapshots and output differences
 *
 * Usage: bun diff <before> <after>
 *
 * @moneyworks-dsl PURE
 */

import { parseArgs } from "node:util";
import type { SmartMoneyWorksClient, GlobalOptions } from "@moneyworks/data";
import { compareSnapshots } from "./diff-engine";
import type { DiffOptions, DiffResult } from "./diff-types";

/**
 * Format diff result for console output
 */
function formatDiffOutput(result: DiffResult, detailed: boolean): string {
	const lines: string[] = [];

	lines.push(`Diff: ${result.beforeLabel} -> ${result.afterLabel}`);
	lines.push(`Computed: ${result.computedAt}`);
	lines.push("");

	// Summary
	lines.push("=== Summary ===");
	lines.push(`Tables compared: ${result.summary.tablesCompared}`);
	lines.push(`Tables with changes: ${result.summary.tablesWithChanges}`);
	lines.push(`Total added: ${result.summary.totalAdded}`);
	lines.push(`Total deleted: ${result.summary.totalDeleted}`);
	lines.push(`Total modified: ${result.summary.totalModified}`);
	lines.push(`Total unchanged: ${result.summary.totalUnchanged}`);
	lines.push("");

	// Per-table details
	for (const table of result.tables) {
		const hasChanges =
			table.counts.added > 0 ||
			table.counts.deleted > 0 ||
			table.counts.modified > 0;

		if (!hasChanges && !detailed) continue;

		lines.push(`=== ${table.tableName} ===`);
		lines.push(`  Added: ${table.counts.added}`);
		lines.push(`  Deleted: ${table.counts.deleted}`);
		lines.push(`  Modified: ${table.counts.modified}`);
		lines.push(`  Unchanged: ${table.counts.unchanged}`);

		if (detailed) {
			// Show added records
			if (table.added.length > 0) {
				lines.push("  --- Added Records ---");
				for (const added of table.added) {
					lines.push(`    [${added.primaryKey}]: ${JSON.stringify(added.record)}`);
				}
			}

			// Show deleted records
			if (table.deleted.length > 0) {
				lines.push("  --- Deleted Records ---");
				for (const deleted of table.deleted) {
					lines.push(`    [${deleted.primaryKey}]: ${JSON.stringify(deleted.record)}`);
				}
			}

			// Show modified records
			if (table.modified.length > 0) {
				lines.push("  --- Modified Records ---");
				for (const modified of table.modified) {
					lines.push(`    [${modified.primaryKey}]:`);
					for (const change of modified.changes) {
						lines.push(`      ${change.field}: ${JSON.stringify(change.oldValue)} -> ${JSON.stringify(change.newValue)}`);
					}
				}
			}
		}

		lines.push("");
	}

	return lines.join("\n");
}

/**
 * CLI command handler for diff
 */
export async function diffCommand(
	_client: SmartMoneyWorksClient,
	args: string[],
	_globalOptions: GlobalOptions,
): Promise<void> {
	// Parse arguments
	const { values, positionals } = parseArgs({
		args,
		options: {
			output: {
				type: "string",
				short: "o",
			},
			dir: {
				type: "string",
				short: "d",
				default: ".snapshots",
			},
			tables: {
				type: "string",
				short: "t",
			},
			json: {
				type: "boolean",
				short: "j",
			},
			detailed: {
				type: "boolean",
				short: "D",
			},
			ignore: {
				type: "string",
				short: "i",
			},
		},
		strict: false,
		allowPositionals: true,
	});

	// Get labels from positional arguments
	const beforeLabel = positionals[0];
	const afterLabel = positionals[1];

	if (!beforeLabel || !afterLabel) {
		console.error("Usage: mw diff <before> <after> [options]");
		console.error("");
		console.error("Options:");
		console.error("  -o, --output <file>   Output to file instead of stdout");
		console.error("  -d, --dir <dir>       Snapshot directory (default: .snapshots)");
		console.error("  -t, --tables <list>   Comma-separated list of tables to compare");
		console.error("  -j, --json            Output as JSON");
		console.error("  -D, --detailed        Show detailed record changes");
		console.error("  -i, --ignore <list>   Comma-separated list of fields to ignore");
		console.error("");
		console.error("Examples:");
		console.error("  mw diff baseline after-import");
		console.error("  mw diff before after --json --output changes.json");
		console.error("  mw diff before after --tables TaxRate,Transaction --detailed");
		process.exit(1);
	}

	// Build diff options
	const diffOptions: DiffOptions = {
		detailed: Boolean(values.detailed),
	};

	if (values.tables) {
		diffOptions.tables = (values.tables as string).split(",").map((t) => t.trim());
	}

	if (values.ignore) {
		diffOptions.ignoreFields = (values.ignore as string).split(",").map((f) => f.trim());
	}

	try {
		const result = await compareSnapshots(
			beforeLabel,
			afterLabel,
			diffOptions,
			values.dir as string,
		);

		// Format output
		let output: string;
		if (values.json) {
			output = JSON.stringify(result, null, 2);
		} else {
			output = formatDiffOutput(result, Boolean(values.detailed));
		}

		// Write output
		if (values.output) {
			await Bun.write(values.output as string, output);
			console.log(`Diff saved to: ${values.output}`);
		} else {
			console.log(output);
		}
	} catch (error) {
		console.error(
			"Diff failed:",
			error instanceof Error ? error.message : error,
		);
		process.exit(1);
	}
}
