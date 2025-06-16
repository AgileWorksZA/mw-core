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
    // Version endpoint (matches /REST/{dataFile}/version)
    this.addRoute('GET', /^\/REST\/([^/]+)\/version$/, (req, res) => {
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
      
      // When no format is specified, MoneyWorks defaults to TSV
      const actualFormat = format || 'tsv';
      
      if (actualFormat.startsWith('xml')) {
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(this.convertToXML(table, mockData));
      } else if (actualFormat === 'json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockData));
      } else if (actualFormat === 'tsv') {
        res.writeHead(200, { 'Content-Type': 'text/tab-separated-values' });
        res.end(this.convertToTSV(mockData));
      } else {
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(this.convertToXML(table, mockData));
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
    this.addRoute('GET', /^\/REST\/([^/]+)\/evaluate$/, (req, res) => {
      const url = new URL(req.url || '/', `http://localhost:${this.port}`);
      const expression = url.searchParams.get('expr') || '';
      let result = '0';
      
      if (expression.includes('CurrentPeriod')) {
        result = '12';
      } else if (expression.includes('Count')) {
        result = '42';
      } else if (expression.includes('Sum')) {
        result = '12345.67';
      } else if (expression === '1 + 1') {
        result = '2';
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(result);
    });
  }

  private getMockDataForTable(table: string, params: URLSearchParams): any[] {
    const limit = parseInt(params.get('limit') || '100');
    const start = parseInt(params.get('start') || '0');
    const filter = params.get('search') || '';

    // Generate mock data based on table
    let data: any[];
    switch (table.toLowerCase()) {
      case 'account':
        data = this.generateAccounts();
        break;
      
      case 'transaction':
        data = this.generateTransactions();
        break;
      
      case 'name':
        data = this.generateNames();
        break;
      
      case 'product':
        data = this.generateProducts();
        break;
      
      default:
        return [];
    }

    // Apply filter if provided
    if (filter) {
      data = this.applyFilter(data, filter);
    }

    // Apply pagination
    return data.slice(start, start + limit);
  }

  private applyFilter(data: any[], filter: string): any[] {
    // Handle complex expressions with parentheses and AND/OR
    if (filter.includes(' AND ') || filter.includes(' OR ')) {
      return data.filter(item => this.evaluateComplexFilter(item, filter));
    }
    
    // Simple filter parser for tests
    const match = filter.match(/(\w+)\s*=\s*"([^"]+)"/);
    if (match) {
      const [, field, value] = match;
      return data.filter(item => item[field] === value);
    }
    
    // Handle LIKE operator
    const likeMatch = filter.match(/(\w+)\s+LIKE\s+"([^"]+)"/);
    if (likeMatch) {
      const [, field, pattern] = likeMatch;
      const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i');
      return data.filter(item => regex.test(String(item[field] || '')));
    }
    
    // Handle comparison operators
    const compMatch = filter.match(/(\w+)\s*([><=]+)\s*(\d+)/);
    if (compMatch) {
      const [, field, op, value] = compMatch;
      const numValue = parseFloat(value);
      return data.filter(item => {
        const itemValue = parseFloat(item[field] || '0');
        switch (op) {
          case '>': return itemValue > numValue;
          case '<': return itemValue < numValue;
          case '>=': return itemValue >= numValue;
          case '<=': return itemValue <= numValue;
          case '=': return itemValue === numValue;
          default: return false;
        }
      });
    }
    
    return data;
  }

  private evaluateComplexFilter(item: any, filter: string): boolean {
    // Handle parentheses by extracting and evaluating inner expressions first
    let workingFilter = filter;
    
    // Replace function calls with dummy values for testing
    workingFilter = workingFilter.replace(/CurrentPeriod\(\)/g, '12');
    
    // Extract parenthetical expressions
    const parenMatch = workingFilter.match(/\(([^)]+)\)/);
    if (parenMatch) {
      const innerExpr = parenMatch[1];
      const innerResult = this.evaluateComplexFilter(item, innerExpr);
      workingFilter = workingFilter.replace(parenMatch[0], innerResult ? 'TRUE' : 'FALSE');
    }
    
    // Handle AND
    if (workingFilter.includes(' AND ')) {
      const parts = workingFilter.split(' AND ');
      return parts.every(part => this.evaluateSingleCondition(item, part.trim()));
    }
    
    // Handle OR
    if (workingFilter.includes(' OR ')) {
      const parts = workingFilter.split(' OR ');
      return parts.some(part => this.evaluateSingleCondition(item, part.trim()));
    }
    
    // Single condition
    return this.evaluateSingleCondition(item, workingFilter);
  }

  private evaluateSingleCondition(item: any, condition: string): boolean {
    // Handle TRUE/FALSE from evaluated expressions
    if (condition === 'TRUE') return true;
    if (condition === 'FALSE') return false;
    
    // Handle equality
    const eqMatch = condition.match(/(\w+)\s*=\s*"([^"]+)"/);
    if (eqMatch) {
      const [, field, value] = eqMatch;
      return item[field] === value;
    }
    
    // Handle numeric comparisons
    const compMatch = condition.match(/(\w+)\s*([><=]+)\s*(\d+)/);
    if (compMatch) {
      const [, field, op, value] = compMatch;
      const numValue = parseFloat(value);
      const itemValue = parseFloat(item[field] || '0');
      switch (op) {
        case '>': return itemValue > numValue;
        case '<': return itemValue < numValue;
        case '>=': return itemValue >= numValue;
        case '<=': return itemValue <= numValue;
        case '=': return itemValue === numValue;
        default: return false;
      }
    }
    
    return false;
  }

  private generateAccounts(): any[] {
    return [
      { Code: 'ACCT-REC', Description: 'Accounts Receivable', Type: 'CA', Balance: '25000.00' },
      { Code: 'BANK-CHQ', Description: 'Checking Account', Type: 'BA', Balance: '10000.00' },
      { Code: 'EXP-WAGES', Description: 'Wages Expense', Type: 'EX', Balance: '30000.00' },
      { Code: 'SALES-PROD', Description: 'Product Sales', Type: 'IN', Balance: '-50000.00' },
    ];
  }

  private generateTransactions(): any[] {
    return [
      { SequenceNumber: '1001', Type: 'DI', TransDate: '20240101', Description: 'Invoice #1001', Gross: '1100.00' },
      { SequenceNumber: '1002', Type: 'DC', TransDate: '20240102', Description: 'Credit Note #2001', Gross: '550.00' },
      { SequenceNumber: '1003', Type: 'DP', TransDate: '20240103', Description: 'Payment Received', Gross: '1100.00' },
      { SequenceNumber: '1004', Type: 'DI', TransDate: '20240104', Description: 'Invoice #1002', Gross: '2200.00' },
      { SequenceNumber: '1005', Type: 'CI', TransDate: '20240105', Description: 'Supplier Invoice #3001', Gross: '750.00' },
    ];
  }

  private generateNames(): any[] {
    return [
      { Code: 'CUST-001', Name: 'ABC Company', CustomerType: 1, SupplierType: 0, Balance: '1000.00' },
      { Code: 'CUST-002', Name: 'XYZ Corporation', CustomerType: 1, SupplierType: 0, Balance: '2500.00' },
      { Code: 'SUPP-001', Name: 'Acme Supplies', CustomerType: 0, SupplierType: 1, Balance: '-500.00' },
      { Code: 'SUPP-002', Name: 'Office Depot', CustomerType: 0, SupplierType: 1, Balance: '-750.00' },
      { Code: 'BOTH-001', Name: 'Contractor Inc', CustomerType: 1, SupplierType: 1, Balance: '100.00' },
    ];
  }

  private generateProducts(): any[] {
    return [
      { Code: 'PROD-001', Description: 'Standard Product', SellPrice: '100.00', BuyPrice: '60.00' },
      { Code: 'PROD-002', Description: 'Service Item', SellPrice: '150.00', BuyPrice: '0.00' },
    ];
  }

  private convertToXML(table: string, data: any[]): string {
    const tableLower = table.toLowerCase();
    let xml = `<?xml version="1.0"?>\n<export>\n  <table name="${table}">\n`;
    
    for (const record of data) {
      xml += `    <${tableLower}>\n`;
      for (const [key, value] of Object.entries(record)) {
        xml += `      <${key}>${this.escapeXML(String(value))}</${key}>\n`;
      }
      xml += `    </${tableLower}>\n`;
    }
    
    xml += '  </table>\n</export>';
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
  
  private convertToTSV(data: any[]): string {
    if (data.length === 0) return '';
    
    // Get headers from first record
    const headers = Object.keys(data[0]);
    const rows = data.map(record => 
      headers.map(header => String(record[header] || '')).join('\t')
    );
    
    return rows.join('\n');
  }
}