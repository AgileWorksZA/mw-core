#!/usr/bin/env bun

import { parseArgs } from "node:util";
import { commands } from "@moneyworks/cli/commands";
import { loadConfig } from "@moneyworks/cli/config";
import { createSmartClient } from "@moneyworks/data";
import { goldCommand } from "@moneyworks/cli/commands/gold/index";

// Parse command line arguments
const { values, positionals } = parseArgs({
	args: process.argv.slice(2),
	options: {
		config: {
			type: "string",
			short: "c",
			default: "./mw-config.json",
		},
		help: {
			type: "boolean",
			short: "h",
		},
		version: {
			type: "boolean",
			short: "v",
		},
		debug: {
			type: "boolean",
			short: "d",
		},
		timing: {
			type: "boolean",
			short: "t",
			description: "Show timing information for the command",
		},
	},
	strict: false,
	allowPositionals: true,
});

// Show version
if (values.version) {
	console.log("MoneyWorks CLI v0.1.0");
	process.exit(0);
}

// Show help
if (values.help || positionals.length === 0) {
	console.log(`
MoneyWorks CLI - Test MoneyWorks Core functionality

Usage: mw <command> [options]

Commands:
  export TaxRate        Export tax rate records
  import TaxRate        Import tax rate records
  eval <expression>     Evaluate a MWScript expression
  version               Get MoneyWorks server version
  list                  List available documents
  test-connection       Test connection to MoneyWorks
  names <command>       Manage names (customers, suppliers, debtors, creditors)

  snapshot <label>      Capture current state of all tables
  diff <before> <after> Compare two snapshots
  action-map <b> <a>    Generate markdown action map from diff

  gold <command>        Control MoneyWorks Gold UI (macOS automation)

Options:
  -c, --config <file>  Config file path (default: ./mw-config.json)
  -d, --debug         Enable debug mode
  -t, --timing        Show timing information
  -h, --help          Show help
  -v, --version       Show version

Export Formats:
  -e, --exportFormat:
    compact         Raw arrays for minimal overhead
    compact-headers Arrays with field names in first row
    full            Complete objects with field names (default)
    schema          Objects with full field metadata

Examples:
  mw export TaxRate --exportFormat compact
  mw export TaxRate --exportFormat schema --output taxrates-schema.json
  mw export TaxRate --filter "TaxCode='GST10'"
  mw export TaxRate --limit 10 --exportFormat compact-headers
  mw eval "Count(TaxRate)"
  mw test-connection

  # Snapshot & Diff workflow
  mw snapshot baseline
  # (make changes in MoneyWorks)
  mw snapshot after-change
  mw diff baseline after-change
  mw action-map baseline after-change --operation create-invoice
  `);
	process.exit(0);
}

// Main CLI logic
async function main() {
	const startTime = values.timing ? performance.now() : 0;

	try {
		const command = positionals[0];

		// Handle gold command separately (doesn't need MW client)
		if (command === "gold") {
			const goldArgs = process.argv.slice(process.argv.indexOf("gold") + 1);
			await goldCommand(goldArgs);
			return;
		}

		// Load config
		const configPath = values.config as string;
		const config = await loadConfig(configPath);

		if (values.debug) {
			config.debug = true;
		}

		// Create client
		const client = createSmartClient(config);

		// Execute command
		const handler = commands[command];
		if (!handler) {
			console.error(`Unknown command: ${command}`);
			console.error(`Run 'mw --help' for available commands`);
			process.exit(1);
		}

		// Pass all args after the command name to the handler
		const commandIndex = process.argv.indexOf(command);
		const commandArgs =
			commandIndex >= 0
				? process.argv.slice(commandIndex + 1)
				: positionals.slice(1);

		if (values.timing) {
			console.error(`\n[Timing] Starting command: ${command}`);
		}

		await handler(client, commandArgs, values);

		if (values.timing) {
			const endTime = performance.now();
			const duration = endTime - startTime;
			console.error(
				`\n[Timing] Command completed in ${duration.toFixed(2)}ms (${(duration / 1000).toFixed(3)}s)`,
			);

			// Additional timing breakdown if available
			if (config.debug) {
				console.error("[Timing] Breakdown:");
				console.error(`  - Total execution: ${duration.toFixed(2)}ms`);
				console.error(`  - Command: ${command}`);
				console.error(`  - Args: ${commandArgs.join(" ")}`);
			}
		}
	} catch (error) {
		if (values.timing) {
			const endTime = performance.now();
			const duration = endTime - startTime;
			console.error(`\n[Timing] Command failed after ${duration.toFixed(2)}ms`);
		}

		console.error("Error:", error instanceof Error ? error.message : error);
		if (values.debug && error instanceof Error) {
			console.error(error.stack);
		}
		process.exit(1);
	}
}

main().catch(console.error);
