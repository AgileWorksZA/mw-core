# PROD-001: Implementation Notes

## Session Log

### 2025-11-24 - Story Creation (gothic-boa session)

**Context Gathered**:
- Examined existing Name and TaxRate implementations
- Reviewed canonical ontology at `/generated/moneyworks-products-canonical-ontology.ts`
- Consulted Weave (Shadow Advisor) for institutional knowledge
- User confirmed: Include full UI, use real data from localhost MoneyWorks + mock data

**Key Decisions**:
1. Follow exact pattern from Name and TaxRate for consistency
2. Include full-stack (canonical + data + API + UI) in single story
3. Source real product data from localhost:6710/acme.moneyworks
4. Create mock data for autonomous testing
5. 14 acceptance criteria across 6 phases

**Weave Insights Applied**:
- CRITICAL: TableRegistry registration is mandatory (AC-007)
- Implement 6 specialized query methods beyond CRUD (AC-004)
- Follow full-stack delivery pattern (all layers in one story)
- Preserve canonical MoneyWorks DSL terminology

**MoneyWorks Connection**:
```json
{
  "host": "localhost",
  "port": 6710,
  "dataFile": "acme.moneyworks",
  "username": "Herman Geldenhuys",
  "password": "",
  "folderPassword": "",
  "folderName": ""
}
```

**Suggested Test Products** (to be created in MoneyWorks):
1. `PROD-001` - Standard product (Type=P, inventoried, bought and sold)
2. `SERV-001` - Service/Time product (Type=T, not inventoried)
3. `SHIP-STANDARD` - Standard shipping (Type=S)
4. `PROD-LOW` - Product with low stock (StockOnHand < ReorderLevel)
5. `SUPP-TEST` - Product with specific supplier for supplier queries

## Questions for Implementation

- [ ] Do we need to handle multi-location inventory (StockOnHand per location)?
- [ ] Should we support quantity break pricing in UI, or just display base prices?
- [ ] Do we need batch/serial number tracking in Phase 1?
- [ ] Should product creation validate account codes exist (COGAcct, SalesAcct, StockAcct)?

## References

**Similar Implementations**:
- Name: `/packages/data/src/repositories/name.repository.ts`
- TaxRate: `/packages/data/src/repositories/tax-rate.repository.ts`
- Name Controller: `/packages/api/src/controllers/name.ts`
- TaxRate Controller: `/packages/api/src/controllers/tax-rate.ts`
- TaxRate UI: `/packages/web1/app/routes/tax-rates.tsx`
- TaxRate Detail UI: `/packages/web1/app/routes/tax-rates.$code.tsx`

**Key Files**:
- Canonical: `/generated/moneyworks-products-canonical-ontology.ts`
- Base Repository: `/packages/data/src/repositories/base.repository.ts`
- Base Controller: `/packages/api/src/controllers/base-table.ts`
- TableRegistry: `/packages/api/src/registry/table-registry.ts`
- Routes Config: `/packages/web1/app/routes.ts`

## Execution Plan

When ready to execute, use: `/loom:plan PROD-001` to break down into tasks, then `/loom:start PROD-001` for autonomous execution.
