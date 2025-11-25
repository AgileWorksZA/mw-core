# MoneyWorks Ontology Architecture

## Purpose

This tiered ontology provides AI agents with **deep semantic understanding** of the MoneyWorks domain while **managing context window budgets efficiently**.

## Design Principles

### 1. Mereological Coherence
- Parts-whole relationships are explicit
- Entity boundaries are clear
- Composition hierarchies are documented
- No knowledge exists in isolation

### 2. Lazy Loading
- Agents load only what they need
- Tiered structure enables progressive depth
- Cross-references allow navigation without full loading
- Context budgets are respected

### 3. Semantic Richness
- Values have meaning, not just types
- Enumerations carry business semantics
- Flags are decomposed to behavior
- Rules explain the "why"

## Tier Structure

```
moneyworks-ontology/
├── tier-0-core/              # ~2K tokens - ALWAYS LOADED
│   ├── paradigm.yaml         # Accounting fundamentals
│   ├── terminology.yaml      # MW canonical language
│   └── topology.yaml         # Entity map overview
│
├── tier-1-relationships/     # ~4K tokens - NAVIGATION
│   ├── dependency-graph.yaml # Creation order, cascade
│   ├── foreign-keys.yaml     # Complete FK registry
│   ├── mereology.yaml        # Parts-whole map
│   └── cardinality.yaml      # Relationship multiplicities
│
├── tier-2-semantics/         # ~2K tokens each - CONTEXTUAL
│   ├── enumerations/         # All coded values with meaning
│   ├── flags/                # Bit flag decomposition
│   └── rules/                # Business rules & constraints
│
├── tier-3-entities/          # ~4-8K tokens each - DEEP REFERENCE
│   └── {entity}-deep.yaml    # Complete entity knowledge
│
└── perspectives/             # Pre-composed agent views
    └── {role}-agent.yaml     # Role-specific ontology slices
```

## Context Budget Strategy

| Tier | Purpose | Token Budget | Loading Strategy |
|------|---------|--------------|------------------|
| Tier 0 | Core concepts | ~2K | Always loaded |
| Tier 1 | Navigation | ~4K | Loaded for exploration |
| Tier 2 | Semantics | ~2K each | Loaded contextually |
| Tier 3 | Deep knowledge | ~4-8K each | On-demand reference |
| Perspectives | Role views | ~6-10K | Pre-composed for tasks |

**Total Agent Budget**: 16K tokens typical, 32K maximum

## File Format

All files use YAML for:
- Human readability
- Easy parsing
- Comment support
- Cross-reference via anchors

## Cross-Reference Convention

```yaml
# Reference to another file
see_also: tier-2-semantics/enumerations/transaction-types.yaml#DI

# Reference to entity
foreign_key:
  target: Names.Code
  details: tier-3-entities/names-deep.yaml#Code
```

## Agent Loading Protocol

1. **Session Start**: Load tier-0-core/* (always)
2. **Task Analysis**: Identify required entities
3. **Load Dependencies**: tier-1-relationships/dependency-graph.yaml
4. **Load Semantics**: Relevant tier-2 files based on task
5. **Deep Reference**: tier-3 entities as needed during execution

## Mereological Map

```
MoneyWorks Universe
├── Financial Events (Transactions)
│   └── composed of: Detail lines (1:N)
│       └── references: Accounts, Products, Jobs, TaxRates
│
├── Business Entities (Names)
│   └── composed of: Contacts (0:N), Memos (0:N)
│   └── classified by: CustomerType, SupplierType
│
├── Financial Structure (Accounts)
│   └── hierarchical: ParentCode tree
│   └── classified by: Type, System, Category, Group
│
├── Inventory (Products)
│   └── composed of: Inventory locations (0:N)
│   └── composed of: Build Records (0:N) for assemblies
│
├── Projects (Jobs)
│   └── hierarchical: Project/Sub-project tree
│   └── linked to: Names (Client)
│
└── System (Login, User, User2, Allocations, etc.)
```

## Status

| Component | Status | Notes |
|-----------|--------|-------|
| Architecture | Complete | This document |
| Tier 0 | In Progress | Core concepts |
| Tier 1 | In Progress | Relationships |
| Tier 2 | Planned | Semantics extraction |
| Tier 3 | Planned | Entity deep dives |
| Perspectives | Planned | Agent views |

---
Last Updated: 2025-01-25
