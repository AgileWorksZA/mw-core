/**
 * Test data factories for generating consistent test data
 */

import type { AccountCamel } from '../tables/accounts';
import { AccountType } from '../tables/accounts';
import type { TransactionCamel } from '../tables/transactions';
import { TransactionType, TransactionStatus } from '../tables/transactions';
import type { NameCamel } from '../tables/names';
import { NameType } from '../tables/names';
import type { ProductCamel } from '../tables/products';
import { ProductType } from '../tables/products';

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
    type: AccountType.CurrentAsset,
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
    type: TransactionType.DebtorInvoice,
    transDate: '20240101',
    period: 1,
    description: 'Test Transaction',
    nameCode: 'CUST-001',
    gross: 100,
    taxAmount: 10,
    net: 90,
    ourRef: `INV-${nextSequence()}`,
    theirRef: '',
    status: TransactionStatus.Unposted,
    currency: 'AUD',
    exchangeRate: 1,
  };

  return { ...defaults, ...overrides };
}

/**
 * Name (Customer/Supplier) factory
 */
export function createName(overrides: Partial<NameCamel> = {}): NameCamel {
  const isCustomer = overrides.customerType === NameType.Customer || overrides.customerType === undefined;
  
  const defaults: NameCamel = {
    code: `${isCustomer ? 'CUST' : 'SUPP'}-${nextSequence()}`,
    name: `Test ${isCustomer ? 'Customer' : 'Supplier'} ${nextSequence()}`,
    customerType: isCustomer ? NameType.Customer : NameType.Both,
    address1: '123 Test Street',
    address2: 'Test Suburb',
    address3: '',
    address4: 'Test City',
    phone: '555-1234',
    fax: '',
    email: 'test@example.com',
    contact: 'Test Contact',
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
    sellUnit: 'EA',
    sellPrice: 100,
    sellPriceB: 90,
    sellPriceC: 85,
    sellPriceD: 80,
    sellPriceE: 75,
    sellPriceF: 70,
    buyUnit: 'EA',
    buyPrice: 60,
    type: ProductType.Product,
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
    const customer = createName({ customerType: NameType.Customer, code: 'CUST-PAID' });
    const invoice = createTransaction({
      type: TransactionType.DebtorInvoice,
      nameCode: customer.code,
      gross: 1100,
      taxAmount: 100,
      net: 1000,
      status: TransactionStatus.Posted,
    });
    const payment = createTransaction({
      type: TransactionType.CashReceipt,
      nameCode: customer.code,
      gross: 1100,
      status: TransactionStatus.Posted,
    });
    
    return { customer, invoice, payment };
  },

  /**
   * Create a purchase order workflow
   */
  purchaseWorkflow: () => {
    const supplier = createName({ customerType: NameType.Both, code: 'SUPP-FLOW' });
    const product = createProduct({ code: 'PROD-FLOW' });
    const order = createTransaction({
      type: TransactionType.PurchaseOrder,
      nameCode: supplier.code,
      status: TransactionStatus.Unposted,
    });
    const invoice = createTransaction({
      type: TransactionType.CreditorInvoice,
      nameCode: supplier.code,
      status: TransactionStatus.Posted,
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
      type: AccountType.FixedAsset, // Asset header
    });
    const child1 = createAccount({
      code: 'CHILD-001',
      description: 'Child Account 1',
      type: AccountType.CurrentAsset,
    });
    const child2 = createAccount({
      code: 'CHILD-002',
      description: 'Child Account 2',
      type: AccountType.CurrentAsset,
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
  }),

  /**
   * Zero and negative values
   */
  zeroTransaction: () => createTransaction({
    gross: 0,
    taxAmount: 0,
    net: 0,
  }),

  /**
   * Large numbers
   */
  largeTransaction: () => createTransaction({
    gross: 999999999.99,
    taxAmount: 99999999.99,
    net: 900000000.00,
  }),
};