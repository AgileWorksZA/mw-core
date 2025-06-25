import type { SmartMoneyWorksClient } from "@moneyworks/data";

export async function listCommand(
  client: SmartMoneyWorksClient,
  _args: string[],
  _globalOptions: Record<string, unknown>
): Promise<void> {
  try {
    console.log("Available documents:");
    const documents = await client.listDocuments();
    
    if (documents.length === 0) {
      console.log("No documents found");
    } else {
      for (const doc of documents) {
        console.log(`  - ${doc}`);
      }
    }
  } catch (error) {
    console.error("Failed to list documents:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}