/**
 * Test to debug field name conversion
 */

import { convertPascalToCamel } from "./src/converters/field-converter";
import { XMLParser } from "./src/xml/parser";

async function testFieldNames() {
  console.log("🔍 Testing Field Name Conversion...\n");

  // Sample XML from MoneyWorks with lowercase field names
  const sampleXML = `<?xml version="1.0"?>
<table name="Transaction" count="1" start="0" found="11">
  <transaction>
    <sequencenumber system="true">4</sequencenumber>
    <lastmodifiedtime system="true">20250128160704</lastmodifiedtime>
    <ourref>00101</ourref>
    <transdate>20240630</transdate>
    <enterdate system="true">20250128</enterdate>
    <duedate>20240707</duedate>
    <period system="true">301</period>
    <type>DII</type>
    <theirref></theirref>
    <namecode>AGI001</namecode>
    <flag></flag>
    <description>Development Services | June 2024</description>
    <gross>5400</gross>
    <tax>540</tax>
    <net>4860</net>
  </transaction>
</table>`;

  try {
    // Parse the XML
    console.log("Parsing XML...");
    const parsed = await XMLParser.parse(
      sampleXML,
      "Transaction",
      "xml-verbose",
    );
    console.log("Parsed records:", parsed.length);
    console.log("First record:", JSON.stringify(parsed[0], null, 2));

    // Test direct field conversion
    console.log("\nTesting field conversion...");
    const testRecord = {
      sequencenumber: 4,
      ourref: "00101",
      transdate: "20240630",
      namecode: "AGI001",
      description: "Test",
      gross: 5400,
    };

    const converted = convertPascalToCamel("Transaction", testRecord);
    console.log("Converted record:", JSON.stringify(converted, null, 2));

    // Test with PascalCase fields
    console.log("\nTesting with PascalCase fields...");
    const pascalRecord = {
      SequenceNumber: 4,
      OurRef: "00101",
      TransDate: "20240630",
      NameCode: "AGI001",
      Description: "Test",
      Gross: 5400,
    };

    const pascalConverted = convertPascalToCamel("Transaction", pascalRecord);
    console.log("Pascal converted:", JSON.stringify(pascalConverted, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testFieldNames();
