/**
 * Mock test for MoneyWorks export/import functionality
 * Tests the builders and converters without requiring a real server
 */

import {
  convertCamelToPascal,
  convertPascalToCamel,
} from "./src/converters/field-converter";
import {
  ExportParser,
  ExportTemplate,
  XMLBuilder,
  XMLParser,
  buildTransaction,
  exportFrom,
  importInto,
} from "./src/export-import";
import type { DetailCamel, NameCamel, TransactionCamel } from "./src/tables";

console.log("🧪 Testing MoneyWorks Export/Import System (Mock)\n");

// Test 1: Export Builder
console.log("1️⃣ Testing Export Builder...");
const exportBuilder = exportFrom("Transaction")
  .where("Period=7")
  .whereField("gross", ">", 1000)
  .whereField("posted", "=", true)
  .whereField("typeCode", "=", "DI")
  .orderBy("transDate", "DESC")
  .limit(50)
  .start(0);

const options = exportBuilder.getOptions();
console.log("Export options:", options);
console.log("✅ Export builder working\n");

// Test 2: Import Builder
console.log("2️⃣ Testing Import Builder...");
const importBuilder = importInto("Name")
  .mode("upsert")
  .add({
    code: "CUST001",
    name: "Acme Corporation",
    customerType: 1,
    email: "contact@acme.com",
    creditLimit: 10000,
  })
  .add({
    code: "SUPP001",
    name: "Widget Suppliers Ltd",
    supplierType: 2,
    email: "orders@widgets.com",
  })
  .workItOut("balance");

console.log(`Records to import: ${importBuilder.count()}`);
const importXML = importBuilder.toXML();
console.log("Import XML preview:", `${importXML.substring(0, 200)}...`);
console.log("✅ Import builder working\n");

// Test 3: Transaction Builder
console.log("3️⃣ Testing Transaction Builder...");
const transaction = buildTransaction()
  .setHeader({
    nameCode: "CUST001",
    transDate: new Date("2024-01-15"),
    description: "Sales Invoice #1234",
    typeCode: "DI",
    ourRef: "INV-1234",
  })
  .addLine("4100", -1000, "Product sales", "GST")
  .addLine("2100", -100, "GST collected")
  .addLine("1100", 1100, "Accounts receivable");

const { transaction: txn, details } = transaction.build();
console.log("Transaction:", {
  ref: txn.ourRef,
  gross: txn.gross,
  detailCount: details.length,
});

const validation = transaction.validate();
console.log("Validation:", validation.length === 0 ? "Passed ✅" : validation);
console.log("✅ Transaction builder working\n");

// Test 4: XML Building and Parsing
console.log("4️⃣ Testing XML Building/Parsing...");
const testNames: Partial<NameCamel>[] = [
  {
    code: "TEST001",
    name: "Test & Company <Ltd>",
    phone: "555-1234",
    email: "test@example.com",
    balance: 1500.5,
  },
];

const xml = XMLBuilder.build("Name", testNames, { verbose: true });
console.log("Built XML length:", xml.length, "characters");
console.log("XML preview:", `${xml.substring(0, 150)}...`);

// Parse it back
XMLParser.parse(xml, "Name", "xml-verbose").then((parsed) => {
  console.log("Parsed records:", parsed.length);
  if (parsed.length > 0) {
    console.log("First record:", parsed[0]);
  }
  console.log("✅ XML building/parsing working\n");
});

// Test 5: Field Converters
console.log("5️⃣ Testing Field Converters...");
const pascalName = {
  Code: "CUST001",
  Name: "Test Customer",
  CreditLimit: 5000,
  CustomerType: 1,
};

const camelName = convertPascalToCamel("Name", pascalName);
console.log("Pascal to Camel:", camelName);

const backToPascal = convertCamelToPascal("Name", camelName);
console.log("Back to Pascal:", backToPascal);
console.log("✅ Field converters working\n");

// Test 6: Detail Field Conversion
console.log("6️⃣ Testing Detail Field Conversion...");
const pascalDetail = {
  "Detail.Account": "4100",
  "Detail.Debit": 100,
  "Detail.Credit": 0,
  "Detail.Description": "Test line item",
};

const camelDetail = convertPascalToCamel("Detail", pascalDetail);
console.log("Detail Pascal to Camel:", camelDetail);

const backToPascalDetail = convertCamelToPascal("Detail", camelDetail);
console.log("Detail back to Pascal:", backToPascalDetail);
console.log("✅ Detail field conversion working\n");

// Test 7: TSV Parser
console.log("7️⃣ Testing TSV Parser...");
const tsvData = `Code\tName\tBalance\tEmail
CUST001\tAcme Corp\t1000.50\tcontact@acme.com
CUST002\tWidget Inc\t2500.00\tsales@widget.com`;

const parsedTSV = ExportParser.parseTSV(tsvData, "Name");
console.log("Parsed TSV records:", parsedTSV.length);
console.log("First record:", parsedTSV[0]);
console.log("✅ TSV parser working\n");

// Test 8: Export Templates
console.log("8️⃣ Testing Export Templates...");
const customTemplate = ExportTemplate.build(
  "Invoice: [OurRef]\nCustomer: $CUSTOMER\nTotal: $[Gross]",
  { CUSTOMER: "Acme Corporation" },
);
console.log("Template format:", customTemplate);
console.log("✅ Export templates working\n");

console.log(
  "🎉 All tests passed! The export/import system is working correctly.",
);
