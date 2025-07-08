/**
 * Logging Middleware
 * Structured logging for API requests
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia } from 'elysia';

export interface LogEntry {
  timestamp: string;
  requestId: string;
  method: string;
  path: string;
  query?: Record<string, any>;
  statusCode?: number;
  duration?: number;
  error?: string;
  userAgent?: string;
}

/**
 * Logging plugin for Elysia
 */
export const logging = new Elysia({ name: 'logging' })
  .derive(({ request }) => {
    const startTime = performance.now();
    return { startTime };
  })
  .onAfterHandle((context) => {
    const { request, set } = context;
    const requestId = (context as any).requestId || 'unknown';
    const startTime = (context as any).startTime || 0;
    const duration = performance.now() - startTime;
    
    const log: LogEntry = {
      timestamp: new Date().toISOString(),
      requestId,
      method: request.method,
      path: new URL(request.url).pathname,
      query: Object.fromEntries(new URL(request.url).searchParams),
      statusCode: typeof set.status === 'number' ? set.status : 200,
      duration: Math.round(duration * 100) / 100,
      userAgent: request.headers.get('user-agent') || undefined
    };
    
    console.log(JSON.stringify(log));
  })
  .onError((context) => {
    const { request, error } = context;
    const requestId = (context as any).requestId || 'unknown';
    const startTime = (context as any).startTime || 0;
    const duration = startTime ? performance.now() - startTime : 0;
    
    const log: LogEntry = {
      timestamp: new Date().toISOString(),
      requestId,
      method: request.method,
      path: new URL(request.url).pathname,
      query: Object.fromEntries(new URL(request.url).searchParams),
      duration: Math.round(duration * 100) / 100,
      error: 'message' in error ? error.message : String(error),
      userAgent: request.headers.get('user-agent') || undefined
    };
    
    console.error(JSON.stringify(log));
  });