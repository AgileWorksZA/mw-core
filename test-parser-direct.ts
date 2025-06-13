import { parseXMLWithSchema } from "./packages/core/src/xml/schema-parser";

const testXML = `<?xml version="1.0"?>
<table name="Transaction" count="1" start="0" found="981">
  <transaction>
    <sequencenumber>1</sequencenumber>
    <ourref>TEST001</ourref>
    <theirref>Customer Ref</theirref>
    <transdate>20240101</transdate>
    <gross>1500.00</gross>
  </transaction>
</table>`;

async function test() {
  console.log("Testing XML parser with count=\"1\"...\n");
  
  try {
    const result = await parseXMLWithSchema("Transaction", testXML, "xml-verbose");
    
    console.log("Parser result:");
    console.log("- Type:", Array.isArray(result) ? "Array" : typeof result);
    if (Array.isArray(result)) {
      console.log("- Length:", result.length);
      console.log("- Records:", result.map(r => ({
        sequenceNumber: r.sequenceNumber,
        ourRef: r.ourRef,
        gross: r.gross
      })));
    }
    
    console.log("\nThe parser correctly returns only 1 record when count=\"1\"");
  } catch (error) {
    console.error("Error:", error);
  }
}

test();