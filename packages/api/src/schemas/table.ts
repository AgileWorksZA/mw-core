/**
 * Table-related API Schemas
 *
 * @moneyworks-dsl PURE
 */

import { t } from "elysia";
import { ExportFormatEnum } from "../schemas/common";

/**
 * Table export query parameters
 */
export const TableExportQuerySchema = t.Object(
	{
		format: t.Optional(ExportFormatEnum),
		filter: t.Optional(
			t.String({
				description: "MoneyWorks filter expression",
				examples: ["TaxCode='GST10'", "Rate > 5"],
			}),
		),
		limit: t.Optional(
			t.Number({
				min: 1,
				max: 10000,
				default: 100,
				description: "Maximum records to return",
			}),
		),
		offset: t.Optional(
			t.Number({
				min: 0,
				default: 0,
				description: "Number of records to skip",
			}),
		),
		orderBy: t.Optional(
			t.String({
				description: "Field to sort by",
				examples: ["TaxCode", "Rate DESC"],
			}),
		),
	},
	{
		description: "Query parameters for table export",
	},
);

/**
 * Table list response
 */
export const TableListSchema = t.Object(
	{
		available: t.Array(t.String(), {
			description: "Tables currently available for use",
		}),
		vetted: t.Array(t.String(), {
			description: "Tables that have been fully vetted",
		}),
		upcoming: t.Array(t.String(), {
			description: "Tables being prepared for release",
		}),
	},
	{
		description: "List of MoneyWorks tables by status",
		examples: [
			{
				available: ["TaxRate"],
				vetted: ["TaxRate"],
				upcoming: ["Account", "Transaction", "Name", "Product"],
			},
		],
	},
);

/**
 * Table schema field info
 */
export const FieldInfoSchema = t.Object({
	name: t.String({ description: "Field name" }),
	position: t.Number({ description: "Field position in TSV" }),
	dataType: t.Union(
		[
			t.Literal("string"),
			t.Literal("number"),
			t.Literal("boolean"),
			t.Literal("date"),
		],
		{ description: "Data type" },
	),
	canonicalType: t.Optional(
		t.String({
			description: "Canonical MoneyWorks type",
		}),
	),
	maxLength: t.Optional(
		t.Number({
			description: "Maximum field length",
		}),
	),
	required: t.Optional(
		t.Boolean({
			description: "Whether field is required",
		}),
	),
});

/**
 * Table schema response
 */
export const TableSchemaSchema = t.Object(
	{
		table: t.String({ description: "Table name" }),
		fields: t.Array(FieldInfoSchema, {
			description: "Field definitions",
		}),
		primaryKey: t.Optional(
			t.String({
				description: "Primary key field",
			}),
		),
		description: t.Optional(
			t.String({
				description: "Table description",
			}),
		),
	},
	{
		description: "Complete table schema information",
	},
);

/**
 * Compact format response (raw arrays)
 */
export const CompactFormatSchema = t.Array(
	t.Array(t.Any(), { description: "Row values" }),
	{ description: "Compact format: array of arrays" },
);

/**
 * Full format response (objects)
 */
export const FullFormatSchema = t.Array(
	t.Record(t.String(), t.Any(), {
		description: "Record as object with field names",
	}),
	{ description: "Full format: array of objects" },
);

/**
 * Schema-enriched format
 */
export const SchemaEnrichedSchema = t.Object(
	{
		schema: t.Record(
			t.String(),
			t.Object({
				type: t.String(),
				maxLength: t.Optional(t.Number()),
				required: t.Optional(t.Boolean()),
				description: t.Optional(t.String()),
			}),
		),
		data: t.Array(t.Record(t.String(), t.Any())),
		metadata: t.Optional(
			t.Object({
				table: t.String(),
				exportedAt: t.String(),
				fieldCount: t.Number(),
				recordCount: t.Number(),
			}),
		),
	},
	{
		description: "Schema-enriched format with field metadata",
	},
);

/**
 * Dynamic export response based on format
 */
export const TableExportResponseSchema = t.Union(
	[CompactFormatSchema, FullFormatSchema, SchemaEnrichedSchema],
	{
		description: "Table data in requested format",
	},
);

/**
 * Import mode enum
 */
export const ImportModeEnum = t.Union(
	[t.Literal("insert"), t.Literal("update"), t.Literal("replace")],
	{
		description:
			"Import mode: insert (create only), update (update only), replace (upsert)",
		default: "replace",
	},
);

/**
 * Import request body schema
 */
export const TableImportBodySchema = t.Object(
	{
		records: t.Array(t.Record(t.String(), t.Any()), {
			description: "Array of records to import",
			minItems: 1,
			maxItems: 1000,
		}),
		mode: t.Optional(ImportModeEnum),
		workItOut: t.Optional(
			t.Boolean({
				description: "Let MoneyWorks work out field mappings",
				default: false,
			}),
		),
		calculated: t.Optional(
			t.Boolean({
				description: "Recalculate calculated fields after import",
				default: false,
			}),
		),
		validate: t.Optional(
			t.Boolean({
				description: "Validate records before sending to MoneyWorks",
				default: true,
			}),
		),
	},
	{
		description: "Import request body",
		examples: [
			{
				records: [
					{ TaxCode: "GST15", Rate: 15, Description: "GST 15%" },
					{ TaxCode: "GST10", Rate: 10, Description: "GST 10%" },
				],
				mode: "replace",
				validate: true,
			},
		],
	},
);

/**
 * Import error detail schema
 */
export const ImportErrorDetailSchema = t.Object({
	recordIndex: t.Number({ description: "Zero-based index of failed record" }),
	field: t.Optional(t.String({ description: "Field that caused the error" })),
	message: t.String({ description: "Error message" }),
	code: t.Optional(t.String({ description: "Error code" })),
	value: t.Optional(t.Any({ description: "Value that caused the error" })),
});

/**
 * Import result schema
 */
export const ImportResultSchema = t.Object(
	{
		success: t.Boolean({ description: "Whether import was successful" }),
		processed: t.Number({ description: "Total records processed" }),
		created: t.Number({ description: "Records created" }),
		updated: t.Number({ description: "Records updated" }),
		skipped: t.Number({ description: "Records skipped" }),
		errors: t.Number({ description: "Number of errors" }),
		errorDetails: t.Array(ImportErrorDetailSchema, {
			description: "Detailed error information",
		}),
		rawResponse: t.Optional(
			t.String({ description: "Raw MoneyWorks response" }),
		),
	},
	{
		description: "Import operation result",
		examples: [
			{
				success: true,
				processed: 2,
				created: 2,
				updated: 0,
				skipped: 0,
				errors: 0,
				errorDetails: [],
			},
		],
	},
);
