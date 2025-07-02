/**
 * MoneyWorks Tax Rate Canonical Terminology
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction This is the DEFINITIVE terminology map for TaxRate concepts
 * @ai-critical ALWAYS use the MoneyWorks term (key), NEVER the description
 */
/**
 * MoneyWorks Tax Rate canonical terms mapping
 * Keys = MoneyWorks canonical terms (USE THESE)
 * Values = Explanatory descriptions (for understanding only)
 *
 * @ai-rule When speaking about tax rates, use the KEY not the value
 * @example Say "TaxCode" not "Tax Code identifier"
 */
export declare const MONEYWORKS_TAX_RATE_CANONICAL_TERMS: {
    readonly TaxRate: "The MoneyWorks tax rate entity (singular)";
    readonly "Tax Rates": "The MoneyWorks tax rates table (plural)";
    readonly TaxCode: "The unique identifier for a tax rate";
    readonly "changeover Date": "The date when Rate1 switches to Rate2";
    readonly Rate1: "Tax rate used before changeover Date";
    readonly Rate2: "Tax rate used on or after changeover Date";
    readonly "historical rate": "Rate1 when after changeover Date";
    readonly "current rate": "The applicable rate based on date comparison";
    readonly PaidAccount: "Control account for GST paid out";
    readonly RecAccount: "Control account for GST received";
    readonly "control account": "Account that tracks tax amounts";
    readonly Combine: "Flag indicating how 2nd tier tax combines";
    readonly CombineRate1: "2nd tier rate before changeover";
    readonly CombineRate2: "2nd tier rate after changeover";
    readonly "2nd tier": "Secondary tax component (like PST)";
    readonly NONE: "No 2nd tier tax";
    readonly ADDITIVE: "2nd tier added to primary";
    readonly COMPOUND: "2nd tier on tax-inclusive amount";
    readonly SEPARATE: "2nd tier calculated independently";
    readonly "GST finalisation": "MoneyWorks tax period closing process";
    readonly GSTPaid: "Total GST paid in last finalisation";
    readonly GSTReceived: "Total GST received in last finalisation";
    readonly NetPaid: "Net amount paid in last finalisation";
    readonly NetReceived: "Net amount received in last finalisation";
    readonly "last finalisation": "Most recent GST period closure";
    readonly GST: "MoneyWorks term for ALL tax types";
    readonly "GST paid": "Tax on purchases (input tax)";
    readonly "GST received": "Tax on sales (output tax)";
    readonly "tax-inclusive": "Amount includes tax";
    readonly "tax-exclusive": "Amount before tax";
    readonly "tax basis": "Amount on which tax is calculated";
    readonly "effective rate": "The rate currently in effect";
    readonly LastModifiedTime: "Timestamp of last record change";
    readonly UserNum: "Scriptable numeric field";
    readonly UserText: "Scriptable text field";
    readonly TaggedText: "Scriptable tag storage field";
};
/**
 * Get the MoneyWorks term for a concept
 *
 * @ai-instruction Use this to ensure you're using correct MW terminology
 */
export declare function getCanonicalTerm(concept: string): string;
/**
 * MoneyWorks tax-specific action terms
 *
 * @ai-instruction Use these verbs when describing tax operations
 */
export declare const MONEYWORKS_TAX_ACTIONS: {
    readonly "calculate GST": "Compute tax amount using rates";
    readonly "finalise GST": "Close tax period and record totals";
    readonly "apply TaxCode": "Use a specific tax rate in transaction";
    readonly changeover: "Switch from Rate1 to Rate2";
    readonly "combine tax": "Apply 2nd tier tax calculation";
};
//# sourceMappingURL=terms.d.ts.map