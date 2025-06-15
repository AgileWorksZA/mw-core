import type { MoneyWorksRESTClient, TableName, ExportFormat } from "@moneyworks/core";
import { parseArgs } from "util";

export async function exportCommand(
  client: MoneyWorksRESTClient,
  args: string[],
  _globalOptions: Record<string, unknown>
): Promise<void> {
  const timing = _globalOptions.timing as boolean;
  const timingStart = timing ? performance.now() : 0;
  if (args.length === 0) {
    console.error("Usage: mw export <table> [options]");
    console.error("Tables: Account, Transaction, Name, Product, Department, Job, etc.");
    console.error("");
    console.error("Options:");
    console.error("  -f, --format <format>   Export format: json, xml-terse, xml-verbose, tsv (default: json)");
    console.error("  --filter <expression>   Filter expression (e.g., \"Type=1\")");
    console.error("  -l, --limit <number>    Limit number of records");
    console.error("  -s, --start <number>    Start offset");
    console.error("  -o, --orderBy <field>   Order by field");
    console.error("  -O, --output <file>     Output to file");
    console.error("  --stream                Stream large datasets (JSON only)");
    process.exit(1);
  }

  // Normalize table name - first letter uppercase
  const tableInput = args[0];
  const table = (tableInput.charAt(0).toUpperCase() + tableInput.slice(1)) as TableName;

  // Parse export-specific options
  const { values } = parseArgs({
    args: args.slice(1),
    options: {
      format: {
        type: "string",
        short: "f",
        default: "json",
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
      stream: {
        type: "boolean",
      },
    },
    strict: false,
  });

  try {
    // Only show the message if output is to a file, not stdout
    if (values.output) {
      console.log(`Exporting ${table} records...`);
    }

    const format = values.format as ExportFormat;
    const limit = values.limit ? parseInt(values.limit as string) : undefined;
    const start = values.start ? parseInt(values.start as string) : undefined;

    if (values.stream) {
      // Stream export for large datasets (only works with formats that return arrays)
      if (format === "tsv" || (typeof format === "string" && format.startsWith("xml"))) {
        console.error("Streaming is only supported for JSON format. Use regular export for XML/TSV.");
        process.exit(1);
      }
      
      let count = 0;
      const stream = client.exportStream(table, {
        format: "json", // Force JSON for streaming
        filter: values.filter as string,
        orderBy: values.orderBy as string,
        chunkSize: 100,
        onProgress: (progress) => {
          process.stdout.write(
            `\rProcessed: ${progress.current}${
              progress.total ? ` / ${progress.total}` : ""
            }${progress.percentage ? ` (${progress.percentage.toFixed(1)}%)` : ""}`
          );
        },
      });

      const records: unknown[] = [];
      for await (const batch of stream) {
        records.push(...batch);
        count += batch.length;
      }
      console.log(`\nExported ${count} records`);

      // Output results
      if (values.output) {
        await Bun.write(values.output as string, JSON.stringify(records, null, 2));
        console.log(`Saved to ${values.output}`);
      } else {
        console.log(JSON.stringify(records, null, 2));
      }
    } else {
      // Regular export
      if (_globalOptions.debug) {
        console.log(`Debug: format = ${format}`);
      }
      
      const exportStart = timing ? performance.now() : 0;
      const result = await client.export(table, {
        format,
        filter: values.filter as string,
        limit,
        start,
        orderBy: values.orderBy as string,
      });
      
      if (timing) {
        const exportEnd = performance.now();
        console.error(`[Timing] Export API call: ${(exportEnd - exportStart).toFixed(2)}ms`);
      }
      
      if (_globalOptions.debug) {
        console.log(`Debug: result type = ${typeof result}`);
        console.log(`Debug: is array = ${Array.isArray(result)}`);
      }

      const outputStart = timing ? performance.now() : 0;
      
      if (values.output) {
        if (typeof result === "string") {
          await Bun.write(values.output as string, result);
        } else {
          await Bun.write(values.output as string, JSON.stringify(result, null, 2));
        }
        console.log(`Exported to ${values.output}`);
      } else {
        if (typeof result === "string") {
          console.log(result);
        } else {
          console.log(JSON.stringify(result, null, 2));
        }
      }
      
      if (timing) {
        const outputEnd = performance.now();
        console.error(`[Timing] Output processing: ${(outputEnd - outputStart).toFixed(2)}ms`);
        if (Array.isArray(result)) {
          console.error(`[Timing] Records processed: ${result.length}`);
        } else if (typeof result === "string") {
          console.error(`[Timing] Output size: ${(result.length / 1024).toFixed(2)}KB`);
        }
      }
    }
  } catch (error) {
    console.error("Export failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}