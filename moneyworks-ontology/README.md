# MoneyWorks Semantic Ontology

A tiered knowledge architecture enabling AI agents to deeply understand the MoneyWorks accounting domain while managing context windows efficiently.

## Quick Start

For AI agents, load these files in order:

```yaml
# 1. Always load tier-0 core (~2K tokens)
- tier-0-core/paradigm.yaml      # Accounting fundamentals
- tier-0-core/terminology.yaml   # MW canonical language
- tier-0-core/topology.yaml      # Entity overview

# 2. Load tier-1 for navigation (~4K tokens)
- tier-1-relationships/dependency-graph.yaml
- tier-1-relationships/foreign-keys.yaml

# 3. Load tier-2 contextually (~2K each)
- tier-2-semantics/enumerations/transaction-types.yaml
- tier-2-semantics/flags/all-flags.yaml
- tier-2-semantics/rules/core-rules.yaml

# 4. Or use a pre-composed perspective
- perspectives/invoicing-agent.yaml
```

## Structure

```
moneyworks-ontology/
├── ARCHITECTURE.md           # Design principles
├── README.md                 # This file
│
├── tier-0-core/              # ~2K tokens - ALWAYS LOAD
│   ├── paradigm.yaml         # Double-entry accounting fundamentals
│   ├── terminology.yaml      # MoneyWorks canonical terms
│   └── topology.yaml         # All 20 entities overview
│
├── tier-1-relationships/     # ~4K tokens - NAVIGATION
│   ├── dependency-graph.yaml # Entity creation order
│   ├── foreign-keys.yaml     # 54 FK relationships
│   ├── mereology.yaml        # Parts-whole relationships
│   └── cardinality.yaml      # 1:N, N:1, M:N multiplicities
│
├── tier-2-semantics/         # ~2K tokens each - CONTEXTUAL
│   ├── enumerations/
│   │   ├── transaction-types.yaml  # 17 transaction types
│   │   └── account-types.yaml      # 10 types + 7 system types
│   ├── flags/
│   │   └── all-flags.yaml          # All bit flags decoded
│   └── rules/
│       └── core-rules.yaml         # Business rules
│
├── tier-3-entities/          # Deep entity knowledge (TODO)
│
└── perspectives/             # Pre-composed agent views
    └── invoicing-agent.yaml  # Invoice management context
```

## Key Concepts

### Tiered Loading
- **Tier 0**: Core concepts every agent needs (~2K tokens)
- **Tier 1**: Navigation and relationships (~4K tokens)
- **Tier 2**: Semantic details loaded contextually (~2K each)
- **Tier 3**: Deep entity knowledge on-demand (~4-8K each)

### Mereological Coherence
The ontology explicitly defines parts-whole relationships:
- Transactions **contain** Detail lines (1:N)
- Names **contain** Contacts and Memos (0:N)
- Products **contain** Inventory locations (0:N)
- Assets **contain** AssetLog entries (0:N)

### Foreign Key Registry
Complete mapping of 54 foreign key relationships across 20 entities, including:
- Target entity and field
- Cardinality (1:1, 1:N, N:1, M:N)
- Nullable constraints
- Semantic meaning
- Validation rules

### Business Rules
Codified rules for validation:
- Transaction balancing (debits = credits)
- Name type matching (debtor/creditor)
- Account postability checks
- Period validation

## Usage Patterns

### For Invoice Creation
```yaml
load:
  - tier-0-core/*
  - tier-2-semantics/enumerations/transaction-types.yaml
  - tier-2-semantics/rules/core-rules.yaml

key_knowledge:
  - DII: Debtor Invoice Incomplete (standard customer invoice)
  - CII: Creditor Invoice Incomplete (standard supplier invoice)
  - Must balance (debits = credits)
  - NameCode must match transaction type
```

### For Payment Processing
```yaml
load:
  - tier-0-core/*
  - tier-1-relationships/foreign-keys.yaml#Payments
  - tier-2-semantics/enumerations/transaction-types.yaml#CRD,CPC

key_knowledge:
  - Payments table links invoices to payment transactions
  - CRD: Cash Receipt Debtor (customer payment)
  - CPC: Cash Payment Creditor (supplier payment)
```

## Remaining Work

### Tier 3: Deep Entity Files
- [ ] transaction-deep.yaml - Complete transaction semantics
- [ ] account-deep.yaml - Chart of accounts patterns
- [ ] name-deep.yaml - Contact management patterns
- [ ] (18 more entities)

### Additional Perspectives
- [ ] inventory-agent.yaml
- [ ] reporting-agent.yaml
- [ ] reconciliation-agent.yaml
- [ ] admin-agent.yaml

### Enumerations
- [ ] name-types.yaml (CustomerType, SupplierType)
- [ ] product-types.yaml
- [ ] job-status.yaml
- [ ] payment-methods.yaml

---

**Source**: Extracted from MoneyWorks canonical ontologies in `generated/`
**Coverage**: 20/20 entities at 99.6% average field coverage
