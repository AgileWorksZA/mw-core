/**
 * Example helpers for MCP tool descriptions
 */

export const accountExamples = {
  listAll: '{"operation": "list"}',
  listActive: '{"operation": "list", "includeInactive": false}',
  getByCode: '{"operation": "get", "code": "1000"}',
  searchBank: '{"operation": "search", "query": "bank"}',
  countExpenses: '{"operation": "count", "accountType": "expense"}',
};

export const transactionExamples = {
  recent: '{"operation": "recent", "days": 7}',
  getById: '{"operation": "get", "sequenceNumber": 12345}',
  outstanding: '{"operation": "outstanding", "type": "sales"}',
  search: '{"operation": "search", "query": "ABC Corp"}',
};

export const nameExamples = {
  listCustomers: '{"operation": "list", "type": "customer"}',
  getContact: '{"operation": "get", "code": "CUST001"}',
  searchEmail: '{"operation": "find", "email": "john@example.com"}',
  creditCheck: '{"operation": "credit", "code": "CUST001"}',
};

export const buildExamples = {
  listBuilds: '{"operation": "list", "limit": 20}',
  getBOM: '{"operation": "bom", "productCode": "WIDGET-001"}',
  variance: '{"operation": "variance", "minVariance": 100}',
};

export const coreExamples = {
  getSchema: '{"category": "schema", "operation": "getTableSchema", "table": "Account"}',
  calculate: '{"category": "calculation", "operation": "calculate", "expression": "Sum(Account.Balance)"}',
  validate: '{"category": "validation", "operation": "validateField", "table": "Name", "field": "Email", "value": "test@example.com"}',
};

export const ticketExamples = {
  logError: '{"operation": "create", "type": "error", "tool": "account_operations", "error": "Invalid filter"}',
  listOpen: '{"operation": "list", "status": "open"}',
  getStats: '{"operation": "stats", "groupBy": "tool"}',
};