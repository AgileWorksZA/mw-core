/**
 * Test fixtures for IDE testing
 */

export const testVariables = {
  simple: {
    base_url: "https://api.example.com",
    api_version: "v1",
    timeout: "30000",
  },
  withReferences: {
    protocol: "https",
    host: "api.example.com",
    version: "v1",
    base_url: "{{protocol}}://{{host}}/{{version}}",
    full_endpoint: "{{base_url}}/users",
  },
  circular: {
    var_a: "{{var_b}}",
    var_b: "{{var_c}}",
    var_c: "{{var_a}}",
  },
  nested: {
    level1: "value1",
    level2: "{{level1}}_extended",
    level3: "{{level2}}_more",
  },
};

export const testSecrets = {
  api_key: "sk-test-1234567890",
  client_secret: "secret_abcdefghijk",
  token: "Bearer eyJhbGciOiJIUzI1NiJ9.test",
};

export const testEnvironments = {
  development: {
    id: "env-dev",
    name: "Development",
    variables: {
      base_url: "http://localhost:3000",
      api_version: "v1-dev",
      debug: "true",
    },
    secrets: {
      api_key: "dev-key-123",
    },
    isActive: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  production: {
    id: "env-prod",
    name: "Production",
    variables: {
      base_url: "https://api.production.com",
      api_version: "v2",
      debug: "false",
    },
    secrets: {
      api_key: "prod-key-456",
    },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
};

export const testOpenApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Test API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "{{base_url}}/{{api_version}}",
      description: "API Server",
    },
  ],
  paths: {
    "/users": {
      get: {
        operationId: "getUsers",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const testServiceConnection = {
  id: "svc-test",
  name: "Test Service",
  type: "rest",
  config: {
    baseUrl: "{{base_url}}",
    headers: {
      Authorization: "{{secret:api_key}}",
      "X-API-Version": "{{api_version}}",
    },
    timeout: "{{timeout}}",
  },
};