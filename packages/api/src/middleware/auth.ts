/**
 * Authentication Middleware
 * 
 * Validates API tokens and attaches MoneyWorks client to context
 */

import { Elysia } from 'elysia';
import { connectionService } from '../services/connection-service';
import { createSmartClient, type SmartMoneyWorksClient } from '@moneyworks/data';

// Extend context type
declare module 'elysia' {
  interface Context {
    mwClient?: SmartMoneyWorksClient;
    connectionId?: string;
  }
}

// Cache of active clients to avoid recreating
const clientCache = new Map<string, { client: SmartMoneyWorksClient; lastUsed: number }>();

// Cleanup old clients every 5 minutes
setInterval(() => {
  const now = Date.now();
  const maxAge = 10 * 60 * 1000; // 10 minutes
  
  for (const [key, value] of clientCache.entries()) {
    if (now - value.lastUsed > maxAge) {
      clientCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function authMiddleware(options?: { required?: boolean }) {
  const { required = true } = options || {};

  return new Elysia()
    .derive(async ({ headers, set, store }) => {
      const authHeader = headers.authorization;
      
      if (!authHeader?.startsWith('Bearer ')) {
        if (required) {
          set.status = 401;
          throw new Error('Missing authorization header');
        }
        return {};
      }

      const token = authHeader.substring(7);
      
      try {
        // Get connection config from token
        const config = await connectionService.getConnectionByToken(token);
        
        if (!config) {
          if (required) {
            set.status = 401;
            throw new Error('Invalid token');
          }
          return {};
        }

        // Check cache for existing client
        const cacheKey = token;
        const cached = clientCache.get(cacheKey);
        
        if (cached) {
          cached.lastUsed = Date.now();
          return {
            mwClient: cached.client,
            connectionId: token // Using token as connection identifier for now
          };
        }

        // Create new client
        const client = createSmartClient(config);
        
        // Cache it
        clientCache.set(cacheKey, {
          client,
          lastUsed: Date.now()
        });

        return {
          mwClient: client,
          connectionId: token
        };
      } catch (error) {
        console.error('Auth middleware error:', error);
        if (required) {
          set.status = 401;
          throw new Error('Authentication failed');
        }
        return {};
      }
    });
}