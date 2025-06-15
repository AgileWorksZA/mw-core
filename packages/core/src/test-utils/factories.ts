/**
 * Test data factories for generating consistent test data
 */

import type { Account } from '../tables/accounts';
import type { Transaction } from '../tables/transactions';
import type { Name } from '../tables/names';
import type { Product } from '../tables/products';

let sequenceCounter = 1000;

/**
 * Reset sequence counter for tests
 */
export function resetSequence() {
  sequenceCounter = 1000;
}

/**
 * Get next sequence number
 */
function nextSequence(): number {
  return ++sequenceCounter;
}

/**
 * Account factory
 */
export function createAccount(overrides: Partial<Account> = {}): Account {
  const defaults: Account = {
    sequenceNumber: nextSequence(),
    code: `TEST-${nextSequence()}`,
    description: 'Test Account',
    type: 'BA',
    inactive: false,
    parentAccount: '',
    accountingType: 0,
    currencyCode: 'AUD',
    colour: 0,
    displayOrder: 0,
    balance: 0,
    foreignBalance: 0,
    enteredBalance: 0,
    //... other fields with defaults
  };

  return { ...defaults, ...overrides } as Account;
}

/**
 * Transaction factory
 */
export function createTransaction(overrides: Partial<Transaction> = {}): Transaction {
  const defaults: Transaction = {
    sequenceNumber: nextSequence(),
    type: 'DI',
    transDate: '20240101',
    period: 1,
    fromAccount: 'BANK-001',
    toAccount: 'SALES-001',
    description: 'Test Transaction',
    nameCode: 'CUST-001',
    gross: 100,
    tax: 10,
    net: 90,
    ourReference: `INV-${nextSequence()}`,
    theirReference: '',
    status: 0, // Unposted
    transactionMode: 0,
    currencyCode: 'AUD',
    exchangeRate: 1,
    foreignGross: 100,
    posted: false,
    //... other fields
  };

  return { ...defaults, ...overrides } as Transaction;
}

/**
 * Name (Customer/Supplier) factory
 */
export function createName(overrides: Partial<Name> = {}): Name {
  const isCustomer = overrides.type === 'C' || !overrides.type;
  
  const defaults: Name = {
    sequenceNumber: nextSequence(),
    code: `${isCustomer ? 'CUST' : 'SUPP'}-${nextSequence()}`,
    name: `Test ${isCustomer ? 'Customer' : 'Supplier'} ${nextSequence()}`,
    type: isCustomer ? 'C' : 'S',
    inactive: false,
    address1: '123 Test Street',
    address2: 'Test Suburb',
    address3: '',
    address4: 'Test City',
    postcode: '1234',
    phone: '555-1234',
    mobile: '555-5678',
    fax: '',
    email: 'test@example.com',
    webURL: '',
    contactName: 'Test Contact',
    abn: '',
    balance: 0,
    creditLimit: 1000,
    discount: 0,
    paymentTerms: 30,
    taxCode: 'STD',
    holdStatus: 0,
    //... other fields
  };

  return { ...defaults, ...overrides } as Name;
}

/**
 * Product factory
 */
export function createProduct(overrides: Partial<Product> = {}): Product {
  const defaults: Product = {
    sequenceNumber: nextSequence(),
    code: `PROD-${nextSequence()}`,
    description: 'Test Product',
    comment: 'Test product for unit tests',
    inactive: false,
    ledgerCode: 'SALES-001',
    sellUnit: 'EA',
    sellPrice: 100,
    sellPriceB: 90,
    sellPriceC: 85,
    sellPriceD: 80,
    sellPriceE: 75,
    sellPriceF: 70,
    sellTaxCode: 'STD',
    buyUnit: 'EA',
    buyPrice: 60,
    buyAccount: 'PURCHASES',
    minimumStock: 10,
    maximumStock: 100,
    type: 0, // Normal product
    productGroup: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
    barcode: '',
    //... other fields
  };

  return { ...defaults, ...overrides } as Product;
}

/**
 * Create a batch of test records
 */
export function createBatch<T>(
  factory: (overrides?: Partial<T>) => T,
  count: number,
  overridesOrFunction?: Partial<T> | ((index: number) => Partial<T>)
): T[] {
  const results: T[] = [];
  
  for (let i = 0; i < count; i++) {
    const overrides = typeof overridesOrFunction === 'function'
      ? overridesOrFunction(i)
      : overridesOrFunction || {};
      
    results.push(factory(overrides));
  }
  
  return results;
}

/**
 * Create related test data (e.g., invoice with payment)
 */
export const scenarios = {
  /**
   * Create an invoice with a payment
   */
  invoiceWithPayment: () => {
    const customer = createName({ type: 'C', code: 'CUST-PAID' });
    const invoice = createTransaction({
      type: 'DI',
      nameCode: customer.code,
      gross: 1100,
      tax: 100,
      net: 1000,
      status: 1, // Posted
    });
    const payment = createTransaction({
      type: 'DP',
      nameCode: customer.code,
      gross: 1100,
      linkedTransaction: invoice.sequenceNumber,
      status: 1, // Posted
    });
    
    return { customer, invoice, payment };
  },

  /**
   * Create a purchase order workflow
   */
  purchaseWorkflow: () => {
    const supplier = createName({ type: 'S', code: 'SUPP-FLOW' });
    const product = createProduct({ code: 'PROD-FLOW' });
    const order = createTransaction({
      type: 'PO',
      nameCode: supplier.code,
      status: 0, // Unposted
    });
    const invoice = createTransaction({
      type: 'CI',
      nameCode: supplier.code,
      linkedTransaction: order.sequenceNumber,
      status: 1, // Posted
    });
    
    return { supplier, product, order, invoice };
  },

  /**
   * Create accounts with parent-child relationships
   */
  accountHierarchy: () => {
    const parent = createAccount({
      code: 'PARENT-001',
      description: 'Parent Account',
      type: 'AS', // Asset header
    });
    const child1 = createAccount({
      code: 'CHILD-001',
      description: 'Child Account 1',
      type: 'CA',
      parentAccount: parent.code,
    });
    const child2 = createAccount({
      code: 'CHILD-002',
      description: 'Child Account 2',
      type: 'CA',
      parentAccount: parent.code,
    });
    
    return { parent, children: [child1, child2] };
  }
};

/**
 * Special test cases
 */
export const edgeCases = {
  /**
   * Maximum length fields
   */
  maxLengthAccount: () => createAccount({
    code: 'A'.repeat(15), // Max account code length
    description: 'D'.repeat(255), // Max description length
  }),

  /**
   * Special characters
   */
  specialCharsName: () => createName({
    name: 'Test & <Special> "Chars" Co.',
    address1: "Line with 'quotes' and & symbols",
  }),

  /**
   * Unicode characters
   */
  unicodeName: () => createName({
    name: '测试客户 🎉',
    contactName: 'François Müller',
  }),

  /**
   * Zero and negative values
   */
  zeroTransaction: () => createTransaction({
    gross: 0,
    tax: 0,
    net: 0,
  }),

  /**
   * Large numbers
   */
  largeTransaction: () => createTransaction({
    gross: 999999999.99,
    tax: 99999999.99,
    net: 900000000.00,
  }),
};