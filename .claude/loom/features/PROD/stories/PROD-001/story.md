# PROD-001: Complete Product Entity Implementation with Full-Stack CRUD

## Why (Root Motivation)

Enable developers to build production-ready business applications by providing complete CRUD operations for Products, following proven architectural patterns. Products are central to inventory management, pricing, and sales operations in MoneyWorks.

**Business Impact**: Without Product entity support, the SDK cannot enable real-world e-commerce, inventory, or sales applications. Products are fundamental to any business operating MoneyWorks.

**5 Whys Analysis**:
1. Why implement Products? → To manage product catalog, pricing, and inventory in MoneyWorks
2. Why manage product catalog? → To enable complete business operations (purchasing, sales, inventory tracking)
3. Why enable these operations? → To provide full-featured MoneyWorks integration
4. Why full-featured integration? → To make the MoneyWorks TypeScript SDK production-ready and usable in real business applications
5. Why production-ready SDK? → **To enable developers to build complete business applications on top of MoneyWorks**

## Description

Implement full-stack Product entity support following the established architectural pattern from Name and TaxRate entities. This story delivers:

- **Canonical Types** (Phase 1): TypeScript interfaces for Product entity
- **Data Layer** (Phase 2): ProductRepository with specialized query methods
- **API Layer** (Phase 3): ProductController with validation and TableRegistry registration
- **UI Layer** (Phase 4): React routes for product list and detail views
- **Validation** (Phase 5): TypeScript compilation, API endpoint testing, browser testing
- **Documentation** (Phase 6): JSDoc comments on all public methods

The canonical ontology already exists in `/generated/moneyworks-products-canonical-ontology.ts` with comprehensive field definitions, enums, and validation functions.

## Acceptance Criteria

### Phase 1: Canonical Types (leveraging existing ontology)
- [x] **AC-001**: Canonical ontology exists at `/generated/moneyworks-products-canonical-ontology.ts` with all enums and field definitions
  - Status: Already complete (pre-existing)
  - Evidence: File exists with 970+ lines of canonical definitions

- [ ] **AC-002**: Create TypeScript types in `packages/canonical/src/entities/products/types.ts`:
  - `MoneyWorksProduct` interface (full entity with all fields)
  - `MoneyWorksProductCreateInput` interface (required fields only)
  - `MoneyWorksProductUpdateInput` interface (partial updates)
  - `MoneyWorksProductFilter` type (for search/filtering)
  - Use branded types where appropriate: `AccountCode` for `COGAcct`, `SalesAcct`, `StockAcct`

### Phase 2: Data Layer (Repository)
- [ ] **AC-003**: Create `ProductRepository` extending `BaseMoneyWorksRepository` at `packages/data/src/repositories/product.repository.ts`:
  - `tableName = "Product"`
  - `primaryKey = "Code"`
  - `postProcess()` method to add branded types and parse MoneyWorks data (flags, hash, numeric fields)
  - `prepare()` method to convert typed data to MoneyWorks format

- [ ] **AC-004**: Implement 6 specialized query methods in ProductRepository:
  - `findByCode(code: string): Promise<MoneyWorksProduct | null>` - Find product by code
  - `findByType(type: MoneyWorksProductType): Promise<MoneyWorksProduct[]>` - Find by product type (P/R/T/S/O)
  - `findInventoried(): Promise<MoneyWorksProduct[]>` - Find products with inventory tracking (Hash & 0x0008)
  - `findBySupplier(supplierCode: string): Promise<MoneyWorksProduct[]>` - Find products from specific supplier
  - `searchByCategory(categoryNumber: 1|2|3|4, value: string): Promise<MoneyWorksProduct[]>` - Search by category
  - `findLowStock(): Promise<MoneyWorksProduct[]>` - Find products below reorder level

- [ ] **AC-005**: Export ProductRepository from `packages/data/src/repositories/index.ts`

### Phase 3: API Layer (Controller + Registry)
- [ ] **AC-006**: Create `ProductController` extending `BaseTableController` at `packages/api/src/controllers/product.ts`:
  - `tableName = "Product"`
  - `displayName = "Products"`
  - `description = "Products, inventory, and pricing in MoneyWorks"`
  - `getPrimaryKey()` returns `"Code"`

- [ ] **AC-007**: **CRITICAL** - Register ProductController in TableRegistry at `packages/api/src/registry/table-registry.ts`:
  - Import ProductController
  - Add `this.register(new ProductController(this.client))` to `registerTables()` method
  - Remove "Product" from 'upcoming' array if present
  - Verify Product appears in `/api/v1/tables` response under 'available'
  - **Note**: This is a known pain point - TableRegistry registration is MANDATORY per Weave knowledge

### Phase 4: UI Layer (React Routes)
- [ ] **AC-008**: Create React route files:
  - `packages/web1/app/routes/products.tsx` - List view with:
    - Server-side loader fetching products via smartExport
    - Search/filter controls (search by code/description, filter by type)
    - Pagination controls (page, limit)
    - Table display with key fields (Code, Description, Type, SellPrice, StockOnHand)
    - Click to navigate to detail view
  - `packages/web1/app/routes/products.$code.tsx` - Detail view with:
    - Server-side loader fetching specific product
    - Edit form for key fields (Code, Description, Type, BuyPrice, SellPrice, etc.)
    - Save/Delete actions
    - Back to list navigation

- [ ] **AC-009**: Register product routes in `packages/web1/app/routes.ts`:
  - `route("products", "routes/products.tsx")`
  - `route("products/:code", "routes/products.$code.tsx")`

- [ ] **AC-010**: Add Products navigation link in Navigation component:
  - Add link to `/products` in main navigation menu
  - Icon: Package or Box icon from lucide-react
  - Label: "Products"

### Phase 5: Validation & Testing
- [ ] **AC-011**: TypeScript compilation passes with zero errors:
  - Run `bun run typecheck` from repository root
  - No type errors in canonical, data, api, or web1 packages
  - Evidence: Collect compiler output

- [ ] **AC-012**: API endpoints are accessible and functional:
  - `GET /api/v1/tables` returns Product in 'available' array
  - `GET /api/v1/tables/Product` returns Product metadata
  - `GET /api/v1/tables/Product/export` returns products array (if test data available)
  - `GET /api/v1/tables/Product/{code}` returns specific product by code
  - Evidence: Collect curl/fetch responses

- [ ] **AC-013**: Web UI is functional:
  - Navigate to `/products` - displays product list
  - Search/filter controls work correctly
  - Click on product navigates to `/products/{code}`
  - Detail view displays all key product fields
  - Edit form allows modifications (if permissions allow)
  - Evidence: Screenshots or browser testing notes

### Phase 6: Documentation
- [ ] **AC-014**: Add JSDoc comments to all public methods in ProductRepository:
  - Clear description of purpose
  - `@param` tags for all parameters
  - `@returns` description
  - `@example` where helpful for complex methods
  - `@ai-instruction` for AI-specific guidance
  - Follow project standards from Name and TaxRate repositories

## Weave Knowledge

**Relevant Patterns**:
- **E:pattern-full-stack-delivery** (Confidence: 0.95): All 4 layers (canonical, data, API, UI) must be included in a single story for complete delivery
- **E:pattern-specialized-queries** (Confidence: 0.95): Implement domain-specific query methods beyond generic CRUD
- **E:pattern-canonical-dsl** (Confidence: 1.0): Preserve exact MoneyWorks terminology - use `Code`, `Type`, `COGAcct`, `SalesAcct`, `StockAcct`
- **E:pattern-5-file-canonical** (Confidence: 1.0): Maintain consistent canonical structure (enums, types, fields, validators, index)

**Pain Points to Avoid**:
- **Q:painpoint-table-registry** (Confidence: 1.0, Severity: CRITICAL): TableRegistry registration is NOT optional - Product must be registered or it stays 'upcoming'
- **Q:painpoint-tsv-headers**: Use XML exports for field discovery, TSV for data export efficiency
- **Q:painpoint-client-recreation**: Leverage existing client caching (10-min TTL) in auth middleware

**Best Practices**:
- Follow Name and TaxRate patterns exactly for consistency
- Support mock mode for testing (`MONEYWORKS_MOCK_MODE=true`)
- Use branded types for domain primitives (`AccountCode`)
- Preserve canonical MoneyWorks field names (no camelCase translation)

## Implementation Notes

### Data Requirements
We'll source real product data from the local MoneyWorks instance:
- **Connection**: localhost:6710
- **DataFile**: acme.moneyworks
- **Auth**: No password required

**Suggested test products** (you'll set these up in MoneyWorks if needed):
1. Standard product (P type) - inventoried, bought and sold
2. Service/Time product (T type) - not inventoried
3. Ship method (S type)
4. Product with low stock (triggers reorder warning)
5. Product from specific supplier (for supplier queries)

### Primary Key
- Product uses `Code` as primary key (not `TaxCode` like TaxRate, not `AccountCode` like Account)

### Complex Fields
- `Hash` field: Binary flags for buy/sell/inventory status
- `Flags` field: Complex bit flags for pricing, tax inclusion, serial numbers, batch tracking
- Multiple sell prices: SellPrice (A), SellPriceB-F with quantity breaks
- Account relationships: COGAcct, SalesAcct, StockAcct (all AccountCode branded types)

### Follow Existing Patterns
- **Repository pattern**: See `name.repository.ts` and `tax-rate.repository.ts`
- **Controller pattern**: See `name.ts` and `tax-rate.ts` controllers
- **UI pattern**: See `tax-rates.tsx` and `tax-rates.$code.tsx` routes

## Complexity: Moderate
## Priority: High

## Notes

This story completes the Product entity implementation that was started but never finished (was stuck as 'upcoming' in TableRegistry). Following the full-stack delivery pattern from Account (US-002), we ensure all layers are complete in a single story to avoid partial implementations.
