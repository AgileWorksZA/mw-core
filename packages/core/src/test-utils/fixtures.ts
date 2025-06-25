/**
 * Test fixtures - static test data
 */

export const fixtures = {
  /**
   * XML responses from MoneyWorks
   */
  xml: {
    // Valid export response
    validExport: `<?xml version="1.0"?>
<export>
  <table name="Account">
    <account>
      <Code>BANK-001</Code>
      <Description>Main Bank Account</Description>
      <Type>BA</Type>
      <Balance>10000.00</Balance>
    </account>
    <account>
      <Code>SALES-001</Code>
      <Description>Sales Revenue</Description>
      <Type>IN</Type>
      <Balance>-50000.00</Balance>
    </account>
  </table>
</export>`,

    // Empty result
    emptyExport: `<?xml version="1.0"?>
<export>
  <table name="Account">
  </table>
</export>`,

    // Malformed XML
    malformed: `<?xml version="1.0"?>
<export>
  <table name="Account">
    <account>
      <Code>TEST</Code>
      <!-- Missing closing tags`,

    // Special characters
    withSpecialChars: `<?xml version="1.0"?>
<export>
  <table name="Name">
    <name>
      <Code>SPECIAL-001</Code>
      <Name>Test &amp; Co &lt;Special&gt;</Name>
      <Description>Description with "quotes" and 'apostrophes'</Description>
    </name>
  </table>
</export>`,

    // Error response
    errorResponse: `<?xml version="1.0"?>
<error>
  <code>1001</code>
  <message>Table not found</message>
</error>`,

    // Import success
    importSuccess: `<?xml version="1.0"?>
<import status="success" count="1">
  <record sequence="1001" />
</import>`,

    // Import failure
    importError: `<?xml version="1.0"?>
<import status="error">
  <error field="Code" message="Duplicate code" />
</import>`,
  },

  /**
   * TSV data
   */
  tsv: {
    // Standard TSV export
    validExport: `Code\tDescription\tType\tBalance
BANK-001\tMain Bank Account\tBA\t10000.00
SALES-001\tSales Revenue\tIN\t-50000.00`,

    // With special characters
    withSpecialChars: `Code\tDescription
TEST-001\tTest & Co
TEST-002\t"Quoted Description"
TEST-003\tLine1\\nLine2`,

    // Empty
    empty: '',

    // Headers only
    headersOnly: 'Code\tDescription\tType\tBalance',
  },

  /**
   * JSON responses
   */
  json: {
    // Account list
    accounts: [
      {
        sequenceNumber: 1001,
        code: 'BANK-001',
        description: 'Main Bank Account',
        type: 'BA',
        balance: 10000.00,
      },
      {
        sequenceNumber: 1002,
        code: 'SALES-001',
        description: 'Sales Revenue',
        type: 'IN',
        balance: -50000.00,
      }
    ],

    // Transaction
    transaction: {
      sequenceNumber: 2001,
      type: 'DI',
      transDate: '20240101',
      description: 'Invoice #2001',
      nameCode: 'CUST-001',
      gross: 1100.00,
      tax: 100.00,
      net: 1000.00,
      status: 1,
    },

    // Error response
    error: {
      error: 'Authentication failed',
      code: 401,
      message: 'Invalid username or password',
    }
  },

  /**
   * MoneyWorks expressions
   */
  expressions: {
    // Valid expressions
    valid: {
      simple: '1 + 1',
      field: 'Account.Balance',
      function: 'Count(Transaction, Type="DI")',
      complex: 'Sum(Transaction.Gross, Period=CurrentPeriod() and Status=1)',
    },

    // Invalid expressions
    invalid: {
      syntax: 'Count(Transaction',
      field: 'InvalidTable.Field',
      function: 'InvalidFunction()',
    }
  },

  /**
   * Configuration
   */
  config: {
    // Valid config
    valid: {
      host: 'localhost',
      port: 9595,
      username: 'test',
      password: 'test123',
      dataFile: 'TestFile.mwd7',
    },

    // Two-level auth
    twoLevel: {
      host: 'localhost',
      port: 9595,
      username: 'test',
      password: 'test123',
      dataFile: 'TestFile.mwd7',
      folderName: 'TestFolder',
      folderPassword: 'folder123',
    },

    // Minimal config
    minimal: {
      host: 'localhost',
      port: 9595,
      username: 'test',
      dataFile: 'TestFile.mwd7',
    },

    // Invalid configs
    invalid: {
      missingHost: {
        port: 9595,
        username: 'test',
        dataFile: 'TestFile.mwd7',
      },
      badPort: {
        host: 'localhost',
        port: 'not-a-number',
        username: 'test',
        dataFile: 'TestFile.mwd7',
      }
    }
  },

  /**
   * HTTP responses
   */
  http: {
    // Success headers
    successHeaders: {
      'content-type': 'text/xml',
      'content-length': '1234',
      'x-moneyworks-version': '9.1.7',
    },

    // Error responses
    errors: {
      unauthorized: {
        status: 401,
        headers: { 'www-authenticate': 'Basic realm="MoneyWorks"' },
        body: 'Unauthorized',
      },
      notFound: {
        status: 404,
        body: 'Not Found',
      },
      serverError: {
        status: 500,
        body: 'Internal Server Error',
      },
      timeout: {
        code: 'ETIMEDOUT',
        message: 'Request timeout',
      }
    }
  },

  /**
   * Date/time values
   */
  dates: {
    // MoneyWorks date format (YYYYMMDD)
    mwDates: {
      today: '20240115',
      yesterday: '20240114',
      startOfYear: '20240101',
      endOfYear: '20241231',
    },

    // ISO dates
    isoDates: {
      today: '2024-01-15T00:00:00Z',
      yesterday: '2024-01-14T00:00:00Z',
    },

    // Periods
    periods: {
      current: 1,
      previous: 12,
      yearStart: 1,
      yearEnd: 12,
    }
  }
};