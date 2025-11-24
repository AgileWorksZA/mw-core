/**
 * Common API Schemas
 *
 * @moneyworks-dsl PURE
 */

import { type TSchema, t } from "elysia";

/**
 * Standard error response schema
 */
export const ErrorSchema = t.Object(
	{
		error: t.Object({
			code: t.String({
				description: "Error code for programmatic handling",
				examples: ["TABLE_NOT_FOUND", "INVALID_FILTER", "MW_ERROR"],
			}),
			message: t.String({
				description: "Human-readable error message",
			}),
			details: t.Optional(
				t.Any({
					description: "Additional error context",
				}),
			),
			requestId: t.String({
				description: "Unique request identifier for tracking",
			}),
		}),
	},
	{
		description: "Standard error response",
		examples: [
			{
				error: {
					code: "TABLE_NOT_FOUND",
					message: "Table Account is not yet available",
					details: { available: ["TaxRate"], requested: "Account" },
					requestId: "abc123-def456",
				},
			},
		],
	},
);

/**
 * Pagination metadata
 */
export const PaginationSchema = t.Object({
	limit: t.Number({ description: "Number of records requested" }),
	offset: t.Number({ description: "Number of records skipped" }),
	total: t.Optional(t.Number({ description: "Total records available" })),
	hasMore: t.Boolean({ description: "Whether more records exist" }),
});

/**
 * Standard metadata for responses
 */
export const MetadataSchema = t.Object({
	table: t.Optional(t.String({ description: "Table name" })),
	format: t.Optional(t.String({ description: "Export format used" })),
	count: t.Number({ description: "Number of records returned" }),
	timestamp: t.String({ description: "ISO 8601 timestamp" }),
	requestId: t.String({ description: "Request tracking ID" }),
	pagination: t.Optional(PaginationSchema),
});

/**
 * Success response wrapper
 */
export const SuccessResponse = <T extends TSchema>(dataSchema: T) =>
	t.Object({
		data: dataSchema,
		metadata: MetadataSchema,
	});

/**
 * Available export formats
 */
export const ExportFormatEnum = t.Union(
	[
		t.Literal("compact"),
		t.Literal("compact-headers"),
		t.Literal("full"),
		t.Literal("schema"),
	],
	{
		default: "full",
		description: "Export format for table data",
		examples: ["full", "compact"],
	},
);

/**
 * Common headers
 */
export const CommonHeaders = t.Object({
	"x-request-id": t.Optional(t.String({ description: "Request tracking ID" })),
	"x-ratelimit-limit": t.Optional(
		t.String({ description: "Rate limit ceiling" }),
	),
	"x-ratelimit-remaining": t.Optional(
		t.String({ description: "Remaining requests" }),
	),
	"x-ratelimit-reset": t.Optional(
		t.String({ description: "Rate limit reset time" }),
	),
});
