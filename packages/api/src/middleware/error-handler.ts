/**
 * Error Handler Middleware
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia } from 'elysia';
import { ValidationError, MoneyWorksError } from '@moneyworks/api/controllers/base-table';

export interface APIError {
  error: {
    code: string;
    message: string;
    details?: any;
    requestId: string;
  };
}

/**
 * Create error response
 */
function createErrorResponse(
  code: string,
  message: string,
  requestId: string,
  details?: any
): APIError {
  return {
    error: {
      code,
      message,
      details,
      requestId
    }
  };
}

/**
 * Error handler plugin for Elysia
 */
export const errorHandler = new Elysia({ name: 'error-handler' })
  .onError(({ error, set, request }) => {
    const requestId = request.headers.get('x-request-id') || 'unknown';
    
    // Handle validation errors
    if (error instanceof ValidationError) {
      set.status = 400;
      return createErrorResponse(
        error.code,
        error.message,
        requestId
      );
    }
    
    // Handle MoneyWorks errors
    if (error instanceof MoneyWorksError) {
      set.status = 502;
      return createErrorResponse(
        error.code,
        error.message,
        requestId,
        { upstream: 'MoneyWorks' }
      );
    }
    
    // Handle Elysia validation errors
    if (error.constructor.name === 'ValidationError' && 'validator' in error) {
      set.status = 400;
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid request parameters',
        requestId,
        error
      );
    }
    
    // Handle 404 - Not Found
    if (error.message?.includes('NOT_FOUND')) {
      set.status = 404;
      return createErrorResponse(
        'NOT_FOUND',
        error.message,
        requestId
      );
    }
    
    // Default error handling
    console.error(`[${requestId}] Unhandled error:`, error);
    set.status = 500;
    
    return createErrorResponse(
      'INTERNAL_ERROR',
      process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred'
        : error.message,
      requestId,
      process.env.NODE_ENV !== 'production' ? { stack: error.stack } : undefined
    );
  });