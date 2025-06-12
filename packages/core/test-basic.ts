/**
 * Basic functionality test
 */

import { ExportBuilder } from "./src/export/builder";
import { ImportBuilder } from "./src/import/builder";
import type { NameCamel } from "./src/tables";
import { XMLBuilder } from "./src/xml/builder";

console.log("Testing basic functionality...\n");

// Test 1: XML Builder
try {
  const testData: Partial<NameCamel>[] = [
    {
      code: "TEST001",
      name: "Test Customer",
      customerType: 1,
    },
  ];

  const xml = XMLBuilder.build("Name", testData);
  console.log("✅ XML Builder works");
  console.log("Sample XML:", `${xml.substring(0, 150)}...`);
} catch (error) {
  console.error("❌ XML Builder failed:", error);
}

// Test 2: Export Builder
try {
  const exportBuilder = new ExportBuilder("Transaction")
    .where("Period=7")
    .limit(10);

  const options = exportBuilder.getOptions();
  console.log("\n✅ Export Builder works");
  console.log("Export options:", options);
} catch (error) {
  console.error("❌ Export Builder failed:", error);
}

// Test 3: Import Builder
try {
  const importBuilder = new ImportBuilder("Product").add({
    code: "PROD001",
    description: "Test Product",
    sellPrice: 99.99,
  });

  const xml = importBuilder.toXML();
  console.log("\n✅ Import Builder works");
  console.log("Import has", importBuilder.count(), "records");
} catch (error) {
  console.error("❌ Import Builder failed:", error);
}

console.log("\n🎉 Basic tests completed!");
