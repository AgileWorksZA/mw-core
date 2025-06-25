# Architectural Decision: Semantic Layer Placement

## The Question
Should the semantic layer be added to the existing `@moneyworks/core` package or created as a new package (e.g., `@moneyworks/semantic`)?

## Recommendation: New Package `@moneyworks/semantic`

After careful consideration, I recommend creating a **new package** that builds on top of core. Here's why:

## Architectural Analysis

### Option 1: Include in Core
```
@moneyworks/core
├── tables/          # Existing data interfaces
├── rest/            # REST client
├── xml/             # XML parsing
├── semantic/        # NEW: Semantic layer
└── dsl/             # NEW: Fluent DSL
```

**Pros:**
- Single package to install
- No coordination between packages
- Semantic types directly available

**Cons:**
- Increases core bundle size for all users
- Mixes concerns (data vs semantics)
- Breaking changes affect everyone
- Harder to iterate on experimental features

### Option 2: New Package (Recommended)
```
@moneyworks/core         # Data layer (existing)
├── tables/              # Pure data interfaces
├── rest/               # REST client
└── xml/                # XML parsing

@moneyworks/semantic    # Semantic layer (new)
├── intents/            # Business intents
├── builders/           # Fluent builders
├── context/            # Business context
├── queries/            # Natural language queries
└── dsl/                # Domain-specific language
```

**Pros:**
- **Separation of Concerns**: Core remains focused on data, semantic adds meaning
- **Progressive Enhancement**: Users can adopt semantic features when ready
- **Smaller Bundle Sizes**: Only include what you need
- **Faster Iteration**: Semantic layer can evolve without affecting core
- **Clear Dependencies**: Semantic depends on core, not vice versa
- **Better Testing**: Can test each layer independently

**Cons:**
- Two packages to install for full features
- Need to maintain compatibility between packages

## Proposed Architecture

### 1. Package Structure
```typescript
// @moneyworks/core (unchanged)
export interface Transaction {
  SequenceNumber: number;
  Type: string;
  // ... pure data
}

// @moneyworks/semantic
import { Transaction } from '@moneyworks/core';

export interface SemanticTransaction {
  data: Transaction;
  intent: BusinessIntent;
  story: () => string;
  validate: () => BusinessRules[];
}
```

### 2. Dependency Flow
```
Application
    ↓
@moneyworks/semantic (optional)
    ↓
@moneyworks/core (required)
    ↓
MoneyWorks REST API
```

### 3. Usage Examples

**Core-only usage** (existing code continues to work):
```typescript
import { MoneyWorksClient } from '@moneyworks/core';

const client = new MoneyWorksClient(config);
const tx = await client.create('Transaction', {
  Type: 'CP',
  Gross: 1000
});
```

**With semantic layer** (progressive enhancement):
```typescript
import { MoneyWorksClient } from '@moneyworks/core';
import { SemanticClient } from '@moneyworks/semantic';

const client = new MoneyWorksClient(config);
const semantic = new SemanticClient(client);

const payment = await semantic
  .paySupplier('ACME Corp')
  .amount(1000)
  .execute();
```

### 4. Migration Path

1. **Phase 1**: Create `@moneyworks/semantic` as experimental
2. **Phase 2**: Iterate based on feedback
3. **Phase 3**: Mark as stable
4. **Phase 4**: Optional - deprecate raw core usage for new projects
5. **Phase 5**: Optional - merge into core as v2.0 if proven

## Package Benefits Comparison

| Aspect | In Core | New Package |
|--------|---------|-------------|
| Bundle Size | Larger for everyone | Pay for what you use |
| Breaking Changes | Affect all users | Isolated to semantic users |
| Development Speed | Slower (stability) | Faster (experimental) |
| Testing | Complex | Clean separation |
| Documentation | Mixed concerns | Focused docs |
| Adoption | Forced | Progressive |
| TypeScript | Single namespace | Clean namespaces |

## Recommended Package Structure

```
packages/
├── core/                 # Existing (stable)
│   ├── src/
│   ├── package.json     # version: 1.x.x
│   └── README.md
│
├── semantic/            # New (experimental → stable)
│   ├── src/
│   │   ├── index.ts
│   │   ├── client.ts    # SemanticClient wrapper
│   │   ├── builders/    # Fluent API builders
│   │   ├── intents/     # Business intents
│   │   ├── context/     # Context providers
│   │   ├── queries/     # Natural language
│   │   └── dsl/         # Full DSL
│   ├── package.json     # version: 0.1.0
│   └── README.md
│
└── examples/            # Show both approaches
    ├── basic-core/
    └── semantic-dsl/
```

## Implementation Example

```typescript
// @moneyworks/semantic/src/client.ts
import { MoneyWorksClient } from '@moneyworks/core';
import { PaymentBuilder } from './builders';

export class SemanticClient {
  constructor(private core: MoneyWorksClient) {}
  
  paySupplier(name: string) {
    return new PaymentBuilder(this.core, name);
  }
  
  // Delegate to core for compatibility
  get export() { return this.core.export; }
  get import() { return this.core.import; }
}
```

## Decision Factors

### Choose "In Core" if:
- You want to force all users to adopt semantic patterns
- Bundle size is not a concern
- You're ready to commit to the API design
- You want a single source of truth

### Choose "New Package" if:
- You want to preserve existing API stability ✓
- You want to iterate quickly on semantic features ✓
- You want progressive adoption ✓
- You want clear separation of concerns ✓
- You want to minimize breaking changes ✓

## Conclusion

Create `@moneyworks/semantic` as a new package that enhances `@moneyworks/core`. This provides:

1. **Stability**: Core remains stable and unchanged
2. **Innovation**: Semantic layer can evolve rapidly
3. **Choice**: Users adopt semantic features when ready
4. **Performance**: Only pay for what you use
5. **Future**: Can merge into core v2 if successful

The semantic layer becomes an optional enhancement that teams can adopt progressively, while existing code continues to work unchanged.