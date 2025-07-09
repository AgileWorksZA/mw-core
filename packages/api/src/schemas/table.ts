/**
 * Table-related API Schemas
 * 
 * @moneyworks-dsl PURE
 */

import { t } from 'elysia';
import { ExportFormatEnum } from '../schemas/common';

/**
 * Table export query parameters
 */
export const TableExportQuerySchema = t.Object({
  format: t.Optional(ExportFormatEnum),
  filter: t.Optional(t.String({ 
    description: 'MoneyWorks filter expression',
    examples: ["TaxCode='GST10'", "Rate > 5"]
  })),
  limit: t.Optional(t.Number({ 
    min: 1, 
    max: 10000,
    default: 100,
    description: 'Maximum records to return'
  })),
  offset: t.Optional(t.Number({ 
    min: 0,
    default: 0,
    description: 'Number of records to skip'
  })),
  orderBy: t.Optional(t.String({ 
    description: 'Field to sort by',
    examples: ['TaxCode', 'Rate DESC']
  }))
}, {
  description: 'Query parameters for table export'
});

/**
 * Table list response
 */
export const TableListSchema = t.Object({
  available: t.Array(t.String(), { 
    description: 'Tables currently available for use' 
  }),
  vetted: t.Array(t.String(), { 
    description: 'Tables that have been fully vetted' 
  }),
  upcoming: t.Array(t.String(), { 
    description: 'Tables being prepared for release' 
  })
}, {
  description: 'List of MoneyWorks tables by status',
  examples: [{
    available: ['TaxRate'],
    vetted: ['TaxRate'],
    upcoming: ['Account', 'Transaction', 'Name', 'Product']
  }]
});

/**
 * Table schema field info
 */
export const FieldInfoSchema = t.Object({
  name: t.String({ description: 'Field name' }),
  position: t.Number({ description: 'Field position in TSV' }),
  dataType: t.Union([
    t.Literal('string'),
    t.Literal('number'),
    t.Literal('boolean'),
    t.Literal('date')
  ], { description: 'Data type' }),
  canonicalType: t.Optional(t.String({ 
    description: 'Canonical MoneyWorks type' 
  })),
  maxLength: t.Optional(t.Number({ 
    description: 'Maximum field length' 
  })),
  required: t.Optional(t.Boolean({ 
    description: 'Whether field is required' 
  }))
});

/**
 * Table schema response
 */
export const TableSchemaSchema = t.Object({
  table: t.String({ description: 'Table name' }),
  fields: t.Array(FieldInfoSchema, { 
    description: 'Field definitions' 
  }),
  primaryKey: t.Optional(t.String({ 
    description: 'Primary key field' 
  })),
  description: t.Optional(t.String({ 
    description: 'Table description' 
  }))
}, {
  description: 'Complete table schema information'
});

/**
 * Compact format response (raw arrays)
 */
export const CompactFormatSchema = t.Array(
  t.Array(t.Any(), { description: 'Row values' }),
  { description: 'Compact format: array of arrays' }
);

/**
 * Full format response (objects)
 */
export const FullFormatSchema = t.Array(
  t.Record(t.String(), t.Any(), { 
    description: 'Record as object with field names' 
  }),
  { description: 'Full format: array of objects' }
);

/**
 * Schema-enriched format
 */
export const SchemaEnrichedSchema = t.Object({
  schema: t.Record(t.String(), t.Object({
    type: t.String(),
    maxLength: t.Optional(t.Number()),
    required: t.Optional(t.Boolean()),
    description: t.Optional(t.String())
  })),
  data: t.Array(t.Record(t.String(), t.Any())),
  metadata: t.Optional(t.Object({
    table: t.String(),
    exportedAt: t.String(),
    fieldCount: t.Number(),
    recordCount: t.Number()
  }))
}, {
  description: 'Schema-enriched format with field metadata'
});

/**
 * Dynamic export response based on format
 */
export const TableExportResponseSchema = t.Union([
  CompactFormatSchema,
  FullFormatSchema,
  SchemaEnrichedSchema
], {
  description: 'Table data in requested format'
});