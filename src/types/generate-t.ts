import fs from "node:fs";

/**
 * Generates TypeScript code for an Elysia TObject based on a JSON Schema.
 * @param schema The JSON Schema object.
 * @param indent The indentation level (default is 0).
 * @returns A string of TypeScript code representing the Elysia type.
 */
function generateElysiaTypeCode(schema: any, indent = 0): string {
  const indentStr = " ".repeat(indent * 2); // 2 spaces per indent level

  // Helper to generate code recursively with increased indent
  const gen = (s: any, i: number) => generateElysiaTypeCode(s, i);

  if (schema.type === "object") {
    const properties = schema.properties || {};
    const required = new Set<string>(schema.required || []);
    const propLines: string[] = [];

    for (const [key, propSchema] of Object.entries(properties)) {
      const propCode = gen(propSchema, indent + 1);
      const isRequired = required.has(key);
      const propType = isRequired ? propCode : `t.Optional(${propCode})`;
      propLines.push(`${indentStr}  ${key}: ${propType},`);
    }

    const propStr =
      propLines.length > 0 ? `\n${propLines.join("\n")}\n${indentStr}` : "";
    return `t.Object({${propStr}})`;
  }

  if (schema.type === "array") {
    if (!schema.items) {
      throw new Error('Array schema must have an "items" definition');
    }
    const itemCode = gen(schema.items, indent);
    return `t.Array(${itemCode})`;
  }

  if (schema.type === "string") {
    if (schema.format === "date" || schema.format === "date-time") {
      return "t.Date()";
    }
    return "t.String()";
  }
  if (schema.type === "number" || schema.type === "integer") {
    return "t.Number()";
  }
  if (schema.type === "boolean") {
    return "t.Boolean()";
  }

  throw new Error(`Unsupported schema type: ${schema.type}`);
}

export const Tables = [
  "Account",
  "AutoSplit",
  "BankRecs",
  "Build",
  "Department",
  "Detail",
  "Filter",
  "General",
  "Job",
  "JobSheet",
  "Ledger",
  "Link",
  "List",
  "Log",
  "Login",
  "Memo",
  "Message",
  "Name",
  "OffLedger",
  "Payments",
  "Product",
  "Stickies",
  "TaxRate",
  "Transaction",
  "User",
  "User2",
];

// Data is the type generated, but I also need to supply pagination data
// { total: number, limit: number, offset: number, next?: number | null, prev?: number | null }
function writeFile(name: string) {
  const path = `./json-schema/${name.toLowerCase()}-schema.json`;
  console.log(`Writing ${name} response file`);
  const data = JSON.parse(fs.readFileSync(path, "utf-8"));
  const typeCode = generateElysiaTypeCode(data);
  const code = `import { t } from 'elysia';
export const ${name}One = ${typeCode};
export const ${name}Many = t.Object({
  data: t.Array(${name}One),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
`;
  fs.writeFileSync(`./responses/${name}.ts`, code);
}

for (const table of Tables) {
  writeFile(table);
}
