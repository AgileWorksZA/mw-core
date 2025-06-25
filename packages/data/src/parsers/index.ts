/**
 * MoneyWorks Data Parsers
 * 
 * Low-level parsing infrastructure for MoneyWorks data formats
 * 
 * @moneyworks-dsl PURE
 */

// Field discovery - the foundation
export {
  discoverTableStructure,
  clearFieldCache,
  getCachedStructure,
  buildTSVHeaders,
  type FieldInfo,
  type TableStructure
} from './field-discovery';

// Smart TSV parser that uses discovered structure  
export {
  parseTSVWithStructure,
  validateTSVStructure
} from './smart-tsv-parser';

// XML parsing utilities
export {
  parseMoneyWorksXML,
  extractFieldOrder,
  xmlFieldToPascalCase,
  buildFieldMapping
} from './xml/moneyworks-xml-parser';

// Date/time parsers (existing)
export {
  parseMWDate,
  parseMWTimestamp,
  formatMWDate
} from './date-parser';

// Number parser (existing)
export {
  parseMWNumber,
  formatMWNumber
} from './number-parser';

// Other existing parsers
export * from './data-parser';
export * from './account-parser';
export * from './enum-parser';
export * from './string-parser';