/**
 * Request ID Middleware
 * Adds unique request IDs for tracking
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia } from 'elysia';

/**
 * Request ID plugin for Elysia
 */
export const requestId = new Elysia({ name: 'request-id' })
  .derive(({ request, set }) => {
    // Check if client provided a request ID
    let id = request.headers.get('x-request-id');
    
    // Generate one if not provided
    if (!id) {
      id = generateRequestId();
    }
    
    // Set it in response headers
    set.headers['x-request-id'] = id;
    
    // Make it available to handlers
    return { requestId: id };
  });

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `mw-${timestamp}-${random}`;
}