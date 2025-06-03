import { EvaluateService } from "@moneyworks/api/src/services/system/evaluate.service";
import type { MoneyWorksConfig } from "@moneyworks/api/src/types/moneyworks";
import { z } from "zod";

// Initialize with default config - this should be replaced with actual config
const defaultConfig: MoneyWorksConfig = {
	host: process.env.MONEYWORKS_HOST || "localhost",
	port: Number(process.env.MONEYWORKS_PORT) || 6700,
	dataFile: process.env.MONEYWORKS_DATAFILE || "",
	username: process.env.MONEYWORKS_USERNAME || "",
	password: process.env.MONEYWORKS_PASSWORD || "",
};

const evaluateService = new EvaluateService(defaultConfig);

// Evaluate expression
const evaluateExpressionSchema = z.object({
	expression: z
		.string()
		.describe(
			"The MoneyWorks expression to evaluate (e.g., 'GetPeriod()', 'CurrentUser()', 'Date()', mathematical expressions, etc.)",
		),
});

export const evaluateExpressionTool = {
	description:
		"Evaluate a MoneyWorks expression and return the result. Supports system functions, calculations, and data queries",
	inputSchema: evaluateExpressionSchema,

	async execute(args: z.infer<typeof evaluateExpressionSchema>) {
		try {
			const result = await evaluateService.evaluateExpression(args.expression);

			return {
				expression: args.expression,
				result,
				type: typeof result,
			};
		} catch (error) {
			// Handle specific MoneyWorks expression errors
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			// Check for common expression errors
			if (errorMessage.includes("syntax") || errorMessage.includes("parse")) {
				throw new Error(
					`Invalid expression syntax: ${errorMessage}. Please check your MoneyWorks expression syntax.`,
				);
			}

			if (errorMessage.includes("unknown function")) {
				throw new Error(
					`Unknown function in expression: ${errorMessage}. Please verify the function name is correct.`,
				);
			}

			// Re-throw with context
			throw new Error(`Expression evaluation failed: ${errorMessage}`);
		}
	},
};

// Evaluate template
const evaluateTemplateSchema = z.object({
	table: z
		.string()
		.describe(
			"The MoneyWorks table to evaluate the template against (e.g., 'account', 'transaction', 'name', 'product')",
		),
	template: z
		.string()
		.describe(
			"The custom template to evaluate. Use MoneyWorks field names and expressions within the template",
		),
});

export const evaluateTemplateTool = {
	description:
		"Evaluate a custom template against a specific MoneyWorks table. Returns an array of evaluated results for each record",
	inputSchema: evaluateTemplateSchema,

	async execute(args: z.infer<typeof evaluateTemplateSchema>) {
		try {
			const results = await evaluateService.evaluateTemplate(
				args.table,
				args.template,
			);

			return {
				table: args.table,
				template: args.template,
				results,
				count: results.length,
			};
		} catch (error) {
			// Handle specific template evaluation errors
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			// Check for common template errors
			if (errorMessage.includes("unknown table")) {
				throw new Error(
					`Unknown table '${args.table}'. Please verify the table name is correct.`,
				);
			}

			if (
				errorMessage.includes("field") &&
				errorMessage.includes("not found")
			) {
				throw new Error(
					`Invalid field reference in template: ${errorMessage}. Please check field names used in the template.`,
				);
			}

			// Re-throw with context
			throw new Error(`Template evaluation failed: ${errorMessage}`);
		}
	},
};

// List common expressions
const listCommonExpressionsSchema = z.object({});

export const listCommonExpressionsTool = {
	description:
		"List common MoneyWorks expressions and functions that can be used with the evaluate tool",
	inputSchema: listCommonExpressionsSchema,

	async execute() {
		return {
			categories: {
				system: {
					description: "System information functions",
					examples: [
						"GetPeriod() - Get current accounting period",
						"CurrentUser() - Get current user name",
						"Date() - Get current date",
						"Time() - Get current time",
						"Version() - Get MoneyWorks version",
					],
				},
				date: {
					description: "Date manipulation functions",
					examples: [
						"Today() - Today's date",
						"Month(date) - Extract month from date",
						"Year(date) - Extract year from date",
						"DayOfWeek(date) - Day of week (1-7)",
						"DateAdd(date, days) - Add days to date",
					],
				},
				text: {
					description: "Text manipulation functions",
					examples: [
						"Upper(text) - Convert to uppercase",
						"Lower(text) - Convert to lowercase",
						"Trim(text) - Remove leading/trailing spaces",
						"Left(text, n) - First n characters",
						"Right(text, n) - Last n characters",
					],
				},
				math: {
					description: "Mathematical operations",
					examples: [
						"Round(value, decimals) - Round to decimal places",
						"Abs(value) - Absolute value",
						"Min(a, b) - Minimum of two values",
						"Max(a, b) - Maximum of two values",
						"Sum(field) - Sum of field values",
					],
				},
				lookup: {
					description: "Data lookup functions",
					examples: [
						"Lookup(table, keyField, keyValue, returnField) - Lookup value",
						"Count(table, criteria) - Count matching records",
						"Sum(table.field, criteria) - Sum field with criteria",
						"Average(table.field, criteria) - Average with criteria",
					],
				},
			},
			usage: "Pass any of these expressions to the evaluateExpression tool",
			templateUsage:
				"For templates, combine field names and expressions, e.g., 'Account: [Code] - [Description]\\nBalance: [Balance]'",
		};
	},
};
