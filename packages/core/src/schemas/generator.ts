/**
 * JSON Schema Generator
 * 
 * Generates JSON Schemas from MoneyWorks TypeScript interfaces.
 */

import type { TableName } from '../tables';
import { tableNames } from '../tables';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import fs from 'fs/promises';
import path from 'path';

/**
 * Field constraints for MoneyWorks tables
 */
const fieldConstraints: Record<string, Record<string, any>> = {
  Name: {
    Code: { maxLength: 14, pattern: '^[A-Z0-9]+$' },
    Name: { maxLength: 63 },
    Email: { format: 'email' },
    Phone: { maxLength: 20 },
    Mobile: { maxLength: 20 },
    Postcode: { maxLength: 10 }
  },
  Account: {
    Code: { maxLength: 14, pattern: '^[A-Z0-9]+$' },
    Description: { maxLength: 63 },
    AccountType: { enum: [0, 1, 2, 3, 4, 5, 6, 7, 8] }
  },
  Transaction: {
    OurRef: { maxLength: 20 },
    Description: { maxLength: 255 },
    TransDate: { format: 'date' }
  },
  Product: {
    Code: { maxLength: 19 },
    Description: { maxLength: 255 },
    SellPrice: { minimum: 0 },
    BuyPrice: { minimum: 0 }
  },
  Detail: {
    Account: { maxLength: 14 },
    Description: { maxLength: 255 },
    TaxCode: { maxLength: 7 },
    Department: { maxLength: 14 },
    Job: { maxLength: 31 },
    StockCode: { maxLength: 19 }
  }
};

/**
 * Required fields for tables
 */
const requiredFields: Record<string, string[]> = {
  Name: ['code'],
  Account: ['code', 'accountType'],
  Transaction: ['nameCode', 'transDate'],
  Product: ['code'],
  Department: ['code'],
  Job: ['code'],
  TaxRate: ['taxCode'],
  Detail: ['parentSeq', 'account', 'debit', 'credit']
};

/**
 * Generate Zod schema for a table
 */
function generateZodSchema(table: TableName): z.ZodObject<any> {
  const constraints = fieldConstraints[table] || {};
  const required = requiredFields[table] || [];
  
  // Build schema shape
  const shape: Record<string, z.ZodTypeAny> = {};
  
  // Add common fields
  shape.sequenceNumber = z.number().int().optional();
  shape.lastModifiedTime = z.string().datetime().optional();
  
  // Add table-specific fields based on constraints
  for (const [field, constraint] of Object.entries(constraints)) {
    let fieldSchema: z.ZodTypeAny = z.string();
    
    // Apply constraints
    if (constraint.maxLength) {
      fieldSchema = (fieldSchema as z.ZodString).max(constraint.maxLength);
    }
    
    if (constraint.pattern) {
      fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(constraint.pattern));
    }
    
    if (constraint.format === 'email') {
      fieldSchema = z.string().email();
    }
    
    if (constraint.format === 'date') {
      fieldSchema = z.date();
    }
    
    if (constraint.enum) {
      fieldSchema = z.enum(constraint.enum);
    }
    
    if (constraint.minimum !== undefined) {
      fieldSchema = z.number().min(constraint.minimum);
    }
    
    // Make optional unless required
    const camelField = toCamelCase(field);
    if (!required.includes(camelField)) {
      fieldSchema = fieldSchema.optional();
    }
    
    shape[camelField] = fieldSchema;
  }
  
  return z.object(shape);
}

/**
 * Generate JSON Schema for a table
 */
export function generateTableSchema(table: TableName): any {
  const zodSchema = generateZodSchema(table);
  
  const jsonSchema = zodToJsonSchema(zodSchema, {
    name: table,
    $refStrategy: 'none',
    errorMessages: true,
    markdownDescription: true
  });
  
  // Add MoneyWorks-specific metadata
  return {
    ...jsonSchema,
    title: `${table} Table`,
    description: `MoneyWorks ${table} table schema`,
    'x-moneyworks-table': table,
    'x-moneyworks-primary-key': getPrimaryKey(table)
  };
}

/**
 * Get primary key for table
 */
function getPrimaryKey(table: TableName): string {
  const primaryKeys: Record<string, string> = {
    Name: 'code',
    Account: 'code',
    Transaction: 'sequenceNumber',
    Product: 'code',
    Department: 'code',
    Job: 'code',
    TaxRate: 'taxCode',
    Asset: 'code',
    AssetCategories: 'code',
    AssetLog: 'parentSeq',
    AutoSplit: 'matchFunction',
    Build: 'productSeq',
    Contact: 'parentSeq',
    General: 'code',
    Inventory: 'productSeq',
    JobSheetItem: 'sequenceNumber',
    Login: 'userID',
    Memo: 'sequenceNumber',
    OffLedger: 'name',
    Payments: 'transSeq',
    Reconciliation: 'account',
    User: 'key',
    User2: 'key',
    Detail: 'parentSeq'
  };
  
  return primaryKeys[table] || 'code';
}

/**
 * Convert PascalCase to camelCase
 */
function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Generate all schemas
 */
export async function generateAllSchemas(): Promise<void> {
  const schemasDir = path.join(__dirname, '../schemas');
  
  // Ensure directory exists
  await fs.mkdir(schemasDir, { recursive: true });
  
  for (const table of tableNames) {
    console.log(`Generating schema for ${table}...`);
    
    try {
      const schema = generateTableSchema(table);
      const fileName = `${table.toLowerCase()}.schema.json`;
      const filePath = path.join(schemasDir, fileName);
      
      await fs.writeFile(
        filePath,
        JSON.stringify(schema, null, 2)
      );
      
      console.log(`✓ Generated ${fileName}`);
    } catch (error) {
      console.error(`✗ Failed to generate schema for ${table}:`, error);
    }
  }
  
  // Generate index file
  const indexContent = generateIndexFile();
  await fs.writeFile(
    path.join(schemasDir, 'index.ts'),
    indexContent
  );
  
  console.log('✓ Generated index.ts');
}

/**
 * Generate index file for schemas
 */
function generateIndexFile(): string {
  const imports = tableNames.map(table => {
    const varName = `${table}Schema`;
    const fileName = `${table.toLowerCase()}.schema.json`;
    return `import ${varName} from './${fileName}';`;
  }).join('\n');
  
  const exports = tableNames.map(table => {
    const varName = `${table}Schema`;
    return `  ${table}: ${varName},`;
  }).join('\n');
  
  return `/**
 * Generated JSON Schemas
 * 
 * Auto-generated from TypeScript interfaces.
 * DO NOT EDIT MANUALLY - use generate:schemas script
 */

${imports}

export const schemas = {
${exports}
} as const;

export type SchemaMap = typeof schemas;
`;
}

/**
 * Generate schema validation code
 */
export function generateValidationCode(): string {
  return `/**
 * Schema Validation
 * 
 * Optional validation using generated JSON schemas.
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { schemas } from './index';
import type { TableName, TableMapCamel } from '../tables';

export class SchemaValidator {
  private ajv: Ajv;
  private validators = new Map<TableName, any>();
  
  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      coerceTypes: true,
      useDefaults: true,
      removeAdditional: 'failing'
    });
    
    addFormats(this.ajv);
    this.compileSchemas();
  }
  
  private compileSchemas(): void {
    for (const [table, schema] of Object.entries(schemas)) {
      this.validators.set(table as TableName, this.ajv.compile(schema));
    }
  }
  
  validate<T extends TableName>(
    table: T,
    data: unknown
  ): data is TableMapCamel[T] {
    const validator = this.validators.get(table);
    if (!validator) {
      throw new Error(\`No validator for table: \${table}\`);
    }
    
    return validator(data);
  }
  
  getErrors(): any[] | null {
    return this.ajv.errors;
  }
}
`;
}