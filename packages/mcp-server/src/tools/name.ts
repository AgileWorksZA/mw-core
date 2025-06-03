import { NameService } from "@moneyworks/api/src/services/tables/name.service";
import { NameFields } from "@moneyworks/api/src/types/interface/tables/name";
import type { Name } from "@moneyworks/api/src/types/interface/tables/name";
import { z } from "zod";

const nameService = new NameService();

// Consolidated name tool schema
const nameToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for names, get specific name, or list available fields"),
	
	// Search operation parameters
	query: z
		.string()
		.optional()
		.describe("Search query for name code, name, or contact (search operation only)"),
	customerType: z.number().optional().describe("Customer type filter (search operation only)"),
	supplierType: z.number().optional().describe("Supplier type filter (search operation only)"),
	kind: z
		.number()
		.optional()
		.describe("Kind filter (0=Customer, 1=Supplier, 2=Both) (search operation only)"),
	category1: z.string().optional().describe("Category 1 filter (search operation only)"),
	category2: z.string().optional().describe("Category 2 filter (search operation only)"),
	category3: z.string().optional().describe("Category 3 filter (search operation only)"),
	category4: z.string().optional().describe("Category 4 filter (search operation only)"),
	hold: z.boolean().optional().describe("Filter by hold status (search operation only)"),
	limit: z
		.number()
		.min(1)
		.max(100)
		.default(50)
		.describe("Maximum number of results (search operation only)"),
	offset: z.number().min(0).default(0).describe("Number of results to skip (search operation only)"),
	
	// Get operation parameters
	code: z.string().optional().describe("The name code to retrieve (get operation only)"),
});

export const nameTool = {
	description: "Unified tool for name operations: search names (customers/suppliers), get specific name, or list available fields",
	inputSchema: nameToolSchema,

	async execute(args: z.infer<typeof nameToolSchema>) {
		switch (args.operation) {
			case "search": {
				const { query, limit = 50, offset = 0, ...filters } = args;

				// Build search object
				const search: Partial<Name> = {};

				// If query is provided, search by code (exact match)
				// Note: Name/Contact search would require API support for partial matching
				if (query) {
					search.Code = query;
				}

				// Add specific field filters
				if (filters.customerType !== undefined) {
					search.CustomerType = filters.customerType;
				}
				if (filters.supplierType !== undefined) {
					search.SupplierType = filters.supplierType;
				}
				if (filters.kind !== undefined) {
					search.Kind = filters.kind;
				}
				if (filters.category1) {
					search.Category1 = filters.category1;
				}
				if (filters.category2) {
					search.Category2 = filters.category2;
				}
				if (filters.category3) {
					search.Category3 = filters.category3;
				}
				if (filters.category4) {
					search.Category4 = filters.category4;
				}
				if (filters.hold !== undefined) {
					search.Hold = filters.hold;
				}

				// Search names
				const result = await nameService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit,
					offset,
					// Note: fields parameter is currently not working properly in TableService
					// so we'll get all fields and let MoneyWorks decide
				});

				return {
					operation: "search",
					names: result.data,
					total: result.pagination?.total || result.data.length,
					limit,
					offset,
				};
			}

			case "get": {
				if (!args.code) {
					throw new Error("code is required for get operation");
				}

				const result = await nameService.getData({
					search: { Code: args.code },
					limit: 1,
					offset: 0,
					// Getting all fields to ensure data is returned properly
				});
				
				if (!result.data || result.data.length === 0) {
					throw new Error(`Name with code '${args.code}' not found`);
				}
				
				return {
					operation: "get",
					name: result.data[0],
				};
			}

			case "listFields": {
				return {
					operation: "listFields",
					fields: NameFields,
					fieldDescriptions: {
						SequenceNumber: "Unique sequence number",
						LastModifiedTime: "Last modification timestamp",
						Code: "Unique identifier code",
						Name: "Company or person name",
						Contact: "Primary contact person",
						Position: "Contact's position",
						Address1: "Address line 1",
						Address2: "Address line 2",
						Address3: "Address line 3",
						Address4: "Address line 4",
						Delivery1: "Delivery address line 1",
						Delivery2: "Delivery address line 2",
						Delivery3: "Delivery address line 3",
						Delivery4: "Delivery address line 4",
						Phone: "Phone number",
						Fax: "Fax number",
						Category1: "Category 1 code",
						Category2: "Category 2 code",
						Category3: "Category 3 code",
						Category4: "Category 4 code",
						CustomerType: "Customer type code",
						D90Plus: "Debt over 90 days",
						D60Plus: "Debt over 60 days",
						D30Plus: "Debt over 30 days",
						DCurrent: "Current debt",
						CCurrent: "Current credit",
						DebtorTerms: "Payment terms for customer",
						CreditorTerms: "Payment terms for supplier",
						Bank: "Bank code",
						AccountName: "Bank account name",
						BankBranch: "Bank branch",
						TheirRef: "Their reference",
						Hold: "Account on hold",
						RecAccount: "Receivables account code",
						PayAccount: "Payables account code",
						Kind: "Type: 0=Customer, 1=Supplier, 2=Both",
						CreditLimit: "Credit limit amount",
						Discount: "Default discount percentage",
						Comment: "Comment text",
						SupplierType: "Supplier type code",
						Colour: "Display color",
						Salesperson: "Salesperson code",
						TaxCode: "Default tax code",
						PostCode: "Postal code",
						State: "State/Province",
						BankAccountNumber: "Bank account number",
						Currency: "Currency code",
						PaymentMethod: "Default payment method",
						DBalance: "Current balance",
						DDI: "Direct dial number",
						eMail: "Email address",
						Mobile: "Mobile phone",
						AfterHours: "After hours phone",
						Contact2: "Secondary contact person",
						Position2: "Secondary contact's position",
						DDI2: "Secondary direct dial",
						eMail2: "Secondary email",
						Mobile2: "Secondary mobile",
						AfterHours2: "Secondary after hours phone",
						WebURL: "Website URL",
						ProductPricing: "Product pricing level",
						DateOfLastSale: "Date of last sale",
						Custom1: "Custom field 1",
						Custom2: "Custom field 2",
						Custom3: "Custom field 3",
						Custom4: "Custom field 4",
						Custom5: "Custom field 5",
						Custom6: "Custom field 6",
						Custom7: "Custom field 7",
						Custom8: "Custom field 8",
						TaxNumber: "Tax identification number",
						ABUID: "Australian Business Number",
						EInvoicingID: "E-invoicing identifier",
					},
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};