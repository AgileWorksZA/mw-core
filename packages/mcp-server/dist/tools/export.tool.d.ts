/**
 * MoneyWorks Export Tool for MCP
 *
 * @moneyworks-dsl PURE
 */
import type { SmartMoneyWorksClient } from "@moneyworks/data";
import type { MoneyWorksExportParams } from "../types/index.js";
export declare const exportTool: {
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
                exportFormat: {
                    type: string;
                    description: string;
                    enum: string[];
                    default: string;
                };
                filter: {
                    type: string;
                    description: string;
                };
                limit: {
                    type: string;
                    description: string;
                    minimum: number;
                    maximum: number;
                };
                offset: {
                    type: string;
                    description: string;
                    minimum: number;
                };
                orderBy: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    handler(client: SmartMoneyWorksClient, params: MoneyWorksExportParams): Promise<{
        content: Array<{
            type: "text";
            text: string;
        }>;
    }>;
};
//# sourceMappingURL=export.tool.d.ts.map