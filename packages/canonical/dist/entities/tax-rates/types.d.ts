/**
 * MoneyWorks Tax Rate Type Definitions
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-table TaxRate
 * @moneyworks-manual moneyworks_appendix_tax_rate.html
 * @moneyworks-dsl PURE
 *
 * @ai-instruction USE ONLY MoneyWorks field names. NEVER translate to generic business terms.
 * @ai-forbidden VAT, sales-tax, tax-rate-id, effective-date, tax-percentage, tax-payable, tax-receivable
 * @ai-required TaxCode, PaidAccount, RecAccount, Rate1, Rate2, GSTPaid, GSTReceived, Combine
 */
import { YYYYMMDD, AccountCode } from '@moneyworks/utilities';
import { MoneyWorksTaxCombineMode } from './enums';
/**
 * MoneyWorks Tax Rate Entity
 *
 * CRITICAL: MoneyWorks uses "GST" terminology for ALL tax types, regardless of country.
 * This is canonical MoneyWorks language and must be preserved.
 *
 * @ai-critical NEVER translate GST to VAT, sales tax, or other terms
 * @ai-context Even for US sales tax or EU VAT, MoneyWorks calls it "GST"
 */
export interface MoneyWorksTaxRate {
    /**
     * The tax code
     * @moneyworks-field TaxCode
     * @moneyworks-type T(5)
     * @ai-term ALWAYS use "TaxCode", NEVER "tax ID", "rate code", or "tax identifier"
     * @example "GST10", "PST", "VAT20"
     */
    TaxCode: string;
    /**
     * The control account for GST paid out under this rate
     * @moneyworks-field PaidAccount
     * @moneyworks-type T(7)
     * @ai-term ALWAYS use "PaidAccount", NEVER "tax payable account" or "GST payable"
     * @ai-context This references an Account.Code in MoneyWorks
     */
    PaidAccount: AccountCode;
    /**
     * The control account for GST received under this rate
     * @moneyworks-field RecAccount
     * @moneyworks-type T(7)
     * @ai-term ALWAYS use "RecAccount", NEVER "tax receivable account" or "GST receivable"
     * @ai-context This references an Account.Code in MoneyWorks
     */
    RecAccount: AccountCode;
    /**
     * Tax rate changeover date
     * @moneyworks-field Date
     * @moneyworks-type D
     * @ai-term ALWAYS use "changeover Date" or just "Date", NEVER "effective date" or "start date"
     * @ai-context Determines when to switch from Rate1 to Rate2
     */
    Date: YYYYMMDD;
    /**
     * Rate used before changeover date
     * @moneyworks-field Rate1
     * @moneyworks-type N
     * @ai-term ALWAYS use "Rate1", NEVER "old rate", "previous rate", or "initial rate"
     * @ai-context Percentage value (e.g., 10 for 10%)
     */
    Rate1: number;
    /**
     * Rate used on or after changeover date
     * @moneyworks-field Rate2
     * @moneyworks-type N
     * @ai-term ALWAYS use "Rate2", NEVER "new rate", "current rate", or "updated rate"
     * @ai-context Percentage value (e.g., 15 for 15%)
     */
    Rate2: number;
    /**
     * Flags (how 2nd tier tax is combined)
     * @moneyworks-field Combine
     * @moneyworks-type N
     * @ai-term ALWAYS use "Combine", NEVER "combination mode" or "tax method"
     * @ai-context Uses MoneyWorksTaxCombineMode enum values
     */
    Combine?: MoneyWorksTaxCombineMode;
    /**
     * 2nd tier rate used before changeover date (PST)
     * @moneyworks-field CombineRate1
     * @moneyworks-type N
     * @ai-term ALWAYS use "CombineRate1", NEVER "secondary rate 1" or "PST rate 1"
     * @ai-context For provincial/state taxes in multi-tier systems
     */
    CombineRate1?: number;
    /**
     * 2nd tier rate used after changeover date (PST)
     * @moneyworks-field CombineRate2
     * @moneyworks-type N
     * @ai-term ALWAYS use "CombineRate2", NEVER "secondary rate 2" or "PST rate 2"
     * @ai-context For provincial/state taxes in multi-tier systems
     */
    CombineRate2?: number;
    /**
     * Total GST paid for taxcode in last GST finalisation
     * @moneyworks-field GSTPaid
     * @moneyworks-type N
     * @ai-term ALWAYS use "GSTPaid", NEVER "tax paid", "VAT paid", or "tax liability"
     * @ai-context Populated during GST finalization process
     */
    GSTPaid?: number;
    /**
     * Total GST received for taxcode in last GST finalisation
     * @moneyworks-field GSTReceived
     * @moneyworks-type N
     * @ai-term ALWAYS use "GSTReceived", NEVER "tax collected", "VAT received", or "tax receipts"
     * @ai-context Populated during GST finalization process
     */
    GSTReceived?: number;
    /**
     * Net paid for taxcode in last GST finalisation
     * @moneyworks-field NetPaid
     * @moneyworks-type N
     * @ai-term ALWAYS use "NetPaid", NEVER "net tax paid" or "base amount paid"
     * @ai-context Net amount before tax in finalization
     */
    NetPaid?: number;
    /**
     * Net received for taxcode in last GST finalisation
     * @moneyworks-field NetReceived
     * @moneyworks-type N
     * @ai-term ALWAYS use "NetReceived", NEVER "net tax received" or "base amount received"
     * @ai-context Net amount before tax in finalization
     */
    NetReceived?: number;
    /**
     * The date and time that this record was last changed
     * @moneyworks-field LastModifiedTime
     * @moneyworks-type S
     * @ai-term ALWAYS use "LastModifiedTime", NEVER "modified date" or "updated at"
     */
    LastModifiedTime?: string;
    /**
     * Scriptable number
     * @moneyworks-field UserNum
     * @moneyworks-type N
     * @ai-term ALWAYS use "UserNum", NEVER "custom number" or "user field 1"
     * @ai-context For custom scripting extensions
     */
    UserNum?: number;
    /**
     * Scriptable text
     * @moneyworks-field UserText
     * @moneyworks-type T(255)
     * @ai-term ALWAYS use "UserText", NEVER "custom text" or "user field 2"
     * @ai-context For custom scripting extensions
     */
    UserText?: string;
    /**
     * Scriptable tag storage
     * @moneyworks-field TaggedText
     * @moneyworks-type T(255)
     * @ai-term ALWAYS use "TaggedText", NEVER "tags" or "metadata"
     * @ai-context For storing structured data as tags
     */
    TaggedText?: string;
}
/**
 * MoneyWorks Tax Rate creation input
 * Only required fields for creating a new tax rate
 *
 * @ai-instruction When creating tax rates, use this interface
 */
export interface MoneyWorksTaxRateCreateInput {
    TaxCode: string;
    PaidAccount: AccountCode;
    RecAccount: AccountCode;
    Date: YYYYMMDD;
    Rate1: number;
    Rate2: number;
}
/**
 * MoneyWorks Tax Rate update input
 * All fields optional except TaxCode for identification
 *
 * @ai-instruction When updating tax rates, use this interface
 */
export interface MoneyWorksTaxRateUpdateInput {
    TaxCode: string;
    PaidAccount?: AccountCode;
    RecAccount?: AccountCode;
    Date?: YYYYMMDD;
    Rate1?: number;
    Rate2?: number;
    Combine?: MoneyWorksTaxCombineMode;
    CombineRate1?: number;
    CombineRate2?: number;
}
//# sourceMappingURL=types.d.ts.map