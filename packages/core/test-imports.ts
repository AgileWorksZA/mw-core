/**
 * Simple test to verify imports work correctly
 */

import {
  ExportParser,
  MoneyWorksError,
  MoneyWorksErrorCode,
  XMLBuilder,
  XMLParser,
  buildTransaction,
  createClient,
  exportFrom,
  importInto,
} from "./src/export-import";

import {
  convertCamelToPascal,
  convertPascalToCamel,
} from "./src/converters/field-converter";
import { fromCamelCase, toCamelCase } from "./src/converters/key-converter";
import type {
  DetailCamel,
  NameCamel,
  ProductCamel,
  TransactionCamel,
} from "./src/tables";

console.log("Testing imports...\n");

// Test key converter functions
console.log("1. Testing key converters:");
console.log('  toCamelCase("TestField"):', toCamelCase("TestField"));
console.log('  fromCamelCase("testField"):', fromCamelCase("testField"));

// Test field converter
console.log("\n2. Testing field converters:");
const testName = { Code: "TEST001", Name: "Test Customer" };
const camelName = convertPascalToCamel("Name", testName);
console.log("  Pascal to Camel:", camelName);
const pascalName = convertCamelToPascal("Name", camelName);
console.log("  Camel to Pascal:", pascalName);

// Test Detail field conversion
console.log("\n3. Testing Detail field conversion:");
const testDetail = { "Detail.Account": "4100", "Detail.Debit": 100 };
const camelDetail = convertPascalToCamel("Detail", testDetail);
console.log("  Detail Pascal to Camel:", camelDetail);
const pascalDetail = convertCamelToPascal("Detail", camelDetail);
console.log("  Detail Camel to Pascal:", pascalDetail);

// Test XML builder
console.log("\n4. Testing XML builder:");
const xml = XMLBuilder.build("Name", [
  { code: "CUST001", name: "Test Customer" },
]);
console.log("  XML length:", xml.length, "characters");

// Test export builder
console.log("\n5. Testing export builder:");
const builder = exportFrom("Transaction").where("Period=7").limit(10);
console.log("  Builder options:", builder.getOptions());

// Test import builder
console.log("\n6. Testing import builder:");
const importBuilder = importInto("Product")
  .mode("create")
  .add({ code: "TEST001", description: "Test Product" });
console.log("  Import count:", importBuilder.count());

// Test transaction builder
console.log("\n7. Testing transaction builder:");
const trans = buildTransaction()
  .setHeader({ nameCode: "CUST001", transDate: new Date() })
  .addLine("4100", -100, "Test sale")
  .addLine("1100", 100, "Balance");
console.log("  Transaction details count:", trans.build().details.length);

// Test error class
console.log("\n8. Testing error handling:");
const error = new MoneyWorksError(
  MoneyWorksErrorCode.AUTH_FAILED,
  "Test error",
);
console.log("  Error code match:", error.is(MoneyWorksErrorCode.AUTH_FAILED));

console.log("\n✅ All imports working correctly!");
