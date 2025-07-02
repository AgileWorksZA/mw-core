/**
 * MoneyWorks List Tables Tool for MCP
 *
 * @moneyworks-dsl PURE
 */
import type { SmartMoneyWorksClient } from "@moneyworks/data";
import type { MoneyWorksTablesResult } from "../types/index.js";
export declare const listTablesTool: {
    definition: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {};
        };
    };
    handler(_client: SmartMoneyWorksClient, _params: Record<string, never>): Promise<{
        content: MoneyWorksTablesResult[];
    }>;
};
//# sourceMappingURL=list-tables.tool.d.ts.map