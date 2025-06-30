/**
 * MWScript Evaluation Routes
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia, t } from 'elysia';
import type { SmartMoneyWorksClient } from '@moneyworks/data';
import type { CacheService } from '@moneyworks/api/services/cache';
import { EvalRequestSchema, EvalResponseSchema } from '@moneyworks/api/schemas/eval';
import { ErrorSchema, SuccessResponse } from '@moneyworks/api/schemas/common';

/**
 * Create eval routes
 */
export function createEvalRoutes(
  client: SmartMoneyWorksClient,
  cache?: CacheService
) {
  return new Elysia({ prefix: '/eval' })
    .post('/', async ({ body, set, headers }) => {
      const requestId = headers['x-request-id'] || 'unknown';
      const { expression, context } = body;
      
      if (!expression || expression.trim().length === 0) {
        set.status = 400;
        throw new Error('VALIDATION_ERROR: Expression cannot be empty');
      }
      
      const startTime = performance.now();
      
      try {
        // Note: MoneyWorks REST API doesn't support context,
        // but we keep it in the API for future enhancement
        const result = await client.evaluate(expression);
        
        const executionTime = performance.now() - startTime;
        
        // Try to detect data type
        const dataType = detectDataType(result);
        
        return {
          data: {
            expression,
            result: result.trim(),
            dataType,
            executionTime: Math.round(executionTime * 100) / 100
          },
          metadata: {
            timestamp: new Date().toISOString(),
            requestId
          }
        };
      } catch (error: any) {
        // Provide helpful context for common MWScript errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('Unknown identifier')) {
          set.status = 400;
          throw new Error(`MWSCRIPT_ERROR: ${errorMessage}. Note: Direct table references like 'Count(TaxRate)' may not work in REST context.`);
        } else if (errorMessage.includes('Syntax error')) {
          set.status = 400;
          throw new Error(`MWSCRIPT_SYNTAX_ERROR: ${errorMessage}`);
        }
        
        throw error;
      }
    }, {
      body: EvalRequestSchema,
      detail: {
        summary: 'Evaluate MWScript expression',
        description: 'Evaluate a MWScript expression and return the result',
        tags: ['MWScript']
      },
      response: {
        200: SuccessResponse(EvalResponseSchema),
        400: ErrorSchema,
        500: ErrorSchema
      }
    })
    
    // Template evaluation endpoint
    .post('/template/:table', async ({ params, body, set, headers }) => {
      const requestId = headers['x-request-id'] || 'unknown';
      const { table } = params;
      const { template, limit = 100, filter } = body;

      if (!template || template.trim().length === 0) {
        set.status = 400;
        throw new Error('VALIDATION_ERROR: Template cannot be empty');
      }

      const startTime = performance.now();

      try {
        // Create cache key if caching is enabled
        const cacheKey = cache ? 
          `eval-template:${table}:${template}:${filter || ''}:${limit}` : 
          null;

        // Try cache first
        if (cache && cacheKey) {
          const cached = cache.get(cacheKey);
          if (cached) {
            set.headers['x-cache-status'] = 'HIT';
            return cached;
          }
        }

        // Get field list for the table to validate template
        const tableInfo = await client.getTableInfo(table);
        if (!tableInfo) {
          set.status = 404;
          throw new Error(`NOT_FOUND: Table '${table}' not found`);
        }

        // Export with custom template format
        // Add double newline for splitting results
        const templateWithDelimiter = `${template}\\n\\n`;
        
        const options: any = {
          format: templateWithDelimiter,
          limit
        };

        if (filter) {
          options.filter = filter;
        }

        // Use smartExport which handles template format
        const rawData = await client.smartExport(table, options);
        
        // Split results and clean up
        const results = typeof rawData === 'string' ?
          rawData.split('\n\n')
            .map(line => line.trim())
            .filter(line => line.length > 0) :
          [];

        const executionTime = performance.now() - startTime;

        const response = {
          data: {
            table,
            template,
            results,
            count: results.length
          },
          metadata: {
            timestamp: new Date().toISOString(),
            requestId,
            executionTime: Math.round(executionTime * 100) / 100,
            filter: filter || null,
            limit
          }
        };

        // Cache the result
        if (cache && cacheKey) {
          cache.set(cacheKey, response, 60 * 1000); // 1 minute TTL
          set.headers['x-cache-status'] = 'MISS';
        }

        return response;
      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('Unknown field')) {
          set.status = 400;
          throw new Error(`TEMPLATE_ERROR: ${errorMessage}. Check that all field names in square brackets exist in the ${table} table.`);
        }
        
        throw error;
      }
    }, {
      params: t.Object({
        table: t.String({ description: 'MoneyWorks table name' })
      }),
      body: t.Object({
        template: t.String({
          description: 'Template string with field names in square brackets',
          examples: [
            '[Code] - [Description]',
            '[Name] (Phone: [Phone])',
            '[TransDate]: [Description] - $[Gross]'
          ]
        }),
        limit: t.Optional(t.Number({ 
          description: 'Maximum number of records to return',
          default: 100,
          minimum: 1,
          maximum: 1000
        })),
        filter: t.Optional(t.String({
          description: 'MoneyWorks filter expression',
          examples: [
            'Code = "ABC"',
            'Gross > 1000',
            'TransDate >= "20240101"'
          ]
        }))
      }),
      detail: {
        summary: 'Evaluate template against table',
        description: `Evaluate a custom template against records in a MoneyWorks table.

Templates use MoneyWorks field syntax with field names in square brackets.
Each record's result is separated by double newlines.

Example templates:
- Account: \`[Code] - [Description]\`
- Transaction: \`[TransDate] [Description] @[Gross]\`
- Name: \`[Code]: [Name] Phone: [Phone]\`

Results are cached for 1 minute to improve performance for repeated queries.`,
        tags: ['MWScript']
      },
      response: {
        200: SuccessResponse(t.Object({
          table: t.String(),
          template: t.String(),
          results: t.Array(t.String()),
          count: t.Number()
        })),
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema
      }
    });
}

/**
 * Detect the data type of a result string
 */
function detectDataType(result: string): 'string' | 'number' | 'boolean' | 'date' | undefined {
  const trimmed = result.trim();
  
  // Boolean
  if (trimmed === 'true' || trimmed === 'false') {
    return 'boolean';
  }
  
  // Number
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return 'number';
  }
  
  // Date (YYYYMMDD format)
  if (/^\d{8}$/.test(trimmed)) {
    const year = parseInt(trimmed.substring(0, 4));
    const month = parseInt(trimmed.substring(4, 6));
    const day = parseInt(trimmed.substring(6, 8));
    
    if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return 'date';
    }
  }
  
  // Default to string
  return 'string';
}