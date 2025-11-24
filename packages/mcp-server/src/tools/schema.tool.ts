/**
 * MoneyWorks Schema Tool for MCP
 *
 * @moneyworks-dsl PURE
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import type {
	MoneyWorksSchemaParams,
	MoneyWorksSchemaResult,
} from "../types/index.js";

// Currently vetted entities
const VETTED_ENTITIES = [
	"TaxRate",
	"Account",
	"Transaction",
	"Name",
	"Product",
	"Job",
	"Contact",
	"Department",
	"General",
	"Inventory",
	"Payment",
];

export const schemaTool = {
	definition: {
		name: "mw_schema",
		description:
			"Get field structure and schema information for MoneyWorks tables",
		inputSchema: {
			type: "object",
			properties: {
				table: {
					type: "string",
					description: "Table name to get schema for",
					enum: VETTED_ENTITIES,
				},
			},
			required: ["table"],
		},
	},

	async handler(
		client: SmartMoneyWorksClient,
		params: MoneyWorksSchemaParams,
	): Promise<{ content: Array<{ type: "text"; text: string }> }> {
		const { table } = params;

		// Validate table is vetted
		if (!VETTED_ENTITIES.includes(table)) {
			throw new Error(
				`Table '${table}' is not yet available. Currently available: ${VETTED_ENTITIES.join(", ")}`,
			);
		}

		try {
			// Ensure field structure is discovered
			await client.preDiscoverTables([table]);

			// Get the cached structure
			const structure = client.getFieldStructure(table);

			if (!structure) {
				throw new Error(`Could not retrieve schema for table '${table}'`);
			}

			const result: MoneyWorksSchemaResult = {
				table,
				fields: structure.fields.map(
					(field: {
						name: string;
						position: number;
						dataType: string;
						canonicalType?: string;
					}) => ({
						name: field.name,
						position: field.position,
						dataType: field.dataType,
						canonicalType: field.canonicalType,
					}),
				),
			};

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		} catch (error) {
			throw new Error(
				`Schema retrieval failed: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	},
};
