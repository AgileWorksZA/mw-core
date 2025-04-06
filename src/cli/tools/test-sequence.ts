/**
 * Special test script for single field (SequenceNumber) parsing
 */
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { MoneyWorksApiService } from "../../services/moneyworks-api.service";
import axios from "axios";

async function testSequenceNumberField() {
  try {
    const config = loadMoneyWorksConfig();
    const api = new MoneyWorksApiService(config);
    const tableName = "account";
    const fields = ["SequenceNumber"];
    
    console.log(`Testing SequenceNumber field format for table: ${tableName}`);
    
    // Format the fields with square brackets
    const formatStr = fields
      .map(field => `[${field}]`)
      .join("\t");
    
    // Construct the URL for direct testing
    const baseUrl = `http://${config.host}:${config.port}/REST/${encodeURIComponent(config.dataFile)}`;
    const url = `${baseUrl}/export/table=${tableName}&limit=10&format=${encodeURIComponent(formatStr)}`;
    
    console.log("\nDirect request URL:");
    console.log(url);
    
    // Execute a raw request
    console.log("\nExecuting raw request to see the response format...");
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.username}:Document:${config.password}`).toString("base64")}`
      },
      responseType: 'text'
    });
    
    console.log("\nRaw response data:");
    console.log(response.data);
    console.log("\nResponse data length:", response.data.length);
    
    // Try to manually parse this into 3-digit chunks
    console.log("\nManual parsing by 3-digit chunks:");
    const rawData = response.data;
    const results = [];
    
    for (let i = 0; i < rawData.length; i += 3) {
      if (i + 3 <= rawData.length) {
        const sequenceNumber = rawData.substring(i, i + 3);
        results.push({ SequenceNumber: sequenceNumber });
      }
    }
    
    console.log("Parsed records:", results.length);
    console.log(JSON.stringify(results, null, 2));
    
    // Now use our API to test the fixed implementation
    console.log("\nUsing API with SequenceNumber field:");
    const apiResult = await api.export(tableName, {
      limit: 10,
      fields: fields
    });
    
    console.log("API result records:", apiResult.data.length);
    console.log(JSON.stringify(apiResult.data, null, 2));
    
  } catch (error) {
    console.error("Error testing SequenceNumber field:", error);
  }
}

testSequenceNumberField();