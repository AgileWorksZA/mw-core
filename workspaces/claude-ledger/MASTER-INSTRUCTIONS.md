# Autonomous Ledger Entity Generation - Master Instructions

## 🎯 Your Autonomous Mission

You are an **autonomous Claude instance** working independently in this workspace to generate a perfect MoneyWorks Ledger entity. You will **iterate until success** using session continuation.

## 📋 Success Definition

**You are SUCCESSFUL when ALL validation tests pass.** Until then, **keep iterating**.

### ✅ Success Criteria Checklist
- [ ] **Official documentation accessed** via WebSearch and cited with URLs
- [ ] **Ledger TypeScript file** generated (`ledger.ts`) 
- [ ] **All validation tests pass** (`npm test`)
- [ ] **Documentation sources recorded** (`sources.md`)
- [ ] **Iteration log maintained** (`iteration-log.md`)
- [ ] **Design reflection completed** (`design-reflection.md`)

## 📁 Local Reference Files Available

**CRITICAL**: You have these reference files in your workspace:

### `name-reference.ts` - GOLD STANDARD PATTERN
This is the **complete, validated Name entity** that you MUST follow as your template. Study this carefully:
- Semantic enums with clear business meaning
- Complete JSDoc documentation
- Validation functions with field constraints  
- Query builder class for type-safe queries
- Utility functions for business logic
- **This is your success pattern to emulate**

### `ledger-source.ts` - YOUR RAW DATA
This contains the **raw Ledger interface** from the existing codebase:
- All 200+ field definitions (MASSIVE entity!)
- 91 historical balance fields + 96 budget fields
- Field annotations (@indexed, @mutable, size constraints)
- Types and constraints you must preserve
- **Transform this into semantic TypeScript like name-reference.ts**

## 🎯 Validation Requirements (ALL MUST PASS)

### 1. **Documentation Validation**
- Must access official MoneyWorks Ledger appendix
- Must cite specific URLs in `sources.md`
- Must extract enum values from official documentation (not guessed)

### 2. **Code Structure Validation**
- Must include ALL 200+ fields from `ledger-source.ts`
- Must have semantic enums (LedgerType, SystemAccountType, DepartmentCategory)
- Must follow exact pattern from `name-reference.ts`
- Must include validation functions
- Must include query builder class
- Must include utility functions

### 3. **Test Validation**
- TypeScript compilation must succeed (`tsc --noEmit ledger.ts`)
- All unit tests must pass (`npm test`)
- Enum validation tests must pass
- Field validation tests must pass
- Query builder tests must pass

### 4. **Evidence Validation**
- `sources.md` must contain official MoneyWorks URLs
- `iteration-log.md` must track all attempts
- Generated code must be > 500 lines and < 1500 lines (larger entity)

### 5. **Design Reflection Validation** ⭐ NEW REQUIREMENT
- Must create `design-reflection.md` comparing your approach to the reference pattern
- Must analyze how well you followed the Name entity template
- Must identify any improvements or deviations from the pattern

## 🔄 Autonomous Process

### Step 1: Study Reference Pattern
```bash
# CRITICAL: Study the gold standard first
Read("name-reference.ts")           # Learn the pattern
Read("ledger-source.ts")            # Understand your raw data (HUGE!)
```

### Step 2: Research & Documentation
```bash
# Use WebSearch to find official MoneyWorks documentation
WebSearch("site:cognito.co.nz ledger appendix field descriptions")
WebSearch("MoneyWorks ledger account types system codes official")
```

### Step 3: Generate Code
```bash
# Create ledger.ts following name-reference.ts pattern exactly
Write("ledger.ts", [generated_code_following_pattern])
```

### Step 4: Create Tests
```bash
# Create comprehensive validation tests
Write("ledger.test.ts", [validation_tests])
```

### Step 5: Validate
```bash
# Run all validation checks
Bash("npm test")
Bash("tsc --noEmit ledger.ts")
```

### Step 6: Design Reflection ⭐ NEW STEP
```bash
# Compare your design to the reference pattern
Write("design-reflection.md", [reflection_analysis])
```

### Step 7: Iterate If Needed
```bash
# If tests fail, analyze and improve
# Document iteration in iteration-log.md
# Continue until all tests pass
```

## 📁 Required Files

### `ledger.ts` - Generated Entity
- Complete TypeScript interface following `name-reference.ts` pattern
- Semantic enums from official docs
- Validation functions
- Query builder class
- Utility functions

### `ledger.test.ts` - Validation Tests
```typescript
import { Ledger, LedgerType, SystemAccountType } from './ledger';

describe('Ledger Entity Validation', () => {
  test('Should have all required fields', () => {
    // Verify 200+ fields exist from ledger-source.ts
  });
  
  test('Should have official enum values', () => {
    // Verify enum values match documentation
  });
  
  test('Should validate field constraints', () => {
    // Test field size limits, required fields
  });
  
  test('Should build valid queries', () => {
    // Test query builder functionality
  });
  
  test('Should follow name-reference.ts pattern', () => {
    // Verify structure matches reference
  });
  
  test('Should handle historical balance fields', () => {
    // Test 91 balance history fields
  });
  
  test('Should handle budget fields', () => {
    // Test 96 budget fields (A and B)
  });
});
```

### `sources.md` - Documentation Evidence
```markdown
# Documentation Sources Used

## Official MoneyWorks URLs
- [Ledger Appendix]: https://cognito.co.nz/manual/moneyworks_appendix_appendix_afield_descriptions.html#ledger
- [Ledger Types]: [specific URL with ledger types]
- [System Account Types]: [specific URL with system account types]

## Key Excerpts
[Document key information extracted from each source]
```

### `design-reflection.md` ⭐ NEW REQUIREMENT
```markdown
# Design Reflection: Ledger Entity vs Name Reference

## Pattern Adherence Analysis

### ✅ What I Followed from name-reference.ts
- [List specific patterns you followed]
- [Enum structure similarities]
- [Validation function patterns]
- [Query builder approach]

### 🔄 What I Adapted for Ledger
- [Ledger-specific adaptations]
- [Why certain changes were needed]
- [Historical balance field handling]
- [Budget field organization]

### 🎯 Pattern Consistency Score
Rate yourself 1-10 on how well you followed the reference pattern and explain.

### 💡 Insights Gained
- [What you learned from the reference]
- [How it improved your approach]
- [Suggestions for the pattern]
- [Challenges with 200+ fields]
```

### `iteration-log.md` - Progress Tracking
```markdown
# Iteration Log

## Iteration 1 - [timestamp]
- Attempted: [what was tried]
- Result: [success/failure]
- Issues: [problems encountered]
- Next: [what to try next]
```

## 🚀 Autonomous Execution Instructions

### Initial Setup
1. **Read these instructions completely**
2. **Study name-reference.ts pattern carefully**
3. **Examine ledger-source.ts raw data** (PREPARE: 200+ fields!)
4. **Initialize workspace** with required files
5. **Begin autonomous iteration loop**

### Iteration Loop
```
WHILE (tests not passing) {
  1. Research documentation (WebSearch)
  2. Generate/improve code following name-reference.ts pattern (Write)
  3. Create/update tests (Write)
  4. Run validation (Bash)
  5. Document iteration (Write to iteration-log.md)
  6. Analyze failures and plan next iteration
}
THEN create design-reflection.md
```

### When Complete
1. **Verify all tests pass**
2. **Complete design reflection**
3. **Copy final output** to `../../../generated/ledger.ts`
4. **Document success** in iteration-log.md

## 🎯 Session Continuation

Use Claude Code session continuation to maintain context:
```bash
# Continue working in the same session
claude -c
```

## 🔧 Key MoneyWorks Context

### Ledger Entity Details
- **200+ fields** - LARGEST MoneyWorks entity
- **91 historical balance fields** (BalanceLast91 to Balance)
- **96 budget fields** (BudgetA and BudgetB with 48 periods each)
- **Complex accounting relationships** (Department, Category, Classification)
- **Core to all MoneyWorks operations** - foundation of accounting system
- **Reference patterns** available in `name-reference.ts`

### Official Documentation Required
- Ledger field appendix from cognito.co.nz
- Ledger type classifications
- System account type codes
- Department and category structures
- Balance history and budget field meanings
- Field size constraints and validation rules

## 💪 Begin Autonomous Work Now

**Your goal**: Generate a perfect, validated MoneyWorks Ledger entity that passes all tests.

**Your tools**: WebSearch, Read, Write, Edit, Bash

**Your process**: Iterate until success

**Your template**: Follow `name-reference.ts` pattern exactly

**Challenge**: This is the LARGEST entity (200+ fields) - stay organized!

**Start by**: 
1. Reading `name-reference.ts` to understand the pattern
2. Reading `ledger-source.ts` to understand your data (massive!)
3. Beginning the autonomous iteration loop

**End with**: A complete design reflection comparing your work to the reference pattern

**Remember**: You are working autonomously. Continue iterating until ALL validation tests pass AND your design reflection is complete. 