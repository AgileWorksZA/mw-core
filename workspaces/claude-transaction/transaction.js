"use strict";
/**
 * MoneyWorks Transaction Entity - Generated from Official Documentation
 * Source: https://cognito.co.nz/manual/moneyworks_appendix_transactions.html
 *
 * Represents financial transactions in MoneyWorks including invoices, payments, orders, and journals
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionQueryBuilder = exports.JournalType = exports.TransactionFlags = exports.ProductPricingLevel = exports.PaymentMethod = exports.TransactionStatus = exports.TransactionType = void 0;
exports.isPosted = isPosted;
exports.isUnposted = isUnposted;
exports.isOnHold = isOnHold;
exports.isInvoice = isInvoice;
exports.isCashTransaction = isCashTransaction;
exports.isOrder = isOrder;
exports.isJournal = isJournal;
exports.hasFlag = hasFlag;
exports.getTransactionTypeLabel = getTransactionTypeLabel;
exports.getPaymentMethodLabel = getPaymentMethodLabel;
exports.getOutstandingAmount = getOutstandingAmount;
exports.validateTransaction = validateTransaction;
exports.queryTransactions = queryTransactions;
exports.isCustomerInvoice = isCustomerInvoice;
exports.isSupplierInvoice = isSupplierInvoice;
exports.hasPaymentInfo = hasPaymentInfo;
// ============================================================================
// ENUMS - Semantic Types from Documentation
// ============================================================================
/** Transaction type classification */
var TransactionType;
(function (TransactionType) {
    /** Creditor invoice - fully paid */
    TransactionType["CreditorInvoiceComplete"] = "CIC";
    /** Creditor invoice - incomplete */
    TransactionType["CreditorInvoiceIncomplete"] = "CII";
    /** Cash payment/purchase */
    TransactionType["CashPayment"] = "CP";
    /** Cash payment for a creditor invoice */
    TransactionType["CashPaymentCreditor"] = "CPC";
    /** Returned refund to debtor */
    TransactionType["CashPaymentDebtorRefund"] = "CPD";
    /** Cash receipt/sale */
    TransactionType["CashReceipt"] = "CR";
    /** Receive refund from creditor */
    TransactionType["CashReceiptCreditorRefund"] = "CRC";
    /** Receipt for a debtor invoice */
    TransactionType["CashReceiptDebtor"] = "CRD";
    /** Debtor invoice - fully paid */
    TransactionType["DebtorInvoiceComplete"] = "DIC";
    /** Debtor invoice - incomplete */
    TransactionType["DebtorInvoiceIncomplete"] = "DII";
    /** General journal */
    TransactionType["GeneralJournal"] = "JN";
    /** Stock journal */
    TransactionType["StockJournal"] = "JNS";
    /** Purchase order (complete) - Bought */
    TransactionType["PurchaseOrderComplete"] = "POC";
    /** Purchase order (incomplete) */
    TransactionType["PurchaseOrderIncomplete"] = "POI";
    /** Quote */
    TransactionType["Quote"] = "QU";
    /** Sales order (complete) - Sold */
    TransactionType["SalesOrderComplete"] = "SOC";
    /** Sales order (incomplete) */
    TransactionType["SalesOrderIncomplete"] = "SOI";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
/** Transaction status codes */
var TransactionStatus;
(function (TransactionStatus) {
    /** Unposted transaction */
    TransactionStatus["Unposted"] = "U";
    /** Posted transaction */
    TransactionStatus["Posted"] = "P";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
/** Payment method types */
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod[PaymentMethod["None"] = 0] = "None";
    PaymentMethod[PaymentMethod["Cash"] = 1] = "Cash";
    PaymentMethod[PaymentMethod["Cheque"] = 2] = "Cheque";
    PaymentMethod[PaymentMethod["Electronic"] = 3] = "Electronic";
    PaymentMethod[PaymentMethod["CreditCard"] = 4] = "CreditCard";
    PaymentMethod[PaymentMethod["UserDefined1"] = 5] = "UserDefined1";
    PaymentMethod[PaymentMethod["UserDefined2"] = 6] = "UserDefined2";
    PaymentMethod[PaymentMethod["UserDefined3"] = 7] = "UserDefined3";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
/** Product pricing levels for transactions */
var ProductPricingLevel;
(function (ProductPricingLevel) {
    ProductPricingLevel["A"] = "A";
    ProductPricingLevel["B"] = "B";
    ProductPricingLevel["C"] = "C";
    ProductPricingLevel["D"] = "D";
    ProductPricingLevel["E"] = "E";
    ProductPricingLevel["F"] = "F";
})(ProductPricingLevel || (exports.ProductPricingLevel = ProductPricingLevel = {}));
/** Transaction flags - bit-mapped field */
var TransactionFlags;
(function (TransactionFlags) {
    /** Was cancelled */
    TransactionFlags[TransactionFlags["WasCancelled"] = 1] = "WasCancelled";
    /** Is cancellation */
    TransactionFlags[TransactionFlags["IsCancellation"] = 2] = "IsCancellation";
    /** Was written off */
    TransactionFlags[TransactionFlags["WasWrittenOff"] = 4] = "WasWrittenOff";
    /** Creditor reimburse */
    TransactionFlags[TransactionFlags["CreditorReimburse"] = 8] = "CreditorReimburse";
    /** Debtor reimburse */
    TransactionFlags[TransactionFlags["DebtorReimburse"] = 16] = "DebtorReimburse";
    /** Printed */
    TransactionFlags[TransactionFlags["Printed"] = 32] = "Printed";
    /** Is writeoff dummy */
    TransactionFlags[TransactionFlags["IsWriteoffDummy"] = 64] = "IsWriteoffDummy";
    /** Is contra dummy */
    TransactionFlags[TransactionFlags["IsContraDummy"] = 128] = "IsContraDummy";
    /** Not on statement */
    TransactionFlags[TransactionFlags["NotOnStatement"] = 2048] = "NotOnStatement";
    /** Is banking journal */
    TransactionFlags[TransactionFlags["IsBankingJournal"] = 4096] = "IsBankingJournal";
    /** Is job invoice */
    TransactionFlags[TransactionFlags["IsJobInvoice"] = 8192] = "IsJobInvoice";
    /** Changed after posting */
    TransactionFlags[TransactionFlags["ChangedAfterPosting"] = 16384] = "ChangedAfterPosting";
    /** Prompt discount taken */
    TransactionFlags[TransactionFlags["PromptDiscountTaken"] = 32768] = "PromptDiscountTaken";
    /** Funds transfer */
    TransactionFlags[TransactionFlags["FundsTransfer"] = 65536] = "FundsTransfer";
    /** Is discount credit note */
    TransactionFlags[TransactionFlags["IsDiscountCreditNote"] = 131072] = "IsDiscountCreditNote";
    /** Is writeoff credit note */
    TransactionFlags[TransactionFlags["IsWriteoffCreditNote"] = 262144] = "IsWriteoffCreditNote";
    /** Is new style sales tax */
    TransactionFlags[TransactionFlags["IsNewStyleSalesTax"] = 524288] = "IsNewStyleSalesTax";
    /** Has scan */
    TransactionFlags[TransactionFlags["HasScan"] = 1048576] = "HasScan";
    /** Has outstanding stock receipts */
    TransactionFlags[TransactionFlags["HasOutstandingStockReceipts"] = 2097152] = "HasOutstandingStockReceipts";
    /** PPD terms locked */
    TransactionFlags[TransactionFlags["PPDTermsLocked"] = 4194304] = "PPDTermsLocked";
    /** Is deposit on order */
    TransactionFlags[TransactionFlags["IsDepositOnOrder"] = 8388608] = "IsDepositOnOrder";
    /** Imported transaction */
    TransactionFlags[TransactionFlags["ImportedTransaction"] = 16777216] = "ImportedTransaction";
    /** Is a recurred transaction */
    TransactionFlags[TransactionFlags["IsRecurredTransaction"] = 134217728] = "IsRecurredTransaction";
})(TransactionFlags || (exports.TransactionFlags = TransactionFlags = {}));
/** Journal type classification */
var JournalType;
(function (JournalType) {
    JournalType[JournalType["General"] = 0] = "General";
    JournalType[JournalType["Make"] = 1] = "Make";
    JournalType[JournalType["Break"] = 2] = "Break";
    JournalType[JournalType["WriteOff"] = 4] = "WriteOff";
    JournalType[JournalType["Create"] = 5] = "Create";
    JournalType[JournalType["Transfer"] = 6] = "Transfer";
    JournalType[JournalType["Revaluation"] = 7] = "Revaluation";
})(JournalType || (exports.JournalType = JournalType = {}));
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/** Check if a transaction is posted */
function isPosted(transaction) {
    return transaction.Status === TransactionStatus.Posted;
}
/** Check if a transaction is unposted */
function isUnposted(transaction) {
    return transaction.Status === TransactionStatus.Unposted;
}
/** Check if a transaction is on hold */
function isOnHold(transaction) {
    return transaction.Hold;
}
/** Check if a transaction is an invoice */
function isInvoice(transaction) {
    return transaction.Type.startsWith("DI") || transaction.Type.startsWith("CI");
}
/** Check if a transaction is a cash transaction */
function isCashTransaction(transaction) {
    return transaction.Type.startsWith("CP") || transaction.Type.startsWith("CR");
}
/** Check if a transaction is an order */
function isOrder(transaction) {
    return transaction.Type.startsWith("PO") || transaction.Type.startsWith("SO");
}
/** Check if a transaction is a journal */
function isJournal(transaction) {
    return transaction.Type.startsWith("JN");
}
/** Check if a transaction has a specific flag */
function hasFlag(transaction, flag) {
    return (transaction.Flags & flag) !== 0;
}
/** Get human-readable transaction type */
function getTransactionTypeLabel(type) {
    switch (type) {
        case TransactionType.CashPayment: return "Cash Payment";
        case TransactionType.CashReceipt: return "Cash Receipt";
        case TransactionType.DebtorInvoiceComplete: return "Customer Invoice (Complete)";
        case TransactionType.DebtorInvoiceIncomplete: return "Customer Invoice (Incomplete)";
        case TransactionType.CreditorInvoiceComplete: return "Supplier Invoice (Complete)";
        case TransactionType.CreditorInvoiceIncomplete: return "Supplier Invoice (Incomplete)";
        case TransactionType.GeneralJournal: return "General Journal";
        case TransactionType.StockJournal: return "Stock Journal";
        case TransactionType.PurchaseOrderComplete: return "Purchase Order (Complete)";
        case TransactionType.PurchaseOrderIncomplete: return "Purchase Order (Incomplete)";
        case TransactionType.SalesOrderComplete: return "Sales Order (Complete)";
        case TransactionType.SalesOrderIncomplete: return "Sales Order (Incomplete)";
        case TransactionType.Quote: return "Quote";
        default: return "Unknown";
    }
}
/** Get human-readable payment method */
function getPaymentMethodLabel(method) {
    switch (method) {
        case PaymentMethod.None: return "None";
        case PaymentMethod.Cash: return "Cash";
        case PaymentMethod.Cheque: return "Cheque";
        case PaymentMethod.Electronic: return "Electronic";
        case PaymentMethod.CreditCard: return "Credit Card";
        case PaymentMethod.UserDefined1: return "User Defined 1";
        case PaymentMethod.UserDefined2: return "User Defined 2";
        case PaymentMethod.UserDefined3: return "User Defined 3";
        default: return "Unknown";
    }
}
/** Calculate outstanding amount for an invoice */
function getOutstandingAmount(transaction) {
    if (!isInvoice(transaction)) {
        return 0;
    }
    return transaction.Gross - transaction.AmtPaid - transaction.AmtWrittenOff;
}
/** Validate a Transaction object against MoneyWorks constraints */
function validateTransaction(transaction) {
    var errors = [];
    // Required fields
    if (!transaction.Type) {
        errors.push({ field: "Type", message: "Transaction type is required", value: transaction.Type });
    }
    if (!transaction.NameCode) {
        errors.push({ field: "NameCode", message: "Name code is required", value: transaction.NameCode });
    }
    if (!transaction.TransDate) {
        errors.push({ field: "TransDate", message: "Transaction date is required", value: transaction.TransDate });
    }
    // Field length validations
    if (transaction.OurRef && transaction.OurRef.length > 12) {
        errors.push({ field: "OurRef", message: "OurRef cannot exceed 12 characters", value: transaction.OurRef });
    }
    if (transaction.Type && transaction.Type.length > 4) {
        errors.push({ field: "Type", message: "Type cannot exceed 4 characters", value: transaction.Type });
    }
    if (transaction.TheirRef && transaction.TheirRef.length > 32) {
        errors.push({ field: "TheirRef", message: "TheirRef cannot exceed 32 characters", value: transaction.TheirRef });
    }
    if (transaction.NameCode && transaction.NameCode.length > 12) {
        errors.push({ field: "NameCode", message: "NameCode cannot exceed 12 characters", value: transaction.NameCode });
    }
    if (transaction.Description && transaction.Description.length > 1024) {
        errors.push({ field: "Description", message: "Description cannot exceed 1024 characters", value: transaction.Description });
    }
    // Enum validations
    if (transaction.Status && ![TransactionStatus.Unposted, TransactionStatus.Posted].includes(transaction.Status)) {
        errors.push({ field: "Status", message: "Invalid transaction status", value: transaction.Status });
    }
    if (transaction.PaymentMethod !== undefined && !Object.values(PaymentMethod).includes(transaction.PaymentMethod)) {
        errors.push({ field: "PaymentMethod", message: "Invalid payment method", value: transaction.PaymentMethod });
    }
    // Business logic validations
    if (transaction.Gross !== undefined && transaction.Gross < 0 && !isJournal(transaction)) {
        errors.push({ field: "Gross", message: "Gross amount cannot be negative for non-journal transactions", value: transaction.Gross });
    }
    if (transaction.Period !== undefined && (transaction.Period < 101 || transaction.Period > 9912)) {
        errors.push({ field: "Period", message: "Period must be between 101 and 9912 (format: 100*year+period)", value: transaction.Period });
    }
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
// ============================================================================
// QUERY BUILDERS
// ============================================================================
var TransactionQueryBuilder = /** @class */ (function () {
    function TransactionQueryBuilder() {
        this.conditions = [];
    }
    /** Filter by transaction type */
    TransactionQueryBuilder.prototype.type = function (type) {
        this.conditions.push("Type=\"".concat(type, "\""));
        return this;
    };
    /** Filter by transaction status */
    TransactionQueryBuilder.prototype.status = function (status) {
        this.conditions.push("Status=\"".concat(status, "\""));
        return this;
    };
    /** Filter by name code */
    TransactionQueryBuilder.prototype.nameCode = function (code) {
        this.conditions.push("NameCode=\"".concat(code, "\""));
        return this;
    };
    /** Filter by transaction reference */
    TransactionQueryBuilder.prototype.ourRef = function (ref) {
        this.conditions.push("OurRef=\"".concat(ref, "\""));
        return this;
    };
    /** Filter by date range */
    TransactionQueryBuilder.prototype.dateRange = function (from, to) {
        this.conditions.push("TransDate>=\"".concat(from, "\" AND TransDate<=\"").concat(to, "\""));
        return this;
    };
    /** Filter by period */
    TransactionQueryBuilder.prototype.period = function (period) {
        this.conditions.push("Period=".concat(period));
        return this;
    };
    /** Filter by hold status */
    TransactionQueryBuilder.prototype.onHold = function (hold) {
        if (hold === void 0) { hold = true; }
        this.conditions.push("Hold=".concat(hold ? "True" : "False"));
        return this;
    };
    /** Filter posted transactions only */
    TransactionQueryBuilder.prototype.postedOnly = function () {
        this.conditions.push("Status=\"P\"");
        return this;
    };
    /** Filter unposted transactions only */
    TransactionQueryBuilder.prototype.unpostedOnly = function () {
        this.conditions.push("Status=\"U\"");
        return this;
    };
    /** Filter invoices only */
    TransactionQueryBuilder.prototype.invoicesOnly = function () {
        this.conditions.push("(Type LIKE \"DI%\" OR Type LIKE \"CI%\")");
        return this;
    };
    /** Filter cash transactions only */
    TransactionQueryBuilder.prototype.cashOnly = function () {
        this.conditions.push("(Type LIKE \"CP%\" OR Type LIKE \"CR%\")");
        return this;
    };
    /** Filter orders only */
    TransactionQueryBuilder.prototype.ordersOnly = function () {
        this.conditions.push("(Type LIKE \"PO%\" OR Type LIKE \"SO%\")");
        return this;
    };
    /** Filter by gross amount range */
    TransactionQueryBuilder.prototype.grossAmountRange = function (min, max) {
        this.conditions.push("Gross>=".concat(min, " AND Gross<=").concat(max));
        return this;
    };
    /** Build the search expression */
    TransactionQueryBuilder.prototype.build = function () {
        return this.conditions.join(" AND ");
    };
    return TransactionQueryBuilder;
}());
exports.TransactionQueryBuilder = TransactionQueryBuilder;
/** Create a new transaction query builder */
function queryTransactions() {
    return new TransactionQueryBuilder();
}
// ============================================================================
// TYPE GUARDS
// ============================================================================
/** Type guard to check if a transaction is a customer invoice */
function isCustomerInvoice(transaction) {
    return transaction.Type !== undefined && transaction.Type.startsWith("DI");
}
/** Type guard to check if a transaction is a supplier invoice */
function isSupplierInvoice(transaction) {
    return transaction.Type !== undefined && transaction.Type.startsWith("CI");
}
/** Type guard to check if a transaction has payment information */
function hasPaymentInfo(transaction) {
    return transaction.PaymentMethod !== undefined && transaction.PaymentMethod !== PaymentMethod.None;
}
