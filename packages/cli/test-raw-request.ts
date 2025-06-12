#!/usr/bin/env bun
/**
 * Test raw HTTP request to MoneyWorks to see actual XML response
 */

const config = {
  host: "localhost",
  port: 6710,
  username: "Admin",
  password: "Datafile",
  dataFile: "Acme Gold",
};

async function testRawRequest() {
  // Build URL with export endpoint
  const params = new URLSearchParams({
    table: "Name",
    format: "xml-terse",
    limit: "1"
  });
  
  const auth = Buffer.from(`${config.username}:${config.password}`).toString("base64");
  const encodedDataFile = config.dataFile.replace(/\//g, "%2f");
  const documentPath = `${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}@${encodedDataFile}`;
  
  const url = `http://${config.host}:${config.port}/REST/${documentPath}/export?${params}`;
  
  console.log("Request URL:", url);
  console.log("Query params:", params.toString());
  console.log("\n");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Accept": "text/xml",
      },
    });

    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      const text = await response.text();
      console.error("Response body:", text);
      return;
    }

    const xmlText = await response.text();
    console.log("=== Raw XML Response ===");
    console.log(xmlText);
    console.log("\n");
    
    // Parse to see structure
    const { parseStringPromise } = await import("xml2js");
    const parsed = await parseStringPromise(xmlText, {
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: false,
    });
    
    console.log("=== Parsed Structure ===");
    console.log(JSON.stringify(parsed, null, 2));
    
  } catch (error) {
    console.error("Error:", error);
  }
}

testRawRequest();