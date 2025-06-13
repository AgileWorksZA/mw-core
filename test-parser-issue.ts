import { parseStringPromise } from "xml2js";

const testXML = `<?xml version="1.0"?>
<table name="Transaction" count="1" start="0" found="981">
  <transaction>
    <sequencenumber system="true">2</sequencenumber>
    <ourref>AP</ourref>
    <description>Test Transaction</description>
  </transaction>
</table>`;

async function testParsing() {
  console.log("Testing XML parsing...\n");
  
  // Parse with xml2js
  const parsed = await parseStringPromise(testXML, {
    explicitArray: false,
    ignoreAttrs: false,
    mergeAttrs: false,
  });
  
  console.log("Parsed structure:");
  console.log(JSON.stringify(parsed, null, 2));
  
  // Check what extractRecords would see
  console.log("\nChecking extraction logic:");
  console.log("parsed.table:", parsed.table);
  console.log("parsed.table.transaction:", parsed.table?.transaction);
  console.log("parsed.table['transaction']:", parsed.table?.['transaction']);
  
  // This is what the current code is looking for
  if (parsed.table?.['transaction']) {
    console.log("\n✅ Found at parsed.table.transaction");
    const records = Array.isArray(parsed.table.transaction) 
      ? parsed.table.transaction 
      : [parsed.table.transaction];
    console.log("Number of records:", records.length);
  } else {
    console.log("\n❌ NOT found at parsed.table.transaction");
  }
}

testParsing();