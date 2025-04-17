import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { MoneyWorksApiService } from "../../services/moneyworks-api.service";
import axios from "axios";

/**
 * Test the custom field format parameter
 */
export async function testCustomFormat() {
  try {
    const config = loadMoneyWorksConfig();
    const api = new MoneyWorksApiService(config);
    const tableName = "account";

    // Test different approaches
    console.log(
      "=== Test 1: Custom format with Code/Description/Type fields ===",
    );
    await testCustomWithManualParsing(api, tableName, [
      "Code",
      "Description",
      "Type",
    ]);

    console.log("\n\n=== Test 2: Custom format with different fields ===");
    await testCustomWithManualParsing(api, tableName, [
      "Code",
      "BankAccountNumber",
    ]);

    console.log("\n\n=== Test 3: Empty format (TSV) ===");
    await testTsv(api, tableName);

    console.log("\nAll tests completed successfully!");
  } catch (error) {
    console.error("Error testing custom format:", error);
  }
}

// Test custom field format with manual parsing of response
async function testCustomWithManualParsing(
  api: MoneyWorksApiService,
  tableName: string,
  fields: string[] = ["Code", "Description", "Type"],
) {
  const config = loadMoneyWorksConfig();

  console.log(`Testing custom format for table: ${tableName}`);
  console.log(`Fields requested: ${fields.join(", ")}`);

  // Format the fields with square brackets and tabs
  const formatStr = fields.map((field) => `[${field}]`).join("\t"); // Actual tab character

  console.log("\nFormat string sent to MoneyWorks:");
  console.log(formatStr);
  console.log("\nEncoded format string in URL:");
  console.log(encodeURIComponent(formatStr));

  // Construct the URL
  const baseUrl = `http://${config.host}:${config.port}/REST/${encodeURIComponent(config.dataFile)}`;
  const url = `${baseUrl}/export/table=${tableName}&limit=3&format=${encodeURIComponent(formatStr)}`;
  console.log("\nFull URL:");
  console.log(url);

  // Execute a raw request
  try {
    console.log("\nExecuting raw request to understand the response format...");
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.username}:Document:${config.password}`).toString("base64")}`,
      },
      responseType: "text",
    });

    console.log("\nRaw response data:");
    console.log(response.data);
    console.log("\nResponse data length:", response.data.length);

    // Try manual parsing with field lengths
    console.log("\nManual parsing attempt:");
    const rawData = response.data;
    const results = [];

    // Based on the raw data format, attempt to parse the records
    let position = 0;
    while (position < rawData.length) {
      const record: Record<string, string> = {};

      // Parse Code (usually first 4 digits)
      let codeEnd = position;
      while (codeEnd < rawData.length && /\d/.test(rawData[codeEnd])) {
        codeEnd++;
      }
      record.Code = rawData.substring(position, codeEnd);
      position = codeEnd;

      // Parse Description (until we find CA, SA, etc. at the end which is Type)
      let typeStart = position;
      while (
        typeStart < rawData.length &&
        !["CA", "SA", "FA", "CL", "TL", "SF", "IN", "EX", "CS"].some(
          (t) => rawData.substring(typeStart, typeStart + 2) === t,
        )
      ) {
        typeStart++;
      }
      record.Description = rawData.substring(position, typeStart).trim();

      // Parse Type (2 characters)
      record.Type = rawData.substring(typeStart, typeStart + 2);
      position = typeStart + 2;

      results.push(record);

      // Limit to 3 records for testing
      if (results.length >= 3) break;
    }

    console.log("\nParsed records:");
    console.log(JSON.stringify(results, null, 2));

    // Now try using our API with fields parameter
    console.log("\nUsing API with fields parameter:");
    const customResult = await api.export(tableName, {
      limit: 3,
      fields: fields,
    });

    console.log("\nAPI result with fields parameter:");
    console.log(JSON.stringify(customResult.data, null, 2));
  } catch (err) {
    console.error("Error with direct request:", err.message);
  }
}

async function testTsv(api: MoneyWorksApiService, tableName: string) {
  console.log(`Testing TSV format for table: ${tableName}`);

  // Test with empty format (should return TSV)
  const tsvResult = await api.export(tableName, {
    limit: 3,
    format: "",
  });

  console.log("\nTSV Format Result (first record only):");
  console.log(JSON.stringify(tsvResult.data[0], null, 2));
}

// Run the test
testCustomFormat();
