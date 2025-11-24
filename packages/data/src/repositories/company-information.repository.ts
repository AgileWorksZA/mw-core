/**
 * MoneyWorks Company Information Repository
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles company information retrieval
 * @ai-critical Use exact MoneyWorks field names for company data
 */

import type { SmartMoneyWorksClient } from "../client/moneyworks-smart-client";

/**
 * Company Information interface based on MoneyWorks fields
 */
export interface CompanyInformation {
	// Basic Information
	Name?: string;
	Address1?: string;
	Address2?: string;
	Address3?: string;
	Address4?: string;
	State?: string;
	PostCode?: string;
	Delivery1?: string;
	Delivery2?: string;
	Delivery3?: string;
	Delivery4?: string;
	DeliveryState?: string;
	DeliveryPostCode?: string;
	Phone?: string;
	Fax?: string;
	Email?: string;
	WebURL?: string;
	Mobile?: string;

	// Tax & Legal
	TaxName?: string;
	GstNum?: string;
	RegNum?: string;
	RemittanceMessage?: string;
	CoRegName?: string;

	// System & Configuration
	Have_Logo?: boolean;
	BaseCurrency?: string;
	Locale?: string;
	LocaleFriendlyName?: string;
	Version?: string;
	LogFilePath?: string;

	// Accounting Periods
	PeriodsInYear?: number;
	CurrentPer?: number;
	AgingCycle?: number;
	PeriodNames?: string;

	// GST Configuration
	GstCycleEndDate?: string;
	GSTCycleMonths?: number;
	GstCycleNum?: number;
	GstIncomeInvoiceBasis?: boolean;
	ExtendedJobCosting?: boolean;
	GSTExpensesInvoiceBasis?: boolean;
	GSTIncomeInvoiceBasis?: boolean;
	GSTProcessingSuppressed?: boolean;
	GSTGuideName?: string;
	GSTRegName?: string;

	// System Status
	LastAgedDebtors?: string;
	LastBackup?: string;
	LastStocktake?: string;
	MultiCurrencyEnabled?: boolean;
	NavigatorActive?: boolean;
	NetworkLatency?: number;
	StartupSequenceNumJob?: number;
}

/**
 * All available company information fields
 */
export const COMPANY_INFORMATION_FIELDS: (keyof CompanyInformation)[] = [
	"Name",
	"Address1",
	"Address2",
	"Address3",
	"Address4",
	"State",
	"PostCode",
	"Delivery1",
	"Delivery2",
	"Delivery3",
	"Delivery4",
	"DeliveryState",
	"DeliveryPostCode",
	"Phone",
	"Fax",
	"Email",
	"WebURL",
	"Mobile",
	"TaxName",
	"GstNum",
	"RegNum",
	"RemittanceMessage",
	"Have_Logo",
	"BaseCurrency",
	"Locale",
	"LocaleFriendlyName",
	"Version",
	"LogFilePath",
	"PeriodsInYear",
	"CurrentPer",
	"AgingCycle",
	"PeriodNames",
	"GstCycleEndDate",
	"GSTCycleMonths",
	"GstCycleNum",
	"GstIncomeInvoiceBasis",
	"CoRegName",
	"ExtendedJobCosting",
	"GSTExpensesInvoiceBasis",
	"GSTIncomeInvoiceBasis",
	"GSTProcessingSuppressed",
	"GSTGuideName",
	"GSTRegName",
	"LastAgedDebtors",
	"LastBackup",
	"LastStocktake",
	"MultiCurrencyEnabled",
	"NavigatorActive",
	"NetworkLatency",
	"StartupSequenceNumJob",
];

/**
 * Repository for MoneyWorks Company Information
 *
 * @ai-instruction Use this for retrieving company setup information
 */
export class CompanyInformationRepository {
	constructor(private client: SmartMoneyWorksClient) {}

	/**
	 * Get company information using the comprehensive field list
	 *
	 * @param fields - Optional array of specific fields to retrieve (defaults to all)
	 * @returns Company information object
	 */
	async getCompanyInformation(
		fields: (keyof CompanyInformation)[] = COMPANY_INFORMATION_FIELDS,
	): Promise<CompanyInformation> {
		try {
			const companyData: Partial<CompanyInformation> = {};
			const errors: string[] = [];

			// Fetch in batches of 15 to avoid expression length limits
			const batchSize = 15;
			for (let i = 0; i < fields.length; i += batchSize) {
				const batchFields = fields.slice(i, i + batchSize);
				const expression = `ConcatAllWith("\\t", ${batchFields.join(", ")})`;

				try {
					console.log(
						`[Company Info] Evaluating batch ${Math.floor(i / batchSize) + 1}:`,
						batchFields,
					);
					const response = await this.client.evaluate(expression);
					console.log("[Company Info] Response:", response);

					if (response) {
						const values = response.split("\t");
						batchFields.forEach((field, index) => {
							const value = values[index];
							if (
								value !== undefined &&
								value !== null &&
								value !== "" &&
								value !== "?"
							) {
								companyData[field] = this.parseFieldValue(field, value);
							}
						});
					}
				} catch (err) {
					console.warn(
						`[Company Info] Failed to fetch batch ${Math.floor(i / batchSize) + 1}:`,
						err,
					);
					errors.push(
						`Some fields in batch ${Math.floor(i / batchSize) + 1} could not be fetched`,
					);
				}
			}

			// Add any errors as metadata (not part of interface but useful for debugging)
			if (errors.length > 0) {
				console.warn("[Company Info] Errors during fetch:", errors);
			}

			return companyData as CompanyInformation;
		} catch (error) {
			console.error("[Company Info Repository] Error:", error);
			throw error;
		}
	}

	/**
	 * Parse field value based on known field types
	 */
	private parseFieldValue(field: keyof CompanyInformation, value: string): any {
		// Boolean fields
		if (
			[
				"Have_Logo",
				"ExtendedJobCosting",
				"GSTExpensesInvoiceBasis",
				"GSTIncomeInvoiceBasis",
				"GSTProcessingSuppressed",
				"MultiCurrencyEnabled",
				"NavigatorActive",
				"GstIncomeInvoiceBasis",
			].includes(field as string)
		) {
			return value === "1" || value.toLowerCase() === "true";
		}

		// Numeric fields
		if (
			[
				"PeriodsInYear",
				"CurrentPer",
				"AgingCycle",
				"GSTCycleMonths",
				"GstCycleNum",
				"NetworkLatency",
				"StartupSequenceNumJob",
			].includes(field as string)
		) {
			return Number.parseInt(value) || 0;
		}

		// String fields (default)
		return value;
	}

	/**
	 * Get basic company details (name and address)
	 */
	async getBasicDetails(): Promise<
		Pick<
			CompanyInformation,
			| "Name"
			| "Address1"
			| "Address2"
			| "Address3"
			| "Address4"
			| "Phone"
			| "Email"
		>
	> {
		return this.getCompanyInformation([
			"Name",
			"Address1",
			"Address2",
			"Address3",
			"Address4",
			"Phone",
			"Email",
		]);
	}

	/**
	 * Get tax and legal information
	 */
	async getTaxInformation(): Promise<
		Pick<
			CompanyInformation,
			"TaxName" | "GstNum" | "RegNum" | "GSTCycleMonths" | "GstCycleEndDate"
		>
	> {
		return this.getCompanyInformation([
			"TaxName",
			"GstNum",
			"RegNum",
			"GSTCycleMonths",
			"GstCycleEndDate",
		]);
	}

	/**
	 * Get system information
	 */
	async getSystemInformation(): Promise<
		Pick<
			CompanyInformation,
			| "Version"
			| "Locale"
			| "LocaleFriendlyName"
			| "BaseCurrency"
			| "MultiCurrencyEnabled"
		>
	> {
		return this.getCompanyInformation([
			"Version",
			"Locale",
			"LocaleFriendlyName",
			"BaseCurrency",
			"MultiCurrencyEnabled",
		]);
	}
}
