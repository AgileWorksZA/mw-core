/**
 * MoneyWorks REST API Errors
 *
 * Custom error classes for MoneyWorks REST operations.
 */

import type { TableName } from "../tables";
import { MoneyWorksErrorCode } from "./types";

/**
 * Base MoneyWorks error
 */
export class MoneyWorksError extends Error {
  constructor(
    public code: MoneyWorksErrorCode,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "MoneyWorksError";
  }

  /**
   * Check if error is of specific type
   */
  is(code: MoneyWorksErrorCode): boolean {
    return this.code === code;
  }
}

/**
 * Export-specific error
 */
export class ExportError extends MoneyWorksError {
  constructor(
    public table: TableName,
    message: string,
    public filter?: string,
    details?: unknown,
  ) {
    super(MoneyWorksErrorCode.INVALID_REQUEST, message, details);
    this.name = "ExportError";
  }
}

/**
 * Import-specific error
 */
export class ImportError extends MoneyWorksError {
  constructor(
    public table: TableName,
    message: string,
    public records: unknown[],
    public validationErrors?: Array<{
      record: number;
      field?: string;
      message: string;
    }>,
    details?: unknown,
  ) {
    super(MoneyWorksErrorCode.VALIDATION_ERROR, message, details);
    this.name = "ImportError";
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends MoneyWorksError {
  constructor(
    message: string,
    public realm?: "document" | "folder",
    details?: unknown,
  ) {
    super(MoneyWorksErrorCode.AUTH_FAILED, message, details);
    this.name = "AuthenticationError";
  }
}

/**
 * Connection error
 */
export class ConnectionError extends MoneyWorksError {
  constructor(
    message: string,
    public host: string,
    public port: number,
    details?: unknown,
  ) {
    super(MoneyWorksErrorCode.SERVER_ERROR, message, details);
    this.name = "ConnectionError";
  }
}

/**
 * Validation error
 */
export class ValidationError extends MoneyWorksError {
  constructor(
    public table: TableName,
    public field: string,
    message: string,
    public value?: unknown,
    details?: unknown,
  ) {
    super(MoneyWorksErrorCode.VALIDATION_ERROR, message, details);
    this.name = "ValidationError";
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends MoneyWorksError {
  constructor(
    message: string,
    public operation: string,
    public timeout: number,
    details?: unknown,
  ) {
    super(MoneyWorksErrorCode.TIMEOUT, message, details);
    this.name = "TimeoutError";
  }
}

/**
 * Parse error
 */
export class ParseError extends MoneyWorksError {
  constructor(
    message: string,
    public format: string,
    public content?: string,
    details?: unknown,
  ) {
    super(MoneyWorksErrorCode.INVALID_REQUEST, message, details);
    this.name = "ParseError";
  }
}

/**
 * Create appropriate error from response
 */
export function createErrorFromResponse(
  response: Response,
  operation: string,
  context?: Record<string, unknown>,
): MoneyWorksError {
  const status = response.status;
  const statusText = response.statusText;

  switch (status) {
    case 401:
      return new AuthenticationError(
        `Authentication failed for ${operation}`,
        context?.realm as "document" | "folder",
        { status, statusText },
      );

    case 403:
      return new MoneyWorksError(
        MoneyWorksErrorCode.PERMISSION_DENIED,
        `Permission denied for ${operation}`,
        { status, statusText, ...context },
      );

    case 404:
      return new MoneyWorksError(
        MoneyWorksErrorCode.DOCUMENT_NOT_FOUND,
        `Document not found during ${operation}`,
        { status, statusText, ...context },
      );

    case 400:
      return new MoneyWorksError(
        MoneyWorksErrorCode.INVALID_REQUEST,
        `Invalid request for ${operation}`,
        { status, statusText, ...context },
      );

    case 500:
    case 502:
    case 503:
      return new MoneyWorksError(
        MoneyWorksErrorCode.SERVER_ERROR,
        `Server error during ${operation}`,
        { status, statusText, ...context },
      );

    default:
      return new MoneyWorksError(
        MoneyWorksErrorCode.UNKNOWN,
        `Unexpected error during ${operation}: ${status} ${statusText}`,
        { status, statusText, ...context },
      );
  }
}

/**
 * Error message formatter
 */
export function formatErrorMessage(error: MoneyWorksError): string {
  let message = `${error.name}: ${error.message}`;

  if (error instanceof ExportError) {
    message += `\n  Table: ${error.table}`;
    if (error.filter) {
      message += `\n  Filter: ${error.filter}`;
    }
  } else if (error instanceof ImportError) {
    message += `\n  Table: ${error.table}`;
    message += `\n  Records: ${error.records.length}`;
    if (error.validationErrors?.length) {
      message += `\n  Validation errors: ${error.validationErrors.length}`;
    }
  } else if (error instanceof ValidationError) {
    message += `\n  Table: ${error.table}`;
    message += `\n  Field: ${error.field}`;
    if (error.value !== undefined) {
      message += `\n  Value: ${JSON.stringify(error.value)}`;
    }
  }

  return message;
}
