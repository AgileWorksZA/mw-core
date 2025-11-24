/**
 * MoneyWorks Company Info Tool
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This tool retrieves company information from MoneyWorks
 */
import { CompanyInformationRepository } from "@moneyworks/data";
export const companyInfoTool = {
	definition: {
		name: "mw_company_info",
		description: "Get company information from MoneyWorks",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	handler: async (client, _params) => {
		try {
			// Use the company information repository
			const repository = new CompanyInformationRepository(client);
			const companyData = await repository.getCompanyInformation();
			console.log(
				"[Company Info Tool] Company data from repository:",
				companyData,
			);
			// If we got no data at all, return a helpful message
			if (Object.keys(companyData).length === 0) {
				return {
					content: [
						{
							type: "text",
							text: "# Company Information\n\nUnable to retrieve company information. This could be due to:\n- Limited REST API access\n- MoneyWorks configuration\n- Connection permissions\n\nTry using the mw_eval tool with specific expressions like:\n- `Version()`\n- `Date()`\n- `CurrentPeriod()`",
						},
					],
				};
			}
			// Format the output
			let output = "# Company Information\n\n";
			// Company Details
			if (companyData.Name || companyData.Address1) {
				output += "## Company Details\n";
				if (companyData.Name) output += `- **Name**: ${companyData.Name}\n`;
				const addressParts = [
					companyData.Address1,
					companyData.Address2,
					companyData.Address3,
					companyData.Address4,
					companyData.State,
					companyData.PostCode,
				].filter(Boolean);
				if (addressParts.length > 0) {
					output += `- **Address**: ${addressParts.join(", ")}\n`;
				}
				output += "\n";
			}
			// Contact Information
			if (
				companyData.Phone ||
				companyData.Fax ||
				companyData.Email ||
				companyData.Mobile
			) {
				output += "## Contact Information\n";
				if (companyData.Phone) output += `- **Phone**: ${companyData.Phone}\n`;
				if (companyData.Mobile)
					output += `- **Mobile**: ${companyData.Mobile}\n`;
				if (companyData.Fax) output += `- **Fax**: ${companyData.Fax}\n`;
				if (companyData.Email) output += `- **Email**: ${companyData.Email}\n`;
				if (companyData.WebURL)
					output += `- **Website**: ${companyData.WebURL}\n`;
				output += "\n";
			}
			// Tax & Legal Information
			if (companyData.GstNum || companyData.RegNum || companyData.TaxName) {
				output += "## Tax & Legal Information\n";
				if (companyData.TaxName)
					output += `- **Tax Name**: ${companyData.TaxName}\n`;
				if (companyData.GstNum)
					output += `- **GST Number**: ${companyData.GstNum}\n`;
				if (companyData.RegNum)
					output += `- **Registration Number**: ${companyData.RegNum}\n`;
				if (companyData.GSTCycleMonths)
					output += `- **GST Cycle**: ${companyData.GSTCycleMonths} months\n`;
				if (companyData.GstCycleEndDate)
					output += `- **GST Cycle End**: ${companyData.GstCycleEndDate}\n`;
				output += "\n";
			}
			// Accounting Setup
			if (
				companyData.PeriodsInYear ||
				companyData.CurrentPer ||
				companyData.BaseCurrency
			) {
				output += "## Accounting Setup\n";
				if (companyData.PeriodsInYear)
					output += `- **Periods in Year**: ${companyData.PeriodsInYear}\n`;
				if (companyData.CurrentPer)
					output += `- **Current Period**: ${companyData.CurrentPer}\n`;
				if (companyData.BaseCurrency)
					output += `- **Base Currency**: ${companyData.BaseCurrency}\n`;
				if (companyData.MultiCurrencyEnabled !== undefined) {
					output += `- **Multi-Currency**: ${companyData.MultiCurrencyEnabled ? "Enabled" : "Disabled"}\n`;
				}
				if (companyData.ExtendedJobCosting !== undefined) {
					output += `- **Extended Job Costing**: ${companyData.ExtendedJobCosting ? "Enabled" : "Disabled"}\n`;
				}
				output += "\n";
			}
			// System Information
			if (companyData.Version || companyData.Locale) {
				output += "## System Information\n";
				if (companyData.Version)
					output += `- **MoneyWorks Version**: ${companyData.Version}\n`;
				if (companyData.Locale)
					output += `- **Locale**: ${companyData.Locale}\n`;
				if (companyData.LocaleFriendlyName)
					output += `- **Locale Name**: ${companyData.LocaleFriendlyName}\n`;
				output += "\n";
			}
			// GST Processing
			const gstFields =
				companyData.GSTProcessingSuppressed !== undefined ||
				companyData.GSTIncomeInvoiceBasis !== undefined ||
				companyData.GSTExpensesInvoiceBasis !== undefined;
			if (gstFields) {
				output += "## GST Processing\n";
				if (companyData.GSTProcessingSuppressed !== undefined) {
					output += `- **GST Processing**: ${companyData.GSTProcessingSuppressed ? "Suppressed" : "Active"}\n`;
				}
				if (companyData.GSTIncomeInvoiceBasis !== undefined) {
					output += `- **Income Invoice Basis**: ${companyData.GSTIncomeInvoiceBasis ? "Yes" : "No"}\n`;
				}
				if (companyData.GSTExpensesInvoiceBasis !== undefined) {
					output += `- **Expenses Invoice Basis**: ${companyData.GSTExpensesInvoiceBasis ? "Yes" : "No"}\n`;
				}
				output += "\n";
			}
			return {
				content: [
					{
						type: "text",
						text: output,
					},
				],
			};
		} catch (error) {
			console.error("[Company Info Tool] Error:", error);
			throw error;
		}
	},
};
