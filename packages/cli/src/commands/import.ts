import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import type { TaxRates } from "@moneyworks/canonical";
import type {
	GlobalOptions,
	ImportResult,
	SmartMoneyWorksClient,
} from "@moneyworks/data";

export async function importCommand(
	client: SmartMoneyWorksClient,
	args: string[],
	_globalOptions: GlobalOptions,
): Promise<void> {
	if (args.length < 2) {
		console.error("Usage: mw import TaxRate <file> [options]");
		console.error("Example: mw import TaxRate taxrates.json");
		process.exit(1);
	}

	const table = args[0];
	const filePath = args[1];

	// Only accept TaxRate for now
	if (table !== "TaxRate") {
		console.error(
			`Error: Only 'TaxRate' table is currently supported. Got: '${table}'`,
		);
		console.error(
			"Other tables will be added as they are vetted in the canonical DSL.",
		);
		process.exit(1);
	}

	// Parse import-specific options
	const { values } = parseArgs({
		args: args.slice(2),
		options: {
			mode: {
				type: "string",
				short: "m",
				default: "create",
			},
			workItOut: {
				type: "boolean",
				short: "w",
			},
			calculated: {
				type: "boolean",
			},
		},
		strict: false,
	});

	try {
		console.log(`Importing TaxRate records from ${filePath}...`);

		// Read file
		const fileContent = await readFile(filePath, "utf-8");
		const records = JSON.parse(
			fileContent,
		) as Partial<TaxRates.MoneyWorksTaxRate>[];

		if (!Array.isArray(records)) {
			throw new Error("File must contain an array of TaxRate records");
		}

		console.log(`Found ${records.length} records to import`);

		// Import records using raw client for now
		// TODO: Add import method to TaxRateRepository
		const result: ImportResult = await client.import("TaxRate", records, {
			mode: values.mode as "create" | "update" | "createOrUpdate",
			workItOut: values.workItOut as boolean,
			calculated: values.calculated as boolean,
		});

		console.log("Import complete:");
		console.log(`  Processed: ${result.processed}`);
		console.log(`  Created: ${result.created}`);
		console.log(`  Updated: ${result.updated}`);
		console.log(`  Errors: ${result.errors}`);

		if (result.errorDetails && result.errorDetails.length > 0) {
			console.error("\nErrors:");
			for (const error of result.errorDetails) {
				console.error(`  Record ${error.record}: ${error.message}`);
			}
		}
	} catch (error) {
		console.error(
			"Import failed:",
			error instanceof Error ? error.message : error,
		);
		process.exit(1);
	}
}
