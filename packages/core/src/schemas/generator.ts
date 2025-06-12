/**
 * JSON Schema Generator
 *
 * Generates JSON Schemas from MoneyWorks TypeScript interfaces.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { TableName } from "../tables";
import { tableNames } from "../tables";

interface FieldConstraint {
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  format?: string;
  minimum?: number;
  maximum?: number;
  enum?: readonly (string | number)[];
}

/**
 * Field constraints for MoneyWorks tables
 */
const fieldConstraints: Record<string, Record<string, FieldConstraint>> = {
  Name: {
    Code: { maxLength: 14, pattern: "^[A-Z0-9]+$" },
    Name: { maxLength: 63 },
    Email: { format: "email" },
    Phone: { maxLength: 20 },
    Mobile: { maxLength: 20 },
    Postcode: { maxLength: 10 },
  },
  Account: {
    Code: { maxLength: 14, pattern: "^[A-Z0-9]+$" },
    Description: { maxLength: 63 },
    AccountType: { enum: [0, 1, 2, 3, 4, 5, 6, 7, 8] as const },
  },
  Transaction: {
    OurRef: { maxLength: 20 },
    Description: { maxLength: 255 },
    TransDate: { format: "date" },
  },
  Product: {
    Code: { maxLength: 19 },
    Description: { maxLength: 255 },
    SellPrice: { minimum: 0 },
    BuyPrice: { minimum: 0 },
  },
  Detail: {
    Account: { maxLength: 14 },
    Description: { maxLength: 255 },
    TaxCode: { maxLength: 7 },
    Department: { maxLength: 14 },
    Job: { maxLength: 31 },
    StockCode: { maxLength: 19 },
  },
};

/**
 * Required fields for tables
 */
const requiredFields: Record<string, string[]> = {
  Name: ["code"],
  Account: ["code", "accountType"],
  Transaction: ["nameCode", "transDate"],
  Product: ["code"],
  Department: ["code"],
  Job: ["code"],
  TaxRate: ["taxCode"],
  Detail: ["parentSeq", "account", "debit", "credit"],
};

/**
 * Generate Zod schema for a table
 */
function generateZodSchema(table: TableName): z.ZodTypeAny {
  const constraints = fieldConstraints[table] || {};
  const required = requiredFields[table] || [];

  // Build schema shape
  const shape: Record<string, z.ZodTypeAny> = {};

  // Add common fields
  shape.sequenceNumber = z.number().int().optional();
  shape.lastModifiedTime = z.string().datetime().optional();

  // Add table-specific fields based on constraints
  for (const [field, constraint] of Object.entries(constraints)) {
    let fieldSchema: z.ZodTypeAny = z.string();

    // Apply constraints
    if (constraint.maxLength) {
      fieldSchema = (fieldSchema as z.ZodString).max(constraint.maxLength);
    }
    if (constraint.minLength) {
      fieldSchema = (fieldSchema as z.ZodString).min(constraint.minLength);
    }
    if (constraint.pattern) {
      fieldSchema = (fieldSchema as z.ZodString).regex(
        new RegExp(constraint.pattern),
      );
    }
    if (constraint.format === "email") {
      fieldSchema = z.string().email();
    }
    if (constraint.format === "date") {
      fieldSchema = z.string().datetime();
    }
    if (constraint.minimum !== undefined) {
      fieldSchema = z.number().min(constraint.minimum);
    }
    if (constraint.maximum !== undefined) {
      fieldSchema = z.number().max(constraint.maximum);
    }
    if (constraint.enum) {
      // Create union of literal types
      const literals = constraint.enum.map((v) => z.literal(v));
      fieldSchema = z.union(
        literals as [
          z.ZodLiteral<string | number>,
          z.ZodLiteral<string | number>,
          ...z.ZodLiteral<string | number>[],
        ],
      );
    }

    // Make optional if not required
    if (!required.includes(field.toLowerCase())) {
      fieldSchema = fieldSchema.optional();
    }

    shape[field.toLowerCase()] = fieldSchema;
  }

  return z.object(shape);
}

/**
 * Generate JSON Schema for a table
 */
export function generateTableSchema(table: TableName): Record<string, unknown> {
  const zodSchema = generateZodSchema(table);

  // Convert to JSON Schema
  return zodToJsonSchema(zodSchema as z.ZodTypeAny, {
    name: table,
    $refStrategy: "none",
  }) as Record<string, unknown>;
}

/**
 * Generate all schemas and save to files
 */
export async function generateAllSchemas(outputDir: string): Promise<void> {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  for (const table of tableNames) {
    const schema = generateTableSchema(table);

    // Save to file
    const filePath = path.join(outputDir, `${table.toLowerCase()}.schema.json`);
    await fs.writeFile(filePath, JSON.stringify(schema, null, 2), "utf-8");

    console.log(`Generated schema for ${table}: ${filePath}`);
  }

  // Generate index file
  const indexContent = tableNames
    .map(
      (table) =>
        `export { default as ${table}Schema } from "./${table.toLowerCase()}.schema.json";`,
    )
    .join("\n");

  await fs.writeFile(
    path.join(outputDir, "index.ts"),
    `// Generated schemas\n${indexContent}\n`,
    "utf-8",
  );
}

/**
 * CLI entry point
 */
if (require.main === module) {
  const outputDir = process.argv[2] || "./src/schemas/generated";
  generateAllSchemas(outputDir)
    .then(() => console.log("All schemas generated successfully"))
    .catch(console.error);
}
