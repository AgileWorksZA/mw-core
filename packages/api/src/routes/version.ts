/**
 * Version Information Routes
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia, t } from 'elysia';
import type { SmartMoneyWorksClient } from '@moneyworks/data';
import { readFileSync } from 'fs';
import { join } from 'path';
import '../types/context';

export interface VersionInfo {
  api: {
    version: string;
    name: string;
    description: string;
  };
  moneyworks?: {
    version: string;
    server?: string;
  };
  node: string;
  bun: string;
  timestamp: string;
}

/**
 * Create version routes
 */
export function createVersionRoutes() {
  // Read package.json for API info
  let apiInfo = {
    version: '0.1.0',
    name: '@moneyworks/api',
    description: 'MoneyWorks REST API'
  };
  
  try {
    const packagePath = join(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
    apiInfo = {
      version: pkg.version || apiInfo.version,
      name: pkg.name || apiInfo.name,
      description: pkg.description || apiInfo.description
    };
  } catch {
    // Use defaults if package.json can't be read
  }
  
  return new Elysia()
    .get('/version', async (context) => {
      const { mwClient } = context as any;
      const version: VersionInfo = {
        api: apiInfo,
        node: process.version,
        bun: Bun.version,
        timestamp: new Date().toISOString()
      };
      
      // Try to get MoneyWorks version if client is available
      if (mwClient) {
        try {
          const mwVersion = await mwClient.getVersion();
          version.moneyworks = {
            version: mwVersion
          };
        } catch {
          // MoneyWorks version unavailable
        }
      }
      
      return version;
    }, {
      detail: {
        summary: 'Get version information',
        description: 'Get API and MoneyWorks version information',
        tags: ['System']
      },
      response: t.Object({
        api: t.Object({
          version: t.String(),
          name: t.String(),
          description: t.String()
        }),
        moneyworks: t.Optional(t.Object({
          version: t.String(),
          server: t.Optional(t.String())
        })),
        node: t.String(),
        bun: t.String(),
        timestamp: t.String()
      })
    });
}