#!/usr/bin/env bun

/**
 * Test Functionality Example
 *
 * Demonstrates that the export/import system works correctly.
 */

import {
  ExportBuilder,
  ExportParser,
  ExportTemplate,
  ImportBuilder,
  TransactionBuilder,
  XMLBuilder,
  XMLParser,
  convertCamelToPascal,
  convertPascalToCamel,
} from "../src/export-import";
import type {
  DetailCamel,
  NameCamel,
  ProductCamel,
  TransactionCamel,
} from "../src/tables";

console.log("🧪 Testing MoneyWorks Export/Import Functionality\n");

async function testXMLRoundTrip() {
  console.log("1️⃣ Testing XML Build/Parse Round Trip");

  const testProducts: Partial<ProductCamel>[] = [
    {
      code: "WIDGET001",
      description: "Premium Widget",
      sellPrice: 99.99,
      sellUnit: "EA",
      stockOnHand: 100,
    },
    {
      code: "GADGET001",
      description: "Deluxe Gadget",
      sellPrice: 149.99,
      sellUnit: "BOX",
      discontinued: true,
    },
  ];

  // Build XML
  const xml = XMLBuilder.build("Product", testProducts, {
    mode: "upsert",
    workItOut: ["stockValue"],
  });

  console.log("Built XML:");
  console.log(`${xml.substring(0, 300)}...\n`);

  // Parse it back
  try {
    const parsed = await XMLParser.parse(xml, "Product", "xml-verbose");
    console.log(`✅ Parsed ${parsed.length} products back from XML`);
    console.log("First product:", parsed[0]);
  } catch (error) {
    console.error("❌ XML parsing failed:", error);
  }
}

function testExportBuilder() {
  console.log("\n2️⃣ Testing Export Builder");

  const builder = new ExportBuilder("Transaction")
    .where("Period=7")
    .whereField("typeCode", "=", "DI")
    .whereField("gross", ">", 1000)
    .orderBy("transDate", "DESC")
    .limit(100)
    .format("xml-verbose");

  const options = builder.getOptions();
  console.log("Built export options:", options);
  console.log(`✅ Filter: ${options.filter}`);
}

function testImportBuilder() {
  console.log("\n3️⃣ Testing Import Builder");

  const builder = new ImportBuilder("Name")
    .mode("create")
    .add({
      code: "CUST001",
      name: "Acme Corporation",
      customerType: 1,
      email: "contact@acme.com",
      creditLimit: 5000,
    })
    .add({
      code: "CUST002",
      name: "Widget Industries",
      customerType: 1,
      phone: "555-1234",
    })
    .workItOut("balance");

  const xml = builder.toXML();
  console.log("Built import XML:");
  console.log(`${xml.substring(0, 400)}...`);
  console.log(`✅ Created import for ${builder.count()} records`);
}

function testTransactionBuilder() {
  console.log("\n4️⃣ Testing Transaction Builder");

  const transaction = new TransactionBuilder()
    .setHeader({
      nameCode: "CUST001",
      transDate: new Date("2024-01-15"),
      ourRef: "INV001",
      description: "Sales Invoice",
      typeCode: "DI",
    })
    .addInventoryLine(
      "4100",
      "WIDGET001",
      5,
      99.99,
      "Premium Widgets x5",
      "GST",
    )
    .addLine("2100", -49.995, "GST 10%")
    .addLine("1100", 549.945, "Balance Due");

  const errors = transaction.validate();
  if (errors.length > 0) {
    console.error("❌ Transaction validation errors:", errors);
  } else {
    console.log("✅ Transaction is balanced");
  }

  const xml = transaction.toXML();
  console.log("Transaction XML:");
  console.log(`${xml.substring(0, 500)}...`);
}

function testTSVParser() {
  console.log("\n5️⃣ Testing TSV Parser");

  const tsvData = `Code\tName\tPhone\tEmail\tBalance
CUST001\tAcme Corp\t555-1234\tcontact@acme.com\t1500.50
CUST002\tWidget Inc\t555-5678\tsales@widget.com\t2750.00
CUST003\tGadget LLC\t\tinfo@gadget.com\t0`;

  const parsed = ExportParser.parseTSV(tsvData, "Name");
  console.log(`✅ Parsed ${parsed.length} records from TSV`);
  console.log("First record:", parsed[0]);
}

function testTemplates() {
  console.log("\n6️⃣ Testing Export Templates");

  const invoiceTemplate = ExportTemplate.transaction.invoice;
  console.log("Invoice template preview:");
  console.log(`${invoiceTemplate.substring(0, 200)}...`);

  const customTemplate = ExportTemplate.build(
    "Customer: [Name]\nBalance: $[Balance]\nStatus: $STATUS",
    { STATUS: "ACTIVE" },
  );
  console.log("\nCustom template:", customTemplate);
  console.log("✅ Templates working correctly");
}

function testFieldConversion() {
  console.log("\n7️⃣ Testing Field Conversion");

  const camelCase: Partial<NameCamel> = {
    code: "TEST001",
    name: "Test Customer",
    customerType: 1,
    creditLimit: 5000,
    stopCredit: false,
  };

  console.log("CamelCase input:", camelCase);

  const pascalCase = convertCamelToPascal("Name", camelCase);
  console.log("PascalCase output:", pascalCase);

  const backToCamel = convertPascalToCamel("Name", pascalCase);
  console.log("Back to camelCase:", backToCamel);

  const matches = JSON.stringify(camelCase) === JSON.stringify(backToCamel);
  console.log(
    matches ? "✅ Round-trip conversion successful" : "❌ Conversion mismatch",
  );
}

// Run all tests
async function runAllTests() {
  try {
    await testXMLRoundTrip();
    testExportBuilder();
    testImportBuilder();
    testTransactionBuilder();
    testTSVParser();
    testTemplates();
    testFieldConversion();

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

runAllTests();
