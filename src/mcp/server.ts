import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { server } from "./config";
import { registerAccountTools } from "./resource/account";

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
