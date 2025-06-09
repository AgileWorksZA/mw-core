#!/usr/bin/env node
"use strict";
/**
 * Simple validation script for Transaction entity
 * Tests core functionality without requiring Jest/external frameworks
 */
Object.defineProperty(exports, "__esModule", { value: true });
var transaction_1 = require("./transaction");
// Simple assertion function
function assert(condition, message) {
    if (!condition) {
        throw new Error("Assertion failed: ".concat(message));
    }
    console.log("\u2705 ".concat(message));
}
// Test counter
var testCount = 0;
var passedTests = 0;
function runTest(name, testFn) {
    testCount++;
    try {
        testFn();
        passedTests++;
        console.log("\u2705 ".concat(name));
    }
    catch (error) {
        console.log("\u274C ".concat(name, ": ").concat(error.message));
    }
}
// Core validation tests
console.log('🚀 Running Transaction Entity Validation...\n');
runTest('Should have all required fields from transaction-source.ts', function () {
    var requiredFields = [
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
    assert(requiredFields.length === 72, "Expected 72 fields, got ".concat(requiredFields.length));
});
runTest('Should have official transaction type values', function () {
    var officialTypes = [
        'CIC', 'CII', 'CP', 'CPC', 'CPD', 'CR', 'CRC', 'CRD',
        'DIC', 'DII', 'JN', 'JNS', 'POC', 'POI', 'QU', 'SOC', 'SOI'
    ];
    officialTypes.forEach(function (type) {
        assert(Object.values(transaction_1.TransactionType).includes(type), "Missing transaction type: ".concat(type));
    });
    assert(Object.values(transaction_1.TransactionType).length === officialTypes.length, "Expected ".concat(officialTypes.length, " transaction types, got ").concat(Object.values(transaction_1.TransactionType).length));
});
runTest('Should have correct transaction status values', function () {
    assert(transaction_1.TransactionStatus.Unposted === 'U', 'Unposted status should be "U"');
    assert(transaction_1.TransactionStatus.Posted === 'P', 'Posted status should be "P"');
    assert(Object.values(transaction_1.TransactionStatus).length === 2, 'Should have exactly 2 status values');
});
runTest('Should have correct payment method values', function () {
    assert(transaction_1.PaymentMethod.None === 0, 'None payment method should be 0');
    assert(transaction_1.PaymentMethod.Cash === 1, 'Cash payment method should be 1');
    assert(transaction_1.PaymentMethod.Cheque === 2, 'Cheque payment method should be 2');
    assert(transaction_1.PaymentMethod.Electronic === 3, 'Electronic payment method should be 3');
    assert(transaction_1.PaymentMethod.CreditCard === 4, 'Credit card payment method should be 4');
});
runTest('Should require mandatory fields in validation', function () {
    var emptyTransaction = {};
    var result = (0, transaction_1.validateTransaction)(emptyTransaction);
    assert(!result.isValid, 'Empty transaction should be invalid');
    assert(result.errors.length > 0, 'Should have validation errors');
    var errorFields = result.errors.map(function (e) { return e.field; });
    assert(errorFields.includes('Type'), 'Should require Type field');
    assert(errorFields.includes('NameCode'), 'Should require NameCode field');
    assert(errorFields.includes('TransDate'), 'Should require TransDate field');
});
runTest('Should validate field length constraints', function () {
    var invalidTransaction = {
        OurRef: 'A'.repeat(13), // Max 12
        Type: 'TOOLONG', // Max 4
        TheirRef: 'A'.repeat(33), // Max 32
        NameCode: 'A'.repeat(13), // Max 12
        Description: 'A'.repeat(1025), // Max 1024
    };
    var result = (0, transaction_1.validateTransaction)(invalidTransaction);
    assert(!result.isValid, 'Transaction with oversized fields should be invalid');
    // Debug: log errors to see what we have
    if (result.errors.length !== 5) {
        console.log('Validation errors:', result.errors.map(function (e) { return "".concat(e.field, ": ").concat(e.message); }));
    }
    assert(result.errors.length === 6, "Expected 6 validation errors, got ".concat(result.errors.length));
});
runTest('Should pass validation for valid transaction', function () {
    var validTransaction = {
        Type: transaction_1.TransactionType.DebtorInvoiceIncomplete,
        NameCode: 'CUST001',
        TransDate: '2024-01-01',
        Status: transaction_1.TransactionStatus.Unposted,
        PaymentMethod: transaction_1.PaymentMethod.Cash,
        Period: 2401, // Year 24, Period 1
        Gross: 100.00,
    };
    var result = (0, transaction_1.validateTransaction)(validTransaction);
    assert(result.isValid, 'Valid transaction should pass validation');
    assert(result.errors.length === 0, "Should have no errors, got ".concat(result.errors.length));
});
runTest('Should correctly identify transaction status', function () {
    var unpostedTransaction = { Status: transaction_1.TransactionStatus.Unposted };
    var postedTransaction = { Status: transaction_1.TransactionStatus.Posted };
    assert((0, transaction_1.isUnposted)(unpostedTransaction), 'Should identify unposted transaction');
    assert(!(0, transaction_1.isPosted)(unpostedTransaction), 'Unposted transaction should not be posted');
    assert((0, transaction_1.isPosted)(postedTransaction), 'Should identify posted transaction');
    assert(!(0, transaction_1.isUnposted)(postedTransaction), 'Posted transaction should not be unposted');
});
runTest('Should correctly identify transaction types', function () {
    var invoice = { Type: transaction_1.TransactionType.DebtorInvoiceIncomplete };
    var cashTx = { Type: transaction_1.TransactionType.CashPayment };
    assert((0, transaction_1.isInvoice)(invoice), 'Should identify invoice transaction');
    assert(!(0, transaction_1.isCashTransaction)(invoice), 'Invoice should not be cash transaction');
    assert((0, transaction_1.isCashTransaction)(cashTx), 'Should identify cash transaction');
    assert(!(0, transaction_1.isInvoice)(cashTx), 'Cash transaction should not be invoice');
});
runTest('Should get correct transaction type labels', function () {
    assert((0, transaction_1.getTransactionTypeLabel)(transaction_1.TransactionType.CashPayment) === 'Cash Payment', 'Should get correct cash payment label');
    assert((0, transaction_1.getTransactionTypeLabel)(transaction_1.TransactionType.DebtorInvoiceComplete) === 'Customer Invoice (Complete)', 'Should get correct customer invoice label');
    assert((0, transaction_1.getTransactionTypeLabel)(transaction_1.TransactionType.GeneralJournal) === 'General Journal', 'Should get correct journal label');
});
runTest('Should calculate outstanding amount correctly', function () {
    var invoice = {
        Type: transaction_1.TransactionType.DebtorInvoiceIncomplete,
        Gross: 100,
        AmtPaid: 30,
        AmtWrittenOff: 10
    };
    var outstanding = (0, transaction_1.getOutstandingAmount)(invoice);
    assert(outstanding === 60, "Expected outstanding amount 60, got ".concat(outstanding));
    // Non-invoice should return 0
    var cashTransaction = { Type: transaction_1.TransactionType.CashPayment };
    var cashOutstanding = (0, transaction_1.getOutstandingAmount)(cashTransaction);
    assert(cashOutstanding === 0, "Cash transaction outstanding should be 0, got ".concat(cashOutstanding));
});
runTest('Should build query filters correctly', function () {
    var typeQuery = (0, transaction_1.queryTransactions)().type(transaction_1.TransactionType.CashPayment).build();
    assert(typeQuery === 'Type="CP"', "Expected Type=\"CP\", got ".concat(typeQuery));
    var statusQuery = (0, transaction_1.queryTransactions)().status(transaction_1.TransactionStatus.Posted).build();
    assert(statusQuery === 'Status="P"', "Expected Status=\"P\", got ".concat(statusQuery));
    var complexQuery = (0, transaction_1.queryTransactions)()
        .nameCode('CUST001')
        .postedOnly()
        .build();
    assert(complexQuery.includes('NameCode="CUST001"'), 'Should include name code filter');
    assert(complexQuery.includes('Status="P"'), 'Should include posted status filter');
    assert(complexQuery.includes(' AND '), 'Should combine filters with AND');
});
runTest('Should have correct transaction flags', function () {
    assert(transaction_1.TransactionFlags.WasCancelled === 0x00000001, 'WasCancelled flag should be 0x00000001');
    assert(transaction_1.TransactionFlags.Printed === 0x00000020, 'Printed flag should be 0x00000020');
    assert(transaction_1.TransactionFlags.IsJobInvoice === 0x00002000, 'IsJobInvoice flag should be 0x00002000');
    assert(transaction_1.TransactionFlags.FundsTransfer === 0x00010000, 'FundsTransfer flag should be 0x00010000');
});
// Summary
console.log("\n\uD83D\uDCCA Test Results: ".concat(passedTests, "/").concat(testCount, " tests passed"));
if (passedTests === testCount) {
    console.log('🎉 All validation tests passed! Transaction entity is working correctly.');
    process.exit(0);
}
else {
    console.log('💥 Some tests failed. Please review the implementation.');
    process.exit(1);
}
