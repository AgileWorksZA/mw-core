/**
 * MoneyWorks Company Info Tool
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This tool retrieves company information from MoneyWorks
 */
import type { SmartMoneyWorksClient } from "@moneyworks/data";
interface CompanyInfoParams {
}
export declare const companyInfoTool: {
    definition: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {};
        };
    };
    handler: (client: SmartMoneyWorksClient, _params: CompanyInfoParams) => Promise<{
        content: Array<{
            type: "text";
            text: string;
        }>;
    }>;
};
export {};
//# sourceMappingURL=company-info.tool.d.ts.map