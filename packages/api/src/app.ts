/**
 * MoneyWorks API Application
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { createTableRegistry } from './registry/table-registry';
import { createTableRoutes } from './routes/tables';
import { createEvalRoutes } from './routes/eval';
import { createCompanyRoutes } from './routes/company';
import { createI18nRoutes } from './routes/i18n';
import { createHealthRoutes } from './routes/health';
import { createVersionRoutes } from './routes/version';
import { createAuthRoutes } from './routes/auth';
import { errorHandler } from './middleware/error-handler';
import { requestId } from './middleware/request-id';
import { logging } from './middleware/logging';
import { i18n } from './middleware/i18n';
import { authMiddleware } from './middleware/auth';
import { createCaches } from './services/cache';

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
export function createApp(config: APIConfig = {}) {
  const {
    basePath = '/api/v1',
    enableSwagger = true,
    enableCors = true,
    corsOrigins = ['*'],
    enableCacheWarming = true
  } = config;
  
  // Create caches
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

Use the /auth/token endpoint to exchange MoneyWorks credentials for an API token.
Include the token in the Authorization: Bearer <token> header for all other requests.

## Rate Limiting

Rate limiting headers are included in all responses:
- X-RateLimit-Limit - Request limit per window
- X-RateLimit-Remaining - Requests remaining
- X-RateLimit-Reset - Window reset time

## Error Handling

All errors follow a consistent format with error code, message, details, and request ID.
          `,
          contact: {
            name: 'MoneyWorks Team',
            email: 'support@moneyworks.example.com'
          }
        },
        tags: [
          { name: 'Auth', description: 'Authentication and token management' },
          { name: 'Tables', description: 'Table data operations' },
          { name: 'MWScript', description: 'MWScript evaluation' },
          { name: 'System', description: 'System information and health' },
          { name: 'I18n', description: 'Internationalization and labels' }
        ],
        servers: [
          { url: 'http://localhost:3002', description: 'Local development server' }
        ]
      },
      path: '/swagger',
      exclude: ['/swagger', '/swagger/json']
    })) : app)
    
    // Mount auth routes (no auth required)
    .use(createAuthRoutes())
    
    // Mount protected routes (auth required)
    .use(authMiddleware())
    .use(createTableRoutes(caches.labels))
    .use(createEvalRoutes(caches.eval))
    .use(createCompanyRoutes(caches.company))
    .use(createI18nRoutes(caches.labels))
    .use(createHealthRoutes())
    .use(createVersionRoutes())
    
    // Root endpoint
    .get('/', () => ({
      message: 'MoneyWorks REST API',
      version: '0.1.0',
      documentation: enableSwagger ? `${basePath}/swagger` : undefined,
      endpoints: {
        auth: `${basePath}/auth`,
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
  
  return app;
}