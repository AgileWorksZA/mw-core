/**
 * MWScript Evaluation Schemas
 *
 * @moneyworks-dsl PURE
 */

import { t } from "elysia";

/**
 * Eval request body
 */
export const EvalRequestSchema = t.Object(
	{
		expression: t.String({
			description: "MWScript expression to evaluate",
			examples: ["1 + 1", "Date()", 'Upper("hello")', "Month(Date())"],
		}),
		context: t.Optional(
			t.Object(
				{
					table: t.Optional(
						t.String({
							description: "Table context for evaluation",
						}),
					),
					record: t.Optional(
						t.Record(t.String(), t.Any(), {
							description: "Record context for field references",
						}),
					),
				},
				{
					description: "Optional evaluation context",
				},
			),
		),
	},
	{
		description: "MWScript evaluation request",
		examples: [
			{
				expression: "1 + 1",
			},
			{
				expression: "Upper(TaxCode)",
				context: {
					table: "TaxRate",
					record: { TaxCode: "gst10" },
				},
			},
		],
	},
);

/**
 * Eval response
 */
export const EvalResponseSchema = t.Object(
	{
		expression: t.String({
			description: "Original expression",
		}),
		result: t.String({
			description: "Evaluation result as string",
		}),
		dataType: t.Optional(
			t.Union(
				[
					t.Literal("string"),
					t.Literal("number"),
					t.Literal("boolean"),
					t.Literal("date"),
				],
				{
					description: "Detected result data type",
				},
			),
		),
		executionTime: t.Optional(
			t.Number({
				description: "Execution time in milliseconds",
			}),
		),
	},
	{
		description: "MWScript evaluation result",
		examples: [
			{
				expression: "1 + 1",
				result: "2",
				dataType: "number",
				executionTime: 0.5,
			},
			{
				expression: "Date()",
				result: "20250630",
				dataType: "date",
				executionTime: 1.2,
			},
		],
	},
);
