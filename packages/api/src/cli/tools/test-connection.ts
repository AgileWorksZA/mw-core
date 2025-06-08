#!/usr/bin/env bun
/**
 * Comprehensive MoneyWorks API Connection Test
 * 
 * This script tests the MoneyWorks API service implementation by:
 * 1. Testing basic connectivity and authentication
 * 2. Evaluating simple expressions to verify the API is working
 * 3. Testing database table access
 * 4. Verifying the authentication header implementation
 * 5. Comparing with direct HTTP requests
 */

import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { MoneyWorksApiService } from "../../services/moneyworks-api.service";
import axios from "axios";

interface TestResult {
  test: string;
  success: boolean;
  result?: any;
  error?: string;
  duration?: number;
}

class MoneyWorksConnectionTester {
  private config: any;
  private api: MoneyWorksApiService;
  private results: TestResult[] = [];

  constructor() {
    this.config = loadMoneyWorksConfig();
    this.api = new MoneyWorksApiService(this.config);
  }

  private async runTest(testName: string, testFn: () => Promise<any>): Promise<TestResult> {
    console.log(`\n🧪 Running test: ${testName}`);
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      console.log(`✅ PASSED (${duration}ms)`);
      
      const testResult: TestResult = {
        test: testName,
        success: true,
        result,
        duration
      };
      this.results.push(testResult);
      return testResult;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`❌ FAILED (${duration}ms): ${error}`);
      
      const testResult: TestResult = {
        test: testName,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration
      };
      this.results.push(testResult);
      return testResult;
    }
  }

  private getAuthHeaders() {
    // Document auth (always required)
    const documentCredentials = `${this.config.username}:Document:${this.config.password}`;
    const documentAuth = `Basic ${Buffer.from(documentCredentials).toString("base64")}`;

    // Folder auth (only if configured)
    if (this.config.folderAuth) {
      const { folderName, password } = this.config.folderAuth;
      const folderCredentials = `${folderName}:Datacentre:${password}`;
      const folderAuth = `Basic ${Buffer.from(folderCredentials).toString("base64")}`;

      // Return combined auth headers (current implementation)
      return {
        Authorization: `${documentAuth}, ${folderAuth}`,
      };
    }

    return {
      Authorization: documentAuth,
    };
  }

  private getBaseUrl() {
    const protocol = this.config.protocol || "http";
    return `${protocol}://${this.config.host}:${this.config.port}/REST/${encodeURIComponent(this.config.dataFile)}`;
  }

  async testBasicConnectivity() {
    return this.runTest("Basic Server Connectivity", async () => {
      // Test if we can reach the server at all
      const protocol = this.config.protocol || "http";
      const serverUrl = `${protocol}://${this.config.host}:${this.config.port}`;
      const response = await axios.get(`${serverUrl}/REST/server/version`, { timeout: 5000 });
      return { status: response.status, version: response.data, protocol };
    });
  }

  async testAuthentication() {
    return this.runTest("Authentication Headers", async () => {
      // Test our authentication implementation
      const headers = this.getAuthHeaders();
      console.log(`   Document credentials format: ${this.config.username}:Document:${this.config.password}`);
      
      if (this.config.folderAuth) {
        console.log(`   Folder credentials format: ${this.config.folderAuth.folderName}:Datacentre:${this.config.folderAuth.password}`);
        console.log(`   Combined header: ${headers.Authorization.substring(0, 50)}...`);
      }
      
      return headers;
    });
  }

  async testSimpleExpression() {
    return this.runTest("Simple Expression Evaluation", async () => {
      // Test basic evaluate function
      console.log(`   🔍 API will call: evaluate("1+1")`);
      const result = await this.api.evaluate("1+1");
      console.log(`   Expression "1+1" = "${result}"`);
      return result;
    });
  }

  async testDateExpression() {
    return this.runTest("Date Expression Evaluation", async () => {
      // Test date function
      const result = await this.api.evaluate("Today()");
      console.log(`   Today() = "${result}"`);
      return result;
    });
  }

  async testDatabaseTables() {
    return this.runTest("Database Tables List", async () => {
      // Test getting database tables
      const tables = await this.api.getDatabaseTables();
      console.log(`   Found ${tables.length} tables: ${tables.slice(0, 5).join(", ")}${tables.length > 5 ? "..." : ""}`);
      return tables;
    });
  }

  async testAccountTable() {
    return this.runTest("Account Table Access", async () => {
      // Test accessing a specific table
      console.log(`   🔍 API will call: export("account", { limit: 3, format: "xml-verbose" })`);
      const accounts = await this.api.export("account", { limit: 3, format: "xml-verbose" });
      console.log(`   Found ${accounts.data.length} accounts (limit 3)`);
      console.log(`   Total accounts: ${accounts.pagination.total}`);
      return {
        count: accounts.data.length,
        total: accounts.pagination.total,
        sample: accounts.data[0]
      };
    });
  }

  async testDirectHttpRequest() {
    return this.runTest("Direct HTTP Request", async () => {
      // Test making a direct HTTP request with our auth headers
      const url = `${this.getBaseUrl()}/evaluate?expr=${encodeURIComponent("1+1")}`;
      const headers = this.getAuthHeaders();
      
      console.log(`   URL: ${url}`);
      console.log(`   Auth: ${headers.Authorization.substring(0, 50)}...`);
      
      const response = await axios.get(url, { headers });
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    });
  }

  async testCorrectUrlFormat() {
    return this.runTest("Correct URL Format Test", async () => {
      // Test with the CORRECT MoneyWorks REST API URL format
      const correctUrl = `${this.getBaseUrl()}/export?table=account&limit=3&format=xml-verbose`;
      const headers = this.getAuthHeaders();
      
      console.log(`   ✅ CURRENT URL: ${correctUrl}`);
      console.log(`   📋 Per MoneyWorks spec: /REST/{document_path}/export?table={table}&format={format}`);
      console.log(`   Auth: ${headers.Authorization.substring(0, 50)}...`);
      
      const response = await axios.get(correctUrl, { headers });
      return {
        status: response.status,
        data: response.data,
        dataLength: response.data.length
      };
    });
  }

  async testListDocuments() {
    return this.runTest("List Available Documents", async () => {
      // Test listing documents on server
      const protocol = this.config.protocol || "http";
      const listUrl = `${protocol}://${this.config.host}:${this.config.port}/REST/server/list`;
      const headers = this.getAuthHeaders();
      
      console.log(`   📋 LIST URL: ${listUrl}`);
      console.log(`   Auth: ${headers.Authorization.substring(0, 50)}...`);
      
      const response = await axios.get(listUrl, { headers });
      console.log(`   📄 Available documents:`);
      console.log(response.data);
      
      return {
        status: response.status,
        documents: response.data
      };
    });
  }

  async testSubfolderUrlFormat() {
    return this.runTest("Subfolder URL Format Test", async () => {
      // Test with SUBFOLDER path format per MoneyWorks spec: /REST/{folder}%2f{document}.moneyworks/
      const protocol = this.config.protocol || "http";
      const folderName = this.config.folderAuth?.folderName || "";
      const documentName = encodeURIComponent("AgileWorks Information Systems Main GL To Fix");
      
      const subfolderUrl = `${protocol}://${this.config.host}:${this.config.port}/REST/${folderName}%2f${documentName}.moneyworks/export?table=account&limit=3&format=xml-verbose`;
      const headers = this.getAuthHeaders();
      
      console.log(`   🗂️  SUBFOLDER URL: ${subfolderUrl}`);
      console.log(`   📋 Format: /REST/{folder}%2f{document}.moneyworks/export?table={table}`);
      console.log(`   📁 Folder: ${folderName}`);
      console.log(`   📄 Document: ${documentName}.moneyworks`);
      console.log(`   Auth: ${headers.Authorization.substring(0, 50)}...`);
      
      const response = await axios.get(subfolderUrl, { headers });
      return {
        status: response.status,
        data: response.data,
        dataLength: response.data.length
      };
    });
  }

  async testProperDualHeaderAuth() {
    return this.runTest("Proper Dual Header Authentication", async () => {
      // Test with proper dual headers as per MoneyWorks spec
      if (!this.config.folderAuth) {
        throw new Error("Folder auth not configured - cannot test dual headers");
      }

      const documentCredentials = `${this.config.username}:Document:${this.config.password}`;
      const documentAuth = `Basic ${Buffer.from(documentCredentials).toString("base64")}`;

      const { folderName, password } = this.config.folderAuth;
      const folderCredentials = `${folderName}:Datacentre:${password}`;
      const folderAuth = `Basic ${Buffer.from(folderCredentials).toString("base64")}`;

      const url = `${this.getBaseUrl()}/evaluate?expr=${encodeURIComponent("1+1")}`;
      
      console.log(`   Using separate Authorization headers`);
      console.log(`   Folder: ${folderAuth.substring(0, 30)}...`);
      console.log(`   Document: ${documentAuth.substring(0, 30)}...`);

      // Create axios instance with custom adapter to handle duplicate headers
      const response = await axios({
        method: 'get',
        url: url,
        headers: {
          'Authorization': [folderAuth, documentAuth]
        },
        validateStatus: () => true // Accept any status for debugging
      });

      return {
        status: response.status,
        data: response.data,
        statusText: response.statusText
      };
    });
  }

  async testFieldTypes() {
    return this.runTest("Field Type Discovery", async () => {
      // Test field type discovery for account table
      const fields = await this.api.getDatabaseFieldsWithTypes("account");
      console.log(`   Account table has ${fields.length} fields`);
      console.log(`   Sample fields: ${fields.slice(0, 3).map(f => `${f.name}(${f.jsType})`).join(", ")}`);
      return {
        fieldCount: fields.length,
        sampleFields: fields.slice(0, 5)
      };
    });
  }

  async runAllTests() {
    console.log("🚀 MoneyWorks API Connection Test Suite");
    console.log("=====================================");
    console.log(`Server: ${this.config.host}:${this.config.port}`);
    console.log(`Protocol: ${this.config.protocol || 'http (default)'}`);
    console.log(`Document: ${this.config.dataFile}`);
    console.log(`Username: ${this.config.username}`);
    console.log(`Folder Auth: ${this.config.folderAuth ? 'Yes' : 'No'}`);

    // Run all tests in order
    await this.testBasicConnectivity();
    await this.testAuthentication();
    await this.testSimpleExpression();
    await this.testDateExpression();
    await this.testDatabaseTables();
    await this.testAccountTable();
    await this.testDirectHttpRequest();
    
    // Only test dual headers if folder auth is configured
    if (this.config.folderAuth) {
      await this.testProperDualHeaderAuth();
    }
    
    await this.testFieldTypes();
    await this.testListDocuments();
    await this.testCorrectUrlFormat();
    await this.testSubfolderUrlFormat();
    await this.testProtocolSupport();

    // Print summary
    this.printSummary();
  }

  async testProtocolSupport() {
    return this.runTest("Protocol Support Test", async () => {
      const results = [];
      
      // Test HTTP
      try {
        const httpUrl = `http://${this.config.host}:${this.config.port}/REST/server/version`;
        const httpResponse = await axios.get(httpUrl, { timeout: 3000 });
        results.push({ protocol: 'http', status: httpResponse.status, version: httpResponse.data });
        console.log(`   ✅ HTTP works: ${httpResponse.data}`);
      } catch (error) {
        results.push({ protocol: 'http', error: error instanceof Error ? error.message : String(error) });
        console.log(`   ❌ HTTP failed: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Test HTTPS
      try {
        const httpsUrl = `https://${this.config.host}:${this.config.port}/REST/server/version`;
        const httpsResponse = await axios.get(httpsUrl, { 
          timeout: 3000,
          // Allow self-signed certificates for testing
          httpsAgent: new (await import('https')).Agent({
            rejectUnauthorized: false
          })
        });
        results.push({ protocol: 'https', status: httpsResponse.status, version: httpsResponse.data });
        console.log(`   ✅ HTTPS works: ${httpsResponse.data}`);
      } catch (error) {
        results.push({ protocol: 'https', error: error instanceof Error ? error.message : String(error) });
        console.log(`   ❌ HTTPS failed: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      const configuredProtocol = this.config.protocol || 'http';
      console.log(`   📋 Current config uses: ${configuredProtocol}`);
      
      return results;
    });
  }

  private printSummary() {
    console.log("\n📊 Test Summary");
    console.log("===============");
    
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => r.success === false).length;
    const totalTime = this.results.reduce((sum, r) => sum + (r.duration || 0), 0);

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total time: ${totalTime}ms`);
    console.log(`📈 Success rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log("\n❌ Failed Tests:");
      this.results.filter(r => !r.success).forEach(result => {
        console.log(`   • ${result.test}: ${result.error}`);
      });
    }

    console.log("\n💡 Analysis:");
    const connectivityPassed = this.results.find(r => r.test.includes("Connectivity"))?.success;
    const authPassed = this.results.find(r => r.test.includes("Simple Expression"))?.success;
    const tablesPassed = this.results.find(r => r.test.includes("Database Tables"))?.success;

    if (!connectivityPassed) {
      console.log("   🔍 Check if MoneyWorks DataCentre is running and accessible");
      console.log("   🔍 Verify host and port configuration");
    } else if (!authPassed) {
      console.log("   🔍 Authentication issue - check username, password, and document name");
      console.log("   🔍 Verify document is open in MoneyWorks DataCentre");
    } else if (!tablesPassed) {
      console.log("   🔍 Document access issue - check document permissions");
    } else {
      console.log("   ✨ MoneyWorks API is working correctly!");
      console.log("   ✨ MCP server should be able to connect successfully");
    }
  }
}

// Run the tests
const tester = new MoneyWorksConnectionTester();
tester.runAllTests().catch(console.error);