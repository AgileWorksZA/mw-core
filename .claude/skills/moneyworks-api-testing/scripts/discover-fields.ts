#!/usr/bin/env bun
/**
 * Generate TypeScript interface from MoneyWorks table schema
 *
 * Usage:
 *   bun discover-fields.ts --table=Job [--primaryKey=Code] [--output=file.ts]
 */

import { writeFileSync } from "fs";
import {
	parseArgs,
	getToken,
	getApiUrl,
	apiRequest,
	exitWithError,
	printUsage,
	mwTypeToTs,
	isOptionalField,
} from "./utils";

const args = parseArgs(process.argv);

if (args.help || !args.table) {
	printUsage(
		"discover-fields.ts",
		[
			"--table=Name         Table name (required)",
			"--primaryKey=Code    Primary key field (default: Code)",
			"--output=file.ts     Write to file instead of stdout",
			"--entity=Name        Entity name override (default: same as table)",
		],
		[
			"bun discover-fields.ts --table=Job",
			"bun discover-fields.ts --table=Transaction --primaryKey=SequenceNumber",
			"bun discover-fields.ts --table=Job --output=packages/canonical/src/entities/job/types.ts",
		]
	);
	process.exit(args.help ? 0 : 1);
}

const token = getToken(args);
const baseUrl = getApiUrl(args);
const table = args.table as string;
const primaryKey = (args.primaryKey as string) || "Code";
const entityName = (args.entity as string) || table;
const outputFile = args.output as string | undefined;

if (!token) {
	exitWithError(
		"No token provided. Use --token=xxx, set MW_TOKEN env var, or add to .env file"
	);
}

// Fetch schema
const schemaResult = await apiRequest<{
	data: {
		table: string;
		primaryKey?: string;
		fields: Array<{
			name: string;
			type: string;
			description?: string;
			required?: boolean;
		}>;
	};
}>(`/tables/${encodeURIComponent(table)}/schema`, { token, baseUrl });

if (!schemaResult.ok) {
	exitWithError(`Failed to get schema for '${table}': ${schemaResult.error}`);
}

const schema = schemaResult.data.data;
const fields = schema.fields || [];

// Generate TypeScript interface
const lines: string[] = [];

// Header
lines.push(`/**`);
lines.push(` * MoneyWorks ${entityName} Type Definitions`);
lines.push(` *`);
lines.push(` * Auto-generated from MoneyWorks schema`);
lines.push(` * Generated: ${new Date().toISOString()}`);
lines.push(` *`);
lines.push(` * @moneyworks-entity ${entityName}`);
lines.push(` * @moneyworks-table ${table}`);
lines.push(` * @moneyworks-dsl PURE`);
lines.push(` *`);
lines.push(
	` * @ai-instruction USE ONLY MoneyWorks field names. NEVER translate.`
);
lines.push(` * @ai-required ${primaryKey}`);
lines.push(` */`);
lines.push(``);

// Import branded types if needed
const hasAccountCode = fields.some(
	(f) => f.name.includes("Account") || f.name.endsWith("Acct")
);
const hasDateField = fields.some((f) => f.type?.toUpperCase().startsWith("D"));

if (hasAccountCode || hasDateField) {
	const imports: string[] = [];
	if (hasAccountCode) imports.push("AccountCode");
	if (hasDateField) imports.push("YYYYMMDD");
	lines.push(`import type { ${imports.join(", ")} } from "@moneyworks/utilities";`);
	lines.push(``);
}

// Main interface
lines.push(`/**`);
lines.push(` * MoneyWorks ${entityName} Entity`);
lines.push(` *`);
lines.push(` * @ai-critical NEVER translate MoneyWorks field names`);
lines.push(` */`);
lines.push(`export interface MoneyWorks${entityName} {`);

// Sort fields - put primary key first, then alphabetically
const sortedFields = [...fields].sort((a, b) => {
	if (a.name === primaryKey) return -1;
	if (b.name === primaryKey) return 1;
	return a.name.localeCompare(b.name);
});

for (const field of sortedFields) {
	const tsType = mwTypeToTs(field.type);
	const optional = field.name !== primaryKey && isOptionalField(field.name, field.type);
	const optionalMarker = optional ? "?" : "";

	// Use branded types where appropriate
	let finalType = tsType;
	if (
		field.type?.toUpperCase().startsWith("D") &&
		!field.name.includes("Time")
	) {
		finalType = "YYYYMMDD";
	} else if (
		field.name.includes("Account") ||
		(field.name.endsWith("Acct") && tsType === "string")
	) {
		finalType = "AccountCode";
	}

	lines.push(`\t/**`);
	if (field.description) {
		lines.push(`\t * ${field.description}`);
	}
	lines.push(`\t * @moneyworks-field ${field.name}`);
	lines.push(`\t * @moneyworks-type ${field.type || "?"}`);
	lines.push(`\t */`);
	lines.push(`\t${field.name}${optionalMarker}: ${finalType};`);
	lines.push(``);
}

lines.push(`}`);
lines.push(``);

// Create input interface
lines.push(`/**`);
lines.push(` * MoneyWorks ${entityName} creation input`);
lines.push(` * Only required fields for creating a new ${entityName.toLowerCase()}`);
lines.push(` */`);
lines.push(`export interface MoneyWorks${entityName}CreateInput {`);
lines.push(`\t${primaryKey}: string;`);
lines.push(`\t// TODO: Add other required creation fields`);
lines.push(`}`);
lines.push(``);

// Update input interface
lines.push(`/**`);
lines.push(` * MoneyWorks ${entityName} update input`);
lines.push(` * All fields optional except ${primaryKey} for identification`);
lines.push(` */`);
lines.push(`export interface MoneyWorks${entityName}UpdateInput {`);
lines.push(`\t${primaryKey}: string;`);
lines.push(`\t// TODO: Add optional update fields`);
lines.push(`}`);
lines.push(``);

// Filter interface
lines.push(`/**`);
lines.push(` * MoneyWorks ${entityName} filter for search/query operations`);
lines.push(` */`);
lines.push(`export interface MoneyWorks${entityName}Filter {`);
lines.push(`\t/** Filter by ${primaryKey} */`);
lines.push(`\t${primaryKey.toLowerCase()}?: string;`);
lines.push(``);
lines.push(`\t/** Search text */`);
lines.push(`\tsearchText?: string;`);
lines.push(`}`);
lines.push(``);

const output = lines.join("\n");

if (outputFile) {
	writeFileSync(outputFile, output, "utf-8");
	console.log(`✅ Generated TypeScript interface at: ${outputFile}`);
	console.log(`   Entity: MoneyWorks${entityName}`);
	console.log(`   Fields: ${fields.length}`);
	console.log(`   Primary Key: ${primaryKey}`);
} else {
	console.log(output);
}
