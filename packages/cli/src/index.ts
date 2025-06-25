#!/usr/bin/env bun

import { parseArgs } from "util";
import { createSmartClient } from "@moneyworks/data";
import { commands } from "@moneyworks/cli/commands";
import { loadConfig } from "@moneyworks/cli/config";

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
  export TaxRate      Export tax rate records
  import TaxRate      Import tax rate records  
  eval <expression>   Evaluate a MWScript expression
  version            Get MoneyWorks server version
  list               List available documents
  test-connection    Test connection to MoneyWorks

Options:
  -c, --config <file>  Config file path (default: ./mw-config.json)
  -d, --debug         Enable debug mode
  -t, --timing        Show timing information
  -h, --help          Show help
  -v, --version       Show version

Export Formats:
  json         JSON format (default)
  xml-terse    Compact XML format
  xml-verbose  Detailed XML format with all fields
  tsv          Tab-separated values

Examples:
  mw export TaxRate --filter "TaxCode='GST10'"
  mw export TaxRate --limit 10 --format xml-verbose
  mw export TaxRate --format tsv --output taxrates.tsv
  mw export TaxRate --format xml-terse > taxrates.xml
  mw eval "Count(TaxRate)"
  mw test-connection
  `);
  process.exit(0);
}

// Main CLI logic
async function main() {
  const startTime = values.timing ? performance.now() : 0;
  
  try {
    const command = positionals[0];
    
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
    const commandArgs = commandIndex >= 0 ? process.argv.slice(commandIndex + 1) : positionals.slice(1);
    
    if (values.timing) {
      console.error(`\n[Timing] Starting command: ${command}`);
    }
    
    await handler(client, commandArgs, values);
    
    if (values.timing) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`\n[Timing] Command completed in ${duration.toFixed(2)}ms (${(duration / 1000).toFixed(3)}s)`);
      
      // Additional timing breakdown if available
      if (config.debug) {
        console.error(`[Timing] Breakdown:`);
        console.error(`  - Total execution: ${duration.toFixed(2)}ms`);
        console.error(`  - Command: ${command}`);
        console.error(`  - Args: ${commandArgs.join(' ')}`);
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