/**
 * XML module exports
 */

export { 
  XMLBuilder, 
  buildXML,
  buildTransactionWithDetails,
  buildBatchImport,
  validateRecord 
} from './builder';
export * from './parser';
export { 
  parseXMLWithSchema,
  createDynamicSchema,
  validateRecord as validateRecordWithSchema,
  transformFieldValue
} from './schema-parser';