# Product Entity Implementation Idea

**Date**: 2025-11-24
**Session**: gothic-boa (f44f844e)

## Raw Idea

Create Product entity for MoneyWorks, matching the implementation pattern established by the existing "Name" and "TaxRate" entities.

## User's Request

"This is a moneyworks project. Could you please look at the existing moneyworks tables that were created, take 'name'. I want to create products next. it should effectively match 'name' and 'taxrate' in parity."

## Context

- Existing entities: Names (comprehensive with 70+ fields), TaxRates (16 fields)
- Both follow consistent pattern: types.ts, fields.ts, enums.ts, validators.ts, index.ts
- TaxRates has additional: terms.ts, rules.ts, calculators.ts
- User wants "parity" - meaning same level of completeness and structure

## Key Requirements Mentioned

1. Follow the pattern of existing "name" entity
2. Match the parity/structure of both "name" and "taxrate"
3. Create for MoneyWorks project (canonical entity)

## Initial Thoughts

- Need to discover MoneyWorks Product table fields
- Should follow the 5-file canonical pattern minimum
- Consider if Products need additional files like TaxRates (calculators, rules, terms)
- **CRITICAL**: Based on Weave knowledge, must include FULL-STACK (canonical + data + API + UI registration)
