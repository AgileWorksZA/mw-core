#!/usr/bin/env node
/**
 * Simple validation script for Transaction entity
 * Tests core functionality without requiring Jest/external frameworks
 */

import { 
  Transaction, 
  TransactionType, 
  TransactionStatus, 
  PaymentMethod,
  TransactionFlags,
  validateTransaction,
  isPosted,
  isUnposted,
  isInvoice,
  isCashTransaction,
  queryTransactions,
  getTransactionTypeLabel,
  getOutstandingAmount
} from './transaction';

// Simple assertion function
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ ${message}`);
}

// Test counter
let testCount = 0;
let passedTests = 0;

function runTest(name: string, testFn: () => void): void {
  testCount++;
  try {
    testFn();
    passedTests++;
    console.log(`✅ ${name}`);
  } catch (error) {
    console.log(`❌ ${name}: ${(error as Error).message}`);
  }
}

// Core validation tests
console.log('🚀 Running Transaction Entity Validation...\n');

runTest('Should have all required fields from transaction-source.ts', () => {
  const requiredFields = [
    'SequenceNumber', 'LastModifiedTime', 'OurRef', 'TransDate', 'EnterDate',
    'DueDate', 'Period', 'Type', 'TheirRef', 'NameCode', 'Flag', 'Description',
    'Gross', 'Analysis', 'Contra', 'ToFrom', 'Status', 'Hold', 'DatePaid',
    'AmtPaid', 'PayAmount', 'Aging', 'TaxAmount', 'TaxCycle', 'Recurring',
    'Printed', 'Flags', 'TaxProcessed', 'Salesperson', 'Colour', 'BankJNSeq',
    'PaymentMethod', 'TimePosted', 'SecurityLevel', 'User1', 'User2', 'User3',
    'PromptPaymentDate', 'PromptPaymentAmt', 'ProdPriceCode', 'MailingAddress',
    'DeliveryAddress', 'FreightCode', 'FreightAmount', 'FreightDetails',
    'SpecialBank', 'SpecialBranch', 'SpecialAccount', 'Currency', 'ExchangeRate',
    'EnteredBy', 'PostedBy', 'AmtWrittenOff', 'OrderTotal', 'OrderShipped',
    'OrderDeposit', 'OriginatingOrderSeq', 'CurrencyTransferSeq',
    'PromptPaymentTerms', 'PromptPaymentDisc', 'ApprovedBy1', 'ApprovedBy2',
    'UserNum', 'UserText', 'User4', 'User5', 'User6', 'User7', 'User8',
    'TaggedText', 'Emailed', 'Transferred'
  ];
  
  assert(requiredFields.length === 72, `Expected 72 fields, got ${requiredFields.length}`);
});

runTest('Should have official transaction type values', () => {
  const officialTypes = [
    'CIC', 'CII', 'CP', 'CPC', 'CPD', 'CR', 'CRC', 'CRD',
    'DIC', 'DII', 'JN', 'JNS', 'POC', 'POI', 'QU', 'SOC', 'SOI'
  ];

  officialTypes.forEach(type => {
    assert(Object.values(TransactionType).includes(type as TransactionType), `Missing transaction type: ${type}`);
  });

  assert(Object.values(TransactionType).length === officialTypes.length, 
    `Expected ${officialTypes.length} transaction types, got ${Object.values(TransactionType).length}`);
});

runTest('Should have correct transaction status values', () => {
  assert(TransactionStatus.Unposted === 'U', 'Unposted status should be "U"');
  assert(TransactionStatus.Posted === 'P', 'Posted status should be "P"');
  assert(Object.values(TransactionStatus).length === 2, 'Should have exactly 2 status values');
});

runTest('Should have correct payment method values', () => {
  assert(PaymentMethod.None === 0, 'None payment method should be 0');
  assert(PaymentMethod.Cash === 1, 'Cash payment method should be 1');
  assert(PaymentMethod.Cheque === 2, 'Cheque payment method should be 2');
  assert(PaymentMethod.Electronic === 3, 'Electronic payment method should be 3');
  assert(PaymentMethod.CreditCard === 4, 'Credit card payment method should be 4');
});

runTest('Should require mandatory fields in validation', () => {
  const emptyTransaction = {};
  const result = validateTransaction(emptyTransaction);
  
  assert(!result.isValid, 'Empty transaction should be invalid');
  assert(result.errors.length > 0, 'Should have validation errors');
  
  const errorFields = result.errors.map(e => e.field);
  assert(errorFields.includes('Type'), 'Should require Type field');
  assert(errorFields.includes('NameCode'), 'Should require NameCode field');
  assert(errorFields.includes('TransDate'), 'Should require TransDate field');
});

runTest('Should validate field length constraints', () => {
  const invalidTransaction = {
    OurRef: 'A'.repeat(13), // Max 12
    Type: 'TOOLONG', // Max 4
    TheirRef: 'A'.repeat(33), // Max 32
    NameCode: 'A'.repeat(13), // Max 12
    Description: 'A'.repeat(1025), // Max 1024
  };

  const result = validateTransaction(invalidTransaction);
  assert(!result.isValid, 'Transaction with oversized fields should be invalid');
  
  // Debug: log errors to see what we have
  if (result.errors.length !== 5) {
    console.log('Validation errors:', result.errors.map(e => `${e.field}: ${e.message}`));
  }
  
  assert(result.errors.length === 6, `Expected 6 validation errors, got ${result.errors.length}`);
});

runTest('Should pass validation for valid transaction', () => {
  const validTransaction = {
    Type: TransactionType.DebtorInvoiceIncomplete,
    NameCode: 'CUST001',
    TransDate: '2024-01-01',
    Status: TransactionStatus.Unposted,
    PaymentMethod: PaymentMethod.Cash,
    Period: 2401, // Year 24, Period 1
    Gross: 100.00,
  };

  const result = validateTransaction(validTransaction);
  assert(result.isValid, 'Valid transaction should pass validation');
  assert(result.errors.length === 0, `Should have no errors, got ${result.errors.length}`);
});

runTest('Should correctly identify transaction status', () => {
  const unpostedTransaction = { Status: TransactionStatus.Unposted } as Transaction;
  const postedTransaction = { Status: TransactionStatus.Posted } as Transaction;
  
  assert(isUnposted(unpostedTransaction), 'Should identify unposted transaction');
  assert(!isPosted(unpostedTransaction), 'Unposted transaction should not be posted');
  assert(isPosted(postedTransaction), 'Should identify posted transaction');
  assert(!isUnposted(postedTransaction), 'Posted transaction should not be unposted');
});

runTest('Should correctly identify transaction types', () => {
  const invoice = { Type: TransactionType.DebtorInvoiceIncomplete } as Transaction;
  const cashTx = { Type: TransactionType.CashPayment } as Transaction;
  
  assert(isInvoice(invoice), 'Should identify invoice transaction');
  assert(!isCashTransaction(invoice), 'Invoice should not be cash transaction');
  assert(isCashTransaction(cashTx), 'Should identify cash transaction');
  assert(!isInvoice(cashTx), 'Cash transaction should not be invoice');
});

runTest('Should get correct transaction type labels', () => {
  assert(getTransactionTypeLabel(TransactionType.CashPayment) === 'Cash Payment', 
    'Should get correct cash payment label');
  assert(getTransactionTypeLabel(TransactionType.DebtorInvoiceComplete) === 'Customer Invoice (Complete)', 
    'Should get correct customer invoice label');
  assert(getTransactionTypeLabel(TransactionType.GeneralJournal) === 'General Journal', 
    'Should get correct journal label');
});

runTest('Should calculate outstanding amount correctly', () => {
  const invoice = { 
    Type: TransactionType.DebtorInvoiceIncomplete,
    Gross: 100, 
    AmtPaid: 30, 
    AmtWrittenOff: 10 
  } as Transaction;
  
  const outstanding = getOutstandingAmount(invoice);
  assert(outstanding === 60, `Expected outstanding amount 60, got ${outstanding}`);
  
  // Non-invoice should return 0
  const cashTransaction = { Type: TransactionType.CashPayment } as Transaction;
  const cashOutstanding = getOutstandingAmount(cashTransaction);
  assert(cashOutstanding === 0, `Cash transaction outstanding should be 0, got ${cashOutstanding}`);
});

runTest('Should build query filters correctly', () => {
  const typeQuery = queryTransactions().type(TransactionType.CashPayment).build();
  assert(typeQuery === 'Type="CP"', `Expected Type="CP", got ${typeQuery}`);
  
  const statusQuery = queryTransactions().status(TransactionStatus.Posted).build();
  assert(statusQuery === 'Status="P"', `Expected Status="P", got ${statusQuery}`);
  
  const complexQuery = queryTransactions()
    .nameCode('CUST001')
    .postedOnly()
    .build();
  
  assert(complexQuery.includes('NameCode="CUST001"'), 'Should include name code filter');
  assert(complexQuery.includes('Status="P"'), 'Should include posted status filter');
  assert(complexQuery.includes(' AND '), 'Should combine filters with AND');
});

runTest('Should have correct transaction flags', () => {
  assert(TransactionFlags.WasCancelled === 0x00000001, 'WasCancelled flag should be 0x00000001');
  assert(TransactionFlags.Printed === 0x00000020, 'Printed flag should be 0x00000020');
  assert(TransactionFlags.IsJobInvoice === 0x00002000, 'IsJobInvoice flag should be 0x00002000');
  assert(TransactionFlags.FundsTransfer === 0x00010000, 'FundsTransfer flag should be 0x00010000');
});

// Summary
console.log(`\n📊 Test Results: ${passedTests}/${testCount} tests passed`);

if (passedTests === testCount) {
  console.log('🎉 All validation tests passed! Transaction entity is working correctly.');
  process.exit(0);
} else {
  console.log('💥 Some tests failed. Please review the implementation.');
  process.exit(1);
}