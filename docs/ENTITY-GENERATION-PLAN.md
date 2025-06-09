# MoneyWorks Entity Generation Plan

## Overview
Convert all 33 MoneyWorks entities from generic types to semantic, documentation-driven TypeScript interfaces with proper enums, validation, and query builders.

## Progress Dashboard

| Entity | Status | Priority | Coverage | Last Updated | Notes |
|--------|---------|----------|----------|--------------|-------|
| **Name** | ✅ Complete | Critical | 100% | 2025-01-15 | Customer/supplier entity with all enums |
| **Account** | 🔄 In Progress | Critical | 0% | - | Chart of accounts - next target |
| **Transaction** | 📋 Planned | Critical | 0% | - | Main financial transactions |
| **Product** | 📋 Planned | High | 0% | - | Inventory management |
| **Ledger** | 📋 Planned | High | 0% | - | General ledger entries |
| Detail | 📋 Planned | Medium | 0% | - | Transaction details |
| Job | 📋 Planned | Medium | 0% | - | Job/project tracking |
| Offledger | 📋 Planned | Medium | 0% | - | Off-ledger transactions |
| Contacts | 📋 Planned | Low | 0% | - | Contact management |
| Asset | 📋 Planned | Low | 0% | - | Fixed asset tracking |
| Assetlog | 📋 Planned | Low | 0% | - | Asset transaction log |
| Assetcat | 📋 Planned | Low | 0% | - | Asset categories |
| Autosplit | 📋 Planned | Low | 0% | - | Automatic splits |
| Bankrecs | 📋 Planned | Low | 0% | - | Bank reconciliation |
| Build | 📋 Planned | Low | 0% | - | Build assembly |
| Department | 📋 Planned | Low | 0% | - | Department codes |
| Filter | 📋 Planned | Low | 0% | - | Data filters |
| General | 📋 Planned | Low | 0% | - | General settings |
| Inventory | 📋 Planned | Low | 0% | - | Inventory movements |
| Jobsheet | 📋 Planned | Low | 0% | - | Job worksheets |
| Link | 📋 Planned | Low | 0% | - | Data links |
| Lists | 📋 Planned | Low | 0% | - | Custom lists |
| Log | 📋 Planned | Low | 0% | - | System logs |
| Login | 📋 Planned | Low | 0% | - | User sessions |
| Memo | 📋 Planned | Low | 0% | - | Memo entries |
| Message | 📋 Planned | Low | 0% | - | System messages |
| Payments | 📋 Planned | Low | 0% | - | Payment methods |
| Stickies | 📋 Planned | Low | 0% | - | Sticky notes |
| Taxrate | 📋 Planned | Low | 0% | - | Tax rate definitions |
| User | 📋 Planned | Low | 0% | - | User accounts |
| User2 | 📋 Planned | Low | 0% | - | Extended user data |

**Total: 33 entities**
**Complete: 1 (3%)**
**In Progress: 1 (Account)**
**Remaining: 31**

## 4-Day Implementation Plan

### Day 1: Infrastructure (2 hours) - IN PROGRESS
- [x] HTTrack mirroring setup
- [x] Documentation structure
- [x] Entity mapping system
- [x] Name entity (COMPLETE)
- [ ] Mirror MoneyWorks docs
- [ ] Verify mirror completeness

### Day 2: Core Financial Entities (4 hours)
**Target: Account + Transaction**
- [ ] Account entity (Type, System enums)
- [ ] Transaction entity (Type, Status enums)
- [ ] Integration with Level-0 API
- [ ] Basic validation tests

### Day 3: Business Entities (4 hours)
**Target: Product + Ledger + Detail**
- [ ] Product entity (pricing, inventory)
- [ ] Ledger entity (GL entries)
- [ ] Detail entity (transaction lines)
- [ ] Cross-entity relationships

### Day 4: Integration & Testing (4 hours)
**Target: MCP Tools + Level-0 Integration**
- [ ] Update MCP tools with semantic types
- [ ] Level-0 API integration
- [ ] End-to-end testing
- [ ] Documentation updates

## Entity Prioritization

### Critical (Must have for Level-0)
1. **Name** ✅ - Customer/supplier management
2. **Account** 🔄 - Chart of accounts
3. **Transaction** 📋 - Financial transactions
4. **Product** 📋 - Inventory/services

### High Priority (Core business logic)
5. **Ledger** - General ledger
6. **Detail** - Transaction details
7. **Job** - Project tracking
8. **Offledger** - Off-ledger items

### Medium Priority (Extended functionality)
9-20. **Asset, Contacts, Department** etc.

### Low Priority (System/utility)
21-33. **Log, Message, Filter** etc.

## Documentation Sources

### Primary Sources (AppendixHTML)
- `moneyworks_appendix_names.html` ✅
- `moneyworks_appendix_accounts.html` 🔄
- `moneyworks_appendix_transactions.html` 📋
- `moneyworks_appendix_products.html` 📋
- `moneyworks_appendix_ledger.html` 📋
- Additional appendix pages as discovered

### Secondary Sources
- Developer API documentation
- User manual sections
- Field reference guides

## Parallel Processing Strategy

### Claude Instance Assignment
```yaml
Claude-1 (Primary): Account entity
Claude-2: Transaction entity  
Claude-3: Product entity
Claude-4: Ledger entity
```

Each Claude instance:
1. Reads specific documentation
2. Generates TypeScript entity
3. Creates validation rules
4. Builds query helpers
5. Submits for review

### Quality Control
- Primary Claude reviews all submissions
- Consistent pattern validation
- Integration testing
- Documentation verification

## File Structure

```
mw-core/
├── mirror/                    # HTTrack documentation mirror
│   ├── manual/               # MoneyWorks manual
│   └── developer/            # Developer docs
├── generated/                # Generated TypeScript entities
│   ├── name.ts              ✅ Complete
│   ├── account.ts           🔄 In progress
│   ├── transaction.ts       📋 Planned
│   └── ...
├── entity-mappings.yaml     # Documentation mapping
└── docs/
    ├── ENTITY-GENERATION-PLAN.md  # This file
    └── progress/             # Daily progress logs
```

## Success Criteria

### Per Entity
- [ ] Complete TypeScript interface
- [ ] All semantic enums defined
- [ ] Field validation functions
- [ ] Query builder methods
- [ ] Integration with Level-0 API
- [ ] 100% field coverage from docs

### Overall Project
- [ ] All 33 entities generated
- [ ] Level-0 API uses semantic types
- [ ] MCP tools updated
- [ ] End-to-end testing passes
- [ ] Documentation complete

## Commands & Scripts

### Mirror Documentation
```bash
./scripts/mirror-docs.sh
```

### Generate Entity
```bash
npm run generate:entity <entity-name>
```

### Validate All
```bash
npm run validate:entities
```

### Integration Test
```bash
npm run test:integration
```

## Next Immediate Actions

1. **Run HTTrack mirroring** ⏳
2. **Verify Account appendix exists**
3. **Generate Account entity**
4. **Test Level-0 integration**

---

**Last Updated:** January 15, 2025
**Next Review:** Daily during 4-day sprint 