import { parseArgs } from "node:util";
import { TaxRates } from "@moneyworks/canonical";
import type {
	ExportFormat,
	GlobalOptions,
	SmartMoneyWorksClient,
} from "@moneyworks/data";
import { TaxRateRepository } from "@moneyworks/data";

/**
 * Format array output for display or file
 * @private
 */
function formatArrayOutput(data: any[][]): string {
	// For arrays, we'll format as TSV for compatibility
	return data
		.map((row) =>
			row
				.map((value) =>
					value === null || value === undefined ? "" : String(value),
				)
				.join("\t"),
		)
		.join("\n");
}

export async function exportCommand(
	client: SmartMoneyWorksClient,
	args: string[],
	_globalOptions: GlobalOptions,
): Promise<void> {
	const timing = _globalOptions.timing || false;
	const timingStart = timing ? performance.now() : 0;

	if (args.length === 0) {
		console.error("Usage: mw export TaxRate [options]");
		console.error("");
		console.error("Options:");
		console.error(
			"  -f, --format <format>        MoneyWorks format: json, xml-terse, xml-verbose, tsv (default: json)",
		);
		console.error(
			"  -e, --exportFormat <format>  Export format: compact, compact-headers, full, schema (default: full)",
		);
		console.error(
			"  --filter <expression>        Filter expression (e.g., \"TaxCode='GST10'\")",
		);
		console.error("  -l, --limit <number>         Limit number of records");
		console.error("  -s, --start <number>         Start offset");
		console.error("  -o, --orderBy <field>        Order by field");
		console.error("  -O, --output <file>          Output to file");
		console.error("");
		console.error("Export Formats:");
		console.error("  compact         Raw arrays for minimal overhead");
		console.error("  compact-headers Arrays with field names in first row");
		console.error(
			"  full            Complete objects with field names (default)",
		);
		console.error("  schema          Objects with full field metadata");
		process.exit(1);
	}

	// Only accept TaxRate for now
	const table = args[0];
	if (table !== "TaxRate") {
		console.error(
			`Error: Only 'TaxRate' table is currently supported. Got: '${table}'`,
		);
		console.error(
			"Other tables will be added as they are vetted in the canonical DSL.",
		);
		process.exit(1);
	}

	// Parse export-specific options
	const { values } = parseArgs({
		args: args.slice(1),
		options: {
			format: {
				type: "string",
				short: "f",
				default: "json",
			},
			exportFormat: {
				type: "string",
				short: "e",
				default: "full",
			},
			filter: {
				type: "string",
			},
			limit: {
				type: "string",
				short: "l",
			},
			start: {
				type: "string",
				short: "s",
			},
			orderBy: {
				type: "string",
				short: "o",
			},
			output: {
				type: "string",
				short: "O",
			},
		},
		strict: false,
	});

	try {
		// Only show the message if output is to a file, not stdout
		if (values.output) {
			console.log("Exporting TaxRate records...");
		}

		const format = values.format as string;
		const exportFormat = values.exportFormat as
			| "compact"
			| "compact-headers"
			| "full"
			| "schema";
		const limit = values.limit
			? Number.parseInt(values.limit as string)
			: undefined;
		const start = values.start
			? Number.parseInt(values.start as string)
			: undefined;

		if (_globalOptions.debug) {
			console.log(`Debug: format = ${format}, exportFormat = ${exportFormat}`);
		}

		const exportStart = timing ? performance.now() : 0;

		// Create repository
		const taxRateRepo = new TaxRateRepository(client);

		let result: any;

		// Use smartExport for all formats to get consistent behavior
		result = await client.smartExport("TaxRate", {
			exportFormat,
			search: values.filter as string,
			limit,
			offset: start,
			sort: values.orderBy as string,
		});

		if (timing) {
			const exportEnd = performance.now();
			console.error(
				`[Timing] Export API call: ${(exportEnd - exportStart).toFixed(2)}ms`,
			);
		}

		if (_globalOptions.debug) {
			console.log(`Debug: result type = ${typeof result}`);
			console.log(`Debug: is array = ${Array.isArray(result)}`);
		}

		const outputStart = timing ? performance.now() : 0;

		// Format output based on export format
		let outputContent: string;

		if (exportFormat === "compact" || exportFormat === "compact-headers") {
			// For array formats, we'll use a custom formatter
			outputContent = formatArrayOutput(result);
		} else {
			// For object formats, use JSON stringify
			outputContent = JSON.stringify(result, null, 2);
		}

		if (values.output) {
			await Bun.write(values.output as string, outputContent);
			console.log(`Exported to ${values.output}`);
		} else {
			console.log(outputContent);
		}

		if (timing) {
			const outputEnd = performance.now();
			console.error(
				`[Timing] Output processing: ${(outputEnd - outputStart).toFixed(2)}ms`,
			);
			if (Array.isArray(result)) {
				console.error(`[Timing] Records processed: ${result.length}`);
			} else if (typeof result === "string") {
				console.error(
					`[Timing] Output size: ${(result.length / 1024).toFixed(2)}KB`,
				);
			}
		}
	} catch (error) {
		console.error(
			"Export failed:",
			error instanceof Error ? error.message : error,
		);
		process.exit(1);
	}
}
