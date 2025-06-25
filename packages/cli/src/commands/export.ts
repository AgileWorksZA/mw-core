import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { TaxRateRepository } from "@moneyworks/data";
import { parseArgs } from "util";

export async function exportCommand(
  client: SmartMoneyWorksClient,
  args: string[],
  _globalOptions: Record<string, unknown>
): Promise<void> {
  const timing = _globalOptions.timing as boolean;
  const timingStart = timing ? performance.now() : 0;
  
  if (args.length === 0) {
    console.error("Usage: mw export TaxRate [options]");
    console.error("");
    console.error("Options:");
    console.error("  -f, --format <format>   Export format: json, xml-terse, xml-verbose, tsv (default: json)");
    console.error("  --filter <expression>   Filter expression (e.g., \"TaxCode='GST10'\")");
    console.error("  -l, --limit <number>    Limit number of records");
    console.error("  -s, --start <number>    Start offset");
    console.error("  -o, --orderBy <field>   Order by field");
    console.error("  -O, --output <file>     Output to file");
    process.exit(1);
  }

  // Only accept TaxRate for now
  const table = args[0];
  if (table !== "TaxRate") {
    console.error(`Error: Only 'TaxRate' table is currently supported. Got: '${table}'`);
    console.error("Other tables will be added as they are vetted in the canonical DSL.");
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
      console.log(`Exporting TaxRate records...`);
    }

    const format = values.format as string;
    const limit = values.limit ? parseInt(values.limit as string) : undefined;
    const start = values.start ? parseInt(values.start as string) : undefined;

    if (_globalOptions.debug) {
      console.log(`Debug: format = ${format}`);
    }
    
    const exportStart = timing ? performance.now() : 0;
    
    // Create repository
    const taxRateRepo = new TaxRateRepository(client);
    
    let result: any;
    
    // Handle different formats
    if (format === "json") {
      // Use repository methods for JSON
      if (values.filter) {
        // For now, we'll use the raw export until we implement proper filtering in the repository
        result = await client.export("TaxRate", {
          format: "json",
          filter: values.filter as string,
          limit,
          start,
          orderBy: values.orderBy as string,
        });
      } else {
        // Use repository's findAll method
        result = await taxRateRepo.findAll({
          limit,
          offset: start,
          orderBy: values.orderBy as string,
        });
      }
    } else {
      // For other formats, use raw export
      result = await client.export("TaxRate", {
        format: format as any,
        filter: values.filter as string,
        limit,
        start,
        orderBy: values.orderBy as string,
      });
    }
    
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
  } catch (error) {
    console.error("Export failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}