/**
 * MoneyWorks REST API Client
 * 
 * Provides a complete REST client for interacting with MoneyWorks server.
 */

// Main client
export { MoneyWorksRESTClient } from "./client";

// Types
export type {
  MoneyWorksConfig,
  ExportFormat,
  ExportOptions,
  ImportOptions,
  ImportResult,
  StreamOptions,
  AuthHeaders,
  RESTResponse,
} from "./types";

export {
  MoneyWorksErrorCode,
  REST_ENDPOINTS,
  DEFAULT_CONFIG,
} from "./types";

// Errors
export { 
  MoneyWorksError,
  ExportError,
  ImportError,
  AuthenticationError,
  ConnectionError,
  ValidationError,
  TimeoutError,
  ParseError
} from "./errors";

// Auth utilities
export {
  buildAuthHeaders,
  buildDocumentPath,
  buildRESTUrl,
  validateConfig,
  maskConfig,
  parseAuthError,
} from "./auth";