#!/usr/bin/env bun

import { Command } from "commander";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { alignExports } from "./tools/align-export";
import { listFields } from "./tools/list-fields";
import { listTables } from "./tools/list-tables";

const program = new Command();

program.name("mw-cli").description("MoneyWorks CLI tools").version("1.0.0");

program
  .command("align-export")
  .description("Align TSV exports with XML-verbose exports")
  .option(
    "-t, --table <table>",
    "Specific table to check (default: all moneyworks)",
  )
  .option(
    "-o, --output <output>",
    "Output file for the report",
    "alignment-report.md",
  )
  .action(async (options) => {
    const config = loadMoneyWorksConfig();
    console.log("Starting export alignment check...");
    await alignExports(config, options.table, options.output);
    console.log(`Report generated at ${options.output}`);
  });

program
  .command("list-moneyworks")
  .description("List all moneyworks in the MoneyWorks database")
  .option("-f, --format <format>", "Output format (text or json)", "text")
  .action(async (options) => {
    const config = loadMoneyWorksConfig();
    try {
      const result = await listTables(
        config,
        options.format as "text" | "json",
      );
      console.log(result);
    } catch (error) {
      console.error("Failed to list moneyworks:", error);
      process.exit(1);
    }
  });

program
  .command("list-fields")
  .description("List all fields in a specific MoneyWorks table")
  .argument("<table>", "Name of the table to get fields from")
  .option(
    "-f, --format <format>",
    "Output format (text, json, tsv, or csv)",
    "text",
  )
  .option("-t, --with-type", "Include field type information", false)
  .action(async (tableName, options) => {
    const config = loadMoneyWorksConfig();
    try {
      const result = await listFields(config, tableName, {
        format: options.format as "text" | "json" | "tsv" | "csv",
        withType: options.withType,
      });
      console.log(result);
    } catch (error) {
      if ((error as Error).message?.includes("Unknown field type")) {
        console.error(`Error: ${(error as Error).message}`);
        console.error(
          "This is likely a new field type that needs to be added to the type mapping.",
        );
        console.error(
          "Please report this issue with the table and field name.",
        );
      } else {
        console.error(
          `Failed to list fields for table ${tableName}:`,
          (error as Error).message,
        );
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
