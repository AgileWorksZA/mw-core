import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { server } from "./config";
import { registerAccountTools } from "./resource/tables/account";
import { registerAutoSplitTools } from "./resource/tables/auto-split";
import { registerBankRecsTools } from "./resource/tables/bank-recs";
import { registerBuildTools } from "./resource/tables/build";
import { registerDepartmentTools } from "./resource/tables/department";
import { registerDetailTools } from "./resource/tables/detail";
import { registerFilterTools } from "./resource/tables/filter";
import { registerGeneralTools } from "./resource/tables/general";
import { registerJobTools } from "./resource/tables/job";
import { registerJobSheetTools } from "./resource/tables/job-sheet";
import { registerLedgerTools } from "./resource/tables/ledger";
import { registerLinkTools } from "./resource/tables/link";
import { registerListTools } from "./resource/tables/lists";
import { registerLogTools } from "./resource/tables/log";
import { registerLoginTools } from "./resource/tables/login";
import { registerMemoTools } from "./resource/tables/memo";
import { registerMessageTools } from "./resource/tables/message";
import { registerNameTools } from "./resource/tables/name";
import { registerOffLedgerTools } from "./resource/tables/off-ledger";
import { registerPaymentsTools } from "./resource/tables/payments";
import { registerProductTools } from "./resource/tables/product";
import { registerStickiesTools } from "./resource/tables/stickies";
import { registerTaxRateTools } from "./resource/tables/tax-rate";
import { registerTransactionTools } from "./resource/tables/transaction";
import { registerUserTools } from "./resource/tables/user";
import { registerUser2Tools } from "./resource/tables/user2";

registerAccountTools(server);
registerAutoSplitTools(server);
registerBankRecsTools(server);
registerBuildTools(server);
registerDepartmentTools(server);
registerDetailTools(server);
registerFilterTools(server);
registerGeneralTools(server);
registerJobTools(server);
registerJobSheetTools(server);
registerLedgerTools(server);
registerLinkTools(server);
registerListTools(server);
registerLogTools(server);
registerLoginTools(server);
registerMemoTools(server);
registerMessageTools(server);
registerNameTools(server);
registerOffLedgerTools(server);
registerPaymentsTools(server);
registerProductTools(server);
registerStickiesTools(server);
registerTaxRateTools(server);
registerTransactionTools(server);
registerUserTools(server);
registerUser2Tools(server);

const transport = new StdioServerTransport();
(async () => {
  try {
    await server.connect(transport);
    console.log("MCP server connected successfully.");
  } catch (error) {
    console.error("Failed to connect MCP server:", error);
  }
})();
