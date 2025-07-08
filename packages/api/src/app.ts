/**
 * MoneyWorks API Application
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import type { SmartMoneyWorksClient } from '@moneyworks/data';
import { createTableRegistry } from '@moneyworks/api/registry/table-registry';
import { createTableRoutes } from '@moneyworks/api/routes/tables';
import { createEvalRoutes } from '@moneyworks/api/routes/eval';
import { createCompanyRoutes } from '@moneyworks/api/routes/company';
import { createI18nRoutes } from '@moneyworks/api/routes/i18n';
import { createHealthRoutes } from '@moneyworks/api/routes/health';
import { createVersionRoutes } from '@moneyworks/api/routes/version';
import { errorHandler } from '@moneyworks/api/middleware/error-handler';
import { requestId } from '@moneyworks/api/middleware/request-id';
import { logging } from '@moneyworks/api/middleware/logging';
import { i18n } from '@moneyworks/api/middleware/i18n';
import { createCaches } from '@moneyworks/api/services/cache';

export interface APIConfig {
  port?: number;
  host?: string;
  basePath?: string;
  enableSwagger?: boolean;
  enableCors?: boolean;
  corsOrigins?: string[];
  enableCacheWarming?: boolean;
}

/**
 * Create the API application
 */
export function createApp(client: SmartMoneyWorksClient, config: APIConfig = {}) {
  const {
    basePath = '/api/v1',
    enableSwagger = true,
    enableCors = true,
    corsOrigins = ['*'],
    enableCacheWarming = true
  } = config;
  
  // Create table registry and caches
  const registry = createTableRegistry(client);
  const caches = createCaches();
  
  // Create base app
  const app = new Elysia({ prefix: basePath })
    // Global plugins
    .use(requestId)
    .use(errorHandler)
    .use(logging)
    .use(i18n)
    
    // CORS support
    .use((app) => enableCors ? app.use(cors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
    })) : app)
    
    // Swagger documentation
    .use((app) => enableSwagger ? app.use(swagger({
      documentation: {
        info: {
          title: 'MoneyWorks REST API',
          version: '0.1.0',
          description: `
# MoneyWorks REST API

A comprehensive REST API for MoneyWorks accounting software, built with a focus on developer experience and extensibility.

## Features

- **Export data** from MoneyWorks tables in multiple formats
- **Evaluate** MWScript expressions
- **Discover** table schemas and field metadata
- **Type-safe** with full TypeScript support
- **Progressive enhancement** - new tables added as they're vetted

## Export Formats

All table endpoints support multiple export formats via the \`format\` query parameter:

- **full** (default) - Complete objects with field names
- **compact** - Raw arrays for minimal overhead
- **compact-headers** - Arrays with field names in first row
- **schema** - Objects with complete field metadata

## Authentication

Authentication details will be added in a future release.

## Rate Limiting

Rate limiting headers are included in all responses:
- \`X-RateLimit-Limit\` - Request limit per window
- \`X-RateLimit-Remaining\` - Requests remaining
- \`X-RateLimit-Reset\` - Window reset time

## Error Handling

All errors follow a consistent format:
\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {},
    "requestId": "mw-12345-abcdef"
  }
}
\`\`\`
          `,
          contact: {
            name: 'MoneyWorks Team',
            email: 'support@moneyworks.example.com'
          }
        },
        tags: [
          { name: 'Tables', description: 'Table data operations' },
          { name: 'MWScript', description: 'MWScript evaluation' },
          { name: 'System', description: 'System information and health' },
          { name: 'I18n', description: 'Internationalization and labels' }
        ],
        servers: [
          { url: 'http://localhost:3000', description: 'Local development server' }
        ]
      },
      path: '/swagger',
      exclude: ['/swagger', '/swagger/json']
    })) : app)
    
    // Mount routes
    .use(createTableRoutes(registry, client, caches.labels))
    .use(createEvalRoutes(client, caches.eval))
    .use(createCompanyRoutes(client, caches.company))
    .use(createI18nRoutes(client, caches.labels))
    .use(createHealthRoutes(client))
    .use(createVersionRoutes(client))
    
    // Root endpoint
    .get('/', () => ({
      message: 'MoneyWorks REST API',
      version: '0.1.0',
      documentation: enableSwagger ? `${basePath}/swagger` : undefined,
      endpoints: {
        tables: `${basePath}/tables`,
        eval: `${basePath}/eval`,
        company: `${basePath}/company`,
        i18n: `${basePath}/i18n`,
        health: `${basePath}/health`,
        version: `${basePath}/version`
      }
    }), {
      detail: {
        summary: 'API information',
        description: 'Get basic API information and available endpoints',
        tags: ['System']
      }
    });
  
  // Warm up caches on startup if enabled
  if (enableCacheWarming) {
    warmUpCaches(client, caches).catch(error => {
      console.error('Cache warming failed:', error);
    });
  }
  
  return app;
}

/**
 * Warm up caches with commonly accessed data
 */
async function warmUpCaches(
  client: SmartMoneyWorksClient,
  caches: ReturnType<typeof createCaches>
) {
  console.log('Warming up caches...');
  
  const warmUpTasks = [
    // Warm up company info cache
    caches.company.warmUp([
      {
        key: 'company:Name:nested',
        factory: async () => {
          const expression = 'Name';
          const result = await client.evaluate(expression);
          return { name: result };
        }
      }
    ]),
    
    // Warm up labels cache for TaxRate (currently vetted table)
    caches.labels.warmUp([
      {
        key: 'labels:TaxRate:en',
        factory: async () => {
          // This would normally call the labels controller
          // For now, just cache basic field names
          return {
            language: 'en' as const,
            table: 'TaxRate',
            labels: {
              Code: 'Code',
              Description: 'Description',
              Rate: 'Rate'
            }
          };
        }
      }
    ])
  ];
  
  await Promise.all(warmUpTasks);
  console.log('Cache warming completed');
}