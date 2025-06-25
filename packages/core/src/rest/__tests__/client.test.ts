/**
 * Tests for MoneyWorksRESTClient
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { MoneyWorksRESTClient } from '../client';
import { createTestClient, assert } from '../../test-utils/helpers';
import { fixtures } from '../../test-utils/fixtures';
import { createAccount, createTransaction } from '../../test-utils/factories';
import type { MockMoneyWorksServer } from '../../test-utils/mock-server';
import { buildXML } from '../../xml/builder';

describe('MoneyWorksRESTClient', () => {
  let client: MoneyWorksRESTClient;
  let server: MockMoneyWorksServer;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const setup = await createTestClient();
    client = setup.client;
    server = setup.server;
    cleanup = setup.cleanup;
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('constructor', () => {
    it('should create client with valid config', () => {
      expect(client).toBeInstanceOf(MoneyWorksRESTClient);
    });

    it('should throw on invalid config', () => {
      expect(() => new MoneyWorksRESTClient({} as any))
        .toThrow('Missing required configuration');
    });

    it('should accept optional password', () => {
      const config = { ...fixtures.config.minimal };
      expect(() => new MoneyWorksRESTClient(config)).not.toThrow();
    });
  });

  describe('authentication', () => {
    it('should authenticate with basic auth', async () => {
      const version = await client.getVersion();
      expect(version).toContain('MoneyWorks');
    });

    it('should fail with invalid credentials', async () => {
      server.setCredentials('valid', 'valid');
      await assert.rejects(
        client.getVersion(),
        /Unauthorized/
      );
    });

    it('should retry on auth failure', async () => {
      let attempts = 0;
      server.addRoute('GET', '/version', (req, res) => {
        attempts++;
        if (attempts < 2) {
          res.writeHead(401);
          res.end('Unauthorized');
        } else {
          res.writeHead(200);
          res.end('MoneyWorks Gold 9.1.7');
        }
      });

      const version = await client.getVersion();
      expect(version).toContain('MoneyWorks');
      expect(attempts).toBe(2);
    });
  });

  describe('export', () => {
    it('should export all records from a table', async () => {
      server.mockResponse('GET', '/REST/TestFile.mwd7/export?table=Account', {
        body: fixtures.xml.validExport,
        headers: { 'Content-Type': 'text/xml' }
      });

      const accounts = await client.export('Account');
      expect(accounts).toHaveLength(2);
      expect(accounts[0]).toMatchObject({
        code: 'BANK-001',
        description: 'Main Bank Account',
        type: 'BA'
      });
    });

    it('should apply filters', async () => {
      server.addRoute('GET', /\/REST\/.*\/export/, (req, res, matches) => {
        const url = new URL(req.url!, `http://localhost`);
        const filter = url.searchParams.get('search');
        
        expect(filter).toBe('Type="BA"');
        
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(fixtures.xml.validExport);
      });

      await client.export('Account', { filter: 'Type="BA"' });
    });

    it('should respect limit and offset', async () => {
      server.addRoute('GET', /\/REST\/.*\/export/, (req, res) => {
        const url = new URL(req.url!, `http://localhost`);
        expect(url.searchParams.get('limit')).toBe('10');
        expect(url.searchParams.get('start')).toBe('20');
        
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(fixtures.xml.emptyExport);
      });

      await client.export('Account', { limit: 10, start: 20 });
    });

    it('should handle empty results', async () => {
      server.mockResponse('GET', '/REST/TestFile.mwd7/export?table=Account', {
        body: fixtures.xml.emptyExport
      });

      const accounts = await client.export('Account');
      expect(accounts).toEqual([]);
    });

    it('should handle malformed XML', async () => {
      server.mockResponse('GET', '/REST/TestFile.mwd7/export?table=Account', {
        body: fixtures.xml.malformed
      });

      await assert.rejects(
        client.export('Account'),
        /Failed to parse/
      );
    });

    it('should decode special characters', async () => {
      server.mockResponse('GET', '/REST/TestFile.mwd7/export?table=Name', {
        body: fixtures.xml.withSpecialChars
      });

      const names = await client.export('Name');
      expect(names[0].name).toBe('Test & Co <Special>');
      expect(names[0].description).toContain('"quotes"');
    });

    it('should support different formats', async () => {
      // JSON format - client requests XML and converts it
      server.mockResponse('GET', '/REST/TestFile.mwd7/export?table=Account&format=xml-verbose', {
        body: fixtures.xml.validExport,
        headers: { 'Content-Type': 'text/xml' }
      });

      const jsonAccounts = await client.export('Account', { format: 'json' });
      expect(jsonAccounts).toHaveLength(2);
      expect(jsonAccounts[0]).toMatchObject({
        code: 'BANK-001',
        description: 'Main Bank Account',
        type: 'BA'
      });

      // TSV format
      server.mockResponse('GET', '/REST/TestFile.mwd7/export?table=Account', {
        body: fixtures.tsv.validExport,
        headers: { 'Content-Type': 'text/tab-separated-values' }
      });

      const tsvAccounts = await client.export('Account', { format: 'tsv' });
      expect(tsvAccounts).toContain('BANK-001');
    });
  });

  describe('import', () => {
    it('should import a single record', async () => {
      server.mockResponse('POST', '/REST/TestFile.mwd7/import', {
        body: fixtures.xml.importSuccess
      });

      const account = createAccount({ code: 'NEW-001' });
      const result = await client.import('Account', [account]);
      
      expect(result).toEqual({
        success: true,
        count: 1,
        sequenceNumbers: [1001]
      });
    });

    it('should import multiple records', async () => {
      server.addRoute('POST', /\/REST\/.*\/import/, (req, res) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          // Check that multiple records were sent
          const recordCount = (body.match(/<account>/g) || []).length;
          expect(recordCount).toBe(3);
          
          res.writeHead(200, { 'Content-Type': 'text/xml' });
          res.end('<import status="success" count="3" />');
        });
      });

      const accounts = [
        createAccount({ code: 'NEW-001' }),
        createAccount({ code: 'NEW-002' }),
        createAccount({ code: 'NEW-003' }),
      ];

      const result = await client.import('Account', accounts);
      expect(result.count).toBe(3);
    });

    it('should handle import errors', async () => {
      server.mockResponse('POST', '/REST/TestFile.mwd7/import', {
        body: fixtures.xml.importError
      });

      await assert.rejects(
        client.import('Account', [createAccount()]),
        /Duplicate code/
      );
    });
  });

  describe('evaluate', () => {
    it('should evaluate simple expressions', async () => {
      server.mockResponse('GET', '/REST/TestFile.mwd7/evaluate?expr=1%20%2B%201', {
        body: '2'
      });

      const result = await client.evaluate('1 + 1');
      expect(result).toBe('2');
    });

    it('should evaluate complex expressions', async () => {
      server.addRoute('GET', /\/REST\/.*\/evaluate/, (req, res) => {
        const url = new URL(req.url!, `http://localhost`);
        const expr = url.searchParams.get('expr') || '';
        
        if (expr.includes('Count')) {
          res.end('42');
        } else if (expr.includes('Sum')) {
          res.end('12345.67');
        } else {
          res.end('0');
        }
      });

      const count = await client.evaluate('Count(Transaction, Type="DI")');
      expect(count).toBe('42');

      const sum = await client.evaluate('Sum(Transaction.Gross)');
      expect(sum).toBe('12345.67');
    });

    it('should handle evaluation errors', async () => {
      server.mockResponse('GET', '/REST/TestFile.mwd7/evaluate?expr=Invalid%28', {
        status: 400,
        body: 'Invalid expression'
      });

      await assert.rejects(
        client.evaluate('Invalid('),
        /Invalid expression/
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      // Stop server to simulate network error
      await server.stop();

      await assert.rejects(
        client.getVersion(),
        /ECONNREFUSED/
      );
    });

    it('should handle timeout', async () => {
      server.mockResponse('GET', '/version', {
        body: 'OK',
        delay: 2000 // 2 second delay
      });

      // Create client with short timeout
      const timeoutClient = new MoneyWorksRESTClient({
        ...fixtures.config.valid,
        timeout: 100 // 100ms timeout
      });

      await assert.rejects(
        timeoutClient.getVersion(),
        /timeout/i
      );
    });

    it('should handle 404 errors', async () => {
      server.mockResponse('GET', '/REST/TestFile.mwd7/export?table=InvalidTable', {
        status: 404,
        body: 'Table not found'
      });

      await assert.rejects(
        client.export('InvalidTable' as any),
        /not found/i
      );
    });

    it('should handle 500 errors', async () => {
      server.mockResponse('GET', '/REST/TestFile.mwd7/export?table=Account', {
        status: 500,
        body: 'Internal Server Error'
      });

      await assert.rejects(
        client.export('Account'),
        /Server Error/
      );
    });
  });

  describe('performance', () => {
    it('should handle large datasets efficiently', async () => {
      // Generate large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => 
        createAccount({ code: `ACC-${i.toString().padStart(4, '0')}` })
      );

      server.addRoute('GET', /\/REST\/.*\/export/, (req, res) => {
        const xml = buildXML('Account', largeDataset);
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(xml);
      });

      const start = Date.now();
      const result = await client.export('Account');
      const duration = Date.now() - start;

      expect(result).toHaveLength(1000);
      expect(duration).toBeLessThan(1000); // Should process in under 1 second
    });

    it('should stream large exports', async () => {
      // TODO: Implement streaming test when streaming is added
      expect(true).toBe(true);
    });
  });
});