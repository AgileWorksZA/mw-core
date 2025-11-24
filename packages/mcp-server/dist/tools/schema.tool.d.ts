/**
 * MoneyWorks Schema Tool for MCP
 *
 * @moneyworks-dsl PURE
 */
import type { SmartMoneyWorksClient } from "@moneyworks/data";
import type { MoneyWorksSchemaParams } from "../types/index.js";
export declare const schemaTool: {
	definition: {
		name: string;
		description: string;
		inputSchema: {
			type: string;
			properties: {
				table: {
					type: string;
					description: string;
					enum: string[];
				};
			};
			required: string[];
		};
	};
	handler(
		client: SmartMoneyWorksClient,
		params: MoneyWorksSchemaParams,
	): Promise<{
		content: Array<{
			type: "text";
			text: string;
		}>;
	}>;
};
//# sourceMappingURL=schema.tool.d.ts.map
