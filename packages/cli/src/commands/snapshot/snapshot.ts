/**
 * Snapshot Command
 * Captures the current state of all MoneyWorks tables
 *
 * Usage: bun snapshot <label>
 *
 * @moneyworks-dsl PURE
 */

import { parseArgs } from "node:util";
import type { SmartMoneyWorksClient, GlobalOptions } from "@moneyworks/data";
import {
	SNAPSHOT_TABLES,
	getPrimaryKeyField,
	type SnapshotMetadata,
	type SnapshotOptions,
	type SnapshotResult,
	type SnapshotRecord,
	type TableSnapshot,
} from "./types";

/**
 * Default output directory for snapshots
 */
const DEFAULT_SNAPSHOT_DIR = ".snapshots";

/**
 * Take a snapshot of all registered MoneyWorks tables
 */
export async function takeSnapshot(
	client: SmartMoneyWorksClient,
	options: SnapshotOptions,
): Promise<SnapshotResult> {
	const startTime = new Date().toISOString();
	const outputDir = options.outputDir || DEFAULT_SNAPSHOT_DIR;
	const snapshotPath = `${outputDir}/${options.label}`;
	const tablesToSnapshot = options.tables || [...SNAPSHOT_TABLES];

	// Create snapshot directory
	await Bun.write(`${snapshotPath}/.keep`, "");

	const metadata: SnapshotMetadata = {
		label: options.label,
		timestamp: startTime,
		tables: [],
		totalRecords: 0,
	};

	const errors: Record<string, string> = {};
	let totalRecords = 0;

	if (options.verbose) {
		console.log(`Taking snapshot: ${options.label}`);
		console.log(`Output: ${snapshotPath}`);
		console.log(`Tables: ${tablesToSnapshot.length}`);
		console.log("");
	}

	// Iterate over each table and export
	for (const tableName of tablesToSnapshot) {
		try {
			if (options.verbose) {
				process.stdout.write(`  ${tableName}... `);
			}

			// Export table data using smartExport with full format
			const records = await client.smartExport(tableName, {
				exportFormat: "full",
			});

			// Get primary key field for this table
			const pkField = getPrimaryKeyField(tableName);

			// Transform records to include _primaryKey
			const snapshotRecords: SnapshotRecord[] = [];
			if (Array.isArray(records)) {
				for (const record of records) {
					const pkValue = record[pkField];
					snapshotRecords.push({
						_primaryKey: pkValue as string | number,
						...record,
					});
				}
			}

			const tableSnapshot: TableSnapshot = {
				tableName,
				recordCount: snapshotRecords.length,
				records: snapshotRecords,
				capturedAt: new Date().toISOString(),
			};

			// Write table snapshot to file
			const tableFile = `${snapshotPath}/${tableName}.json`;
			await Bun.write(tableFile, JSON.stringify(tableSnapshot, null, 2));

			metadata.tables.push(tableName);
			totalRecords += snapshotRecords.length;

			if (options.verbose) {
				console.log(`${snapshotRecords.length} records`);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			errors[tableName] = errorMessage;

			if (options.verbose) {
				console.log(`ERROR: ${errorMessage}`);
			}
		}
	}

	metadata.totalRecords = totalRecords;

	// Write metadata file
	const metadataFile = `${snapshotPath}/metadata.json`;
	await Bun.write(metadataFile, JSON.stringify(metadata, null, 2));

	if (options.verbose) {
		console.log("");
		console.log(`Snapshot complete: ${totalRecords} total records`);
		if (Object.keys(errors).length > 0) {
			console.log(`Errors: ${Object.keys(errors).length} tables failed`);
		}
	}

	return {
		success: Object.keys(errors).length === 0,
		path: snapshotPath,
		metadata,
		errors: Object.keys(errors).length > 0 ? errors : undefined,
	};
}

/**
 * CLI command handler for snapshot
 */
export async function snapshotCommand(
	client: SmartMoneyWorksClient,
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
				default: DEFAULT_SNAPSHOT_DIR,
			},
			tables: {
				type: "string",
				short: "t",
			},
			quiet: {
				type: "boolean",
				short: "q",
			},
		},
		strict: false,
		allowPositionals: true,
	});

	// Get label from positional argument
	const label = positionals[0];

	if (!label) {
		console.error("Usage: mw snapshot <label> [options]");
		console.error("");
		console.error("Options:");
		console.error(
			"  -o, --output <dir>    Output directory (default: .snapshots)",
		);
		console.error(
			"  -t, --tables <list>   Comma-separated list of tables to snapshot",
		);
		console.error("  -q, --quiet           Suppress progress output");
		console.error("");
		console.error("Examples:");
		console.error("  mw snapshot baseline");
		console.error("  mw snapshot after-import");
		console.error("  mw snapshot pre-tax-change --tables TaxRate,Transaction");
		process.exit(1);
	}

	// Parse tables list if provided
	let tables: string[] | undefined;
	if (values.tables) {
		tables = (values.tables as string).split(",").map((t) => t.trim());
	}

	const options: SnapshotOptions = {
		label,
		outputDir: values.output as string,
		tables,
		verbose: !values.quiet,
	};

	try {
		const result = await takeSnapshot(client, options);

		if (!result.success) {
			console.error("\nSnapshot completed with errors:");
			for (const [table, error] of Object.entries(result.errors || {})) {
				console.error(`  ${table}: ${error}`);
			}
			process.exit(1);
		}

		if (!values.quiet) {
			console.log(`\nSnapshot saved to: ${result.path}`);
		}
	} catch (error) {
		console.error(
			"Snapshot failed:",
			error instanceof Error ? error.message : error,
		);
		process.exit(1);
	}
}
