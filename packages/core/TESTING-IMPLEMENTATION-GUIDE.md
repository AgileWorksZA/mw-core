# Testing Implementation Guide - Phase 1

## Overview

This guide provides detailed implementation steps for Phase 1 of the comprehensive testing plan, focusing on core functionality testing for the @moneyworks/core package.

## Test Structure Setup

### Directory Structure
```
packages/core/
├── src/
│   └── **/*.test.ts          # Unit tests alongside source files
├── tests/
│   ├── fixtures/             # Test data fixtures
│   │   ├── xml/
│   │   ├── json/
│   │   └── tsv/
│   ├── factories/            # Test data factories
│   ├── utils/                # Test utilities
│   ├── mocks/                # Mock implementations
│   └── setup.ts              # Global test setup
└── test-config.json          # Test configuration
```

## 1. REST Client Unit Tests

### Enhanced client.test.ts

```typescript
import { describe, expect, test, beforeEach, afterEach, mock } from "bun:test";
import { MoneyWorksRESTClient } from "../client";
import { MoneyWorksError, MoneyWorksErrorCode } from "../errors";
import type { MoneyWorksConfig } from "../types";

describe("MoneyWorksRESTClient", () => {
  let client: MoneyWorksRESTClient;
  let mockFetch: ReturnType<typeof mock>;
  
  const testConfig: MoneyWorksConfig = {
    host: "localhost",
    port: 6710,
    dataFile: "test.moneyworks",
    username: "testuser",
    password: "testpass",
  };

  beforeEach(() => {
    mockFetch = mock((url: string, options?: RequestInit) => {
      return Promise.resolve(new Response());
    });
    global.fetch = mockFetch;
    client = new MoneyWorksRESTClient(testConfig);
  });

  afterEach(() => {
    mock.restore();
  });

  describe("export", () => {
    test("should export records with default options", async () => {
      const mockResponse = `Code\tName\tPhone
CUST001\tAcme Corp\t555-1234
CUST002\tWidget Inc\t555-5678`;

      mockFetch.mockResolvedValueOnce(
        new Response(mockResponse, {
          headers: { "content-type": "text/tab-separated-values" }
        })
      );

      const result = await client.export("Name");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/export/table=Name"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Basic dGVzdHVzZXI6dGVzdHBhc3M=",
          }),
        })
      );
      expect(result).toBe(mockResponse);
    });

    test("should handle JSON format conversion", async () => {
      const mockXML = `<?xml version="1.0"?>
<export>
  <table name="Name">
    <name>
      <Code>CUST001</Code>
      <Name>Acme Corp</Name>
      <Phone>555-1234</Phone>
    </name>
  </table>
</export>`;

      mockFetch.mockResolvedValueOnce(
        new Response(mockXML, {
          headers: { "content-type": "text/xml" }
        })
      );

      const result = await client.export("Name", { format: "json" });

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty("code", "CUST001");
      expect(result[0]).toHaveProperty("name", "Acme Corp");
    });

    test("should handle export errors", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response("Authentication failed", {
          status: 401,
          statusText: "Unauthorized"
        })
      );

      await expect(client.export("Name")).rejects.toThrow(MoneyWorksError);
      await expect(client.export("Name")).rejects.toMatchObject({
        code: MoneyWorksErrorCode.AUTH_FAILED,
      });
    });

    test("should handle timeout", async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((resolve) => setTimeout(resolve, 35000))
      );

      const timeoutClient = new MoneyWorksRESTClient({
        ...testConfig,
        timeout: 100, // 100ms timeout
      });

      await expect(timeoutClient.export("Name")).rejects.toThrow(
        MoneyWorksError
      );
      await expect(timeoutClient.export("Name")).rejects.toMatchObject({
        code: MoneyWorksErrorCode.TIMEOUT,
      });
    });
  });

  describe("import", () => {
    test("should import records successfully", async () => {
      const mockResponse = `Created: 2
Updated: 0
Errors: 0`;

      mockFetch.mockResolvedValueOnce(
        new Response(mockResponse, {
          headers: { "content-type": "text/plain" }
        })
      );

      const records = [
        { code: "CUST003", name: "New Customer" },
        { code: "CUST004", name: "Another Customer" },
      ];

      const result = await client.import("Name", records);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/import"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "text/xml",
          }),
          body: expect.stringContaining("<Code>CUST003</Code>"),
        })
      );

      expect(result).toEqual({
        processed: 2,
        created: 2,
        updated: 0,
        errors: 0,
      });
    });

    test("should handle import errors", async () => {
      const mockResponse = `[ERROR] Line 1: Duplicate key 'CUST001'
[ERROR] Line 2: Invalid field value
Created: 0
Updated: 0
Errors: 2`;

      mockFetch.mockResolvedValueOnce(
        new Response(mockResponse, {
          headers: { "content-type": "text/plain" }
        })
      );

      const records = [
        { code: "CUST001", name: "Duplicate" },
        { code: "CUST005", name: "" },
      ];

      const result = await client.import("Name", records);

      expect(result.errors).toBe(2);
      expect(result.errorDetails).toHaveLength(2);
      expect(result.errorDetails[0].message).toContain("Duplicate key");
    });
  });

  describe("streaming", () => {
    test("should stream large datasets", async () => {
      const batches = [
        createNameBatch(0, 1000),
        createNameBatch(1000, 1000),
        createNameBatch(2000, 500), // Last partial batch
      ];

      let callCount = 0;
      mockFetch.mockImplementation(() => {
        const batch = batches[callCount++];
        return Promise.resolve(
          new Response(createXMLResponse("Name", batch), {
            headers: { "content-type": "text/xml" }
          })
        );
      });

      const results = [];
      for await (const batch of client.exportStream("Name", { chunkSize: 1000 })) {
        results.push(batch);
      }

      expect(results).toHaveLength(3);
      expect(results[0]).toHaveLength(1000);
      expect(results[1]).toHaveLength(1000);
      expect(results[2]).toHaveLength(500);
    });

    test("should call progress callback", async () => {
      const progressUpdates = [];
      
      mockFetch
        .mockResolvedValueOnce(
          new Response(createXMLResponse("Name", createNameBatch(0, 100)))
        )
        .mockResolvedValueOnce(
          new Response(createXMLResponse("Name", []))
        );

      await client.exportStream("Name", {
        chunkSize: 100,
        onProgress: (progress) => progressUpdates.push(progress),
      }).next();

      expect(progressUpdates).toHaveLength(1);
      expect(progressUpdates[0].current).toBe(100);
    });
  });
});

// Helper functions
function createNameBatch(start: number, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    code: `CUST${String(start + i + 1).padStart(6, "0")}`,
    name: `Customer ${start + i + 1}`,
  }));
}

function createXMLResponse(table: string, records: any[]) {
  const recordsXML = records
    .map(r => `<${table.toLowerCase()}>
      ${Object.entries(r).map(([k, v]) => 
        `<${k.charAt(0).toUpperCase() + k.slice(1)}>${v}</${k.charAt(0).toUpperCase() + k.slice(1)}>`
      ).join("\n      ")}
    </${table.toLowerCase()}>`)
    .join("\n  ");

  return `<?xml version="1.0"?>
<export>
  <table name="${table}">
    ${recordsXML}
  </table>
</export>`;
}
```

### New auth.test.ts

```typescript
import { describe, expect, test } from "bun:test";
import {
  buildAuthHeaders,
  buildRESTUrl,
  maskConfig,
  parseAuthError,
  validateConfig,
} from "./auth";
import type { MoneyWorksConfig } from "./types";

describe("Authentication", () => {
  describe("buildAuthHeaders", () => {
    test("should build basic auth headers", () => {
      const config: MoneyWorksConfig = {
        host: "localhost",
        port: 6710,
        dataFile: "test.moneyworks",
        username: "user",
        password: "pass",
      };

      const headers = buildAuthHeaders(config);

      expect(headers.Authorization).toBe("Basic " + btoa("user:pass"));
      expect(headers["Authorization-Folder"]).toBeUndefined();
    });

    test("should build two-level auth headers", () => {
      const config: MoneyWorksConfig = {
        host: "localhost",
        port: 6710,
        dataFile: "test.moneyworks",
        username: "user",
        password: "pass",
        folderName: "folder",
        folderPassword: "folderpass",
      };

      const headers = buildAuthHeaders(config);

      expect(headers.Authorization).toBe("Basic " + btoa("user:pass"));
      expect(headers["Authorization-Folder"]).toBe(
        "Basic " + btoa("folder:folderpass")
      );
    });

    test("should handle special characters in credentials", () => {
      const config: MoneyWorksConfig = {
        host: "localhost",
        port: 6710,
        dataFile: "test.moneyworks",
        username: "user@domain.com",
        password: "p@ss:word!",
      };

      const headers = buildAuthHeaders(config);

      expect(headers.Authorization).toBe(
        "Basic " + btoa("user@domain.com:p@ss:word!")
      );
    });
  });

  describe("maskConfig", () => {
    test("should mask sensitive fields", () => {
      const config: MoneyWorksConfig = {
        host: "localhost",
        port: 6710,
        dataFile: "test.moneyworks",
        username: "testuser",
        password: "testpass",
        folderPassword: "folderpass",
      };

      const masked = maskConfig(config);

      expect(masked.password).toBe("***");
      expect(masked.folderPassword).toBe("***");
      expect(masked.username).toBe("testuser");
      expect(masked.host).toBe("localhost");
    });
  });

  describe("parseAuthError", () => {
    test("should parse 401 response", () => {
      const response = new Response("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="MoneyWorks"',
        },
      });

      const message = parseAuthError(response);

      expect(message).toContain("Authentication failed");
      expect(message).toContain("Invalid credentials");
    });

    test("should parse folder auth failure", () => {
      const response = new Response("Folder authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="MoneyWorks Folder"',
        },
      });

      const message = parseAuthError(response);

      expect(message).toContain("Folder authentication");
    });
  });

  describe("validateConfig", () => {
    test("should validate complete config", () => {
      const config: MoneyWorksConfig = {
        host: "localhost",
        port: 6710,
        dataFile: "test.moneyworks",
        username: "user",
        password: "pass",
      };

      expect(() => validateConfig(config)).not.toThrow();
    });

    test("should reject invalid port", () => {
      const config: MoneyWorksConfig = {
        host: "localhost",
        port: 999999,
        dataFile: "test.moneyworks",
        username: "user",
        password: "pass",
      };

      expect(() => validateConfig(config)).toThrow("Invalid port number");
    });

    test("should reject invalid file extension", () => {
      const config: MoneyWorksConfig = {
        host: "localhost",
        port: 6710,
        dataFile: "test.xlsx",
        username: "user",
        password: "pass",
      };

      expect(() => validateConfig(config)).toThrow(
        "Invalid data file extension"
      );
    });

    test("should require both folder credentials", () => {
      const config: MoneyWorksConfig = {
        host: "localhost",
        port: 6710,
        dataFile: "test.moneyworks",
        username: "user",
        password: "pass",
        folderName: "folder",
        // Missing folderPassword
      };

      expect(() => validateConfig(config)).toThrow(
        "Both folderName and folderPassword must be provided"
      );
    });
  });
});
```

## 2. Table Interface Tests

### Example: transactions.test.ts

```typescript
import { describe, expect, test } from "bun:test";
import {
  TransactionType,
  TransactionStatus,
  transactionConverters,
  transactionHelpers,
  type Transaction,
  type TransactionCamel,
} from "./transactions";

describe("Transactions Table", () => {
  describe("Enums", () => {
    test("should have correct transaction type values", () => {
      expect(TransactionType.DebtorInvoice).toBe("DII");
      expect(TransactionType.CashPayment).toBe("CP");
      expect(TransactionType.Journal).toBe("JN");
    });

    test("should have correct status values", () => {
      expect(TransactionStatus.Unposted).toBe("U");
      expect(TransactionStatus.Posted).toBe("P");
      expect(TransactionStatus.Pending).toBe("O");
      expect(TransactionStatus.Completed).toBe("C");
    });
  });

  describe("Converters", () => {
    test("should convert from PascalCase to camelCase", () => {
      const raw: Transaction = {
        SequenceNumber: 12345,
        Type: TransactionType.DebtorInvoice,
        Status: TransactionStatus.Posted,
        TransDate: "2024-01-15",
        Period: 202401,
        Description: "Test Invoice",
        NameCode: "CUST001",
        OurRef: "INV001",
        Gross: 1100,
        TaxAmount: 100,
        Net: 1000,
      };

      const camel = transactionConverters.toCamelCase(raw);

      expect(camel.sequenceNumber).toBe(12345);
      expect(camel.type).toBe(TransactionType.DebtorInvoice);
      expect(camel.status).toBe(TransactionStatus.Posted);
      expect(camel.transDate).toBe("2024-01-15");
      expect(camel.description).toBe("Test Invoice");
      expect(camel.gross).toBe(1100);
    });

    test("should convert from camelCase to PascalCase", () => {
      const camel: TransactionCamel = {
        sequenceNumber: 12345,
        type: TransactionType.DebtorInvoice,
        status: TransactionStatus.Posted,
        transDate: "2024-01-15",
        period: 202401,
        nameCode: "CUST001",
        gross: 1100,
      };

      const pascal = transactionConverters.fromCamelCase(camel);

      expect(pascal.SequenceNumber).toBe(12345);
      expect(pascal.Type).toBe(TransactionType.DebtorInvoice);
      expect(pascal.Status).toBe(TransactionStatus.Posted);
      expect(pascal.NameCode).toBe("CUST001");
    });

    test("should handle optional fields", () => {
      const minimal: Transaction = {
        SequenceNumber: 1,
        Type: TransactionType.Journal,
        Status: TransactionStatus.Unposted,
        TransDate: "2024-01-01",
        Period: 202401,
      };

      const camel = transactionConverters.toCamelCase(minimal);

      expect(camel.description).toBeUndefined();
      expect(camel.nameCode).toBeUndefined();
      expect(camel.gross).toBeUndefined();
    });
  });

  describe("Helpers", () => {
    describe("decodeFlags", () => {
      test("should decode all flags correctly", () => {
        const flags = transactionHelpers.decodeFlags(0x001f); // All flags set

        expect(flags.reconciled).toBe(true);
        expect(flags.hasAttachments).toBe(true);
        expect(flags.approved).toBe(true);
        expect(flags.needsApproval).toBe(true);
        expect(flags.exported).toBe(true);
        expect(flags.locked).toBe(false); // 0x0020 not set
      });

      test("should decode no flags", () => {
        const flags = transactionHelpers.decodeFlags(0);

        expect(flags.reconciled).toBe(false);
        expect(flags.hasAttachments).toBe(false);
        expect(flags.approved).toBe(false);
        expect(flags.needsApproval).toBe(false);
        expect(flags.exported).toBe(false);
        expect(flags.locked).toBe(false);
      });
    });

    describe("encodeFlags", () => {
      test("should encode flags correctly", () => {
        const encoded = transactionHelpers.encodeFlags({
          reconciled: true,
          hasAttachments: false,
          approved: true,
          needsApproval: false,
          exported: true,
          locked: false,
        });

        expect(encoded).toBe(0x0015); // 0x0001 | 0x0004 | 0x0010
      });
    });

    describe("period encoding", () => {
      test("should encode period correctly", () => {
        expect(transactionHelpers.encodePeriod(2024, 1)).toBe(2401);
        expect(transactionHelpers.encodePeriod(2024, 12)).toBe(2412);
        expect(transactionHelpers.encodePeriod(2025, 3)).toBe(2503);
      });

      test("should decode period correctly", () => {
        expect(transactionHelpers.decodePeriod(2401)).toEqual({
          year: 2024,
          period: 1,
        });
        expect(transactionHelpers.decodePeriod(2412)).toEqual({
          year: 2024,
          period: 12,
        });
      });
    });

    describe("type checking", () => {
      test("should identify invoice types", () => {
        expect(transactionHelpers.isInvoice(TransactionType.DebtorInvoice)).toBe(true);
        expect(transactionHelpers.isInvoice(TransactionType.CreditorCredit)).toBe(true);
        expect(transactionHelpers.isInvoice(TransactionType.CashPayment)).toBe(false);
        expect(transactionHelpers.isInvoice(TransactionType.Journal)).toBe(false);
      });

      test("should identify payment types", () => {
        expect(transactionHelpers.isPayment(TransactionType.CashPayment)).toBe(true);
        expect(transactionHelpers.isPayment(TransactionType.CashReceipt)).toBe(true);
        expect(transactionHelpers.isPayment(TransactionType.DebtorInvoice)).toBe(false);
      });

      test("should identify order types", () => {
        expect(transactionHelpers.isOrder(TransactionType.Quote)).toBe(true);
        expect(transactionHelpers.isOrder(TransactionType.SalesOrder)).toBe(true);
        expect(transactionHelpers.isOrder(TransactionType.PurchaseOrder)).toBe(true);
        expect(transactionHelpers.isOrder(TransactionType.DebtorInvoice)).toBe(false);
      });
    });

    describe("calculations", () => {
      test("should calculate net amount", () => {
        expect(transactionHelpers.calculateNet(1100, 100)).toBe(1000);
        expect(transactionHelpers.calculateNet(550, 50)).toBe(500);
      });

      test("should calculate balance", () => {
        expect(transactionHelpers.calculateBalance(1000)).toBe(1000);
        expect(transactionHelpers.calculateBalance(1000, 300)).toBe(700);
        expect(transactionHelpers.calculateBalance(1000, 300, 200)).toBe(500);
      });
    });
  });

  describe("Field Constraints", () => {
    test("should validate field lengths", () => {
      const transaction: Partial<TransactionCamel> = {
        type: "TOOLONG" as TransactionType, // Should be max 3 chars
        nameCode: "VERYLONGCODE123", // Should be max 11 chars
        ourRef: "VERYLONGREFERENCE123", // Should be max 11 chars
      };

      const errors = validateFieldLengths("Transaction", transaction);

      expect(errors).toContain("type exceeds 3 character limit");
      expect(errors).toContain("nameCode exceeds 11 character limit");
      expect(errors).toContain("ourRef exceeds 11 character limit");
    });
  });
});

// Helper function for field validation
function validateFieldLengths(table: string, record: any): string[] {
  const constraints = {
    Transaction: {
      type: 3,
      nameCode: 11,
      ourRef: 11,
      theirRef: 21,
      department: 7,
      bankAccount: 7,
    },
  };

  const errors: string[] = [];
  const tableConstraints = constraints[table];

  if (tableConstraints) {
    for (const [field, maxLength] of Object.entries(tableConstraints)) {
      if (record[field] && record[field].length > maxLength) {
        errors.push(`${field} exceeds ${maxLength} character limit`);
      }
    }
  }

  return errors;
}
```

## 3. Test Utilities

### tests/utils/test-data-builder.ts

```typescript
/**
 * Test data builder utilities
 */

export class TestDataBuilder {
  static transaction(overrides: Partial<TransactionCamel> = {}): TransactionCamel {
    return {
      sequenceNumber: 1,
      type: TransactionType.DebtorInvoice,
      status: TransactionStatus.Unposted,
      transDate: new Date(),
      period: 202401,
      ...overrides,
    };
  }

  static name(overrides: Partial<NameCamel> = {}): NameCamel {
    return {
      code: `TEST${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: "Test Customer",
      customerType: 1,
      ...overrides,
    };
  }

  static product(overrides: Partial<ProductCamel> = {}): ProductCamel {
    return {
      code: `PROD${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      description: "Test Product",
      sellPrice: 99.99,
      sellUnit: "EA",
      ...overrides,
    };
  }

  static detail(overrides: Partial<DetailCamel> = {}): DetailCamel {
    return {
      parentSeq: 1,
      account: "4100",
      debit: 0,
      credit: 100,
      description: "Test line",
      ...overrides,
    };
  }
}
```

### tests/utils/mock-server.ts

```typescript
/**
 * Mock MoneyWorks server for testing
 */

import { serve } from "bun";

export class MockMoneyWorksServer {
  private server: any;
  private requests: Request[] = [];
  private responses = new Map<string, Response>();

  async start(port = 6710) {
    this.server = serve({
      port,
      fetch: async (req) => {
        this.requests.push(req);
        
        const url = new URL(req.url);
        const key = `${req.method} ${url.pathname}`;
        
        const mockResponse = this.responses.get(key);
        if (mockResponse) {
          return mockResponse;
        }

        // Default responses
        if (url.pathname.includes("/export")) {
          return this.handleExport(url);
        }
        if (url.pathname.includes("/import")) {
          return this.handleImport(req);
        }

        return new Response("Not Found", { status: 404 });
      },
    });
  }

  stop() {
    this.server?.stop();
  }

  mockResponse(method: string, path: string, response: Response) {
    this.responses.set(`${method} ${path}`, response);
  }

  getRequests() {
    return this.requests;
  }

  clearRequests() {
    this.requests = [];
  }

  private async handleExport(url: URL): Promise<Response> {
    const params = new URLSearchParams(url.pathname.split("?")[1]);
    const table = params.get("table");
    const format = params.get("format") || "tsv";

    if (format === "xml-verbose") {
      return new Response(
        `<?xml version="1.0"?>
<export>
  <table name="${table}">
    <${table.toLowerCase()}>
      <Code>TEST001</Code>
      <Name>Test Record</Name>
    </${table.toLowerCase()}>
  </table>
</export>`,
        { headers: { "content-type": "text/xml" } }
      );
    }

    return new Response("Code\tName\nTEST001\tTest Record", {
      headers: { "content-type": "text/tab-separated-values" },
    });
  }

  private async handleImport(req: Request): Promise<Response> {
    const body = await req.text();
    const recordCount = (body.match(/<Code>/g) || []).length;

    return new Response(
      `Created: ${recordCount}\nUpdated: 0\nErrors: 0`,
      { headers: { "content-type": "text/plain" } }
    );
  }
}
```

## 4. Test Configuration

### test-config.json

```json
{
  "moneyworks": {
    "host": "localhost",
    "port": 6710,
    "dataFile": "test.moneyworks",
    "username": "test",
    "password": "test"
  },
  "mock": {
    "enabled": true,
    "port": 6711
  },
  "fixtures": {
    "path": "tests/fixtures",
    "formats": ["xml", "tsv", "json"]
  },
  "timeouts": {
    "unit": 5000,
    "integration": 30000,
    "e2e": 60000
  }
}
```

## 5. GitHub Actions CI Configuration

### .github/workflows/test.yml

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install
    
    - name: Run type checking
      run: bun run typecheck
    
    - name: Run unit tests
      run: bun test:unit
    
    - name: Run integration tests
      run: bun test:integration
    
    - name: Generate coverage report
      run: bun test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
```

## Next Steps

1. **Implement Mock Server Tests**: Create comprehensive mock server tests for all REST endpoints
2. **Add Schema Validation Tests**: Test Zod schema validation for all table types
3. **Create Test Fixtures**: Generate realistic test data for all MoneyWorks tables
4. **Performance Benchmarks**: Add performance tests for large data operations
5. **Error Scenario Coverage**: Test all error codes and edge cases

## Testing Checklist

- [ ] All REST client methods have unit tests
- [ ] All table interfaces have converter tests
- [ ] All helper functions have unit tests
- [ ] Mock server handles all API endpoints
- [ ] Test utilities are documented
- [ ] CI/CD pipeline is configured
- [ ] Coverage reports are generated
- [ ] Performance benchmarks established
- [ ] Error scenarios fully covered
- [ ] Integration tests with real MoneyWorks (optional)