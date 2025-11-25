# MoneyWorks Canonical Ontology - Project Context

## Invariant Reference Document

This document captures the **invariant epistemic dimensions** for the MoneyWorks Canonical Ontology project. It defines the mission, vision, philosophical foundations, and non-negotiable principles that guide all work.

---

## Mission

**To establish a 100% truthful, high-fidelity, mereologically coherent semantic ontology of MoneyWorks that enables AI agents to deeply understand and reason about accounting operations.**

### Mission Imperatives

1. **Truth over convenience** - Every claim must be verifiable against source material
2. **Fidelity over abstraction** - Capture MoneyWorks as it IS, not as we think it should be
3. **Coherence over completeness** - Better to have verified facts than unverified assumptions
4. **Utility over elegance** - The ontology serves agents; agent understanding is the measure of success

---

## Vision

An AI agent, upon loading the MoneyWorks ontology, should be able to:

1. **Understand** what a Debtor Invoice is, why it exists, and what it accomplishes
2. **Reason** about the consequences of creating a transaction (GL effects, balances, relationships)
3. **Validate** whether a proposed operation is correct before attempting it
4. **Explain** MoneyWorks concepts to users in their domain language
5. **Navigate** the entity model to find related information
6. **Predict** system behavior based on ontological knowledge

### Vision Outcome

> "The ontology is the agent's accounting education - complete, accurate, and immediately applicable."

---

## Why This Matters

### The Problem

Current AI agents working with MoneyWorks face:

1. **Semantic blindness** - They see field names but don't understand meaning
2. **Relationship ignorance** - They don't know what connects to what
3. **Rule opacity** - Business rules are embedded in code, invisible to agents
4. **Context loss** - Each session starts from zero understanding

### The Solution

A canonical ontology provides:

1. **Semantic grounding** - Every concept has defined meaning
2. **Relationship mapping** - All connections are explicit
3. **Rule documentation** - Business logic is captured declaratively
4. **Epistemic persistence** - Knowledge survives across sessions

### The Stakes

- **Without ontology**: Agents make errors, hallucinate relationships, frustrate users
- **With ontology**: Agents operate correctly, reason accurately, earn trust

---

## Philosophical Foundations

### Eitology (Essence/Being)

**What IS each MoneyWorks concept?**

For each entity, we must capture:

- **Essential properties** - What makes a Transaction a Transaction?
- **Necessary conditions** - What must be true for this entity to exist?
- **Identity criteria** - What distinguishes one instance from another?

Example:
```
Transaction:
  essence: "A financial event affecting the General Ledger"
  necessary_conditions:
    - "Must have at least one Detail line"
    - "Must balance (debits = credits)"
    - "Must have a valid TypeCode"
  identity: "SequenceNumber (system-assigned, unique)"
```

### Axiology (Value)

**What makes accounting "good"?**

Values embedded in MoneyWorks:

- **Balance** - The double-entry equation must hold
- **Accuracy** - Amounts must reflect reality
- **Completeness** - All events must be recorded
- **Timeliness** - Events recorded in correct periods
- **Auditability** - Actions must be traceable
- **Control** - Sensitive operations require authorization

These values inform business rules and validation logic.

### Teleology (Purpose/Ends)

**Why does each entity exist? What end does it serve?**

For each entity, we document:

- **Purpose** - Why was this created?
- **Goal** - What does it accomplish?
- **Beneficiary** - Who/what benefits from its existence?

Example:
```
Payments:
  purpose: "Link invoices to payment transactions"
  goal: "Enable accurate AR/AP aging and allocation"
  beneficiary: "Finance users managing receivables/payables"
  telos: "Ensure every dollar is accounted for"
```

### Epistemology (Knowledge)

**How do we KNOW what we claim?**

Knowledge sources in priority order:

1. **Manual** - MoneyWorks official documentation (authoritative)
2. **Canonical TS** - TypeScript ontology files (derived from manual)
3. **API Behavior** - Observed system behavior (empirical)
4. **Inference** - Logical deduction from verified facts (reasoned)
5. **Assumption** - Educated guesses (provisional)

Every claim must cite its source and confidence level.

---

## Confidence Dimensions

These dimensions objectively qualify our epistemic confidence:

### 1. Structural Integrity (95%)
- **Definition**: Internal consistency of ontology structure
- **Measures**: FK validity, cardinality consistency, no circular dependencies
- **Verification**: Multi-agent validation pass

### 2. Entity Coverage (100%)
- **Definition**: All MoneyWorks entities represented
- **Measures**: Documented entities / Total entities
- **Verification**: Comparison against canonical TS files

### 3. Enumeration Accuracy (100%)
- **Definition**: All coded values correctly defined
- **Measures**: Verified enums / Total enums
- **Verification**: Cross-check against source TS

### 4. Flag Accuracy (100%)
- **Definition**: All flag bits correctly defined
- **Measures**: Verified flags / Total flags
- **Verification**: Cross-check against source TS

### 5. FK Verification (41%)
- **Definition**: Foreign key relationships verified against source
- **Measures**: Source-verified FKs / Total FKs
- **Verification**: Check for relationshipTarget in source

### 6. Qualia Richness (51%)
- **Definition**: Semantic depth and meaning capture
- **Measures**: Semantic completeness, contextual richness, boundary clarity
- **Verification**: Multi-perspective agent assessment

### 7. Source Fidelity (1.7%)
- **Definition**: Alignment with authoritative manual
- **Measures**: Manual files processed / Total files
- **Verification**: Document processing logs

### 8. Mereological Coherence (100%)
- **Definition**: Parts-whole relationship consistency
- **Measures**: Verified relationships / Claimed relationships
- **Verification**: Structural analysis, asymmetry checks

---

## Invariants

### Epistemic Invariants

These MUST hold for all knowledge claims:

1. **Traceability** - Every claim must cite its source
2. **Calibration** - Confidence must match evidence strength
3. **Transparency** - Unverified claims must be marked
4. **Falsifiability** - Claims must be empirically testable
5. **Updateability** - New evidence can revise beliefs

### Ontological Invariants

These MUST hold for all structural claims:

1. **Mereological Coherence** - Parts-whole relationships are consistent
2. **Asymmetry** - No circular containment (A contains B contains A)
3. **Transitivity** - If A contains B contains C, then A contains C
4. **Supplementation** - Wholes have at least one part
5. **Identity** - Each entity has unique identification

### Methodological Invariants

These MUST guide all work:

1. **Source Primacy** - Manual > Inference > Assumption
2. **Empirical Validation** - Test claims against live system
3. **Session Persistence** - State survives across sessions
4. **Parallel Mining** - Use subagents for efficiency
5. **Continuous Validation** - Re-verify as knowledge grows

---

## Source Material

### Primary Source

```
Location: /Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror
Content: Complete MoneyWorks manual (HTTrack mirror)
Files: 1201 HTML documents
Authority: Canonical (official MoneyWorks documentation)
```

### Secondary Source

```
Location: /Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/generated
Content: Canonical TypeScript ontology files
Files: 20 moneyworks-*-canonical-ontology.ts
Authority: Derived (extracted from manual by previous agents)
```

### Tertiary Source

```
Location: Live MoneyWorks API
Content: Actual system behavior
Authority: Empirical (ground truth for validation)
```

---

## Mining Strategy

### Phase 1: Index Creation

Build canonical index of 1201 HTML files:

```yaml
index_structure:
  by_entity: "Map entity names → relevant documents"
  by_topic: "Map topics → documents"
  by_appendix: "Direct appendix file references"
  by_keyword: "Searchable keyword index"
```

### Phase 2: Parallel Mining

Deploy subagents for document extraction:

```yaml
mining_protocol:
  agents_per_batch: 5
  strategy: "Entity-parallel (one entity per agent)"
  extraction_targets:
    - field_definitions
    - relationship_targets
    - business_rules
    - usage_examples
    - semantic_descriptions
```

### Phase 3: Cross-Validation

Second-pass verification:

```yaml
validation_protocol:
  method: "Agent B reviews Agent A's extraction"
  conflict_resolution: "Source document wins"
  confidence_assignment: "Based on evidence strength"
```

### Phase 4: Reification

Compile validated knowledge into canonical ontology:

```yaml
reification_protocol:
  format: "YAML with source citations"
  structure: "Tiered (0-core, 1-relationships, 2-semantics, 3-entities)"
  tagging: "All claims tagged with confidence level"
```

---

## Success Criteria

### Quantitative

| Metric | Current | Target |
|--------|---------|--------|
| Overall Confidence | 48.7% | 85%+ |
| FK Verification | 41% | 90%+ |
| Qualia Richness | 51% | 80%+ |
| Source Fidelity | 1.7% | 95%+ |

### Qualitative

- **Agent Understanding**: An agent can explain any MoneyWorks concept accurately
- **Operational Correctness**: Agent-guided operations succeed without errors
- **User Trust**: Users rely on agent for MoneyWorks guidance
- **Zero Hallucination**: No invented relationships or rules

---

## Project Structure

```
moneyworks-ontology/
├── context.md              # This file - invariants and vision
├── state.yaml              # Persistent epistemic state
├── backlog.yaml            # Task tracking
├── handoff.yaml            # Session initialization
│
├── tier-0-core/            # Foundational concepts (always load)
├── tier-1-relationships/   # Entity relationships
├── tier-2-semantics/       # Enumerations, flags, rules
├── tier-3-entities/        # Deep entity knowledge (future)
├── perspectives/           # Agent-specific views
│
├── VALIDATION-*.md         # Validation reports
├── ARCHITECTURE.md         # System design
└── README.md               # Quick start
```

---

## Governance

### Change Protocol

1. All changes must maintain mereological coherence
2. New claims require source citation
3. Confidence scores updated with evidence
4. State.yaml reflects current truth

### Quality Gates

- No claim without source
- No structure change without validation
- No session end without state update
- No empirical claim without test

---

## Closing Principle

> "The map is not the territory, but a good map respects the territory."

Our ontology must faithfully represent MoneyWorks as it exists, not as we wish it to be. Truth is the foundation; utility follows from truth.

---

**Document Status**: Invariant Reference
**Last Updated**: 2025-01-25
**Authority**: Project Constitution
