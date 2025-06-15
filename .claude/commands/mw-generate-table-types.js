import { existsSync } from 'fs';
import { readFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MoneyWorks table documentation URLs
const TABLE_URLS = {
  // Core business tables
  accounts: "https://cognito.co.nz/manual/moneyworks_appendix_accounts.html",
  names: "https://cognito.co.nz/manual/moneyworks_appendix_names.html",
  products: "https://cognito.co.nz/manual/moneyworks_appendix_products.html",
  transactions: "https://cognito.co.nz/manual/moneyworks_appendix_transactions.html",
  jobs: "https://cognito.co.nz/manual/moneyworks_appendix_jobs.html",
  contacts: "https://cognito.co.nz/manual/moneyworks_appendix_contacts.html",
  assets: "https://cognito.co.nz/manual/moneyworks_appendix_assets.html",
  departments: "https://cognito.co.nz/manual/moneyworks_appendix_departments.html",
  inventory: "https://cognito.co.nz/manual/moneyworks_appendix_inventory.html",
  "job-sheet-items": "https://cognito.co.nz/manual/moneyworks_appendix_job_sheet_items.html",
  "tax-rate": "https://cognito.co.nz/manual/moneyworks_appendix_tax_rate.html",
  // Authentication & security tables
  login: "https://cognito.co.nz/manual/moneyworks_appendix_login_file.html",
  user: "https://cognito.co.nz/manual/moneyworks_appendix_user_file.html",
  user2: "https://cognito.co.nz/manual/moneyworks_appendix_user2_file.html",
  // Financial transaction tables
  payments: "https://cognito.co.nz/manual/moneyworks_appendix_payments_file.html",
  reconciliation: "https://cognito.co.nz/manual/moneyworks_appendix_reconciliation_file.html",
  "auto-split": "https://cognito.co.nz/manual/moneyworks_appendix_allocation_file.html",
  // Asset management tables
  "asset-log": "https://cognito.co.nz/manual/moneyworks_appendix_assets.html",
  "asset-categories": "https://cognito.co.nz/manual/moneyworks_appendix_asset_categories.html",
  // Multi-currency & off-ledger
  offledger: "https://cognito.co.nz/manual/moneyworks_appendix_offledgers_and_currency.html",
  // Manufacturing & inventory
  build: "https://cognito.co.nz/manual/moneyworks_appendix_build_file.html",
  // CRM & documentation
  memo: "https://cognito.co.nz/manual/moneyworks_appendix_memo_file.html",
  // Configuration tables
  general: "https://cognito.co.nz/manual/moneyworks_appendix_account_categories__department_classifications_and_groups.html",
  // Transaction subfiles
  detail: "https://cognito.co.nz/manual/moneyworks_appendix_transactions.html",
};

// Table-specific patterns and exceptions
const TABLE_PATTERNS = {
  names: {
    exceptionalFields: {
      customerType: "Uses 0/1/2 values instead of boolean",
      email: "Limited to 63 characters (not standard 255)",
      name: "255 characters (longer than usual)",
    },
    hasFlags: true,
    hasDualRole: true,
    relationships: {
      SalesPerson: "User.Code",
      Bank: "Bank.Code",
      Currency: "Currency.Code",
      TaxCode: "TaxRate.Code",
    },
    balanceGroups: ["Creditor", "Debtor"],
  },
  accounts: {
    exceptionalFields: {
      code: "7 characters max (not 11 like other tables)",
      type: "Two-character codes (IN, SA, EX, AS, LI, EQ)",
      colour: "Numeric color representation",
    },
    hasSecurityLevels: true,
    typeEnum: ["IN", "SA", "EX", "AS", "LI", "EQ"],
  },
  transactions: {
    exceptionalFields: {
      sequenceNumber: "Primary key instead of Code",
      period: "Encoded as 100 * year + period number",
    },
    hasDetailTable: true,
    noCodeField: true,
    statusTracking: ["Unposted", "Posted"],
  },
  products: {
    hasInventoryTracking: true,
    hasMultipleLocations: true,
  },
  jobs: {
    hasBudgetTracking: true,
    hasTimeTracking: true,
  },
  // Authentication & security tables
  login: {
    noCodeField: true,
    hasEncryption: true,
    exceptionalFields: {
      Password: "Encrypted field",
      Privileges: "Encoded as string but represents access rights",
    },
  },
  user: {
    scriptStorage: true,
    keyField: "Key",
    keyLength: 63,
    exceptionalFields: {
      Key: "Primary key up to 63 characters",
    },
  },
  user2: {
    scriptStorage: true,
    keyField: "Key",
    keyLength: 255,
    extendedFields: true,
    exceptionalFields: {
      Key: "Primary key up to 255 characters",
    },
  },
  // Financial transaction tables
  payments: {
    noCodeField: true,
    manyToMany: true,
    exceptionalFields: {
      OurAmount: "High bit indicates overpayment",
      TransSeq: "Links to Transaction.SequenceNumber",
      InvoiceSeq: "Links to invoice Transaction.SequenceNumber",
    },
  },
  reconciliation: {
    noCodeField: true,
    bankIntegration: true,
    exceptionalFields: {
      BankStatementDate: "Date of bank statement",
      Discrepancy: "Difference amount in reconciliation",
    },
  },
  "auto-split": {
    hasRules: true,
    percentageAllocation: true,
    exceptionalFields: {
      Percent: "Percentage allocation (0-100)",
      Amount: "Fixed amount allocation",
    },
  },
  // Asset management tables
  "asset-log": {
    isSubfile: true,
    parentTable: "assets",
    noDirectAccess: true,
    exceptionalFields: {
      Note: "Description of asset transaction",
    },
  },
  "asset-categories": {
    hasGLMapping: true,
    exceptionalFields: {
      DepreciationMethod: "0=None, 1=StraightLine, 2=DiminishingValue",
    },
  },
  // Multi-currency & off-ledger
  offledger: {
    dualPurpose: true,
    variableArrays: true,
    currencySupport: true,
    exceptionalFields: {
      Code: "Starts with @ for currencies",
      HistoricBalances: "Variable size array of historical balances",
    },
  },
  // Manufacturing & inventory
  build: {
    isBOM: true,
    linkedToProducts: true,
    exceptionalFields: {
      ProductCode: "Links to Products.Code",
      ComponentCode: "Component product code",
    },
  },
  // CRM & documentation
  memo: {
    hasReminders: true,
    linkedToNames: true,
    exceptionalFields: {
      NameCode: "Links to Names.Code",
      ReminderDate: "Optional reminder date",
    },
  },
  // Configuration tables
  general: {
    multiPurpose: true,
    codePrefix: ["A_", "D_", "G_"],
    logicalTables: ["Categories", "Classifications", "Groups"],
    exceptionalFields: {
      Code: "Prefix determines type: A_=Categories, D_=Classifications, G_=Groups",
    },
  },
  // Transaction subfiles
  detail: {
    isSubfile: true,
    parentTable: "transactions",
    noDirectAccess: true,
    keyField: "ParentSeq",
    exceptionalFields: {
      Account: "14-character account code",
      StockCode: "19-character product code",
      Custom1: "Scriptable text field",
      Custom2: "Scriptable text field",
    },
    hasFlags: true,
    linkedTables: {
      Account: "accounts.Code",
      StockCode: "products.Code",
      Department: "departments.Code",
      Job: "jobs.Code",
    },
  },
};

// Common field patterns
const COMMON_PATTERNS = {
  userFields: {
    pattern: /^user[1-8]$/,
    type: "string",
    maxLength: 255,
    optional: true,
    description: "User-defined field",
  },
  timestamps: {
    modTime: { type: "string", format: "ISO timestamp" },
    modUser: { type: "string", description: "User who last modified" },
  },
  flags: {
    type: "number",
    description: "Bitwise flags field",
    needsHelpers: true,
  },
};

export default {
  name: "mw-generate-table-types",
  description: "Generate TypeScript interfaces for MoneyWorks tables",
  
  async execute(args) {
    const tableName = args.table?.toLowerCase();
    
    // Validate table name
    if (!tableName) {
      return {
        error: "No table name provided",
        usage: "/project:mw-generate-table-types table=\"names\"",
        availableTables: Object.keys(TABLE_URLS),
      };
    }
    
    if (!TABLE_URLS[tableName]) {
      const availableTables = Object.keys(TABLE_URLS);
      const suggestion = findClosestMatch(tableName, availableTables);
      
      return {
        error: `Unknown table: ${tableName}`,
        availableTables,
        suggestion: suggestion ? `Did you mean "${suggestion}"?` : null,
      };
    }
    
    // Prepare output directory - for the core package
    const projectRoot = join(__dirname, '../..');
    const outputDir = join(projectRoot, 'packages/core/src/tables');
    const outputPath = join(outputDir, `${tableName}.ts`);
    
    try {
      await mkdir(outputDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's ok
    }
    
    // Check if file already exists
    let existingInterface = null;
    if (existsSync(outputPath)) {
      try {
        existingInterface = await readFile(outputPath, 'utf-8');
      } catch (error) {
        console.error('Error reading existing file:', error);
      }
    }
    
    // Get table-specific patterns
    const tablePatterns = TABLE_PATTERNS[tableName] || {};
    
    // Find related tables
    const relatedTables = findRelatedTables(tableName);
    
    // Return structured context for Claude
    return {
      action: existingInterface ? 'update' : 'create',
      table: tableName,
      interfaceName: toInterfaceName(tableName),
      documentationUrl: TABLE_URLS[tableName],
      outputPath,
      existingInterface,
      patterns: {
        common: COMMON_PATTERNS,
        specific: tablePatterns,
      },
      relatedTables,
      instructions: {
        fetchUrl: TABLE_URLS[tableName],
        analyzeStructure: true,
        generateInterface: true,
        includeEnums: true,
        includeHelpers: tablePatterns.hasFlags || tablePatterns.hasBitwiseFields,
        saveToFile: outputPath,
      },
      examples: {
        enumPattern: tablePatterns.typeEnum ? generateEnumExample(tableName, tablePatterns.typeEnum) : null,
        flagHelpers: tablePatterns.hasFlags ? generateFlagHelperExample(tableName) : null,
        converters: generateConverterExample(tableName),
      },
    };
  },
};

// Helper functions
function toInterfaceName(table) {
  return table
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function findClosestMatch(input, options) {
  // Simple string similarity
  const distances = options.map(option => ({
    option,
    distance: levenshteinDistance(input, option),
  }));
  
  const closest = distances.sort((a, b) => a.distance - b.distance)[0];
  return closest.distance <= 3 ? closest.option : null;
}

function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function findRelatedTables(tableName) {
  const relations = {
    names: ['contacts', 'transactions', 'memo'],
    accounts: ['transactions', 'asset-categories'],
    transactions: ['names', 'accounts', 'products', 'payments'],
    products: ['inventory', 'transactions', 'build'],
    jobs: ['transactions', 'job-sheet-items'],
    contacts: ['names'],
    inventory: ['products'],
    'job-sheet-items': ['jobs'],
    // New table relationships
    login: ['user', 'user2'],
    user: ['login'],
    user2: ['login'],
    payments: ['transactions'],
    reconciliation: ['accounts'],
    'auto-split': ['accounts'],
    'asset-log': ['assets'],
    'asset-categories': ['assets', 'accounts'],
    assets: ['asset-log', 'asset-categories'],
    offledger: [],
    build: ['products'],
    memo: ['names'],
    general: ['accounts', 'departments'],
  };
  
  return relations[tableName] || [];
}

function generateEnumExample(tableName, values) {
  const enumName = `${toInterfaceName(tableName)}Type`;
  return `export enum ${enumName} {\n${values.map(v => `  ${v} = "${v}",`).join('\n')}\n}`;
}

function generateFlagHelperExample(tableName) {
  const interfaceName = toInterfaceName(tableName);
  return `export const ${tableName}Helpers = {
  decodeFlags(flags: number): ${interfaceName}Flags {
    return {
      // Decode bitwise flags
    };
  },
  encodeFlags(flags: ${interfaceName}Flags): number {
    // Encode to bitwise number
  }
};`;
}

function generateConverterExample(tableName) {
  const interfaceName = toInterfaceName(tableName);
  return `export const ${tableName}Converters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: ${interfaceName}): ${interfaceName}Camel {
    return {
      code: raw.Code,
      name: raw.Name,
      // Map all fields...
    };
  },
  
  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  fromCamelCase(camel: ${interfaceName}Camel): ${interfaceName} {
    return {
      Code: camel.code,
      Name: camel.name,
      // Map all fields...
    };
  }
};`;
}