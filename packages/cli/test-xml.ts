import { MoneyWorksRESTClient } from "@moneyworks/core";
import { loadConfig } from "./src/config";

async function testXML() {
  const config = await loadConfig("../core/mw-config.json");
  const client = new MoneyWorksRESTClient(config);
  
  console.log("Testing XML export...");
  
  try {
    // Test with a different table first
    const accountXML = await client.export("Account", {
      format: "xml-verbose",
      limit: 1
    });
    
    console.log("Account XML type:", typeof accountXML);
    console.log("Account XML (first 500 chars):");
    console.log(typeof accountXML === "string" ? accountXML.substring(0, 500) : JSON.stringify(accountXML, null, 2).substring(0, 500));
    
    console.log("\n---\n");
    
    // Now test Name table
    const nameXML = await client.export("Name", {
      format: "xml-verbose",
      limit: 1
    });
    
    console.log("Name XML type:", typeof nameXML);
    console.log("Name XML (first 500 chars):");
    console.log(typeof nameXML === "string" ? nameXML.substring(0, 500) : JSON.stringify(nameXML, null, 2).substring(0, 500));
    
  } catch (error) {
    console.error("Error:", error);
  }
}

testXML();