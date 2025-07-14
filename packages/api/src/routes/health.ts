/**
 * Health Check Routes
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia, t } from 'elysia';
import type { SmartMoneyWorksClient } from '@moneyworks/data';
import '../types/context';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    api: 'ok' | 'error';
    moneyworks: 'ok' | 'error' | 'timeout';
  };
  version: {
    api: string;
    moneyworks?: string;
  };
}

const startTime = Date.now();

/**
 * Create health routes
 */
export function createHealthRoutes() {
  return new Elysia()
    .get('/health', async (context) => {
      const { mwClient } = context as any;
      const checks: {
        api: 'ok' | 'error';
        moneyworks: 'ok' | 'error' | 'timeout';
      } = {
        api: 'ok',
        moneyworks: 'error'
      };
      
      // Check MoneyWorks connection if client is available
      if (mwClient) {
        try {
          const testResult = await Promise.race([
            mwClient.testConnection(),
            new Promise<boolean>((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 5000)
            )
          ]);
          
          if (testResult) {
            checks.moneyworks = 'ok';
          }
        } catch (error: any) {
          checks.moneyworks = error.message === 'Timeout' ? 'timeout' : 'error';
        }
      }
      
      // Determine overall status based on the current moneyworks check status
      const mwStatus = checks.moneyworks;
      const status = mwStatus === 'ok' ? 'healthy' : 
                    mwStatus === 'timeout' ? 'degraded' : 'unhealthy';
      
      const health: HealthStatus = {
        status,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - startTime,
        checks,
        version: {
          api: '0.1.0'
        }
      };
      
      return health;
    }, {
      detail: {
        summary: 'Health check',
        description: 'Check API and MoneyWorks connection health',
        tags: ['System']
      },
      response: t.Object({
        status: t.Union([
          t.Literal('healthy'),
          t.Literal('degraded'),
          t.Literal('unhealthy')
        ]),
        timestamp: t.String(),
        uptime: t.Number(),
        checks: t.Object({
          api: t.Union([t.Literal('ok'), t.Literal('error')]),
          moneyworks: t.Union([
            t.Literal('ok'),
            t.Literal('error'),
            t.Literal('timeout')
          ])
        }),
        version: t.Object({
          api: t.String(),
          moneyworks: t.Optional(t.String())
        })
      })
    })
    
    // Simple health check (for load balancers)
    .get('/ping', () => 'pong', {
      detail: {
        summary: 'Ping',
        description: 'Simple health check endpoint',
        tags: ['System']
      },
      response: t.String()
    });
}