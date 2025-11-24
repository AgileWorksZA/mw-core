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
export const MONEYWORKS_TAX_RATE_CANONICAL_TERMS = {
	// === Entity and Structure Terms ===
	TaxRate: "The MoneyWorks tax rate entity (singular)",
	"Tax Rates": "The MoneyWorks tax rates table (plural)",
	TaxCode: "The unique identifier for a tax rate",

	// === Rate Management Terms ===
	"changeover Date": "The date when Rate1 switches to Rate2",
	Rate1: "Tax rate used before changeover Date",
	Rate2: "Tax rate used on or after changeover Date",
	"historical rate": "Rate1 when after changeover Date",
	"current rate": "The applicable rate based on date comparison",

	// === Account Integration Terms ===
	PaidAccount: "Control account for GST paid out",
	RecAccount: "Control account for GST received",
	"control account": "Account that tracks tax amounts",

	// === Multi-tier Tax Terms ===
	Combine: "Flag indicating how 2nd tier tax combines",
	CombineRate1: "2nd tier rate before changeover",
	CombineRate2: "2nd tier rate after changeover",
	"2nd tier": "Secondary tax component (like PST)",
	NONE: "No 2nd tier tax",
	ADDITIVE: "2nd tier added to primary",
	COMPOUND: "2nd tier on tax-inclusive amount",
	SEPARATE: "2nd tier calculated independently",

	// === GST Finalization Terms ===
	"GST finalisation": "MoneyWorks tax period closing process",
	GSTPaid: "Total GST paid in last finalisation",
	GSTReceived: "Total GST received in last finalisation",
	NetPaid: "Net amount paid in last finalisation",
	NetReceived: "Net amount received in last finalisation",
	"last finalisation": "Most recent GST period closure",

	// === Universal Tax Terms (MW Convention) ===
	GST: "MoneyWorks term for ALL tax types",
	"GST paid": "Tax on purchases (input tax)",
	"GST received": "Tax on sales (output tax)",

	// === Calculation Terms ===
	"tax-inclusive": "Amount includes tax",
	"tax-exclusive": "Amount before tax",
	"tax basis": "Amount on which tax is calculated",
	"effective rate": "The rate currently in effect",

	// === System Fields ===
	LastModifiedTime: "Timestamp of last record change",
	UserNum: "Scriptable numeric field",
	UserText: "Scriptable text field",
	TaggedText: "Scriptable tag storage field",
} as const;

/**
 * Get the MoneyWorks term for a concept
 *
 * @ai-instruction Use this to ensure you're using correct MW terminology
 */
export function getCanonicalTerm(concept: string): string {
	// This would be used by tooling to enforce terminology
	const lowercaseConcept = concept.toLowerCase();

	// Check common mistakes
	const mistakes: Record<string, string> = {
		"tax id": "TaxCode",
		"tax rate id": "TaxCode",
		"rate code": "TaxCode",
		"effective date": "changeover Date",
		"start date": "changeover Date",
		"old rate": "Rate1",
		"new rate": "Rate2",
		"tax payable": "PaidAccount",
		"tax receivable": "RecAccount",
		vat: "GST",
		"sales tax": "GST",
	};

	return mistakes[lowercaseConcept] || concept;
}

/**
 * MoneyWorks tax-specific action terms
 *
 * @ai-instruction Use these verbs when describing tax operations
 */
export const MONEYWORKS_TAX_ACTIONS = {
	"calculate GST": "Compute tax amount using rates",
	"finalise GST": "Close tax period and record totals",
	"apply TaxCode": "Use a specific tax rate in transaction",
	changeover: "Switch from Rate1 to Rate2",
	"combine tax": "Apply 2nd tier tax calculation",
} as const;
