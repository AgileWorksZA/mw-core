/**
 * Table Routes
 * RESTful endpoints for MoneyWorks tables
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia, t } from 'elysia';
import type { TableRegistry } from '@moneyworks/api/registry/table-registry';
import { 
  TableExportQuerySchema, 
  TableListSchema,
  TableSchemaSchema,
  TableExportResponseSchema 
} from '@moneyworks/api/schemas/table';
import { 
  ErrorSchema, 
  SuccessResponse,
  MetadataSchema 
} from '@moneyworks/api/schemas/common';

/**
 * Create table routes
 */
export function createTableRoutes(registry: TableRegistry) {
  return new Elysia({ prefix: '/tables' })
    // List available tables
    .get('/', ({ headers }) => {
      const requestId = headers['x-request-id'] || 'unknown';
      const tables = registry.getTableStatus();
      
      return {
        data: tables,
        metadata: {
          count: tables.available.length,
          timestamp: new Date().toISOString(),
          requestId
        }
      };
    }, {
      detail: {
        summary: 'List available tables',
        description: 'Get list of available, vetted, and upcoming MoneyWorks tables',
        tags: ['Tables']
      },
      response: {
        200: SuccessResponse(TableListSchema),
        500: ErrorSchema
      }
    })
    
    // Get table schema
    .get('/:table/schema', async ({ params: { table }, set, headers }) => {
      const requestId = headers['x-request-id'] || 'unknown';
      const controller = registry.getTable(table);
      
      if (!controller) {
        set.status = 404;
        throw new Error(`NOT_FOUND: Table '${table}' is not available`);
      }
      
      const schema = await controller.getSchema();
      
      return {
        data: schema,
        metadata: {
          table,
          timestamp: new Date().toISOString(),
          requestId
        }
      };
    }, {
      params: t.Object({
        table: t.String({ description: 'Table name' })
      }),
      detail: {
        summary: 'Get table schema',
        description: 'Get field definitions and metadata for a specific table',
        tags: ['Tables']
      },
      response: {
        200: SuccessResponse(TableSchemaSchema),
        404: ErrorSchema,
        500: ErrorSchema
      }
    })
    
    // Export table data
    .get('/:table', async ({ params: { table }, query, set, headers }) => {
      const requestId = headers['x-request-id'] || 'unknown';
      const controller = registry.getTable(table);
      
      if (!controller) {
        set.status = 404;
        throw new Error(`NOT_FOUND: Table '${table}' is not available`);
      }
      
      // Set content type based on format
      const format = query.format || 'full';
      if (format === 'compact' || format === 'compact-headers') {
        set.headers['content-type'] = 'text/tab-separated-values';
      } else {
        set.headers['content-type'] = 'application/json';
      }
      
      const data = await controller.export({
        format: query.format as any,
        filter: query.filter,
        limit: query.limit,
        offset: query.offset,
        orderBy: query.orderBy
      });
      
      // For compact formats, return raw data
      if (format === 'compact' || format === 'compact-headers') {
        if (Array.isArray(data)) {
          return data.map(row => 
            Array.isArray(row) ? row.join('\t') : ''
          ).join('\n');
        }
      }
      
      // For JSON formats, wrap with metadata
      const count = Array.isArray(data) ? data.length : 
                   (data.data && Array.isArray(data.data) ? data.data.length : 0);
      
      return {
        data,
        metadata: {
          table,
          format,
          count,
          timestamp: new Date().toISOString(),
          requestId,
          pagination: {
            limit: query.limit || 100,
            offset: query.offset || 0,
            hasMore: count === (query.limit || 100)
          }
        }
      };
    }, {
      params: t.Object({
        table: t.String({ description: 'Table name' })
      }),
      query: TableExportQuerySchema,
      detail: {
        summary: 'Export table data',
        description: 'Export data from a MoneyWorks table in various formats',
        tags: ['Tables']
      },
      response: {
        200: t.Union([
          SuccessResponse(TableExportResponseSchema),
          t.String({ description: 'TSV data for compact formats' })
        ]),
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema
      }
    });
}