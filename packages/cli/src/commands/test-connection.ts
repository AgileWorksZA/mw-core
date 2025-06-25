import type { SmartMoneyWorksClient } from "@moneyworks/data";

export async function testConnectionCommand(
  client: SmartMoneyWorksClient,
  _args: string[],
  _globalOptions: Record<string, unknown>
): Promise<void> {
  try {
    console.log("Testing connection to MoneyWorks...");
    
    // Try to get version
    const version = await client.getVersion();
    console.log(`✓ Connected successfully`);
    console.log(`  Server version: ${version}`);
    
    // Try to list documents
    const documents = await client.listDocuments();
    console.log(`  Available documents: ${documents.length}`);
    
    // Try a simple evaluation
    try {
      const taxRateCount = await client.evaluate("Count(TaxRate)");
      console.log(`  TaxRate records: ${taxRateCount}`);
    } catch {
      // Ignore errors - might not have access to tax rates
    }
    
    console.log("\\nConnection test successful!");
  } catch (error) {
    console.error("Connection test failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}