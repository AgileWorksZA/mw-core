#!/usr/bin/env bun
/**
 * Auto-generate TSV field mappings for MoneyWorks tables.
 *
 * Connects to MoneyWorks REST API directly, exports 1 record as both TSV and XML,
 * compares column counts, identifies extra metadata columns, and generates
 * the hardcoded TypeScript mapping array.
 *
 * Usage:
 *   bun packages/data/src/parsers/generate-field-mapping.ts <TableName> [--all]
 *   bun packages/data/src/parsers/generate-field-mapping.ts Account
 *   bun packages/data/src/parsers/generate-field-mapping.ts --all
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Read MW config
const configPath = resolve(import.meta.dir, "../../../../mw-config.json");
const config = JSON.parse(readFileSync(configPath, "utf-8"));

const host = config.host === "localhost" ? "studio.local" : config.host;
const port = config.port || 6710;
const encodedUser = encodeURIComponent(config.username);
const encodedPass = encodeURIComponent(config.password || " ");
const encodedFile = config.dataFile.replace(/\//g, "%2f");
const baseUrl = `http://${host}:${port}/REST/${encodedUser}:${encodedPass}@${encodedFile}`;

async function fetchTSV(table: string): Promise<string> {
	const url = `${baseUrl}/export?table=${table}&limit=1`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`TSV fetch failed: ${res.status} ${await res.text()}`);
	return res.text();
}

async function fetchXML(table: string): Promise<string> {
	const url = `${baseUrl}/export?table=${table}&limit=1&format=xml-verbose`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`XML fetch failed: ${res.status} ${await res.text()}`);
	return res.text();
}

function extractXMLFieldNames(xml: string, table: string): string[] {
	// Match opening tags like <detail.parentseq>, <account.code>, <sequencenumber>
	const prefix = table.toLowerCase() + ".";
	const tableTag = table.toLowerCase();
	const fieldRegex = /<([\w.]+)(?:\s[^>]*)?>([^<]*)<\/\1>/g;
	const seen = new Set<string>();
	const fields: string[] = [];

	let match;
	while ((match = fieldRegex.exec(xml)) !== null) {
		let fieldName = match[1];
		// Skip table wrapper element (e.g., <account>...</account>)
		if (fieldName === tableTag) continue;
		// Strip table prefix if present (e.g., detail.parentseq → parentseq)
		if (fieldName.startsWith(prefix)) {
			fieldName = fieldName.substring(prefix.length);
		}
		if (!seen.has(fieldName)) {
			seen.add(fieldName);
			fields.push(fieldName);
		}
	}
	return fields;
}

function inferDataType(value: string): string {
	if (value === "") return "string";
	if (value === "0" || value === "1") return "boolean";
	if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "string"; // ISO date as string
	if (/^\d{8}$/.test(value)) return "date"; // YYYYMMDD
	if (/^-?\d+(\.\d+)?$/.test(value)) return "number";
	return "string";
}

function toPascalCase(xmlField: string): string {
	// Known casing overrides (preserve MW conventions)
	const overrides: Record<string, string> = {
		sequencenumber: "Sequencenumber",
		lastmodifiedtime: "LastModifiedTime",
		taxcode: "TaxCode",
		parentseq: "ParentSeq",
		stockcode: "StockCode",
		stockqty: "StockQty",
		unitprice: "UnitPrice",
		costprice: "CostPrice",
		saleunit: "SaleUnit",
		jobcode: "JobCode",
		basecurrencynet: "BaseCurrencyNet",
		serialnumber: "SerialNumber",
		transactiontype: "TransactionType",
		securitylevel: "SecurityLevel",
		stocklocation: "StockLocation",
		orderstatus: "OrderStatus",
		expensedtax: "ExpensedTax",
		moreflags: "MoreFlags",
		usernum: "UserNum",
		usertext: "UserText",
		taggedtext: "TaggedText",
		backorderqty: "BackorderQty",
		orderqty: "OrderQty",
		postedqty: "PostedQty",
		originalunitcost: "OriginalUnitCost",
		noninvrcvdnotinvoicedqty: "NonInvRcvdNotInvoicedQty",
		prevshipqty: "PrevShipQty",
		bankaccountnumber: "BankAccountNumber",
		creditcardnum: "CreditCardNum",
		creditcardexpiry: "CreditCardExpiry",
		creditcardname: "CreditCardName",
		customertype: "CustomerType",
		suppliertype: "SupplierType",
		creditlimit: "CreditLimit",
		debtorterms: "DebtorTerms",
		creditorterms: "CreditorTerms",
		paymentmethod: "PaymentMethod",
		bankbranch: "BankBranch",
		accountname: "AccountName",
		weburl: "WebURL",
		productpricing: "ProductPricing",
		dateoflastsale: "DateOfLastSale",
		splitacct1: "SplitAcct1",
		splitacct2: "SplitAcct2",
		splitpercent: "SplitPercent",
		afterhours: "AfterHours",
		sellprice: "Sellprice",
		costprice2: "Costprice",
		stockonhand: "Stockonhand",
		stockvalue: "Stockvalue",
		reorderlevel: "Reorderlevel",
	};

	if (overrides[xmlField]) return overrides[xmlField];

	// Default: capitalize first letter
	return xmlField.charAt(0).toUpperCase() + xmlField.slice(1);
}

function extractXMLFieldValues(xml: string, table: string): Map<string, string> {
	// Extract field name → value pairs from XML
	const prefix = table.toLowerCase() + ".";
	const tableTag = table.toLowerCase();
	const fieldRegex = /<([\w.]+)(?:\s[^>]*)?>([^<]*)<\/\1>/g;
	const values = new Map<string, string>();

	let match;
	while ((match = fieldRegex.exec(xml)) !== null) {
		let fieldName = match[1];
		if (fieldName === tableTag) continue;
		if (fieldName.startsWith(prefix)) {
			fieldName = fieldName.substring(prefix.length);
		}
		if (!values.has(fieldName)) {
			values.set(fieldName, match[2]);
		}
	}
	return values;
}

async function generateMapping(table: string): Promise<string> {
	console.error(`Generating mapping for table: ${table}`);

	const [tsvRaw, xmlRaw] = await Promise.all([fetchTSV(table), fetchXML(table)]);

	// Don't trim — trailing tabs represent empty columns
	const tsvFirstRow = tsvRaw.split("\n")[0];
	const tabCount = (tsvFirstRow.match(/\t/g) || []).length;
	const tsvColCount = tabCount + 1;
	const tsvColumns = tsvFirstRow.split("\t");
	// Pad to full column count
	while (tsvColumns.length < tsvColCount) tsvColumns.push("");

	const xmlFields = extractXMLFieldNames(xmlRaw, table);
	const xmlValues = extractXMLFieldValues(xmlRaw, table);

	console.error(`  TSV columns: ${tsvColCount}`);
	console.error(`  XML fields:  ${xmlFields.length}`);

	// Strategy: match TSV column values to XML field values
	// Build a map of xmlField → tsvPosition by matching values
	const tsvToXml: (string | null)[] = new Array(tsvColCount).fill(null);
	const usedXmlFields = new Set<string>();

	// First pass: match unique non-empty values
	for (let pos = 0; pos < tsvColCount; pos++) {
		const tsvVal = tsvColumns[pos];
		if (tsvVal === "") continue;

		// Check if this value uniquely matches one XML field
		const matches: string[] = [];
		for (const [xmlName, xmlVal] of xmlValues) {
			if (xmlVal === tsvVal && !usedXmlFields.has(xmlName)) {
				matches.push(xmlName);
			}
		}

		if (matches.length === 1) {
			tsvToXml[pos] = matches[0];
			usedXmlFields.add(matches[0]);
		}
	}

	// Detect _Timestamp (ISO date pattern at position 2)
	if (tsvColumns[2] && /^\d{4}-\d{2}-\d{2}/.test(tsvColumns[2]) && !tsvToXml[2]) {
		tsvToXml[2] = "_timestamp";
	}

	// Detect _InternalId at position 0 (usually 0 or a small number)
	if (!tsvToXml[0] && /^\d+$/.test(tsvColumns[0])) {
		// If pos 0 value doesn't match any XML field, it's _InternalId
		const val0 = tsvColumns[0];
		let matchesAnyXml = false;
		for (const [, xmlVal] of xmlValues) {
			if (xmlVal === val0) { matchesAnyXml = true; break; }
		}
		if (!matchesAnyXml) {
			tsvToXml[0] = "_internalid";
		}
	}

	// Second pass: fill remaining positions by order for unmatched XML fields
	const unmatchedXml = xmlFields.filter(f => !usedXmlFields.has(f));
	let unmatchedIdx = 0;
	for (let pos = 0; pos < tsvColCount; pos++) {
		if (tsvToXml[pos] === null && unmatchedIdx < unmatchedXml.length) {
			tsvToXml[pos] = unmatchedXml[unmatchedIdx];
			unmatchedIdx++;
		} else if (tsvToXml[pos] === null) {
			tsvToXml[pos] = `_extra${pos}`;
		}
	}

	// Log the mapping for debugging
	for (let pos = 0; pos < tsvColCount; pos++) {
		const val = tsvColumns[pos] || "(empty)";
		const field = tsvToXml[pos];
		console.error(`  [${pos}] ${field} = ${val.substring(0, 40)}`);
	}

	// Build output
	const lines: string[] = [];
	const constName = `${table.toUpperCase()}_TSV_FIELD_MAPPING`;

	lines.push(`/**`);
	lines.push(` * ${table} table TSV field mapping`);
	lines.push(` * TSV has ${tsvColCount} columns, ${xmlFields.length} XML fields`);
	lines.push(` * Auto-generated by generate-field-mapping.ts`);
	lines.push(` */`);
	lines.push(`export const ${constName} = [`);

	for (let pos = 0; pos < tsvColCount; pos++) {
		const xmlName = tsvToXml[pos]!;
		const pascalName = xmlName.startsWith("_") ? xmlName.charAt(0) + xmlName.charAt(1).toUpperCase() + xmlName.slice(2) : toPascalCase(xmlName);
		const value = tsvColumns[pos] ?? "";
		const dt = xmlName.startsWith("_timestamp") ? "string"
			: xmlName === "_internalid" ? "number"
			: inferDataType(value);
		lines.push(`\t{ position: ${pos}, xmlName: "${xmlName}", pascalName: "${pascalName}", dataType: "${dt}" as const },`);
	}

	lines.push(`];`);

	console.error(`\n  Add to getTSVFieldMapping():`);
	console.error(`    case "${table.toUpperCase()}":`);
	console.error(`      return ${constName};`);

	return lines.join("\n");
}

// Main
const args = process.argv.slice(2);

if (args.length === 0) {
	console.error("Usage: bun generate-field-mapping.ts <TableName> [--all]");
	console.error("       bun generate-field-mapping.ts Account");
	console.error("       bun generate-field-mapping.ts --all");
	process.exit(1);
}

const ALL_TABLES = ["TaxRate", "Name", "Product", "Account", "Contact", "Transaction", "Detail"];

const tables = args[0] === "--all" ? ALL_TABLES : [args[0]];

for (const table of tables) {
	try {
		const mapping = await generateMapping(table);
		console.log("\n" + mapping + "\n");
	} catch (err) {
		console.error(`  ERROR: ${err}`);
	}
}
