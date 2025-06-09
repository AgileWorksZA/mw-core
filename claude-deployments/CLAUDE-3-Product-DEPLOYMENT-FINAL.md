# Claude-3 Deployment Package: Product Entity Generation

## 🎯 Your Mission
You are Claude-3 in a parallel processing team generating MoneyWorks entities.
Generate a complete semantic TypeScript definition for the **Product** entity using **official MoneyWorks documentation**.

## 📋 Complete Assignment

### Entity Details
- **Entity**: Product
- **Priority**: Critical (inventory management - 60+ fields)
- **Complexity**: High (pricing levels, inventory tracking, categories)
- **Reference Pattern**: Use the Name entity pattern as your template

### 🌐 Official Documentation Access
**CRITICAL**: Access the official MoneyWorks field descriptions here:
- **Primary URL**: https://cognito.co.nz/manual/moneyworks_appendix_appendix_afield_descriptions.html
- **Search for**: "Product" or "Item" table documentation
- **Backup search**: Use web_search tool to find MoneyWorks Product appendix

Use web_search like this:
```
web_search("site:cognito.co.nz product item table fields appendix")
```

### Key Semantic Fields to Focus On
Based on your source interface, focus on these critical enums:

```typescript
export enum ProductType {
  // Based on Type field (size="2") - find official values
}

export enum PricingLevel {
  A = "A",
  B = "B", 
  C = "C",
  D = "D",
  E = "E",
  F = "F"
}

export enum JobPricingMode {
  // Based on JobPricingMode field (number) - find official values
}
```

## 📁 COMPLETE Source API Definition
Your TypeScript interface MUST cover all these fields from your codebase:

```typescript
export interface Product {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed size="32" */
  Code: string;
  /** @mutable="freely, script-only" size="40" */
  SuppliersCode: string;
  /** @mutable="conditionally" size="12" */
  Supplier: string;
  /** @mutable="freely, script-only" size="256" */
  Description: string;
  /** @mutable="freely, script-only" size="1024" */
  Comment: string;
  /** @mutable="freely, script-only" size="16" */
  Category1: string;
  /** @mutable="freely, script-only" size="16" */
  Category2: string;
  /** @mutable="freely, script-only" size="16" */
  Category3: string;
  /** @mutable="freely, script-only" size="16" */
  Category4: string;
  /** size="14" */
  SalesAcct: string;
  /** size="14" */
  COGAcct: string;
  /** size="14" */
  StockAcct: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="6" */
  SellUnit: string;
  /** @mutable="conditionally" */
  SellPrice: number;
  /** @mutable="conditionally" */
  Plussage: number;
  /** @mutable="conditionally" */
  BuyWeight: number;
  /** @mutable="freely, script-only" size="6" */
  BuyUnit: string;
  CostPrice: number;
  ConversionFactor: number;
  /** @mutable="freely, script-only" */
  MarginWarning: number;
  /** @mutable="conditionally" */
  SellDiscount: number;
  /** @mutable="conditionally" */
  SellDiscountMode: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  StockOnHand: number;
  StockValue: number;
  MinBuildQty: number;
  NormalBuildQty: number;
  /** @mutable="freely, script-only" */
  ReorderLevel: number;
  /** @mutable="conditionally" */
  JobPricingMode: number;
  /** @mutable="freely, script-only" */
  Flags: number;
  /** @mutable="conditionally" */
  Colour: number;
  /** @mutable="freely, script-only" */
  UseMultiplePrices: boolean;
  /** @mutable="conditionally" */
  SellPriceB: number;
  /** @mutable="conditionally" */
  SellPriceC: number;
  /** @mutable="conditionally" */
  SellPriceD: number;
  /** @mutable="conditionally" */
  SellPriceE: number;
  /** @mutable="conditionally" */
  SellPriceF: number;
  /** @mutable="conditionally" */
  QtyBreak1: number;
  /** @mutable="conditionally" */
  QtyBreak2: number;
  /** @mutable="conditionally" */
  QtyBreak3: number;
  /** @mutable="conditionally" */
  QtyBreak4: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceA1: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceA2: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceA3: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceA4: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceB1: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceB2: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceB3: number;
  /** @mutable="conditionally" */
  QtyBrkSellPriceB4: number;
  /** @indexed @mutable="conditionally" size="2" */
  Type: string;
  /** @mutable="conditionally" */
  Count: number;
  OnOrder: number;
  StockTakeStartQty: number;
  StockTakeValue: number;
  /** @mutable="freely, script-only" */
  StockTakeNewQty: number;
  /** @indexed @mutable="freely, script-only" size="20" */
  BarCode: string;
  /** size="4" */
  BuyPriceCurrency: string;
  /** @mutable="conditionally" */
  BuyPrice: number;
  /** @mutable="freely, script-only" size="256" */
  Custom1: string;
  /** @mutable="freely, script-only" size="256" */
  Custom2: string;
  /** @mutable="freely, script-only" size="16" */
  Custom3: string;
  /** @mutable="freely, script-only" size="16" */
  Custom4: string;
  /** @mutable="conditionally" size="6" */
  BuyTaxCodeOverride: string;
  /** @mutable="conditionally" size="6" */
  SellTaxCodeOverride: string;
  /** @mutable="freely, script-only" */
  LeadTimeDays: number;
  /** @indexed */
  Hash: number;
  /** @mutable="conditionally" */
  SellWeight: number;
  /** @mutable="freely, script-only" size="16" */
  Custom5: string;
  /** @mutable="freely, script-only" size="16" */
  Custom6: string;
  /** @mutable="freely, script-only" size="16" */
  Custom7: string;
  /** @mutable="freely, script-only" size="16" */
  Custom8: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
}
```

## 🔍 Research Process
1. **Access official docs** using web_search with MoneyWorks site
2. **Find Product/Item appendix** with complete field descriptions
3. **Document enum values** from official sources (not guessed)
4. **Extract pricing level meanings** and inventory workflow
5. **Map size constraints** exactly from documentation

## ✅ Success Criteria Checklist
Before submitting your work, verify:

- [ ] **Accessed official MoneyWorks documentation** via web_search
- [ ] **Found Product table appendix** with enum values
- [ ] **All 60+ fields included** with correct types from source interface
- [ ] **Semantic enums sourced from docs** (ProductType, PricingLevel, etc.)
- [ ] **Complete JSDoc documentation** with exact size constraints
- [ ] **Validation functions** with documented field limits
- [ ] **Query builder class** for type-safe product queries  
- [ ] **Utility functions** (isStocked, needsReorder, getPrice, etc.)
- [ ] **TypeScript compiles** without errors
- [ ] **Generated file**: `generated/product.ts`

## 🚀 Begin Immediately
1. Use web_search to access MoneyWorks documentation
2. Find official Product field descriptions and enums
3. Generate complete semantic TypeScript following Name pattern
4. Use only documented enum values (never guess)
5. Save as `generated/product.ts`

**Focus on inventory management accuracy. Document pricing levels and reorder logic from official sources.** 