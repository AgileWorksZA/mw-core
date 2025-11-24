/**
 * MoneyWorks List Tables Tool for MCP
 *
 * @moneyworks-dsl PURE
 */
import type { SmartMoneyWorksClient } from "@moneyworks/data";
export declare const listTablesTool: {
	definition: {
		name: string;
		description: string;
		inputSchema: {
			type: string;
			properties: {};
		};
	};
	handler(
		_client: SmartMoneyWorksClient,
		_params: Record<string, never>,
	): Promise<{
		content: Array<{
			type: "text";
			text: string;
		}>;
	}>;
};
//# sourceMappingURL=list-tables.tool.d.ts.map
