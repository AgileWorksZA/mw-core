/**
 * Integration tests for export functionality
 * These tests require a running MoneyWorks instance or will use mock server
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { MoneyWorksRESTClient } from '../client';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createTestClient } from '../../test-utils/helpers';
import type { MockMoneyWorksServer } from '../../test-utils/mock-server';

// Check if we have a real MoneyWorks config
const configPath = join(process.cwd(), 'mw-config.json');
const hasRealConfig = existsSync(configPath) && process.env.USE_REAL_MW === 'true';

describe('Export Integration Tests', () => {
  let client: MoneyWorksRESTClient;
  let server: MockMoneyWorksServer | null = null;
  let cleanup: (() => Promise<void>) | null = null;

  beforeAll(async () => {
    if (hasRealConfig) {
      // Use real MoneyWorks
      console.log('Using real MoneyWorks instance');
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      client = new MoneyWorksRESTClient(config);
    } else {
      // Use mock server
      console.log('Using mock MoneyWorks server');
      const setup = await createTestClient();
      client = setup.client;
      server = setup.server;
      cleanup = setup.cleanup;
    }
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe('Account exports', () => {
    it('should export all accounts', async () => {
      const accounts = await client.export('Account');
      
      expect(Array.isArray(accounts)).toBe(true);
      expect(accounts.length).toBeGreaterThan(0);
      
      // Check structure of first account
      if (accounts.length > 0) {
        const account = accounts[0];
        expect(account).toHaveProperty('code');
        expect(account).toHaveProperty('description');
        expect(account).toHaveProperty('type');
        expect(account).toHaveProperty('balance');
      }
    });

    it('should filter accounts by type', async () => {
      const bankAccounts = await client.export('Account', {
        filter: 'Type="BA"'
      });
      
      expect(Array.isArray(bankAccounts)).toBe(true);
      
      // All returned accounts should be bank accounts
      for (const account of bankAccounts) {
        expect(account.type).toBe('BA');
      }
    });

    it('should respect limit parameter', async () => {
      const limitedAccounts = await client.export('Account', {
        limit: 5
      });
      
      expect(Array.isArray(limitedAccounts)).toBe(true);
      expect(limitedAccounts.length).toBeLessThanOrEqual(5);
    });

    it('should handle pagination with offset', async () => {
      // Get first batch
      const firstBatch = await client.export('Account', {
        limit: 5,
        offset: 0
      });
      
      // Get second batch
      const secondBatch = await client.export('Account', {
        limit: 5,
        offset: 5
      });
      
      // Ensure they're different
      if (firstBatch.length > 0 && secondBatch.length > 0) {
        expect(firstBatch[0].sequenceNumber).not.toBe(secondBatch[0].sequenceNumber);
      }
    });
  });

  describe('Transaction exports', () => {
    it('should export transactions', async () => {
      const transactions = await client.export('Transaction', {
        limit: 10
      });
      
      expect(Array.isArray(transactions)).toBe(true);
      
      if (transactions.length > 0) {
        const transaction = transactions[0];
        expect(transaction).toHaveProperty('sequenceNumber');
        expect(transaction).toHaveProperty('type');
        expect(transaction).toHaveProperty('transDate');
        expect(transaction).toHaveProperty('gross');
      }
    });

    it('should filter by date range', async () => {
      const dateFilteredTrans = await client.export('Transaction', {
        filter: 'TransDate >= "20240101" AND TransDate <= "20241231"',
        limit: 10
      });
      
      expect(Array.isArray(dateFilteredTrans)).toBe(true);
      
      // Check dates are in range
      for (const trans of dateFilteredTrans) {
        const date = parseInt(trans.transDate);
        expect(date).toBeGreaterThanOrEqual(20240101);
        expect(date).toBeLessThanOrEqual(20241231);
      }
    });

    it('should filter by transaction type', async () => {
      const invoices = await client.export('Transaction', {
        filter: 'Type="DI"',
        limit: 10
      });
      
      expect(Array.isArray(invoices)).toBe(true);
      
      // All should be debtor invoices
      for (const invoice of invoices) {
        expect(invoice.type).toBe('DI');
      }
    });
  });

  describe('Name (Customer/Supplier) exports', () => {
    it('should export customers', async () => {
      const customers = await client.export('Name', {
        filter: 'Type="C"',
        limit: 10
      });
      
      expect(Array.isArray(customers)).toBe(true);
      
      for (const customer of customers) {
        expect(customer.type).toBe('C');
        expect(customer).toHaveProperty('code');
        expect(customer).toHaveProperty('name');
      }
    });

    it('should export suppliers', async () => {
      const suppliers = await client.export('Name', {
        filter: 'Type="S"',
        limit: 10
      });
      
      expect(Array.isArray(suppliers)).toBe(true);
      
      for (const supplier of suppliers) {
        expect(supplier.type).toBe('S');
      }
    });
  });

  describe('Product exports', () => {
    it('should export products', async () => {
      const products = await client.export('Product', {
        limit: 10
      });
      
      expect(Array.isArray(products)).toBe(true);
      
      if (products.length > 0) {
        const product = products[0];
        expect(product).toHaveProperty('code');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('sellPrice');
      }
    });
  });

  describe('Export formats', () => {
    it('should export as JSON', async () => {
      const jsonResult = await client.export('Account', {
        limit: 5,
        format: 'json'
      });
      
      expect(Array.isArray(jsonResult)).toBe(true);
      expect(jsonResult.length).toBeGreaterThan(0);
    });

    it('should export as TSV', async () => {
      const tsvResult = await client.export('Account', {
        limit: 5,
        format: 'tsv'
      });
      
      expect(typeof tsvResult).toBe('string');
      expect(tsvResult).toContain('\t'); // Tab-separated
      expect(tsvResult.split('\n').length).toBeGreaterThan(1); // Has rows
    });

    it('should export as XML (default)', async () => {
      const xmlResult = await client.export('Account', {
        limit: 5,
        format: 'xml'
      });
      
      // When format is XML, it still gets parsed to objects
      expect(Array.isArray(xmlResult)).toBe(true);
    });
  });

  describe('Complex queries', () => {
    it('should handle complex filter expressions', async () => {
      const complexFilter = await client.export('Transaction', {
        filter: '(Type="DI" OR Type="DC") AND Gross > 100 AND Period=CurrentPeriod()',
        limit: 10
      });
      
      expect(Array.isArray(complexFilter)).toBe(true);
      
      for (const trans of complexFilter) {
        expect(['DI', 'DC']).toContain(trans.type);
        expect(trans.gross).toBeGreaterThan(100);
      }
    });

    it('should order results', async () => {
      const orderedAccounts = await client.export('Account', {
        orderBy: 'Code',
        limit: 10
      });
      
      expect(Array.isArray(orderedAccounts)).toBe(true);
      
      // Check if ordered by code
      if (orderedAccounts.length > 1) {
        for (let i = 1; i < orderedAccounts.length; i++) {
          const prevCode = orderedAccounts[i - 1].code;
          const currCode = orderedAccounts[i].code;
          expect(prevCode.localeCompare(currCode)).toBeLessThanOrEqual(0);
        }
      }
    });
  });

  describe('Error handling', () => {
    it('should handle invalid table names', async () => {
      await expect(
        client.export('InvalidTable' as any)
      ).rejects.toThrow();
    });

    it('should handle invalid filters', async () => {
      await expect(
        client.export('Account', {
          filter: 'InvalidField="test"'
        })
      ).rejects.toThrow();
    });

    it('should handle network timeouts gracefully', async () => {
      // Only test with mock server
      if (server) {
        server.mockResponse('GET', '/REST/TestFile/export', {
          delay: 5000,
          body: '[]'
        });

        const timeoutClient = new MoneyWorksRESTClient({
          ...client['config'],
          timeout: 100
        });

        await expect(
          timeoutClient.export('Account')
        ).rejects.toThrow(/timeout/i);
      }
    });
  });

  describe('Performance', () => {
    it('should handle large exports efficiently', async () => {
      const start = Date.now();
      
      const largeExport = await client.export('Transaction', {
        limit: 100
      });
      
      const duration = Date.now() - start;
      
      expect(Array.isArray(largeExport)).toBe(true);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      
      console.log(`Exported ${largeExport.length} transactions in ${duration}ms`);
    });
  });
});