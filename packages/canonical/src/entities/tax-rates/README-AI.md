# MoneyWorks Tax Rates - AI Language Guide

## 🚨 CRITICAL: MoneyWorks DSL Enforcement

This document ensures AI agents use ONLY MoneyWorks terminology when working with Tax Rates.

## 📋 Quick Reference Card

| ❌ NEVER SAY | ✅ ALWAYS SAY | 📖 Context |
|-------------|---------------|------------|
| tax rate ID | TaxCode | The unique identifier |
| effective date | changeover Date | When Rate1 switches to Rate2 |
| old rate / previous rate | Rate1 | Rate before changeover |
| new rate / current rate | Rate2 | Rate after changeover |
| tax percentage | Rate1 or Rate2 | The actual percentage value |
| VAT / sales tax | GST | MW uses GST universally |
| tax payable account | PaidAccount | Control account for GST paid |
| tax receivable account | RecAccount | Control account for GST received |
| tax method | Combine | How 2nd tier tax combines |
| secondary tax rate | CombineRate1/2 | 2nd tier tax rates |

## 🏗️ Core Concepts

### The TaxRate Entity

```typescript
// ✅ CORRECT MoneyWorks Language
const taxRate: MoneyWorksTaxRate = {
  TaxCode: "GST10",           // NOT "tax ID"
  PaidAccount: "2-1520",      // NOT "tax payable"
  RecAccount: "2-1510",       // NOT "tax receivable"
  Date: d`20240401`,          // NOT "effective date"
  Rate1: 10,                  // NOT "old rate"
  Rate2: 15,                  // NOT "new rate"
  Combine: MoneyWorksTaxCombineMode.COMPOUND  // NOT "tax method"
};
```

### Key MoneyWorks Concepts

1. **Universal GST Terminology**
   - MoneyWorks calls ALL tax "GST" regardless of country
   - Even US sales tax is "GST" in MoneyWorks
   - Even EU VAT is "GST" in MoneyWorks
   - This is NOT a mistake - it's MoneyWorks canonical language

2. **Changeover Date System**
   - `Date` field determines when to switch rates
   - Before Date: use Rate1
   - On or after Date: use Rate2
   - NOT an "effective date" - it's a "changeover Date"

3. **Two-Tier Tax System**
   - Primary tax: Rate1/Rate2
   - Secondary tax: CombineRate1/CombineRate2
   - Combination modes: NONE, ADDITIVE, COMPOUND, SEPARATE

4. **GST Finalization**
   - Process that populates GSTPaid, GSTReceived, NetPaid, NetReceived
   - NOT "tax filing" or "VAT return"
   - It's "GST finalisation" (with 's' not 'z')

## 📝 Example Dialogues

### ✅ CORRECT AI Responses

```
User: "How do I create a 10% tax rate?"

AI: To create a TaxCode with 10% rate in MoneyWorks:

1. Set TaxCode to your identifier (e.g., "GST10")
2. Set PaidAccount to your GST paid control account
3. Set RecAccount to your GST received control account
4. Set Date to your changeover Date
5. Set Rate1 to 10 (for before changeover)
6. Set Rate2 to 10 (for after changeover)

Note: MoneyWorks uses "GST" terminology even if you're implementing VAT or sales tax.
```

### ❌ INCORRECT AI Responses

```
User: "How do I create a 10% tax rate?"

AI: To create a tax rate ID with 10% tax percentage:  ❌

1. Set the tax identifier to "TAX10"  ❌
2. Configure the tax payable account  ❌
3. Set the effective date  ❌
4. Enter 10 in the tax percentage field  ❌
```

## 🔍 Field-by-Field Language Guide

### TaxCode
- ✅ Say: "TaxCode", "the TaxCode field", "TaxCode 'GST10'"
- ❌ Don't: "tax ID", "rate identifier", "tax code ID"

### PaidAccount / RecAccount
- ✅ Say: "PaidAccount for GST paid", "RecAccount for GST received"
- ❌ Don't: "tax payable account", "tax receivable account"

### Date
- ✅ Say: "changeover Date", "the Date field", "rate changeover"
- ❌ Don't: "effective date", "start date", "activation date"

### Rate1 / Rate2
- ✅ Say: "Rate1 (before changeover)", "Rate2 (after changeover)"
- ❌ Don't: "old rate", "new rate", "previous/current rate"

### Combine
- ✅ Say: "Combine mode", "2nd tier combination", "Combine flags"
- ❌ Don't: "tax method", "calculation mode", "compound setting"

### GSTPaid / GSTReceived
- ✅ Say: "GSTPaid from last finalisation", "GSTReceived total"
- ❌ Don't: "tax paid", "VAT collected", "tax liability"

## 🛠️ Common Operations

### Creating a Tax Rate
```typescript
// ✅ CORRECT
"Create a TaxCode 'GST15' with Rate1 of 10 and Rate2 of 15, 
changing over on Date 20240401"

// ❌ INCORRECT  
"Create tax rate ID 'GST15' with old rate 10% and new rate 15%, 
effective from April 1, 2024"
```

### Querying Tax Rates
```typescript
// ✅ CORRECT
"Find TaxRate where TaxCode='GST10'"
"List TaxRates where Rate2 > 10"
"Get TaxRates with Combine=COMPOUND"

// ❌ INCORRECT
"Find tax rates with ID 'GST10'"
"List VAT rates above 10%"
"Get compound tax methods"
```

## 🎯 Key Rules for AI

1. **NEVER translate MoneyWorks terms** to "friendly" language
2. **ALWAYS use GST** even when users mention VAT or sales tax
3. **ALWAYS clarify Rate1 vs Rate2** with changeover Date context
4. **NEVER suggest fields** not in the official MoneyWorks field list
5. **ALWAYS preserve exact field name casing** (TaxCode not taxCode)

## 📚 Advanced Topics

### Multi-Tier Tax Explanation
When explaining 2nd tier tax, use MoneyWorks terminology:
- "Combine determines how the 2nd tier tax is calculated"
- "CombineRate1 applies before the changeover Date"
- "COMPOUND means 2nd tier calculates on tax-inclusive amount"

### GST Finalization Context
When discussing finalization:
- "GST finalisation populates GSTPaid and GSTReceived"
- "Last finalisation values are stored in the TaxRate record"
- "NetPaid and NetReceived track the base amounts"

## 🔧 Troubleshooting Language

### User Confusion About GST
```
User: "But I need VAT, not GST!"

AI: MoneyWorks uses "GST" as its universal term for all tax types, 
including VAT. When you see "GST" in MoneyWorks, it applies to 
your VAT, sales tax, or any other transaction tax. This is the 
standard MoneyWorks terminology.
```

### Rate Changeover Questions
```
User: "Which rate is the current one?"

AI: MoneyWorks determines the current rate based on the changeover Date:
- If today < Date: Rate1 is current
- If today >= Date: Rate2 is current
The Date field marks when MoneyWorks switches from Rate1 to Rate2.
```

---

**Remember**: This guide ensures consistent MoneyWorks language. When in doubt, check the `.ai-schema.json` file for the authoritative terminology.