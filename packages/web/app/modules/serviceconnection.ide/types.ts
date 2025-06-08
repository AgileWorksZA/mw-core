import type { FileContext } from "~/modules/ide/types";

/**
 * Authentication configuration for service connections
 */
export interface AuthenticationConfig {
  type: "none" | "basic" | "bearer" | "apikey" | "oauth2" | "custom";
  config?: {
    // Basic auth
    username?: string;
    password?: string;
    
    // Bearer token
    token?: string;
    
    // API Key
    apiKey?: string;
    apiKeyLocation?: "header" | "query";
    apiKeyName?: string;
    
    // OAuth2
    clientId?: string;
    clientSecret?: string;
    authorizationUrl?: string;
    tokenUrl?: string;
    scopes?: string[];
    
    // Custom auth
    customHeaders?: Record<string, string>;
  };
}

/**
 * The main data structure for Service Connection files
 */
export interface ServiceConnectionData {
  /**
   * Display name for the connection
   */
  name: string;
  
  /**
   * Type of service
   */
  type: "rest" | "graphql" | "grpc" | "websocket" | "database";
  
  /**
   * Base URL or connection string
   */
  url: string;
  
  /**
   * Authentication configuration
   */
  authentication: AuthenticationConfig;
  
  /**
   * Default headers to include in requests
   */
  headers?: Record<string, string>;
  
  /**
   * Default query parameters
   */
  queryParams?: Record<string, string>;
  
  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
  
  /**
   * Retry configuration
   */
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier?: number;
  };
  
  /**
   * SSL/TLS configuration
   */
  sslConfig?: {
    rejectUnauthorized?: boolean;
    ca?: string;
    cert?: string;
    key?: string;
  };
  
  /**
   * Proxy configuration
   */
  proxy?: {
    url: string;
    auth?: {
      username: string;
      password: string;
    };
  };
  
  /**
   * Connection metadata
   */
  metadata?: {
    description?: string;
    tags?: string[];
    lastTested?: string;
    lastTestStatus?: "success" | "failed";
    createdAt?: string;
    updatedAt?: string;
  };
}

/**
 * The context for the Service Connection artifact
 */
export interface ServiceConnectionContext extends FileContext {
  /**
   * The service connection data
   */
  data: ServiceConnectionData;
}

/**
 * Schema for ServiceConnectionData validation
 */
export const ServiceConnectionSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    type: { 
      type: "string",
      enum: ["rest", "graphql", "grpc", "websocket", "database"]
    },
    url: { type: "string" },
    authentication: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["none", "basic", "bearer", "apikey", "oauth2", "custom"]
        },
        config: {
          type: "object",
          nullable: true,
          properties: {
            username: { type: "string", nullable: true },
            password: { type: "string", nullable: true },
            token: { type: "string", nullable: true },
            tokenPrefix: { type: "string", nullable: true },
            apiKey: { type: "string", nullable: true },
            apiKeyLocation: { 
              type: "string", 
              enum: ["header", "query", "cookie"],
              nullable: true 
            },
            apiKeyName: { type: "string", nullable: true },
            clientId: { type: "string", nullable: true },
            clientSecret: { type: "string", nullable: true },
            authorizationUrl: { type: "string", nullable: true },
            tokenUrl: { type: "string", nullable: true },
            redirectUri: { type: "string", nullable: true },
            scopes: { 
              type: "array",
              items: { type: "string" },
              nullable: true
            },
            grantType: { 
              type: "string", 
              enum: ["authorization_code", "client_credentials", "password", "refresh_token"],
              nullable: true 
            },
            accessToken: { type: "string", nullable: true },
            refreshToken: { type: "string", nullable: true },
            tokenExpiry: { type: "string", nullable: true },
            customHeaders: {
              type: "object",
              additionalProperties: { type: "string" },
              nullable: true
            },
            customQueryParams: {
              type: "object",
              additionalProperties: { type: "string" },
              nullable: true
            },
            customCookies: {
              type: "object",
              additionalProperties: { type: "string" },
              nullable: true
            }
          },
          additionalProperties: false
        }
      },
      required: ["type"],
      additionalProperties: false
    },
    headers: {
      type: "object",
      additionalProperties: { type: "string" },
      nullable: true
    },
    queryParams: {
      type: "object",
      additionalProperties: { type: "string" },
      nullable: true
    },
    timeout: { type: "number", nullable: true },
    cors: {
      type: "object",
      nullable: true,
      properties: {
        credentials: { 
          type: "string", 
          enum: ["include", "same-origin", "omit"],
          nullable: true 
        },
        mode: { 
          type: "string", 
          enum: ["cors", "no-cors", "same-origin"],
          nullable: true 
        }
      },
      additionalProperties: false
    },
    retryConfig: {
      type: "object",
      nullable: true,
      properties: {
        maxRetries: { type: "number" },
        retryDelay: { type: "number" },
        backoffMultiplier: { type: "number", nullable: true },
        retryOn: { 
          type: "array",
          items: { type: "number" },
          nullable: true
        },
        retryCondition: { 
          type: "string", 
          enum: ["network-error", "5xx", "4xx-5xx", "custom"],
          nullable: true 
        }
      },
      required: ["maxRetries", "retryDelay"],
      additionalProperties: false
    },
    sslConfig: {
      type: "object",
      nullable: true,
      properties: {
        rejectUnauthorized: { type: "boolean", nullable: true },
        ca: { type: "string", nullable: true },
        cert: { type: "string", nullable: true },
        key: { type: "string", nullable: true }
      },
      additionalProperties: false
    },
    proxy: {
      type: "object",
      nullable: true,
      properties: {
        url: { type: "string" },
        auth: {
          type: "object",
          nullable: true,
          properties: {
            username: { type: "string" },
            password: { type: "string" }
          },
          required: ["username", "password"],
          additionalProperties: false
        }
      },
      required: ["url"],
      additionalProperties: false
    },
    metadata: {
      type: "object",
      nullable: true,
      properties: {
        description: { type: "string", nullable: true },
        tags: {
          type: "array",
          items: { type: "string" },
          nullable: true
        },
        environment: {
          type: "string",
          enum: ["development", "staging", "production", "test"],
          nullable: true
        },
        lastTested: { type: "string", nullable: true },
        lastTestStatus: {
          type: "string",
          enum: ["success", "failed"],
          nullable: true
        },
        lastTestError: { type: "string", nullable: true },
        createdAt: { type: "string", nullable: true },
        updatedAt: { type: "string", nullable: true },
        version: { type: "string", nullable: true }
      },
      additionalProperties: false
    }
  },
  required: ["name", "type", "url", "authentication"],
  additionalProperties: false
};

/**
 * Empty context for initializing a new Service Connection artifact
 */
export const blankContext: ServiceConnectionContext = {
  data: {
    name: "New Service Connection",
    type: "rest",
    url: "",
    authentication: {
      type: "none"
    },
    headers: {},
    queryParams: {},
    metadata: {
      description: "",
      tags: [],
      createdAt: new Date().toISOString()
    }
  },
};