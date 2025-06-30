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
import { createHealthRoutes } from '@moneyworks/api/routes/health';
import { createVersionRoutes } from '@moneyworks/api/routes/version';
import { errorHandler } from '@moneyworks/api/middleware/error-handler';
import { requestId } from '@moneyworks/api/middleware/request-id';
import { logging } from '@moneyworks/api/middleware/logging';

export interface APIConfig {
  port?: number;
  host?: string;
  basePath?: string;
  enableSwagger?: boolean;
  enableCors?: boolean;
  corsOrigins?: string[];
}

/**
 * Create the API application
 */
export function createApp(client: SmartMoneyWorksClient, config: APIConfig = {}) {
  const {
    basePath = '/api/v1',
    enableSwagger = true,
    enableCors = true,
    corsOrigins = ['*']
  } = config;
  
  // Create table registry
  const registry = createTableRegistry(client);
  
  // Create base app
  const app = new Elysia({ prefix: basePath })
    // Global plugins
    .use(requestId)
    .use(errorHandler)
    .use(logging)
    
    // CORS support
    .use(enableCors ? cors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
    }) : (app) => app)
    
    // Swagger documentation
    .use(enableSwagger ? swagger({
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
          { name: 'System', description: 'System information and health' }
        ],
        servers: [
          { url: 'http://localhost:3000', description: 'Local development server' }
        ]
      },
      path: '/swagger',
      exclude: ['/swagger', '/swagger/json']
    }) : (app) => app)
    
    // Mount routes
    .use(createTableRoutes(registry))
    .use(createEvalRoutes(client))
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
  
  return app;
}