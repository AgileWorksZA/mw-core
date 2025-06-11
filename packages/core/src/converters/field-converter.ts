/**
 * Enhanced Field Converter
 * 
 * Converts between camelCase and PascalCase for all MoneyWorks tables.
 */

import type { TableName, TableMap, TableMapCamel } from '../tables';
import { detailFieldMappings } from '../tables/detail';
import { toCamelCase, fromCamelCase } from './key-converter';

// Import all table converters
import { nameConverters } from '../tables/names';
import { accountConverters } from '../tables/accounts';
import { transactionConverters } from '../tables/transactions';
import { productConverters } from '../tables/products';
import { departmentConverters } from '../tables/departments';
import { jobConverters } from '../tables/jobs';
import { taxRateConverters } from '../tables/tax-rates';
import { assetConverters } from '../tables/assets';
import { contactConverters } from '../tables/contacts';
import { assetCategoriesConverters } from '../tables/asset-categories';
import { assetLogConverters } from '../tables/asset-log';
import { autoSplitConverters } from '../tables/auto-split';
import { buildConverters } from '../tables/build';
import { generalConverters } from '../tables/general';
import { inventoryConverters } from '../tables/inventory';
import { jobSheetItemConverters } from '../tables/job-sheet-items';
import { loginConverters } from '../tables/login';
import { memoConverters } from '../tables/memo';
import { offLedgerConverters } from '../tables/offledger';
import { paymentsConverters } from '../tables/payments';
import { reconciliationConverters } from '../tables/reconciliation';
import { userConverters } from '../tables/user';
import { user2Converters } from '../tables/user2';
import { detailConverters } from '../tables/detail';

/**
 * Map of table converters
 */
const tableConverters: Record<TableName, any> = {
  Name: nameConverters,
  Account: accountConverters,
  Transaction: transactionConverters,
  Product: productConverters,
  Department: departmentConverters,
  Job: jobConverters,
  TaxRate: taxRateConverters,
  Asset: assetConverters,
  Contact: contactConverters,
  AssetCategories: assetCategoriesConverters,
  AssetLog: assetLogConverters,
  AutoSplit: autoSplitConverters,
  Build: buildConverters,
  General: generalConverters,
  Inventory: inventoryConverters,
  JobSheetItem: jobSheetItemConverters,
  Login: loginConverters,
  Memo: memoConverters,
  OffLedger: offLedgerConverters,
  Payments: paymentsConverters,
  Reconciliation: reconciliationConverters,
  User: userConverters,
  User2: user2Converters,
  Detail: detailConverters
};

/**
 * Convert from PascalCase (MoneyWorks) to camelCase (TypeScript)
 */
export function convertPascalToCamel<T extends TableName>(
  table: T,
  record: Partial<TableMap[T]>
): Partial<TableMapCamel[T]> {
  const converter = tableConverters[table];
  
  if (converter?.toCamelCase) {
    return converter.toCamelCase(record);
  }
  
  // Fallback to generic conversion
  return genericToCamelCase(record);
}

/**
 * Convert from camelCase (TypeScript) to PascalCase (MoneyWorks)
 */
export function convertCamelToPascal<T extends TableName>(
  table: T,
  record: Partial<TableMapCamel[T]>
): Partial<TableMap[T]> {
  const converter = tableConverters[table];
  
  if (converter?.fromCamelCase) {
    return converter.fromCamelCase(record);
  }
  
  // Fallback to generic conversion
  return genericFromCamelCase(record);
}

/**
 * Generic camelCase conversion
 */
function genericToCamelCase<T extends object>(obj: T): any {
  const result: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        result[camelKey] = value.map(item => 
          typeof item === 'object' ? genericToCamelCase(item) : item
        );
      } else if (typeof value === 'object' && !(value instanceof Date)) {
        result[camelKey] = genericToCamelCase(value);
      } else {
        result[camelKey] = value;
      }
    }
  }
  
  return result;
}

/**
 * Generic PascalCase conversion
 */
function genericFromCamelCase<T extends object>(obj: T): any {
  const result: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const pascalKey = fromCamelCase(key);
    
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        result[pascalKey] = value.map(item => 
          typeof item === 'object' ? genericFromCamelCase(item) : item
        );
      } else if (typeof value === 'object' && !(value instanceof Date)) {
        result[pascalKey] = genericFromCamelCase(value);
      } else {
        result[pascalKey] = value;
      }
    }
  }
  
  return result;
}

/**
 * Get field mappings for a table
 */
export function getFieldMappings(table: TableName): Record<string, string> {
  switch (table) {
    case 'Detail':
      return detailFieldMappings;
    // Add other table mappings as they have custom field names
    default:
      return {};
  }
}

/**
 * Convert field name based on table mappings
 */
export function convertFieldName(
  table: TableName,
  field: string,
  toCamel: boolean
): string {
  const mappings = getFieldMappings(table);
  
  if (toCamel) {
    // Find camelCase mapping
    for (const [camel, pascal] of Object.entries(mappings)) {
      if (pascal === field) {
        return camel;
      }
    }
  } else {
    // Use direct mapping
    const pascal = mappings[field];
    if (pascal) {
      return pascal;
    }
  }
  
  // Fallback to generic conversion
  return toCamel ? toCamelCase(field) : fromCamelCase(field);
}