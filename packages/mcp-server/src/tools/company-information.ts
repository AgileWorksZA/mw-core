import { CompanyInformationService } from "@moneyworks/api/src/services/system/company-information.service";
import {
	type CompanyInformationField,
	CompanyInformationFields,
} from "@moneyworks/api/src/types/interface/system/company-information";
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

const companyInfoService = new CompanyInformationService(defaultConfig);

// Get company information
const getCompanyInformationSchema = z.object({
	fields: z
		.array(
			z.enum(
				CompanyInformationFields as [
					CompanyInformationField,
					...CompanyInformationField[],
				],
			),
		)
		.optional()
		.describe(
			"Specific fields to retrieve. If not provided, all fields will be returned",
		),
});

export const getCompanyInformationTool = {
	description:
		"Get company information from MoneyWorks including name, address, tax details, and system configuration",
	inputSchema: getCompanyInformationSchema,

	async execute(args: z.infer<typeof getCompanyInformationSchema>) {
		// If specific fields are requested, use them; otherwise get all fields
		const fieldsToRetrieve = args.fields || CompanyInformationFields;

		const result =
			await companyInfoService.getCompanyInformation(fieldsToRetrieve);

		return {
			companyInformation: result,
			fieldsRetrieved: fieldsToRetrieve.length,
		};
	},
};

// List company information fields
const listCompanyInformationFieldsSchema = z.object({});

export const listCompanyInformationFieldsTool = {
	description: "List all available fields for company information",
	inputSchema: listCompanyInformationFieldsSchema,

	async execute() {
		return {
			fields: CompanyInformationFields,
			totalFields: CompanyInformationFields.length,
			fieldCategories: {
				contactInfo: ["Name", "Phone", "Fax", "Email", "Mobile", "WebURL"],
				postalAddress: [
					"Address1",
					"Address2",
					"Address3",
					"Address4",
					"State",
					"PostCode",
				],
				deliveryAddress: [
					"Delivery1",
					"Delivery2",
					"Delivery3",
					"Delivery4",
					"DeliveryState",
					"DeliveryPostCode",
				],
				taxAndRegistration: [
					"TaxName",
					"GstNum",
					"RegNum",
					"CoRegName",
					"GSTRegName",
					"GSTGuideName",
				],
				systemSettings: [
					"BaseCurrency",
					"Locale",
					"LocaleFriendlyName",
					"Version",
					"Have_Logo",
					"MultiCurrencyEnabled",
					"NavigatorActive",
					"ExtendedJobCosting",
				],
				periodSettings: [
					"PeriodsInYear",
					"CurrentPer",
					"PeriodNames",
					"AgingCycle",
				],
				gstSettings: [
					"GSTCycleMonths",
					"GstCycleNum",
					"GstCycleEndDate",
					"GstIncomeInvoiceBasis",
					"GSTExpensesInvoiceBasis",
					"GSTIncomeInvoiceBasis",
					"GSTProcessingSuppressed",
				],
				systemInfo: [
					"NetworkLatency",
					"StartupSequenceNumJob",
					"LogFilePath",
					"LastAgedDebtors",
					"LastBackup",
					"LastStocktake",
					"RemittanceMessage",
				],
			},
			description: "Available fields for company information queries",
		};
	},
};
