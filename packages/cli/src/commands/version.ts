import type { SmartMoneyWorksClient, GlobalOptions } from "@moneyworks/data";

export async function versionCommand(
  client: SmartMoneyWorksClient,
  _args: string[],
  _globalOptions: GlobalOptions
): Promise<void> {
  try {
    const version = await client.getVersion();
    console.log(`MoneyWorks Server Version: ${version}`);
  } catch (error) {
    console.error("Failed to get version:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}