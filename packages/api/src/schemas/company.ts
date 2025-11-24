/**
 * Company Information Schemas
 * Type definitions for company metadata endpoints
 *
 * @moneyworks-dsl PURE
 */

import { t } from "elysia";

/**
 * Company information fields available from MoneyWorks
 * Safe subset of fields that don't expose sensitive data
 * These are accessed as variables in the company context, not functions
 */
export const CompanyFields = [
	"Name",
	"Address1",
	"Address2",
	"Address3",
	"Address4",
	"Phone",
	"Fax",
	"Email",
	"WebURL",
	"PeriodsInYear",
	"CurrentPer",
	"GSTCycleMonths",
	"GstNum",
	"BaseCurrency",
	"Version",
	"Locale",
	"MultiCurrencyEnabled",
	"ExtendedJobCosting",
] as const;

export type CompanyField = (typeof CompanyFields)[number];

/**
 * Company information response schema
 */
export const CompanyInfoSchema = t.Object({
	// Basic info
	name: t.Optional(t.String()),
	address: t.Optional(
		t.Object({
			line1: t.Optional(t.String()),
			line2: t.Optional(t.String()),
			line3: t.Optional(t.String()),
			line4: t.Optional(t.String()),
			country: t.Optional(t.String()),
		}),
	),
	contact: t.Optional(
		t.Object({
			phone: t.Optional(t.String()),
			fax: t.Optional(t.String()),
			email: t.Optional(t.String()),
			website: t.Optional(t.String()),
		}),
	),

	// Accounting settings
	accounting: t.Optional(
		t.Object({
			periodsInYear: t.Optional(t.Number()),
			currentPeriod: t.Optional(t.Number()),
			baseCurrency: t.Optional(t.String()),
			multiCurrencyEnabled: t.Optional(t.Boolean()),
			extendedJobCosting: t.Optional(t.Boolean()),
		}),
	),

	// GST/Tax settings
	tax: t.Optional(
		t.Object({
			gstEnabled: t.Optional(t.Boolean()),
			gstCycleMonths: t.Optional(t.Number()),
			gstRegistrationNumber: t.Optional(t.String()),
		}),
	),

	// System info
	system: t.Optional(
		t.Object({
			version: t.Optional(t.String()),
			platform: t.Optional(t.String()),
			databaseFiles: t.Optional(t.String()),
		}),
	),
});

/**
 * Query schema for company endpoint
 */
export const CompanyQuerySchema = t.Object({
	fields: t.Optional(t.Array(t.String())),
	format: t.Optional(t.Union([t.Literal("nested"), t.Literal("flat")])),
});
