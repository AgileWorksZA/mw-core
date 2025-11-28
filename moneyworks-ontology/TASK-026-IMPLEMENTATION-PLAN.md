# TASK-026 Implementation Plan

**Status:** READY FOR EXECUTION
**Created:** 2025-11-28
**Design Version:** 1.0 (locked)
**Estimated Duration:** 3 sessions (14 hours total)

---

## Purpose

This implementation plan breaks down TASK-026 into discrete, session-sized work units that can be executed across multiple agent sessions while maintaining mereological coherence and zero-entropy context transfer.

**Canonical Design:** See `TASK-026-DESIGN.md` (locked specification)

---

## Session Protocol

### Before Each Session

**Agent MUST read:**
1. `TASK-026-DESIGN.md` (locked design - DO NOT deviate)
2. This implementation plan (current session context)
3. `SESSION-XXX-HANDOFF.yaml` (previous session outcomes)
4. `backlog.yaml` (current task status)

### During Each Session

**Agent MUST:**
- Follow locked design exactly (no re-design)
- Update backlog.yaml with progress
- Create session completion document
- Update next session handoff

### After Each Session

**Agent MUST create:**
- `SESSION-XXX-TASK-026-PROGRESS.md` (what was accomplished)
- `SESSION-XXX-HANDOFF.yaml` update (context for next session)
- Commit with clear message referencing TASK-026 session number

---

## Session 1: Foundation - Validators 1-3

### Session Metadata

**Session ID:** To be assigned (Session 009 or later)
**Duration:** 6 hours estimated
**Priority:** P0-NEXT (after PRODUCTION-REVIEW approval)
**Dependencies:** PRODUCTION-REVIEW complete

### Objectives

Build and test the three core validators:
1. Field Count Validator
2. Duplicate Field Detector
3. DataType Consistency Checker

### Pre-Session Checklist

- [ ] PRODUCTION-REVIEW completed and approved
- [ ] Design document read and understood
- [ ] Development environment ready (Node.js, TypeScript)
- [ ] Test framework setup (Jest or similar)

### Tasks

#### TASK-026-S1-T1: Project Structure Setup (30 min)

**Input:** Empty scripts/ directory
**Output:** Complete folder structure

**Steps:**
```bash
mkdir -p scripts/validators
mkdir -p scripts/utils
mkdir -p scripts/tests/validators
mkdir -p scripts/tests/fixtures

# Create package.json scripts
npm pkg set scripts.validate:ontology="ts-node scripts/validate-ontology-coherence.ts"
npm pkg set scripts.test:validators="jest scripts/tests"

# Install dependencies
npm install --save-dev @types/node typescript ts-node jest @types/jest
npm install chalk js-yaml fast-glob
npm install --save-dev @types/js-yaml
```

**Acceptance:**
- [ ] Folder structure matches design
- [ ] Dependencies installed
- [ ] Can run TypeScript files with ts-node

---

#### TASK-026-S1-T2: Shared Utilities (1 hour)

**Input:** Design specification
**Output:** Reusable utility functions

**Files to create:**

**`scripts/utils/typescript-parser.ts`**
```typescript
import { readFileSync } from 'fs';

export interface ParsedOntology {
  filePath: string;
  content: string;
  headerFieldCount: number | null;
  fields: string[];
  businessRules: any[];
  dataTypes: string[];
}

export function parseOntologyFile(filePath: string): ParsedOntology {
  const content = readFileSync(filePath, 'utf-8');

  return {
    filePath,
    content,
    headerFieldCount: extractHeaderCount(content),
    fields: extractFieldNames(content, 'FIELDS'),
    businessRules: extractBusinessRules(content),
    dataTypes: extractDataTypes(content)
  };
}

function extractHeaderCount(content: string): number | null {
  const match = content.match(/\/\/\s*(\d+)\s+fields/i);
  return match ? parseInt(match[1]) : null;
}

function extractFieldNames(content: string, section: string): string[] {
  // Implementation per design spec
  const regex = /fieldName:\s*["']([^"']+)["']/g;
  const matches = Array.from(content.matchAll(regex));
  return matches.map(m => m[1]);
}

function extractDataTypes(content: string): string[] {
  const regex = /dataType:\s*["']([^"']+)["']/g;
  const matches = Array.from(content.matchAll(regex));
  return matches.map(m => m[1]);
}

function extractBusinessRules(content: string): any[] {
  // Extract BUSINESS_RULES array
  // Return parsed rules
  return [];
}
```

**`scripts/utils/error-formatter.ts`**
```typescript
import chalk from 'chalk';

export interface ValidationError {
  validator: string;
  file: string;
  message: string;
  expected?: any;
  actual?: any;
  fix?: string;
  location?: string;
}

export function formatError(error: ValidationError): string {
  const lines = [
    chalk.red(`❌ ${error.validator} in ${error.file}`),
    '',
    `   ${error.message}`,
  ];

  if (error.expected && error.actual) {
    lines.push('');
    lines.push(chalk.dim('   Expected:') + ` ${error.expected}`);
    lines.push(chalk.dim('   Found:   ') + ` ${error.actual}`);
  }

  if (error.fix) {
    lines.push('');
    lines.push(chalk.yellow('   Fix: ') + error.fix);
  }

  if (error.location) {
    lines.push('');
    lines.push(chalk.dim(`   Location: ${error.location}`));
  }

  return lines.join('\n');
}
```

**Acceptance:**
- [ ] Utilities compile without errors
- [ ] Can parse sample ontology file
- [ ] Error formatter produces colored output

---

#### TASK-026-S1-T3: Field Count Validator (1.5 hours)

**Input:** Design spec for Component 1
**Output:** Working validator with tests

**File: `scripts/validators/field-count-validator.ts`**

```typescript
import { parseOntologyFile } from '../utils/typescript-parser';
import { ValidationError } from '../utils/error-formatter';

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
}

export function validateFieldCount(filePath: string): ValidationResult {
  const parsed = parseOntologyFile(filePath);

  // No header found
  if (parsed.headerFieldCount === null) {
    return {
      success: false,
      errors: [{
        validator: 'Field Count Validator',
        file: filePath,
        message: 'No field count header found',
        fix: `Add header comment: // ${parsed.fields.length} fields`
      }]
    };
  }

  // Count mismatch
  if (parsed.headerFieldCount !== parsed.fields.length) {
    return {
      success: false,
      errors: [{
        validator: 'Field Count Validator',
        file: filePath,
        message: 'Field count mismatch',
        expected: parsed.headerFieldCount,
        actual: parsed.fields.length,
        fix: `Update header to: // ${parsed.fields.length} fields`
      }]
    };
  }

  return { success: true, errors: [] };
}
```

**Test File: `scripts/tests/validators/field-count-validator.test.ts`**

```typescript
import { validateFieldCount } from '../../validators/field-count-validator';
import { writeFixture, cleanupFixtures } from '../fixtures/helpers';

describe('Field Count Validator', () => {
  afterAll(cleanupFixtures);

  it('should pass when counts match', () => {
    const fixture = writeFixture('valid.ts', `
      // 2 fields
      export const FIELDS = [
        { fieldName: "Code" },
        { fieldName: "Name" }
      ];
    `);

    const result = validateFieldCount(fixture);
    expect(result.success).toBe(true);
  });

  it('should fail when count is too low', () => {
    const fixture = writeFixture('low-count.ts', `
      // 1 field
      export const FIELDS = [
        { fieldName: "Code" },
        { fieldName: "Name" }
      ];
    `);

    const result = validateFieldCount(fixture);
    expect(result.success).toBe(false);
    expect(result.errors[0].expected).toBe(1);
    expect(result.errors[0].actual).toBe(2);
  });

  it('should fail when no header found', () => {
    const fixture = writeFixture('no-header.ts', `
      export const FIELDS = [
        { fieldName: "Code" }
      ];
    `);

    const result = validateFieldCount(fixture);
    expect(result.success).toBe(false);
    expect(result.errors[0].message).toContain('No field count header');
  });
});
```

**Acceptance:**
- [ ] Validator implements design spec exactly
- [ ] All tests pass
- [ ] Edge cases covered (no header, zero fields, mismatch)

---

#### TASK-026-S1-T4: Duplicate Field Detector (1.5 hours)

**Input:** Design spec for Component 2
**Output:** Working validator with tests

**File: `scripts/validators/duplicate-detector.ts`**

```typescript
import { parseOntologyFile } from '../utils/typescript-parser';
import { ValidationError } from '../utils/error-formatter';
import { ValidationResult } from './field-count-validator';

export function detectDuplicates(filePath: string): ValidationResult {
  const parsed = parseOntologyFile(filePath);

  // Find duplicate field names
  const fieldCounts = new Map<string, number>();
  for (const field of parsed.fields) {
    fieldCounts.set(field, (fieldCounts.get(field) || 0) + 1);
  }

  const duplicates = Array.from(fieldCounts.entries())
    .filter(([_, count]) => count > 1)
    .map(([name, _]) => name);

  if (duplicates.length > 0) {
    return {
      success: false,
      errors: [{
        validator: 'Duplicate Field Detector',
        file: filePath,
        message: `Duplicate field definitions found: ${duplicates.join(', ')}`,
        fix: 'Remove duplicate field definitions from FIELDS array'
      }]
    };
  }

  // Check BUSINESS_RULES pattern
  if (parsed.content.includes('BUSINESS_RULES') &&
      parsed.content.match(/BUSINESS_RULES[\s\S]*fieldName:/)) {
    return {
      success: false,
      errors: [{
        validator: 'Duplicate Field Detector',
        file: filePath,
        message: 'BUSINESS_RULES must use "targetField" not "fieldName"',
        expected: 'targetField:',
        actual: 'fieldName:',
        fix: 'Replace all "fieldName:" with "targetField:" in BUSINESS_RULES section'
      }]
    };
  }

  return { success: true, errors: [] };
}
```

**Test File:** Similar structure to field-count tests

**Acceptance:**
- [ ] Detects duplicate fieldName values
- [ ] Detects fieldName in BUSINESS_RULES
- [ ] All tests pass

---

#### TASK-026-S1-T5: DataType Consistency Checker (1.5 hours)

**Input:** Design spec for Component 3
**Output:** Working validator with tests

**File: `scripts/validators/datatype-checker.ts`**

```typescript
const STANDARD_DATATYPES = ['T', 'N', 'D', 'A', 'S'] as const;

const TYPE_SUGGESTIONS: Record<string, string> = {
  'B': 'N  // Boolean stored as 0/1',
  'DT': 'S  // DateTime as timestamp string',
  'M': 'T  // Memo as text',
  '$ ': 'A  // Amount/Money',
  '$': 'A  // Amount/Money',
  '3': 'T  // Likely typo for Text'
};

export function checkDataTypes(filePath: string): ValidationResult {
  const parsed = parseOntologyFile(filePath);

  const nonStandard = parsed.dataTypes.filter(
    type => !STANDARD_DATATYPES.includes(type as any)
  );

  if (nonStandard.length > 0) {
    const unique = Array.from(new Set(nonStandard));
    const suggestions = unique.map(type => ({
      found: type,
      suggested: TYPE_SUGGESTIONS[type] || 'Review against standard set (T, N, D, A, S)'
    }));

    return {
      success: false,
      errors: [{
        validator: 'DataType Consistency Checker',
        file: filePath,
        message: `Non-standard dataTypes found: ${unique.join(', ')}`,
        fix: suggestions.map(s => `"${s.found}" → ${s.suggested}`).join('\n   ')
      }]
    };
  }

  return { success: true, errors: [] };
}
```

**Test File:** Cover all non-standard types from Phase 1

**Acceptance:**
- [ ] Detects all non-standard types
- [ ] Provides helpful suggestions
- [ ] All tests pass

---

### Session 1 Deliverables

**Code:**
- [ ] 3 validators implemented (Components 1-3)
- [ ] Shared utilities (parser, formatter)
- [ ] Comprehensive test suite (90%+ coverage)

**Documentation:**
- [ ] SESSION-XXX-TASK-026-S1-PROGRESS.md
- [ ] Updated backlog.yaml (Session 1 complete)
- [ ] Updated handoff for Session 2

**Quality Gates:**
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] Validates current ontology successfully
- [ ] Code reviewed and documented

---

## Session 2: Integration - Components 4-5

### Session Metadata

**Session ID:** To be assigned
**Duration:** 6 hours estimated
**Dependencies:** Session 1 complete

### Objectives

1. Implement Metric Coherence Validator (Component 4)
2. Create CLI interface (Component 5.3)
3. Implement pre-commit hook (Component 5.1)
4. Create GitHub Actions workflow (Component 5.2)
5. Integration testing

### Tasks

#### TASK-026-S2-T1: Metric Coherence Validator (1.5 hours)

**File: `scripts/validators/metric-validator.ts`**

Follow Component 4 specification from design doc.

**Test scenarios:**
- All metrics match → Pass
- Perfect match count differs → Fail with details
- Entity coverage differs → Fail
- One file missing metric → Warning (not fail)

---

#### TASK-026-S2-T2: CLI Interface (1 hour)

**File: `scripts/validate-ontology-coherence.ts`**

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import { glob } from 'fast-glob';
import { validateFieldCount } from './validators/field-count-validator';
import { detectDuplicates } from './validators/duplicate-detector';
import { checkDataTypes } from './validators/datatype-checker';
import { validateMetrics } from './validators/metric-validator';
import { formatError } from './utils/error-formatter';
import chalk from 'chalk';

async function validateAll(options: any) {
  const ontologyFiles = await glob('generated/moneyworks-*-canonical-ontology.ts');

  let allErrors = [];

  // Run validators on each file
  for (const file of ontologyFiles) {
    const results = [
      validateFieldCount(file),
      detectDuplicates(file),
      checkDataTypes(file)
    ];

    for (const result of results) {
      if (!result.success) {
        allErrors.push(...result.errors);
      }
    }
  }

  // Validate metrics
  const metricResult = await validateMetrics(
    'moneyworks-ontology/state.yaml',
    'moneyworks-ontology/backlog.yaml',
    'moneyworks-ontology/SESSION-009-HANDOFF.yaml'
  );

  if (!metricResult.success) {
    allErrors.push(...metricResult.errors);
  }

  return {
    success: allErrors.length === 0,
    errors: allErrors
  };
}

const program = new Command();

program
  .name('validate-ontology')
  .description('Validate MoneyWorks ontology coherence')
  .option('--component <name>', 'Run specific component only')
  .option('--fix', 'Auto-fix issues where safe (future)')
  .action(async (options) => {
    console.log(chalk.blue('🔍 Validating MoneyWorks Ontology...\n'));

    const result = await validateAll(options);

    if (result.success) {
      console.log(chalk.green('✅ All validations passed!\n'));
      process.exit(0);
    } else {
      console.error(chalk.red(`❌ Found ${result.errors.length} validation error(s):\n`));
      result.errors.forEach(error => {
        console.error(formatError(error));
        console.error('');
      });
      process.exit(1);
    }
  });

program.parse();
```

**Acceptance:**
- [ ] CLI runs and validates all files
- [ ] Error output is clear and actionable
- [ ] Exit code 0 on success, 1 on failure

---

#### TASK-026-S2-T3: Pre-Commit Hook (1 hour)

**Setup Husky:**
```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run validate:ontology"
```

**File: `.husky/pre-commit`**

```bash
#!/bin/bash

# Check if ontology files changed
CHANGED=$(git diff --cached --name-only | grep -E "(moneyworks-.*-canonical-ontology\.ts|state\.yaml|backlog\.yaml)")

if [ -z "$CHANGED" ]; then
  exit 0
fi

echo "🔍 Validating ontology coherence..."

npm run validate:ontology

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Ontology validation failed!"
  echo "Fix the issues above before committing."
  echo ""
  echo "To bypass validation (NOT recommended):"
  echo "  git commit --no-verify"
  exit 1
fi

echo "✅ Ontology validation passed!"
exit 0
```

**Acceptance:**
- [ ] Hook blocks invalid commits
- [ ] Hook allows valid commits
- [ ] Only runs when ontology files change
- [ ] Clear error messages

---

#### TASK-026-S2-T4: GitHub Actions Workflow (1 hour)

**File: `.github/workflows/ontology-validation.yml`**

```yaml
name: Ontology Coherence Validation

on:
  pull_request:
    paths:
      - 'generated/moneyworks-*-canonical-ontology.ts'
      - 'moneyworks-ontology/*.yaml'
  push:
    branches:
      - main
      - 'dev/**'
    paths:
      - 'generated/moneyworks-*-canonical-ontology.ts'
      - 'moneyworks-ontology/*.yaml'

jobs:
  validate:
    name: Validate Ontology Coherence
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ontology validation
        run: npm run validate:ontology

      - name: Comment on PR (if failed)
        if: failure() && github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ Ontology validation failed. Please check the CI logs for details.'
            })
```

**Acceptance:**
- [ ] Workflow triggers on ontology changes
- [ ] Fails PR if validation fails
- [ ] Comments on failed PRs
- [ ] Runs on main/dev branches

---

#### TASK-026-S2-T5: Integration Tests (1.5 hours)

**File: `scripts/tests/integration.test.ts`**

```typescript
describe('Integration: Full Pipeline', () => {
  it('should validate current production ontology', async () => {
    const result = await validateAll({});
    expect(result.success).toBe(true);
  });

  it('should detect Phase 1 duplicate issue', async () => {
    // Create fixture with duplicate fieldName
    const fixture = createBadOntology('duplicate-field');
    const result = await validateAll({ files: [fixture] });
    expect(result.success).toBe(false);
    expect(result.errors).toContainMatch(/duplicate/i);
  });

  it('should detect non-standard dataType', async () => {
    const fixture = createBadOntology('datatype-B');
    const result = await validateAll({ files: [fixture] });
    expect(result.success).toBe(false);
    expect(result.errors).toContainMatch(/non-standard/i);
  });
});
```

**Acceptance:**
- [ ] All Phase 1 issues detectable
- [ ] Current ontology passes validation
- [ ] Integration tests cover happy path + all error paths

---

### Session 2 Deliverables

**Code:**
- [ ] Component 4 (Metric Validator) complete
- [ ] Component 5 (Integration Layer) complete
- [ ] CLI interface working
- [ ] Pre-commit hook installed
- [ ] GitHub Actions workflow configured

**Testing:**
- [ ] Integration test suite passes
- [ ] Manual validation of current ontology succeeds
- [ ] Performance < 5 seconds confirmed

**Documentation:**
- [ ] SESSION-XXX-TASK-026-S2-PROGRESS.md
- [ ] Updated backlog.yaml (Session 2 complete)
- [ ] Updated handoff for Session 3

---

## Session 3: Documentation & Production

### Session Metadata

**Session ID:** To be assigned
**Duration:** 2 hours estimated
**Dependencies:** Session 2 complete

### Objectives

1. Comprehensive README documentation
2. Developer guide
3. Performance optimization
4. Final production validation
5. Handoff to production team

### Tasks

#### TASK-026-S3-T1: README Documentation (30 min)

**File: `scripts/README.md`**

```markdown
# MoneyWorks Ontology Coherence Validation

Automated CI pipeline to maintain 100% production-ready quality.

## Quick Start

```bash
# Install dependencies
npm install

# Run validation
npm run validate:ontology

# Install pre-commit hook
npx husky install
```

## What It Validates

1. **Field Counts** - Header comments match actual counts
2. **Duplicates** - No duplicate field definitions
3. **DataTypes** - Only standard types (T, N, D, A, S)
4. **Metrics** - Consistency across state files

## Usage

[Examples, troubleshooting, etc.]
```

**Acceptance:**
- [ ] Clear installation instructions
- [ ] Usage examples
- [ ] Troubleshooting section

---

#### TASK-026-S3-T2: Performance Optimization (30 min)

**Tasks:**
- [ ] Profile validation runtime
- [ ] Cache parsed ASTs if needed
- [ ] Parallelize file validation
- [ ] Confirm < 5 second target met

---

#### TASK-026-S3-T3: Final Validation (30 min)

**Checklist:**
- [ ] Validate all 31 current ontology files → Pass
- [ ] Pre-commit hook works on test commit
- [ ] GitHub Actions workflow passes on test PR
- [ ] All tests pass (unit + integration)
- [ ] Code coverage > 90%

---

#### TASK-026-S3-T4: Production Handoff (30 min)

**Deliverables:**
- [ ] TASK-026-COMPLETE.md summary document
- [ ] Demo video or screenshots (optional)
- [ ] Production team notification
- [ ] backlog.yaml updated (TASK-026 complete)

---

### Session 3 Deliverables

**Documentation:**
- [ ] Comprehensive README
- [ ] Developer guide
- [ ] TASK-026-COMPLETE.md

**Quality:**
- [ ] Performance benchmarks met
- [ ] 100% acceptance criteria satisfied
- [ ] Production team handoff complete

---

## Cross-Session Coordination

### Handoff Protocol

**End of Each Session:**
```yaml
# SESSION-XXX-HANDOFF.yaml update

task_026_progress:
  session_number: 1  # or 2, 3
  status: "Session X complete"
  next_session_focus: "Session X+1 objectives"

  completed_this_session:
    - Component X implemented
    - Tests passing
    - Documentation updated

  ready_for_next_session:
    - [ ] Code committed and pushed
    - [ ] Tests passing in CI
    - [ ] Handoff document updated

  next_session_agent_must_read:
    - TASK-026-DESIGN.md (locked design)
    - TASK-026-IMPLEMENTATION-PLAN.md (this file)
    - SESSION-XXX-HANDOFF.yaml (previous outcomes)
```

### Quality Gates Between Sessions

**Session 1 → Session 2 Gate:**
- [ ] All 3 validators implemented
- [ ] Test suite passing
- [ ] Code compiles without errors
- [ ] Validates current ontology successfully

**Session 2 → Session 3 Gate:**
- [ ] All 5 components complete
- [ ] Pre-commit hook working
- [ ] GitHub Actions passing
- [ ] Integration tests passing

---

## Contingency Planning

### If Session Runs Long

**Priority Order:**
1. Core functionality (validators work)
2. Tests pass
3. Documentation
4. Polish/optimization

**Can defer to next session:**
- Performance optimization (if < 10 seconds)
- Extensive documentation
- Additional test coverage (if > 80%)

### If Design Issue Found

**Protocol:**
1. Document issue in session notes
2. Do NOT deviate from locked design
3. Flag for production team review
4. Create TASK-026-AMENDMENT-001.md if approved

---

## Success Criteria

### Overall (All Sessions Complete)

- ✅ All 5 components implemented per design
- ✅ Pre-commit hook prevents invalid commits
- ✅ GitHub Actions validates PRs
- ✅ All tests pass (unit + integration)
- ✅ Performance < 5 seconds
- ✅ Documentation complete
- ✅ Production team satisfied

### Definition of Done

**Code:**
- Implements locked design exactly
- 90%+ test coverage
- TypeScript strict mode passes
- No console warnings/errors

**Testing:**
- All unit tests pass
- Integration tests pass
- Manual validation of current ontology succeeds
- Performance benchmarks met

**Documentation:**
- README with clear examples
- Inline code comments
- Session completion docs
- Handoff for future sessions

---

## Timeline

```
Session 1: Foundation (6h)
  ├─ T1: Setup (0.5h)
  ├─ T2: Utilities (1h)
  ├─ T3: Field Count (1.5h)
  ├─ T4: Duplicates (1.5h)
  └─ T5: DataTypes (1.5h)

Session 2: Integration (6h)
  ├─ T1: Metrics (1.5h)
  ├─ T2: CLI (1h)
  ├─ T3: Pre-commit (1h)
  ├─ T4: GitHub Actions (1h)
  └─ T5: Integration tests (1.5h)

Session 3: Production (2h)
  ├─ T1: README (0.5h)
  ├─ T2: Optimization (0.5h)
  ├─ T3: Validation (0.5h)
  └─ T4: Handoff (0.5h)

Total: 14 hours across 3 sessions
```

---

## Appendix: Session Checklist Template

```markdown
# Session X: TASK-026 Implementation

## Pre-Session
- [ ] Read TASK-026-DESIGN.md
- [ ] Read TASK-026-IMPLEMENTATION-PLAN.md
- [ ] Read previous SESSION-XXX-HANDOFF.yaml
- [ ] Understand session objectives

## During Session
- [ ] Follow locked design (no deviations)
- [ ] Update backlog.yaml with progress
- [ ] Write tests for all code
- [ ] Document decisions

## Post-Session
- [ ] All tests passing
- [ ] Code committed with clear message
- [ ] SESSION-XXX-TASK-026-SX-PROGRESS.md created
- [ ] Handoff updated for next session
- [ ] Quality gates met for next session
```

---

**END OF IMPLEMENTATION PLAN**

*Ready for multi-session execution*
*Design locked, plan approved, ready to build*
