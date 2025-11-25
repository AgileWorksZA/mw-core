# Ontology Validation Framework

## The Problem

AI-generated ontologies are stochastic - they can hallucinate, misinterpret, or omit information. Every claim in the ontology must be **verifiable against source material**.

## Validation Principles

### 1. Source of Truth Hierarchy
```
Level 1: MoneyWorks Manual HTML (mirror/)     - AUTHORITATIVE
Level 2: Canonical Ontology TS (generated/)   - DERIVED FROM L1
Level 3: Semantic Ontology YAML (this dir)    - DERIVED FROM L2
```

Every claim at Level 3 must trace back to Level 2, which traces to Level 1.

### 2. Verification Categories

| Category | What to Verify | Source |
|----------|----------------|--------|
| FK Relationships | Target entity/field exists | canonical *.ts files |
| Enumerations | Values and meanings correct | canonical *.ts enums |
| Flags | Bit positions and names | canonical *.ts flags |
| Rules | Business logic accurate | canonical *.ts comments |
| Cardinality | 1:N, N:1 correct | FK definitions |

### 3. Validation Output Format

```yaml
validation_result:
  file: tier-1-relationships/foreign-keys.yaml
  claim: "Transactions.NameCode targets Names.Code"
  source_file: generated/moneyworks-transactions-canonical-ontology.ts
  source_line: 526
  source_text: 'relationshipTarget: "Names.Code"'
  status: VERIFIED | DISCREPANCY | NOT_FOUND
  discrepancy: null | "description of mismatch"
```

## Validation Agents

### Agent 1: FK Registry Validator
- **Input**: `tier-1-relationships/foreign-keys.yaml`
- **Source**: All `generated/moneyworks-*-canonical-ontology.ts` files
- **Task**: For each FK, verify target entity/field exists in source

### Agent 2: Enumeration Validator
- **Input**: `tier-2-semantics/enumerations/*.yaml`
- **Source**: Enum definitions in canonical TS files
- **Task**: Verify each enum value and its meaning

### Agent 3: Flag Validator
- **Input**: `tier-2-semantics/flags/all-flags.yaml`
- **Source**: Flag enum definitions in canonical TS files
- **Task**: Verify bit positions and semantic meanings

### Agent 4: Rule Validator
- **Input**: `tier-2-semantics/rules/core-rules.yaml`
- **Source**: Comments and validation logic in canonical TS files
- **Task**: Verify rules match documented behavior

## Execution Protocol

```bash
# Run all validators in parallel
# Each produces a validation report
# Discrepancies are flagged for human review
```

## Discrepancy Handling

### Severity Levels
- **CRITICAL**: FK target doesn't exist (breaks referential integrity)
- **HIGH**: Enum value incorrect (causes wrong behavior)
- **MEDIUM**: Flag bit position wrong (causes data corruption)
- **LOW**: Semantic description differs (documentation issue)

### Resolution Process
1. Agent flags discrepancy with evidence
2. Human reviews source material
3. Ontology updated OR source material corrected
4. Re-validation confirms fix

## Quality Metrics

### Coverage
- % of FK relationships verified
- % of enum values verified
- % of flag bits verified
- % of rules verified

### Accuracy
- Discrepancies found / Total claims
- Target: <1% discrepancy rate

## Continuous Validation

When canonical ontologies are updated:
1. Re-run validation agents
2. Flag any new discrepancies
3. Update semantic ontology to match
