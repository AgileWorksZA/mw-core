import { ContactsService } from "@moneyworks/api/src/services/tables/contacts.service";
import type { Contacts } from "@moneyworks/api/src/types/interface/tables/contacts";
import { z } from "zod";

const contactService = new ContactsService();

// Consolidated contact tool schema
const contactToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe(
			"The operation to perform: search for contacts, get specific contact, or list available fields",
		),

	// Search operation parameters
	query: z.string().optional().describe("Search query (search operation only)"),
	limit: z
		.number()
		.min(1)
		.max(100)
		.default(50)
		.describe("Maximum number of results (search operation only)"),
	offset: z
		.number()
		.min(0)
		.default(0)
		.describe("Number of results to skip (search operation only)"),

	// Get operation parameters
	sequenceNumber: z
		.number()
		.optional()
		.describe("The contact sequence number to retrieve (get operation only)"),
});

export const contactTool = {
	description:
		"Unified tool for contact operations: search contacts, get specific contact, or list available fields",
	inputSchema: contactToolSchema,

	async execute(args: z.infer<typeof contactToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Contacts> = {};

				// Build search criteria
				if (args.query) {
					// Search by contact name
					search.ContactName = args.query;
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
				if (!args.sequenceNumber) {
					throw new Error(
						"sequenceNumber is required for get operation",
					);
				}

				const searchCriteria = { SequenceNumber: args.sequenceNumber };

				const result = await contactService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error("Contact not found");
				}

				return {
					operation: "get",
					contact: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { ContactsFields } = await import(
					"@moneyworks/api/src/types/interface/tables/contacts"
				);
				return {
					operation: "listFields",
					fields: ContactsFields,
					description: "Available fields for contact queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};
