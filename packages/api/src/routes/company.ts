/**
 * Company Information Routes
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia } from 'elysia';
import type { SmartMoneyWorksClient } from '@moneyworks/data';
import type { CacheService } from '@moneyworks/api/services/cache';
import { CompanyController } from '@moneyworks/api/controllers/company';
import { 
  CompanyInfoSchema, 
  CompanyQuerySchema, 
  CompanyFields 
} from '@moneyworks/api/schemas/company';
import { ErrorSchema, SuccessResponse } from '@moneyworks/api/schemas/common';

/**
 * Create company routes
 */
export function createCompanyRoutes(
  client: SmartMoneyWorksClient, 
  cache: CacheService
) {
  const controller = new CompanyController(client, cache);

  return new Elysia({ prefix: '/company' })
    .get('/', async ({ query, set, headers }) => {
      const requestId = headers['x-request-id'] || 'unknown';

      try {
        const data = await controller.getCompanyInfo(
          query.fields,
          query.format
        );

        // Set cache headers
        set.headers['cache-control'] = 'public, max-age=300'; // 5 minutes
        set.headers['x-cache-status'] = 'MISS'; // Will be HIT if from cache

        return {
          data,
          metadata: {
            timestamp: new Date().toISOString(),
            requestId,
            format: query.format || 'nested',
            fieldCount: query.fields?.length || CompanyFields.length,
            count: 1
          }
        };
      } catch (error: any) {
        set.status = 400;
        throw new Error(`COMPANY_ERROR: ${error.message}`);
      }
    }, {
      query: CompanyQuerySchema,
      detail: {
        summary: 'Get company information',
        description: `Retrieve company metadata from MoneyWorks.

Available fields:
${CompanyFields.map(f => `- ${f}`).join('\n')}

The response can be formatted as:
- **nested** (default): Organized into logical groups (address, contact, etc.)
- **flat**: All fields at root level with their MoneyWorks names

Results are cached for 5 minutes to improve performance.`,
        tags: ['System']
      },
      response: {
        200: SuccessResponse(CompanyInfoSchema),
        400: ErrorSchema,
        500: ErrorSchema
      }
    })
    .get('/fields', ({ headers }) => {
      const requestId = headers['x-request-id'] || 'unknown';

      return {
        data: {
          fields: CompanyFields,
          groups: {
            basic: ['Name'],
            address: [
              'Address1',
              'Address2', 
              'Address3',
              'Address4'
            ],
            contact: [
              'Phone',
              'Fax',
              'Email',
              'WebURL'
            ],
            accounting: [
              'PeriodsInYear',
              'CurrentPer',
              'BaseCurrency',
              'MultiCurrencyEnabled',
              'ExtendedJobCosting'
            ],
            tax: [
              'GSTCycleMonths',
              'GstNum'
            ],
            system: [
              'Version',
              'Locale'
            ]
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          requestId,
          totalFields: CompanyFields.length
        }
      };
    }, {
      detail: {
        summary: 'List available company fields',
        description: 'Get all available company information fields grouped by category',
        tags: ['System']
      }
    });
}