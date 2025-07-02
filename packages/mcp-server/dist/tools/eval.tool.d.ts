/**
 * MoneyWorks Eval Tool for MCP
 *
 * @moneyworks-dsl PURE
 */
import type { SmartMoneyWorksClient } from "@moneyworks/data";
import type { MoneyWorksEvalParams, MoneyWorksEvalResult } from "../types/index.js";
export declare const evalTool: {
    definition: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                expression: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    handler(client: SmartMoneyWorksClient, params: MoneyWorksEvalParams): Promise<{
        content: MoneyWorksEvalResult[];
    }>;
};
//# sourceMappingURL=eval.tool.d.ts.map