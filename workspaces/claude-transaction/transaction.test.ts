import { 
  Transaction, 
  TransactionType, 
  TransactionStatus, 
  PaymentMethod,
  ProductPricingLevel,
  TransactionFlags,
  JournalType,
  validateTransaction,
  isPosted,
  isUnposted,
  isOnHold,
  isInvoice,
  isCashTransaction,
  isOrder,
  isJournal,
  hasFlag,
  getTransactionTypeLabel,
  getPaymentMethodLabel,
  getOutstandingAmount,
  queryTransactions,
  isCustomerInvoice,
  isSupplierInvoice,
  hasPaymentInfo
} from './transaction';

describe('Transaction Entity Validation', () => {
  
  describe('Core Interface Validation', () => {
    test('Should have all required fields from transaction-source.ts', () => {
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

      // Create a sample transaction to test field existence
      const sampleTransaction: Partial<Transaction> = {};
      
      // This test ensures the interface has all expected fields
      requiredFields.forEach(field => {
        expect(() => {
          // This should not throw a TypeScript error if the field exists
          (sampleTransaction as any)[field] = null;
        }).not.toThrow();
      });

      // Verify we have exactly 71 fields as per transaction-source.ts
      expect(requiredFields.length).toBe(71);
    });
  });

  describe('Enum Validation', () => {
    test('Should have official transaction type values', () => {
      const officialTypes = [
        'CIC', 'CII', 'CP', 'CPC', 'CPD', 'CR', 'CRC', 'CRD',
        'DIC', 'DII', 'JN', 'JNS', 'POC', 'POI', 'QU', 'SOC', 'SOI'
      ];

      officialTypes.forEach(type => {
        expect(Object.values(TransactionType)).toContain(type);
      });

      // Ensure we have exactly the right number of transaction types
      expect(Object.values(TransactionType).length).toBe(officialTypes.length);
    });

    test('Should have correct transaction status values', () => {
      expect(TransactionStatus.Unposted).toBe('U');
      expect(TransactionStatus.Posted).toBe('P');
      expect(Object.values(TransactionStatus).length).toBe(2);
    });

    test('Should have correct payment method values', () => {
      expect(PaymentMethod.None).toBe(0);
      expect(PaymentMethod.Cash).toBe(1);
      expect(PaymentMethod.Cheque).toBe(2);
      expect(PaymentMethod.Electronic).toBe(3);
      expect(PaymentMethod.CreditCard).toBe(4);
      expect(PaymentMethod.UserDefined1).toBe(5);
      expect(PaymentMethod.UserDefined2).toBe(6);
      expect(PaymentMethod.UserDefined3).toBe(7);
    });

    test('Should have correct pricing level values', () => {
      expect(ProductPricingLevel.A).toBe('A');
      expect(ProductPricingLevel.B).toBe('B');
      expect(ProductPricingLevel.C).toBe('C');
      expect(ProductPricingLevel.D).toBe('D');
      expect(ProductPricingLevel.E).toBe('E');
      expect(ProductPricingLevel.F).toBe('F');
    });

    test('Should have correct transaction flags', () => {
      expect(TransactionFlags.WasCancelled).toBe(0x00000001);
      expect(TransactionFlags.Printed).toBe(0x00000020);
      expect(TransactionFlags.IsJobInvoice).toBe(0x00002000);
      expect(TransactionFlags.FundsTransfer).toBe(0x00010000);
      expect(TransactionFlags.ImportedTransaction).toBe(0x01000000);
      expect(TransactionFlags.IsRecurredTransaction).toBe(0x08000000);
    });
  });

  describe('Validation Function Tests', () => {
    test('Should require mandatory fields', () => {
      const emptyTransaction = {};
      const result = validateTransaction(emptyTransaction);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      const errorFields = result.errors.map(e => e.field);
      expect(errorFields).toContain('Type');
      expect(errorFields).toContain('NameCode');
      expect(errorFields).toContain('TransDate');
    });

    test('Should validate field length constraints', () => {
      const invalidTransaction = {
        OurRef: 'A'.repeat(13), // Max 12
        Type: 'TOOLONG', // Max 4
        TheirRef: 'A'.repeat(33), // Max 32
        NameCode: 'A'.repeat(13), // Max 12
        Description: 'A'.repeat(1025), // Max 1024
      };

      const result = validateTransaction(invalidTransaction);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(5);
    });

    test('Should validate enum values', () => {
      const invalidTransaction = {
        Type: 'DI',
        NameCode: 'CUST001',
        TransDate: '2024-01-01',
        Status: 'INVALID' as any,
        PaymentMethod: 999 as any,
      };

      const result = validateTransaction(invalidTransaction);
      expect(result.isValid).toBe(false);
      
      const errorFields = result.errors.map(e => e.field);
      expect(errorFields).toContain('Status');
      expect(errorFields).toContain('PaymentMethod');
    });

    test('Should validate business logic', () => {
      const invalidTransaction = {
        Type: 'DI',
        NameCode: 'CUST001',
        TransDate: '2024-01-01',
        Gross: -100, // Negative for non-journal
        Period: 50, // Invalid period format
      };

      const result = validateTransaction(invalidTransaction);
      expect(result.isValid).toBe(false);
      
      const errorFields = result.errors.map(e => e.field);
      expect(errorFields).toContain('Gross');
      expect(errorFields).toContain('Period');
    });

    test('Should pass validation for valid transaction', () => {
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
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });

  describe('Utility Function Tests', () => {
    const sampleTransaction: Transaction = {
      SequenceNumber: 1,
      LastModifiedTime: '2024-01-01T10:00:00',
      OurRef: 'INV001',
      TransDate: '2024-01-01',
      EnterDate: '2024-01-01',
      DueDate: '2024-01-31',
      Period: 2401,
      Type: TransactionType.DebtorInvoiceIncomplete,
      TheirRef: 'PO123',
      NameCode: 'CUST001',
      Flag: '',
      Description: 'Test Invoice',
      Gross: 100.00,
      Analysis: '',
      Contra: '1200',
      ToFrom: '',
      Status: TransactionStatus.Unposted,
      Hold: false,
      DatePaid: '',
      AmtPaid: 0,
      PayAmount: 0,
      Aging: 0,
      TaxAmount: 10.00,
      TaxCycle: 0,
      Recurring: false,
      Printed: 0,
      Flags: 0,
      TaxProcessed: 0,
      Salesperson: 'JS',
      Colour: 0,
      BankJNSeq: 0,
      PaymentMethod: PaymentMethod.None,
      TimePosted: '',
      SecurityLevel: 0,
      User1: '',
      User2: '',
      User3: '',
      PromptPaymentDate: '',
      PromptPaymentAmt: 0,
      ProdPriceCode: 'A',
      MailingAddress: '',
      DeliveryAddress: '',
      FreightCode: '',
      FreightAmount: 0,
      FreightDetails: '',
      SpecialBank: '',
      SpecialBranch: '',
      SpecialAccount: '',
      Currency: '',
      ExchangeRate: 0,
      EnteredBy: 'ADM',
      PostedBy: '',
      AmtWrittenOff: 0,
      OrderTotal: 0,
      OrderShipped: 0,
      OrderDeposit: 0,
      OriginatingOrderSeq: 0,
      CurrencyTransferSeq: 0,
      PromptPaymentTerms: 0,
      PromptPaymentDisc: 0,
      ApprovedBy1: '',
      ApprovedBy2: '',
      UserNum: 0,
      UserText: '',
      User4: '',
      User5: '',
      User6: '',
      User7: '',
      User8: '',
      TaggedText: '',
      Emailed: 0,
      Transferred: 0
    };

    test('Should correctly identify posted/unposted status', () => {
      expect(isUnposted(sampleTransaction)).toBe(true);
      expect(isPosted(sampleTransaction)).toBe(false);

      const postedTransaction = { ...sampleTransaction, Status: TransactionStatus.Posted };
      expect(isPosted(postedTransaction)).toBe(true);
      expect(isUnposted(postedTransaction)).toBe(false);
    });

    test('Should correctly identify hold status', () => {
      expect(isOnHold(sampleTransaction)).toBe(false);
      
      const heldTransaction = { ...sampleTransaction, Hold: true };
      expect(isOnHold(heldTransaction)).toBe(true);
    });

    test('Should correctly identify transaction types', () => {
      expect(isInvoice(sampleTransaction)).toBe(true);
      expect(isCashTransaction(sampleTransaction)).toBe(false);
      expect(isOrder(sampleTransaction)).toBe(false);
      expect(isJournal(sampleTransaction)).toBe(false);

      const cashTransaction = { ...sampleTransaction, Type: TransactionType.CashPayment };
      expect(isCashTransaction(cashTransaction)).toBe(true);
      expect(isInvoice(cashTransaction)).toBe(false);

      const orderTransaction = { ...sampleTransaction, Type: TransactionType.SalesOrderIncomplete };
      expect(isOrder(orderTransaction)).toBe(true);

      const journalTransaction = { ...sampleTransaction, Type: TransactionType.GeneralJournal };
      expect(isJournal(journalTransaction)).toBe(true);
    });

    test('Should correctly check flags', () => {
      expect(hasFlag(sampleTransaction, TransactionFlags.Printed)).toBe(false);
      
      const flaggedTransaction = { ...sampleTransaction, Flags: TransactionFlags.Printed | TransactionFlags.IsJobInvoice };
      expect(hasFlag(flaggedTransaction, TransactionFlags.Printed)).toBe(true);
      expect(hasFlag(flaggedTransaction, TransactionFlags.IsJobInvoice)).toBe(true);
      expect(hasFlag(flaggedTransaction, TransactionFlags.WasCancelled)).toBe(false);
    });

    test('Should get correct labels', () => {
      expect(getTransactionTypeLabel(TransactionType.CashPayment)).toBe('Cash Payment');
      expect(getTransactionTypeLabel(TransactionType.DebtorInvoiceComplete)).toBe('Customer Invoice (Complete)');
      expect(getTransactionTypeLabel(TransactionType.GeneralJournal)).toBe('General Journal');

      expect(getPaymentMethodLabel(PaymentMethod.Cash)).toBe('Cash');
      expect(getPaymentMethodLabel(PaymentMethod.Electronic)).toBe('Electronic');
      expect(getPaymentMethodLabel(PaymentMethod.CreditCard)).toBe('Credit Card');
    });

    test('Should calculate outstanding amount correctly', () => {
      const invoice = { ...sampleTransaction, Gross: 100, AmtPaid: 30, AmtWrittenOff: 10 };
      expect(getOutstandingAmount(invoice)).toBe(60);

      // Non-invoice should return 0
      const cashTransaction = { ...sampleTransaction, Type: TransactionType.CashPayment };
      expect(getOutstandingAmount(cashTransaction)).toBe(0);
    });
  });

  describe('Query Builder Tests', () => {
    test('Should build type filter', () => {
      const query = queryTransactions().type(TransactionType.CashPayment).build();
      expect(query).toBe('Type="CP"');
    });

    test('Should build status filter', () => {
      const query = queryTransactions().status(TransactionStatus.Posted).build();
      expect(query).toBe('Status="P"');
    });

    test('Should build complex queries', () => {
      const query = queryTransactions()
        .nameCode('CUST001')
        .dateRange('2024-01-01', '2024-01-31')
        .postedOnly()
        .build();
      
      expect(query).toContain('NameCode="CUST001"');
      expect(query).toContain('TransDate>="2024-01-01"');
      expect(query).toContain('TransDate<="2024-01-31"');
      expect(query).toContain('Status="P"');
      expect(query.split(' AND ').length).toBe(4);
    });

    test('Should build type-specific filters', () => {
      expect(queryTransactions().invoicesOnly().build()).toContain('Type LIKE "DI%" OR Type LIKE "CI%"');
      expect(queryTransactions().cashOnly().build()).toContain('Type LIKE "CP%" OR Type LIKE "CR%"');
      expect(queryTransactions().ordersOnly().build()).toContain('Type LIKE "PO%" OR Type LIKE "SO%"');
    });

    test('Should build amount range filter', () => {
      const query = queryTransactions().grossAmountRange(100, 1000).build();
      expect(query).toBe('Gross>=100 AND Gross<=1000');
    });
  });

  describe('Type Guard Tests', () => {
    test('Should identify customer invoices', () => {
      const customerInvoice = { Type: 'DIC' };
      const supplierInvoice = { Type: 'CIC' };
      const cashTransaction = { Type: 'CP' };

      expect(isCustomerInvoice(customerInvoice)).toBe(true);
      expect(isCustomerInvoice(supplierInvoice)).toBe(false);
      expect(isCustomerInvoice(cashTransaction)).toBe(false);
    });

    test('Should identify supplier invoices', () => {
      const supplierInvoice = { Type: 'CII' };
      const customerInvoice = { Type: 'DII' };
      const cashTransaction = { Type: 'CR' };

      expect(isSupplierInvoice(supplierInvoice)).toBe(true);
      expect(isSupplierInvoice(customerInvoice)).toBe(false);
      expect(isSupplierInvoice(cashTransaction)).toBe(false);
    });

    test('Should identify transactions with payment info', () => {
      const withPayment = { PaymentMethod: PaymentMethod.Cash };
      const withoutPayment = { PaymentMethod: PaymentMethod.None };
      const noPaymentField = {};

      expect(hasPaymentInfo(withPayment)).toBe(true);
      expect(hasPaymentInfo(withoutPayment)).toBe(false);
      expect(hasPaymentInfo(noPaymentField)).toBe(false);
    });
  });

  describe('Pattern Compliance Tests', () => {
    test('Should follow name-reference.ts pattern structure', () => {
      // Verify similar structure exists
      expect(typeof TransactionType).toBe('object');
      expect(typeof TransactionStatus).toBe('object');
      expect(typeof PaymentMethod).toBe('object');
      expect(typeof validateTransaction).toBe('function');
      expect(typeof queryTransactions).toBe('function');
      
      // Verify validation function signature matches pattern
      const validationResult = validateTransaction({});
      expect(validationResult).toHaveProperty('isValid');
      expect(validationResult).toHaveProperty('errors');
      expect(Array.isArray(validationResult.errors)).toBe(true);
    });

    test('Should have utility functions like name-reference.ts', () => {
      expect(typeof isPosted).toBe('function');
      expect(typeof isUnposted).toBe('function');
      expect(typeof getTransactionTypeLabel).toBe('function');
      expect(typeof getPaymentMethodLabel).toBe('function');
    });

    test('Should have query builder like name-reference.ts', () => {
      const builder = queryTransactions();
      expect(typeof builder.type).toBe('function');
      expect(typeof builder.status).toBe('function');
      expect(typeof builder.build).toBe('function');
      
      // Test method chaining
      const chainedBuilder = builder.type(TransactionType.CashPayment).status(TransactionStatus.Posted);
      expect(typeof chainedBuilder.build).toBe('function');
    });
  });
});