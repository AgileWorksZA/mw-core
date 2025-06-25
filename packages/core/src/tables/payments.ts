/**
 * MoneyWorks Payments Table Interface
 *
 * Many-to-many link between payments and invoices.
 * No explicit primary key field.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_payments_file.html
 */

// Import types from other tables if needed
// import type { Transaction } from './transactions';
// import type { Name } from './names';

// High bit mask for overpayment indicator in InvoiceID
const OVERPAYMENT_HIGH_BIT = 2147483648;

/**
 * Raw MoneyWorks Payments record with PascalCase field names
 */
export interface Payments {
  /** Date and time record was last changed */
  LastModifiedTime: string;

  /** Sequence number of payment/receipt */
  CashTrans: number;

  /**
   * Links invoice to payment.
   * For debtor overpayments, stores namecode with high bit set.
   * To get actual namecode when overpayment: add OVERPAYMENT_HIGH_BIT
   */
  InvoiceID: number;

  /** Amount of receipt allocated to invoice */
  Amount: number;

  /**
   * Tax cycle when receipt processed for GST/VAT/Tax.
   * Negative if processed on invoice/accruals basis.
   */
  GSTCycle: number;
}

/**
 * CamelCase version of Payments record
 */
export interface PaymentsCamel {
  lastModifiedTime: string;
  cashTrans: number;
  invoiceId: number;
  amount: number;
  gstCycle: number;
}

/**
 * Payment relationship types
 */
export enum PaymentType {
  /** Normal payment allocation to invoice */
  NORMAL = "NORMAL",
  /** Overpayment (InvoiceID has high bit set) */
  OVERPAYMENT = "OVERPAYMENT",
}

/**
 * GST processing basis
 */
export enum GSTBasis {
  /** Cash basis (positive GSTCycle) */
  CASH = "CASH",
  /** Invoice/accruals basis (negative GSTCycle) */
  INVOICE = "INVOICE",
}

/**
 * Convert raw Payments record to camelCase
 */
export function paymentsToCamel(raw: Payments): PaymentsCamel {
  return {
    lastModifiedTime: raw.LastModifiedTime,
    cashTrans: raw.CashTrans,
    invoiceId: raw.InvoiceID,
    amount: raw.Amount,
    gstCycle: raw.GSTCycle,
  };
}

/**
 * Convert camelCase to raw Payments record
 */
export function paymentsFromCamel(camel: PaymentsCamel): Payments {
  return {
    LastModifiedTime: camel.lastModifiedTime,
    CashTrans: camel.cashTrans,
    InvoiceID: camel.invoiceId,
    Amount: camel.amount,
    GSTCycle: camel.gstCycle,
  };
}

/**
 * Check if payment is an overpayment
 */
export function isOverpayment(invoiceId: number): boolean {
  return invoiceId >= OVERPAYMENT_HIGH_BIT;
}

/**
 * Get the actual name code from an overpayment InvoiceID
 */
export function getNameCodeFromOverpayment(
  invoiceId: number,
): number | undefined {
  if (!isOverpayment(invoiceId)) {
    return undefined;
  }
  return invoiceId - OVERPAYMENT_HIGH_BIT;
}

/**
 * Create an overpayment InvoiceID from a name code
 */
export function createOverpaymentId(nameCode: number): number {
  return nameCode + OVERPAYMENT_HIGH_BIT;
}

/**
 * Get payment type from InvoiceID
 */
export function getPaymentType(invoiceId: number): PaymentType {
  return isOverpayment(invoiceId)
    ? PaymentType.OVERPAYMENT
    : PaymentType.NORMAL;
}

/**
 * Get GST basis from GSTCycle
 */
export function getGSTBasis(gstCycle: number): GSTBasis {
  return gstCycle < 0 ? GSTBasis.INVOICE : GSTBasis.CASH;
}

/**
 * Get absolute GST cycle value (removes negative for invoice basis)
 */
export function getAbsoluteGSTCycle(gstCycle: number): number {
  return Math.abs(gstCycle);
}

/**
 * Extended payment information with resolved references
 */
export interface PaymentInfo {
  payment: PaymentsCamel;
  paymentType: PaymentType;
  gstBasis: GSTBasis;
  absoluteGstCycle: number;
  nameCode?: number; // For overpayments
}

/**
 * Get extended payment information
 */
export function getPaymentInfo(payment: Payments | PaymentsCamel): PaymentInfo {
  const camelPayment =
    "InvoiceID" in payment ? paymentsToCamel(payment) : payment;

  const info: PaymentInfo = {
    payment: camelPayment,
    paymentType: getPaymentType(camelPayment.invoiceId),
    gstBasis: getGSTBasis(camelPayment.gstCycle),
    absoluteGstCycle: getAbsoluteGSTCycle(camelPayment.gstCycle),
  };

  if (info.paymentType === PaymentType.OVERPAYMENT) {
    info.nameCode = getNameCodeFromOverpayment(camelPayment.invoiceId);
  }

  return info;
}

/**
 * Query builder for Payments
 */
export class PaymentsQuery {
  private parts: string[] = [];

  /**
   * Filter by cash transaction
   */
  byCashTrans(cashTrans: number): this {
    this.parts.push(`CashTrans=${cashTrans}`);
    return this;
  }

  /**
   * Filter by invoice ID
   */
  byInvoiceId(invoiceId: number): this {
    this.parts.push(`InvoiceID=${invoiceId}`);
    return this;
  }

  /**
   * Filter by amount
   */
  byAmount(amount: number): this {
    this.parts.push(`Amount=${amount}`);
    return this;
  }

  /**
   * Filter by GST cycle
   */
  byGSTCycle(cycle: number): this {
    this.parts.push(`GSTCycle=${cycle}`);
    return this;
  }

  /**
   * Filter by overpayments only
   */
  overpayments(): this {
    this.parts.push(`InvoiceID>=${OVERPAYMENT_HIGH_BIT}`);
    return this;
  }

  /**
   * Filter by normal payments only
   */
  normalPayments(): this {
    this.parts.push(`InvoiceID<${OVERPAYMENT_HIGH_BIT}`);
    return this;
  }

  /**
   * Build the query string
   */
  build(): string {
    return this.parts.join(" and ");
  }
}

// Re-export types
export type PaymentsRecord = Payments;
export type PaymentsCamelRecord = PaymentsCamel;
