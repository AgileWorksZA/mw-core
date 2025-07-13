import { createMockMoneyWorksClient } from "./app/services/mock-moneyworks";

async function testMockClient() {
  console.log("Testing mock MoneyWorks client...");
  
  const mockClient = createMockMoneyWorksClient();
  
  // Test supplier search
  const result = await mockClient.searchNames({ searchText: "supplier" });
  console.log("Search result:", JSON.stringify(result, null, 2));
  
  // Test tax rates
  const taxRates = await mockClient.getTaxRates();
  console.log("Tax rates:", JSON.stringify(taxRates, null, 2));
}

testMockClient().catch(console.error);