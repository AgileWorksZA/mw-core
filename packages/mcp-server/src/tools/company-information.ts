import { CompanyInformationService } from "@moneyworks/api/src/services/system/company-information.service";
import {
	type CompanyInformationField,
	CompanyInformationFields,
} from "@moneyworks/api/src/types/interface/system/company-information";
import { z } from "zod";
import { moneyWorksConfig } from "../config/moneyworks.config";

const companyInfoService = new CompanyInformationService(moneyWorksConfig);

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
