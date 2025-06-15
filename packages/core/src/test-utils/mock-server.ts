/**
 * Mock MoneyWorks server for testing
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

interface MockRoute {
  method: string;
  path: RegExp;
  handler: (req: IncomingMessage, res: ServerResponse, matches: RegExpMatchArray) => void;
}

interface MockResponse {
  status?: number;
  body?: any;
  headers?: Record<string, string>;
  delay?: number;
}

export class MockMoneyWorksServer {
  private server: any;
  private routes: MockRoute[] = [];
  private port: number;
  private authEnabled: boolean = true;
  private validCredentials = {
    username: 'test',
    password: 'test123'
  };

  constructor(port: number = 9595) {
    this.port = port;
    this.setupDefaultRoutes();
  }

  /**
   * Start the mock server
   */
  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = createServer((req, res) => {
        this.handleRequest(req, res);
      });

      this.server.listen(this.port, () => {
        console.log(`Mock MoneyWorks server running on port ${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Stop the mock server
   */
  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Add a custom route
   */
  addRoute(method: string, path: string | RegExp, handler: (req: IncomingMessage, res: ServerResponse, matches: RegExpMatchArray) => void) {
    const pathRegex = typeof path === 'string' ? new RegExp(`^${path}$`) : path;
    this.routes.unshift({ method, path: pathRegex, handler });
  }

  /**
   * Add a simple response route
   */
  mockResponse(method: string, path: string, response: MockResponse) {
    this.addRoute(method, path, async (req, res) => {
      if (response.delay) {
        await new Promise(resolve => setTimeout(resolve, response.delay));
      }

      const status = response.status || 200;
      const headers = response.headers || { 'Content-Type': 'application/json' };
      
      res.writeHead(status, headers);
      
      if (response.body) {
        const body = typeof response.body === 'string' 
          ? response.body 
          : JSON.stringify(response.body);
        res.end(body);
      } else {
        res.end();
      }
    });
  }

  /**
   * Set authentication requirement
   */
  setAuthEnabled(enabled: boolean) {
    this.authEnabled = enabled;
  }

  /**
   * Set valid credentials
   */
  setCredentials(username: string, password: string) {
    this.validCredentials = { username, password };
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse) {
    // Check authentication if enabled
    if (this.authEnabled && !this.checkAuth(req)) {
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="MoneyWorks"' });
      res.end('Unauthorized');
      return;
    }

    // Find matching route
    const method = req.method || 'GET';
    const url = new URL(req.url || '/', `http://localhost:${this.port}`);
    
    for (const route of this.routes) {
      if (route.method === method) {
        const matches = url.pathname.match(route.path);
        if (matches) {
          route.handler(req, res, matches);
          return;
        }
      }
    }

    // 404 if no route matches
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }

  private checkAuth(req: IncomingMessage): boolean {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
      return false;
    }

    const credentials = Buffer.from(auth.slice(6), 'base64').toString();
    const [username, password] = credentials.split(':');
    
    return username === this.validCredentials.username && 
           password === this.validCredentials.password;
  }

  private setupDefaultRoutes() {
    // Version endpoint
    this.addRoute('GET', '/version', (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('MoneyWorks Gold 9.1.7 REST API');
    });

    // Export endpoint
    this.addRoute('GET', /^\/REST\/([^/]+)\/export$/, (req, res, matches) => {
      const folder = matches[1];
      const url = new URL(req.url || '/', `http://localhost:${this.port}`);
      const table = url.searchParams.get('table');
      const format = url.searchParams.get('format') || 'xml';

      if (!table) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing table parameter');
        return;
      }

      // Return mock data based on table
      const mockData = this.getMockDataForTable(table, url.searchParams);
      
      if (format === 'xml') {
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(this.convertToXML(table, mockData));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockData));
      }
    });

    // Import endpoint
    this.addRoute('POST', /^\/REST\/([^/]+)\/import$/, (req, res) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end('<import status="success" count="1" />');
      });
    });

    // Evaluate endpoint
    this.addRoute('POST', /^\/REST\/([^/]+)\/evaluate$/, (req, res) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        // Simple expression evaluation
        const expression = body;
        let result = '0';
        
        if (expression.includes('CurrentPeriod')) {
          result = '12';
        } else if (expression.includes('Count')) {
          result = '42';
        } else if (expression.includes('Sum')) {
          result = '12345.67';
        }

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(result);
      });
    });
  }

  private getMockDataForTable(table: string, params: URLSearchParams): any[] {
    const limit = parseInt(params.get('limit') || '100');
    const offset = parseInt(params.get('offset') || '0');

    // Generate mock data based on table
    switch (table.toLowerCase()) {
      case 'account':
        return this.generateAccounts().slice(offset, offset + limit);
      
      case 'transaction':
        return this.generateTransactions().slice(offset, offset + limit);
      
      case 'name':
        return this.generateNames().slice(offset, offset + limit);
      
      case 'product':
        return this.generateProducts().slice(offset, offset + limit);
      
      default:
        return [];
    }
  }

  private generateAccounts(): any[] {
    return [
      { Code: 'BANK-CHQ', Description: 'Checking Account', Type: 'BA', Balance: '10000.00' },
      { Code: 'ACCT-REC', Description: 'Accounts Receivable', Type: 'CA', Balance: '25000.00' },
      { Code: 'SALES-PROD', Description: 'Product Sales', Type: 'IN', Balance: '-50000.00' },
      { Code: 'EXP-WAGES', Description: 'Wages Expense', Type: 'EX', Balance: '30000.00' },
    ];
  }

  private generateTransactions(): any[] {
    return [
      { SequenceNumber: '1001', Type: 'DI', TransDate: '20240101', Description: 'Invoice #1001', Gross: '1100.00' },
      { SequenceNumber: '1002', Type: 'CI', TransDate: '20240102', Description: 'Bill #2001', Gross: '550.00' },
      { SequenceNumber: '1003', Type: 'DP', TransDate: '20240103', Description: 'Payment Received', Gross: '1100.00' },
    ];
  }

  private generateNames(): any[] {
    return [
      { Code: 'CUST-001', Name: 'ABC Company', Type: 'C', Balance: '1000.00' },
      { Code: 'CUST-002', Name: 'XYZ Corporation', Type: 'C', Balance: '2500.00' },
      { Code: 'SUPP-001', Name: 'Acme Supplies', Type: 'S', Balance: '-500.00' },
    ];
  }

  private generateProducts(): any[] {
    return [
      { Code: 'PROD-001', Description: 'Standard Product', SellPrice: '100.00', BuyPrice: '60.00' },
      { Code: 'PROD-002', Description: 'Service Item', SellPrice: '150.00', BuyPrice: '0.00' },
    ];
  }

  private convertToXML(table: string, data: any[]): string {
    let xml = `<?xml version="1.0"?>\n<table name="${table}">\n`;
    
    for (const record of data) {
      xml += '  <record>\n';
      for (const [key, value] of Object.entries(record)) {
        xml += `    <field name="${key}">${this.escapeXML(String(value))}</field>\n`;
      }
      xml += '  </record>\n';
    }
    
    xml += '</table>';
    return xml;
  }

  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}