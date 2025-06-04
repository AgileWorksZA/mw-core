import { SystemLabelsService } from "@moneyworks/api/src/services/system/system-labels.service";
import { TableNames } from "@moneyworks/api/src/types/constants";
import {
	SupportedLanguages,
	type TableLabels,
} from "@moneyworks/api/src/types/interface/system/system-labels";
import { z } from "zod";
import { moneyWorksConfig } from "../config/moneyworks.config";

const systemLabelsService = new SystemLabelsService(moneyWorksConfig);

// Prepare enum values for zod
const supportedLanguagesArray = Object.values(SupportedLanguages);
const tableNamesArray = TableNames.map((name) => name);

// Get table labels
const getTableLabelsSchema = z.object({
	tableName: z
		.enum(tableNamesArray as [string, ...string[]])
		.describe(
			"The MoneyWorks table name (e.g., 'Transaction', 'Name', 'Product', 'Account')",
		),
	language: z
		.enum(["en", ...supportedLanguagesArray] as ["en", ...string[]])
		.default("en")
		.describe(
			"Language code for labels. Default is 'en' (English). Other supported languages include fr, de, es, it, pt, nl, sv, da, no, fi, ru, af, ar",
		),
});

export const getTableLabelsTool = {
	description:
		"Get field labels for a specific MoneyWorks table in the specified language",
	inputSchema: getTableLabelsSchema,

	async execute(args: z.infer<typeof getTableLabelsSchema>) {
		const labels = await systemLabelsService.getTableLabels(
			args.tableName,
			args.language,
		);

		return {
			tableName: args.tableName,
			language: args.language,
			labels,
			fieldCount: Object.keys(labels).length,
		};
	},
};

// Generate all labels
const generateAllLabelsSchema = z.object({});

export const generateAllLabelsTool = {
	description:
		"Generate and cache field labels for all MoneyWorks tables in English",
	inputSchema: generateAllLabelsSchema,

	async execute() {
		const results = await systemLabelsService.generateAllLabels();

		const totalFields = Object.values(results).reduce(
			(sum, count) => sum + count,
			0,
		);
		const tablesProcessed = Object.keys(results).length;

		return {
			summary: {
				tablesProcessed,
				totalFields,
				averageFieldsPerTable: Math.round(totalFields / tablesProcessed),
			},
			tableFieldCounts: results,
			message: `Successfully generated labels for ${tablesProcessed} tables with a total of ${totalFields} fields`,
		};
	},
};

// List supported languages
const listSupportedLanguagesSchema = z.object({});

export const listSupportedLanguagesTool = {
	description: "List all languages supported for field label translation",
	inputSchema: listSupportedLanguagesSchema,

	async execute() {
		const languages = {
			en: "English (default)",
			...Object.entries(SupportedLanguages).reduce(
				(acc, [key, value]) => {
					acc[value] = key;
					return acc;
				},
				{} as Record<string, string>,
			),
		};

		return {
			supportedLanguages: languages,
			totalLanguages: Object.keys(languages).length,
			note: "English labels are generated from MoneyWorks directly. Other languages are translated from English labels.",
		};
	},
};

// List available tables
const listAvailableTablesSchema = z.object({});

export const listAvailableTablesTool = {
	description: "List all MoneyWorks tables that support field labels",
	inputSchema: listAvailableTablesSchema,

	async execute() {
		return {
			tables: TableNames,
			totalTables: TableNames.length,
			categories: {
				core: ["Transaction", "Detail", "Name", "Account", "Product", "Job"],
				financial: ["General", "Ledger", "BankRecs", "Payments", "TaxRate"],
				inventory: ["Inventory", "Build"],
				assets: ["Asset", "AssetCat", "AssetLog"],
				system: [
					"User",
					"User2",
					"Login",
					"Log",
					"Message",
					"Stickies",
					"Memo",
				],
				other: [
					"Department",
					"Lists",
					"Link",
					"Filter",
					"JobSheet",
					"AutoSplit",
					"OffLedger",
					"Contacts",
				],
			},
			description: "Available tables for field label queries",
		};
	},
};
