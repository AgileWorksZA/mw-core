/**
 * MoneyWorks Tax Rate Table Interface
 *
 * The Tax Rate file contains tax codes and their associated rates,
 * including GST/VAT rates, control accounts, and multi-tier tax support.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_tax_rate.html
 */

/**
 * Tax combine flags
 * @description How second-tier tax is combined
 */
export enum TaxCombineMethod {
  /** No combination */
  None = 0,
  /** Add to base */
  Add = 1,
  /** Compound */
  Compound = 2,
}

/**
 * MoneyWorks Tax Rate Table (Raw Interface)
 * @description Complete interface for the Tax Rate table with exact field names
 */
export interface TaxRate {
  /**
   * Tax code
   * @maxLength 5
   * @description Unique identifier for the tax code
   * @example "GST"
   */
  TaxCode: string;

  /**
   * Primary tax rate before changeover
   * @description Rate used before the changeover date
   * @example 15 (for 15%)
   */
  Rate1?: number;

  /**
   * Primary tax rate after changeover
   * @description Rate used on or after the changeover date
   * @example 15 (for 15%)
   */
  Rate2?: number;

  /**
   * Changeover date
   * @format date
   * @description Date when Rate2 becomes effective
   */
  Date?: Date | string;

  /**
   * GST paid control account
   * @maxLength 7
   * @description Account for GST paid on purchases
   * @relationship References Account.Code
   */
  PaidAccount?: string;

  /**
   * GST received control account
   * @maxLength 7
   * @description Account for GST received on sales
   * @relationship References Account.Code
   */
  RecAccount?: string;

  /**
   * Combine method
   * @description How second-tier tax is combined
   */
  Combine?: TaxCombineMethod;

  /**
   * Second-tier rate before changeover
   * @maxLength 2
   * @description PST/second tax rate before changeover date
   * @example 7 (for 7%)
   */
  CombineRate1?: number;

  /**
   * Second-tier rate after changeover
   * @maxLength 2
   * @description PST/second tax rate after changeover date
   * @example 7 (for 7%)
   */
  CombineRate2?: number;

  /**
   * Total GST paid
   * @description GST paid in last finalization period
   * @readonly
   */
  GSTPaid?: number;

  /**
   * Total GST received
   * @description GST received in last finalization period
   * @readonly
   */
  GSTReceived?: number;

  /**
   * Net amount paid
   * @description Net paid for tax code in last finalization
   * @readonly
   */
  NetPaid?: number;

  /**
   * Net amount received
   * @description Net received for tax code in last finalization
   * @readonly
   */
  NetReceived?: number;

  /**
   * User-defined numeric field
   * @description Scriptable numeric field
   */
  UserNum?: number;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Scriptable text field
   */
  UserText?: string;

  /**
   * Tagged text
   * @maxLength 255
   * @description Scriptable tag storage
   */
  TaggedText?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @description Date and time of last record change
   * @readonly
   */
  LastModifiedTime?: string;

  /**
   * User who last modified
   * @readonly
   * @note This field may not be present in all MoneyWorks versions
   */
  ModUser?: string;
}

/**
 * MoneyWorks Tax Rate Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface TaxRateCamel {
  /**
   * Tax code
   * @maxLength 5
   * @description Unique identifier for the tax code
   * @example "GST"
   */
  taxCode: string;

  /**
   * Primary tax rate before changeover
   * @description Rate used before the changeover date
   * @example 15 (for 15%)
   */
  rate1?: number;

  /**
   * Primary tax rate after changeover
   * @description Rate used on or after the changeover date
   * @example 15 (for 15%)
   */
  rate2?: number;

  /**
   * Changeover date
   * @format date
   * @description Date when Rate2 becomes effective
   */
  date?: Date | string;

  /**
   * GST paid control account
   * @maxLength 7
   * @description Account for GST paid on purchases
   * @relationship References Account.Code
   */
  paidAccount?: string;

  /**
   * GST received control account
   * @maxLength 7
   * @description Account for GST received on sales
   * @relationship References Account.Code
   */
  recAccount?: string;

  /**
   * Combine method
   * @description How second-tier tax is combined
   */
  combine?: TaxCombineMethod;

  /**
   * Second-tier rate before changeover
   * @maxLength 2
   * @description PST/second tax rate before changeover date
   * @example 7 (for 7%)
   */
  combineRate1?: number;

  /**
   * Second-tier rate after changeover
   * @maxLength 2
   * @description PST/second tax rate after changeover date
   * @example 7 (for 7%)
   */
  combineRate2?: number;

  /**
   * Total GST paid
   * @description GST paid in last finalization period
   * @readonly
   */
  gstPaid?: number;

  /**
   * Total GST received
   * @description GST received in last finalization period
   * @readonly
   */
  gstReceived?: number;

  /**
   * Net amount paid
   * @description Net paid for tax code in last finalization
   * @readonly
   */
  netPaid?: number;

  /**
   * Net amount received
   * @description Net received for tax code in last finalization
   * @readonly
   */
  netReceived?: number;

  /**
   * User-defined numeric field
   * @description Scriptable numeric field
   */
  userNum?: number;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Scriptable text field
   */
  userText?: string;

  /**
   * Tagged text
   * @maxLength 255
   * @description Scriptable tag storage
   */
  taggedText?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @description Date and time of last record change
   * @readonly
   */
  lastModifiedTime?: string;

  /**
   * User who last modified
   * @readonly
   * @note This field may not be present in all MoneyWorks versions
   */
  modUser?: string;
}

/**
 * Converter utilities for Tax Rate table
 */
export const taxRateConverters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: TaxRate): TaxRateCamel {
    return {
      taxCode: raw.TaxCode,
      rate1: raw.Rate1,
      rate2: raw.Rate2,
      date: raw.Date,
      paidAccount: raw.PaidAccount,
      recAccount: raw.RecAccount,
      combine: raw.Combine,
      combineRate1: raw.CombineRate1,
      combineRate2: raw.CombineRate2,
      gstPaid: raw.GSTPaid,
      gstReceived: raw.GSTReceived,
      netPaid: raw.NetPaid,
      netReceived: raw.NetReceived,
      userNum: raw.UserNum,
      userText: raw.UserText,
      taggedText: raw.TaggedText,
      lastModifiedTime: raw.LastModifiedTime,
      modUser: raw.ModUser,
    };
  },

  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  fromCamelCase(camel: TaxRateCamel): TaxRate {
    return {
      TaxCode: camel.taxCode,
      Rate1: camel.rate1,
      Rate2: camel.rate2,
      Date: camel.date,
      PaidAccount: camel.paidAccount,
      RecAccount: camel.recAccount,
      Combine: camel.combine,
      CombineRate1: camel.combineRate1,
      CombineRate2: camel.combineRate2,
      GSTPaid: camel.gstPaid,
      GSTReceived: camel.gstReceived,
      NetPaid: camel.netPaid,
      NetReceived: camel.netReceived,
      UserNum: camel.userNum,
      UserText: camel.userText,
      TaggedText: camel.taggedText,
      LastModifiedTime: camel.lastModifiedTime,
      ModUser: camel.modUser,
    };
  },
};

/**
 * Helper functions for Tax Rate table
 */
export const taxRateHelpers = {
  /**
   * Get the current effective tax rate
   * @param taxRate - The tax rate record
   * @param date - The date to check (defaults to today)
   * @returns The effective rate
   */
  getEffectiveRate(taxRate: TaxRate, date?: Date): number {
    const checkDate = date || new Date();
    const changeoverDate = taxRate.Date
      ? typeof taxRate.Date === "string"
        ? new Date(taxRate.Date)
        : taxRate.Date
      : null;

    if (!changeoverDate || checkDate < changeoverDate) {
      return taxRate.Rate1 || 0;
    }
    return taxRate.Rate2 || 0;
  },

  /**
   * Get the effective combined rate
   * @param taxRate - The tax rate record
   * @param date - The date to check (defaults to today)
   * @returns The effective combined rate
   */
  getEffectiveCombineRate(taxRate: TaxRate, date?: Date): number {
    const checkDate = date || new Date();
    const changeoverDate = taxRate.Date
      ? typeof taxRate.Date === "string"
        ? new Date(taxRate.Date)
        : taxRate.Date
      : null;

    if (!changeoverDate || checkDate < changeoverDate) {
      return taxRate.CombineRate1 || 0;
    }
    return taxRate.CombineRate2 || 0;
  },

  /**
   * Calculate total tax amount
   * @param amount - The base amount
   * @param taxRate - The tax rate record
   * @param date - The date for rate determination
   * @returns Total tax amount
   */
  calculateTax(amount: number, taxRate: TaxRate, date?: Date): number {
    const rate = this.getEffectiveRate(taxRate, date);
    const combineRate = this.getEffectiveCombineRate(taxRate, date);

    let tax = (amount * rate) / 100;

    if (combineRate && taxRate.Combine) {
      const secondTax = (amount * combineRate) / 100;

      switch (taxRate.Combine) {
        case TaxCombineMethod.Add:
          tax += secondTax;
          break;
        case TaxCombineMethod.Compound:
          tax = (amount * (1 + rate / 100) * combineRate) / 100 + tax;
          break;
      }
    }

    return Math.round(tax * 100) / 100; // Round to 2 decimal places
  },

  /**
   * Calculate gross amount from net
   * @param netAmount - The net amount
   * @param taxRate - The tax rate record
   * @param date - The date for rate determination
   * @returns Gross amount including tax
   */
  calculateGross(netAmount: number, taxRate: TaxRate, date?: Date): number {
    const tax = this.calculateTax(netAmount, taxRate, date);
    return netAmount + tax;
  },

  /**
   * Calculate net amount from gross
   * @param grossAmount - The gross amount including tax
   * @param taxRate - The tax rate record
   * @param date - The date for rate determination
   * @returns Net amount excluding tax
   */
  calculateNet(grossAmount: number, taxRate: TaxRate, date?: Date): number {
    const rate = this.getEffectiveRate(taxRate, date);
    const combineRate = this.getEffectiveCombineRate(taxRate, date);

    let divisor = 1 + rate / 100;

    if (combineRate && taxRate.Combine) {
      switch (taxRate.Combine) {
        case TaxCombineMethod.Add:
          divisor = 1 + (rate + combineRate) / 100;
          break;
        case TaxCombineMethod.Compound:
          divisor = (1 + rate / 100) * (1 + combineRate / 100);
          break;
      }
    }

    return Math.round((grossAmount / divisor) * 100) / 100;
  },

  /**
   * Check if tax code is zero-rated
   * @param taxRate - The tax rate record
   * @returns True if both rates are zero
   */
  isZeroRated(taxRate: TaxRate): boolean {
    return (taxRate.Rate1 || 0) === 0 && (taxRate.Rate2 || 0) === 0;
  },

  /**
   * Check if tax code has multi-tier rates
   * @param taxRate - The tax rate record
   * @returns True if combine rates are configured
   */
  hasMultiTier(taxRate: TaxRate): boolean {
    return (
      taxRate.Combine !== undefined &&
      taxRate.Combine !== TaxCombineMethod.None &&
      ((taxRate.CombineRate1 || 0) > 0 || (taxRate.CombineRate2 || 0) > 0)
    );
  },
};
