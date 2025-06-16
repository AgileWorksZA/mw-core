/**
 * Test data factories for generating consistent test data
 */

import type { AccountCamel } from '../tables/accounts';
import type { TransactionCamel } from '../tables/transactions';
import type { NameCamel } from '../tables/names';
import type { ProductCamel } from '../tables/products';

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
export function createAccount(overrides: Partial<AccountCamel> = {}): AccountCamel {
  const defaults: AccountCamel = {
    code: `TEST-${nextSequence()}`,
    description: 'Test Account',
    type: 'BA' as any, // AccountType.CurrentAsset
    // Optional fields with sensible defaults
    system: '  ' as any,
    currency: 'AUD',
    balance: 0,
    balanceF: 0,
    localBalance: 0,
    colour: 0 as any,
    hidden: false,
    flags: 0,
  };

  return { ...defaults, ...overrides };
}

/**
 * Transaction factory
 */
export function createTransaction(overrides: Partial<TransactionCamel> = {}): TransactionCamel {
  const defaults: TransactionCamel = {
    sequenceNumber: nextSequence(),
    type: 'DI' as any,
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
    mode: 0,
    currency: 'AUD',
    exchangeRate: 1,
    grossF: 100,
    taxF: 10,
    netF: 90,
    posted: 0,
  };

  return { ...defaults, ...overrides };
}

/**
 * Name (Customer/Supplier) factory
 */
export function createName(overrides: Partial<NameCamel> = {}): NameCamel {
  const isCustomer = overrides.type === 'C' || !overrides.type;
  
  const defaults: NameCamel = {
    code: `${isCustomer ? 'CUST' : 'SUPP'}-${nextSequence()}`,
    name: `Test ${isCustomer ? 'Customer' : 'Supplier'} ${nextSequence()}`,
    type: isCustomer ? 'C' : 'S' as any,
    active: 1,
    address1: '123 Test Street',
    address2: 'Test Suburb',
    address3: '',
    address4: 'Test City',
    postcode: '1234',
    phone1: '555-1234',
    phone2: '555-5678',
    fax: '',
    email: 'test@example.com',
    webURL: '',
    contact: 'Test Contact',
    aBN: '',
    balance: 0,
    creditLimit: 1000,
    discount: 0,
    paymentTerms: 30,
    taxCode: 'STD',
    hold: 0,
  };

  return { ...defaults, ...overrides };
}

/**
 * Product factory
 */
export function createProduct(overrides: Partial<ProductCamel> = {}): ProductCamel {
  const defaults: ProductCamel = {
    code: `PROD-${nextSequence()}`,
    description: 'Test Product',
    comment: 'Test product for unit tests',
    active: 1,
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
  };

  return { ...defaults, ...overrides };
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
      linkedSeq: invoice.sequenceNumber,
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
      linkedSeq: order.sequenceNumber,
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
    code: 'A'.repeat(7), // Max account code length
    description: 'D'.repeat(39), // Max description length
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