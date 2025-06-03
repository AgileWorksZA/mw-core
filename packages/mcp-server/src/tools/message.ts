import { MessageService } from "@moneyworks/api/src/services/tables/message.service";
import type { Message } from "@moneyworks/api/src/types/interface/tables/message";
import { z } from "zod";

const messageService = new MessageService();

// Consolidated message tool schema
const messageToolSchema = z.object({
	operation: z
		.enum(["search", "get", "listFields"])
		.describe("The operation to perform: search for messages, get specific message, or list available fields"),
	
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
	sequenceNumber: z.number().optional().describe("The message sequence number to retrieve (get operation only)"),
	code: z.string().optional().describe("The message code to retrieve (get operation only)"),
});

export const messageTool = {
	description: "Unified tool for message operations: search messages, get specific message, or list available fields",
	inputSchema: messageToolSchema,

	async execute(args: z.infer<typeof messageToolSchema>) {
		switch (args.operation) {
			case "search": {
				const search: Partial<Message> = {};

				// Build search criteria
				if (args.query) {
					// Adjust based on table structure
					search.Code = args.query;
				}

				// Execute search using the existing service
				const result = await messageService.getData({
					search: Object.keys(search).length > 0 ? search : undefined,
					limit: args.limit,
					offset: args.offset,
				});

				return {
					operation: "search",
					messages: result.data,
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

				const result = await messageService.getData({
					search: searchCriteria,
					limit: 1,
					offset: 0,
				});

				if (!result.data || result.data.length === 0) {
					throw new Error(`Message not found`);
				}

				return {
					operation: "get",
					message: result.data[0],
				};
			}

			case "listFields": {
				// Import the fields from the interface
				const { MessageFields } = await import(
					"@moneyworks/api/src/types/interface/tables/message"
				);
				return {
					operation: "listFields",
					fields: MessageFields,
					description: "Available fields for message queries and filters",
				};
			}

			default:
				throw new Error(`Unsupported operation: ${args.operation}`);
		}
	},
};