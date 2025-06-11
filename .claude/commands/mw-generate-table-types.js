import { existsSync } from 'fs';
import { readFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MoneyWorks table documentation URLs
const TABLE_URLS = {
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
    names: ['contacts', 'transactions'],
    accounts: ['transactions'],
    transactions: ['names', 'accounts', 'products'],
    products: ['inventory', 'transactions'],
    jobs: ['transactions', 'job-sheet-items'],
    contacts: ['names'],
    inventory: ['products'],
    'job-sheet-items': ['jobs'],
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