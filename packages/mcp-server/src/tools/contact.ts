import { ContactService } from "@moneyworks/api/src/services/tables/contact.service";
import type { Contact } from "@moneyworks/api/src/types/interface/tables/contact";
import { z } from "zod";

const contactService = new ContactService();

// Consolidated contact tool schema
const contactToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for contacts, get specific contact, or list available fields"),
	
	// Search operation parameters
	query: z
		.string()
		.optional()
		.describe("Search query (search operation only)"),
	limit: z
		.number()
		.min(1)
		.max(100)
		.default(50)
		.describe("Maximum number of results (search operation only)"),
	offset: z.number().min(0).default(0).describe("Number of results to skip (search operation only)"),
	
	// Get operation parameters (adjust based on primary key)
	sequenceNumber: z.number().optional().describe("The contact sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The contact code to retrieve (get operation only)"),
});

export const contactTool = {
	description: "Unified tool for contact operations: search contacts, get specific contact, or list available fields",
	inputSchema: contactToolSchema,

	async execute(args: z.infer<typeof contactToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Contact> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await contactService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					contacts: result.data,
					total: result.pagination?.total || result.data.length,
					limit: args.limit,
					offset: args.offset,
				};
			}

			case "get": {
				// Try sequence number first, then code
				let searchCriteria;
				if (args.sequenceNumber) {
					searchCriteria = { SequenceNumber: args.sequenceNumber };
				} else if (args.code) {
					searchCriteria = { Code: args.code };
				} else {
					throw new Error("Either sequenceNumber or code is required for get operation");
				}

				const result = await contactService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Contact not found`);
				}

				return {
					operation: "get",
					contact: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { ContactFields } = await import(
					"@moneyworks/api/src/types/interface/tables/contact"
				);
				return {
					operation: "listFields",
					fields: ContactFields,
					description: "Available fields for contact queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};