/**
 * Table Routes
 * RESTful endpoints for MoneyWorks tables
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia, t } from 'elysia';
import type { TableRegistry } from '@moneyworks/api/registry/table-registry';
import type { SmartMoneyWorksClient } from '@moneyworks/data';
import type { CacheService } from '@moneyworks/api/services/cache';
import { LabelsController } from '@moneyworks/api/controllers/labels';
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
import { SUPPORTED_LANGUAGES } from '@moneyworks/api/middleware/i18n';

/**
 * Create table routes
 */
export function createTableRoutes(
  registry: TableRegistry,
  client?: SmartMoneyWorksClient,
  cache?: CacheService
) {
  const labelsController = client && cache ? 
    new LabelsController(client, cache) : null;

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
    })
    
    // Get field labels for a table
    .get('/:table/labels', async ({ params: { table }, language, set, headers }) => {
      if (!labelsController) {
        set.status = 501;
        throw new Error('NOT_IMPLEMENTED: Labels endpoint requires client and cache configuration');
      }

      const requestId = headers['x-request-id'] || 'unknown';

      try {
        const labels = await labelsController.getTableLabels(table, language);

        // Set cache headers
        set.headers['cache-control'] = 'public, max-age=3600'; // 1 hour
        set.headers['vary'] = 'Accept-Language';

        return {
          data: labels,
          metadata: {
            timestamp: new Date().toISOString(),
            requestId,
            cached: false // Will be updated when we add cache status tracking
          }
        };
      } catch (error: any) {
        if (error.message.includes('not found')) {
          set.status = 404;
          throw new Error(`NOT_FOUND: ${error.message}`);
        }
        throw error;
      }
    }, {
      params: t.Object({
        table: t.String({ description: 'Table name' })
      }),
      detail: {
        summary: 'Get field labels',
        description: `Get human-readable field labels for a table in the specified language.

Supports languages: ${SUPPORTED_LANGUAGES.join(', ')}

Language can be specified via:
1. Query parameter: ?lang=fr
2. Accept-Language header: Accept-Language: fr

Special enumerated fields (like colors, payment methods) are included 
in the 'enumerated' section of the response.

Results are cached for 1 hour.`,
        tags: ['Tables', 'I18n']
      },
      response: {
        200: SuccessResponse(t.Object({
          language: t.String(),
          table: t.String(),
          labels: t.Record(t.String(), t.String()),
          enumerated: t.Optional(t.Record(
            t.String(), 
            t.Record(t.String(), t.String())
          ))
        })),
        404: ErrorSchema,
        501: ErrorSchema,
        500: ErrorSchema
      }
    });
}