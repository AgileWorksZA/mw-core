/**
 * Special test script for single numeric field (Code) parsing
 */
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { MoneyWorksApiService } from "../../services/moneyworks-api.service";
import axios from "axios";

async function testCodeField() {
  try {
    const config = loadMoneyWorksConfig();
    const api = new MoneyWorksApiService(config);
    const tableName = "account";
    const fields = ["Code"];
    
    console.log(`Testing Code field format for table: ${tableName}`);
    
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
    
    // Now use our API to test the fixed implementation
    console.log("\nUsing API with Code field:");
    const apiResult = await api.export(tableName, {
      limit: 10,
      fields: fields
    });
    
    console.log("API result records:", apiResult.data.length);
    console.log(JSON.stringify(apiResult.data, null, 2));
    
  } catch (error) {
    console.error("Error testing Code field:", error);
  }
}

testCodeField();