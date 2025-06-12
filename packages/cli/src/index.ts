#!/usr/bin/env bun

import { parseArgs } from "util";
import { MoneyWorksRESTClient } from "@moneyworks/core";
import type { TableName, MoneyWorksConfig } from "@moneyworks/core";
import { commands } from "./commands";
import { loadConfig } from "./config";

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
  export <table>      Export records from a table
  import <table>      Import records into a table
  eval <expression>   Evaluate a MWScript expression
  version            Get MoneyWorks server version
  list               List available documents
  test-connection    Test connection to MoneyWorks

Options:
  -c, --config <file>  Config file path (default: ./mw-config.json)
  -d, --debug         Enable debug mode
  -h, --help          Show help
  -v, --version       Show version

Export Formats:
  json         JSON format (default)
  xml-terse    Compact XML format
  xml-verbose  Detailed XML format with all fields
  tsv          Tab-separated values

Examples:
  mw export Account --filter "Type=1"
  mw export Transaction --limit 10 --format xml-verbose
  mw export Account --format tsv --output accounts.tsv
  mw export Product --format xml-terse > products.xml
  mw eval "Count(Account)"
  mw test-connection
  `);
  process.exit(0);
}

// Main CLI logic
async function main() {
  try {
    const command = positionals[0];
    
    // Load config
    const configPath = values.config as string;
    const config = await loadConfig(configPath);
    
    if (values.debug) {
      config.debug = true;
    }
    
    // Create client
    const client = new MoneyWorksRESTClient(config);
    
    // Execute command
    const handler = commands[command];
    if (!handler) {
      console.error(`Unknown command: ${command}`);
      console.error(`Run 'mw --help' for available commands`);
      process.exit(1);
    }
    
    await handler(client, positionals.slice(1), values);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    if (values.debug && error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();