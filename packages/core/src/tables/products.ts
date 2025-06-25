/**
 * MoneyWorks Products Table Interface
 *
 * The Products file contains items that can be bought, sold, manufactured,
 * or used as components. Products support inventory tracking, multiple price
 * levels, and build/assembly functionality.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_products.html
 */

/**
 * Product type codes
 * @description Determines the nature and behavior of the product
 */
export enum ProductType {
  /** Product - standard inventory item */
  Product = "P",
  /** Raw material */
  RawMaterial = "R",
  /** Time/labor */
  Time = "T",
  /** Service */
  Service = "S",
  /** Other */
  Other = "O",
}

/**
 * Price level codes
 * @description Multiple pricing tiers for different customer types
 */
export enum PriceLevel {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
}

/**
 * Product pricing structure
 * @description Supports up to 6 price levels
 */
export interface ProductPrices {
  /** Base price level A */
  A: number;
  /** Price level B */
  B?: number;
  /** Price level C */
  C?: number;
  /** Price level D */
  D?: number;
  /** Price level E */
  E?: number;
  /** Price level F */
  F?: number;
}

/**
 * Stock/inventory information
 * @description Current stock levels and values
 */
export interface StockInfo {
  /** Current stock on hand in selling units */
  OnHand: number;
  /** Total stock value */
  Value: number;
  /** Stocktake starting quantity */
  TakeStartQty?: number;
  /** Stocktake new quantity */
  TakeNewQty?: number;
}

/**
 * MoneyWorks Products Table (Raw Interface)
 * @description Complete interface for the Products table with exact field names
 */
export interface Product {
  /**
   * Product code
   * @maxLength 31
   * @description Unique identifier for the product
   * @example "WIDGET-001"
   */
  Code: string;

  /**
   * Product description
   * @maxLength 255
   * @description Display name for the product
   * @example "Blue Widget - Large"
   */
  Description?: string;

  /**
   * Product type
   * @maxLength 1
   * @description Classification of the product
   */
  Type?: ProductType;

  /**
   * Barcode
   * @maxLength 19
   * @description Product barcode/UPC
   */
  BarCode?: string;

  /**
   * Supplier's product code
   * @maxLength 19
   * @description Code used by primary supplier
   */
  SuppliersCode?: string;

  /**
   * Primary supplier
   * @maxLength 11
   * @description Default supplier for this product
   * @relationship References Name.Code
   */
  Supplier?: string;

  /**
   * Selling price (Level A)
   * @description Base selling price excluding tax
   */
  SellPrice?: number;

  /**
   * Selling price level B
   * @description Alternate price level
   */
  SellPriceB?: number;

  /**
   * Selling price level C
   * @description Alternate price level
   */
  SellPriceC?: number;

  /**
   * Selling price level D
   * @description Alternate price level
   */
  SellPriceD?: number;

  /**
   * Selling price level E
   * @description Alternate price level
   */
  SellPriceE?: number;

  /**
   * Selling price level F
   * @description Alternate price level
   */
  SellPriceF?: number;

  /**
   * Buying price
   * @description Standard purchase price
   */
  BuyPrice?: number;

  /**
   * Selling unit
   * @maxLength 5
   * @description Unit of measure for sales
   * @example "ea"
   */
  SellUnit?: string;

  /**
   * Buying unit
   * @maxLength 5
   * @description Unit of measure for purchases
   * @example "box"
   */
  BuyUnit?: string;

  /**
   * Sales account code
   * @maxLength 13
   * @description Income account for sales
   * @relationship References Account.Code
   */
  SalesAcct?: string;

  /**
   * Cost of goods account code
   * @maxLength 13
   * @description Expense account for purchases
   * @relationship References Account.Code
   */
  COGAcct?: string;

  /**
   * Stock on hand
   * @description Current inventory quantity in selling units
   * @readonly
   */
  StockOnHand?: number;

  /**
   * Stock value
   * @description Total value of stock on hand
   * @readonly
   */
  StockValue?: number;

  /**
   * Reorder level
   * @description Minimum stock level before reordering
   */
  ReorderLevel?: number;

  /**
   * Stocktake starting quantity
   * @description Beginning quantity for stocktake
   */
  StockTakeStartQty?: number;

  /**
   * Stocktake new quantity
   * @description Counted quantity during stocktake
   */
  StockTakeNewQty?: number;

  /**
   * Minimum build quantity
   * @description For manufactured items - minimum batch size
   */
  MinBuildQty?: number;

  /**
   * Normal build quantity
   * @description For manufactured items - standard batch size
   */
  NormalBuildQty?: number;

  /**
   * Status flags
   * @description Bitwise flags for various status indicators
   * @see productHelpers.decodeFlags
   */
  Flags?: number;

  /**
   * User-defined category 1
   * @maxLength 15
   */
  Category1?: string;

  /**
   * User-defined category 2
   * @maxLength 15
   */
  Category2?: string;

  /**
   * User-defined category 3
   * @maxLength 15
   */
  Category3?: string;

  /**
   * User-defined category 4
   * @maxLength 15
   */
  Category4?: string;

  /**
   * User-defined custom field 1
   * @maxLength 255
   */
  Custom1?: string;

  /**
   * User-defined custom field 2
   * @maxLength 255
   */
  Custom2?: string;

  /**
   * User-defined custom field 3
   * @maxLength 15
   */
  Custom3?: string;

  /**
   * User-defined custom field 4
   * @maxLength 15
   */
  Custom4?: string;

  /**
   * User-defined custom field 5
   * @maxLength 15
   */
  Custom5?: string;

  /**
   * User-defined custom field 6
   * @maxLength 15
   */
  Custom6?: string;

  /**
   * User-defined custom field 7
   * @maxLength 15
   */
  Custom7?: string;

  /**
   * User-defined custom field 8
   * @maxLength 15
   */
  Custom8?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @readonly
   */
  LastModifiedTime?: string;

  /**
   * User who last modified
   * @readonly
   * @note This field may not be present in all MoneyWorks versions
   */
  ModUser?: string;
}

/**
 * MoneyWorks Products Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface ProductCamel {
  /**
   * Product code
   * @maxLength 31
   * @description Unique identifier for the product
   * @example "WIDGET-001"
   */
  code: string;

  /**
   * Product description
   * @maxLength 255
   * @description Display name for the product
   * @example "Blue Widget - Large"
   */
  description?: string;

  /**
   * Product type
   * @maxLength 1
   * @description Classification of the product
   */
  type?: ProductType;

  /**
   * Barcode
   * @maxLength 19
   * @description Product barcode/UPC
   */
  barCode?: string;

  /**
   * Supplier's product code
   * @maxLength 19
   * @description Code used by primary supplier
   */
  suppliersCode?: string;

  /**
   * Primary supplier
   * @maxLength 11
   * @description Default supplier for this product
   * @relationship References Name.Code
   */
  supplier?: string;

  /**
   * Selling price (Level A)
   * @description Base selling price excluding tax
   */
  sellPrice?: number;

  /**
   * Selling price level B
   * @description Alternate price level
   */
  sellPriceB?: number;

  /**
   * Selling price level C
   * @description Alternate price level
   */
  sellPriceC?: number;

  /**
   * Selling price level D
   * @description Alternate price level
   */
  sellPriceD?: number;

  /**
   * Selling price level E
   * @description Alternate price level
   */
  sellPriceE?: number;

  /**
   * Selling price level F
   * @description Alternate price level
   */
  sellPriceF?: number;

  /**
   * Buying price
   * @description Standard purchase price
   */
  buyPrice?: number;

  /**
   * Selling unit
   * @maxLength 5
   * @description Unit of measure for sales
   * @example "ea"
   */
  sellUnit?: string;

  /**
   * Buying unit
   * @maxLength 5
   * @description Unit of measure for purchases
   * @example "box"
   */
  buyUnit?: string;

  /**
   * Sales account code
   * @maxLength 13
   * @description Income account for sales
   * @relationship References Account.Code
   */
  salesAcct?: string;

  /**
   * Cost of goods account code
   * @maxLength 13
   * @description Expense account for purchases
   * @relationship References Account.Code
   */
  cogAcct?: string;

  /**
   * Stock on hand
   * @description Current inventory quantity in selling units
   * @readonly
   */
  stockOnHand?: number;

  /**
   * Stock value
   * @description Total value of stock on hand
   * @readonly
   */
  stockValue?: number;

  /**
   * Reorder level
   * @description Minimum stock level before reordering
   */
  reorderLevel?: number;

  /**
   * Stocktake starting quantity
   * @description Beginning quantity for stocktake
   */
  stockTakeStartQty?: number;

  /**
   * Stocktake new quantity
   * @description Counted quantity during stocktake
   */
  stockTakeNewQty?: number;

  /**
   * Minimum build quantity
   * @description For manufactured items - minimum batch size
   */
  minBuildQty?: number;

  /**
   * Normal build quantity
   * @description For manufactured items - standard batch size
   */
  normalBuildQty?: number;

  /**
   * Status flags
   * @description Bitwise flags for various status indicators
   * @see productHelpers.decodeFlags
   */
  flags?: number;

  /**
   * User-defined category 1
   * @maxLength 15
   */
  category1?: string;

  /**
   * User-defined category 2
   * @maxLength 15
   */
  category2?: string;

  /**
   * User-defined category 3
   * @maxLength 15
   */
  category3?: string;

  /**
   * User-defined category 4
   * @maxLength 15
   */
  category4?: string;

  /**
   * User-defined custom field 1
   * @maxLength 255
   */
  custom1?: string;

  /**
   * User-defined custom field 2
   * @maxLength 255
   */
  custom2?: string;

  /**
   * User-defined custom field 3
   * @maxLength 15
   */
  custom3?: string;

  /**
   * User-defined custom field 4
   * @maxLength 15
   */
  custom4?: string;

  /**
   * User-defined custom field 5
   * @maxLength 15
   */
  custom5?: string;

  /**
   * User-defined custom field 6
   * @maxLength 15
   */
  custom6?: string;

  /**
   * User-defined custom field 7
   * @maxLength 15
   */
  custom7?: string;

  /**
   * User-defined custom field 8
   * @maxLength 15
   */
  custom8?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @readonly
   */
  lastModifiedTime?: string;

  /**
   * User who last modified
   * @readonly
   * @note This field may not be present in all MoneyWorks versions
   */
  modUser?: string;
}

/**
 * Product flags interface
 * @description Decoded representation of the flags field
 */
export interface ProductFlags {
  /** We buy this product */
  weBuy: boolean;
  /** We sell this product */
  weSell: boolean;
  /** We track inventory for this product */
  weInventory: boolean;
  /** Product is inactive */
  inactive: boolean;
  /** Product is a manufactured/built item */
  isBuilt: boolean;
  /** Product can be used as a component */
  isComponent: boolean;
  /** Track serial numbers */
  trackSerials: boolean;
  /** Track lot numbers */
  trackLots: boolean;
}

/**
 * Converter utilities for Products table
 */
export const productConverters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: Product): ProductCamel {
    return {
      code: raw.Code,
      description: raw.Description,
      type: raw.Type,
      barCode: raw.BarCode,
      suppliersCode: raw.SuppliersCode,
      supplier: raw.Supplier,
      sellPrice: raw.SellPrice,
      sellPriceB: raw.SellPriceB,
      sellPriceC: raw.SellPriceC,
      sellPriceD: raw.SellPriceD,
      sellPriceE: raw.SellPriceE,
      sellPriceF: raw.SellPriceF,
      buyPrice: raw.BuyPrice,
      sellUnit: raw.SellUnit,
      buyUnit: raw.BuyUnit,
      salesAcct: raw.SalesAcct,
      cogAcct: raw.COGAcct,
      stockOnHand: raw.StockOnHand,
      stockValue: raw.StockValue,
      reorderLevel: raw.ReorderLevel,
      stockTakeStartQty: raw.StockTakeStartQty,
      stockTakeNewQty: raw.StockTakeNewQty,
      minBuildQty: raw.MinBuildQty,
      normalBuildQty: raw.NormalBuildQty,
      flags: raw.Flags,
      category1: raw.Category1,
      category2: raw.Category2,
      category3: raw.Category3,
      category4: raw.Category4,
      custom1: raw.Custom1,
      custom2: raw.Custom2,
      custom3: raw.Custom3,
      custom4: raw.Custom4,
      custom5: raw.Custom5,
      custom6: raw.Custom6,
      custom7: raw.Custom7,
      custom8: raw.Custom8,
      lastModifiedTime: raw.LastModifiedTime,
      modUser: raw.ModUser,
    };
  },

  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  fromCamelCase(camel: ProductCamel): Product {
    return {
      Code: camel.code,
      Description: camel.description,
      Type: camel.type,
      BarCode: camel.barCode,
      SuppliersCode: camel.suppliersCode,
      Supplier: camel.supplier,
      SellPrice: camel.sellPrice,
      SellPriceB: camel.sellPriceB,
      SellPriceC: camel.sellPriceC,
      SellPriceD: camel.sellPriceD,
      SellPriceE: camel.sellPriceE,
      SellPriceF: camel.sellPriceF,
      BuyPrice: camel.buyPrice,
      SellUnit: camel.sellUnit,
      BuyUnit: camel.buyUnit,
      SalesAcct: camel.salesAcct,
      COGAcct: camel.cogAcct,
      StockOnHand: camel.stockOnHand,
      StockValue: camel.stockValue,
      ReorderLevel: camel.reorderLevel,
      StockTakeStartQty: camel.stockTakeStartQty,
      StockTakeNewQty: camel.stockTakeNewQty,
      MinBuildQty: camel.minBuildQty,
      NormalBuildQty: camel.normalBuildQty,
      Flags: camel.flags,
      Category1: camel.category1,
      Category2: camel.category2,
      Category3: camel.category3,
      Category4: camel.category4,
      Custom1: camel.custom1,
      Custom2: camel.custom2,
      Custom3: camel.custom3,
      Custom4: camel.custom4,
      Custom5: camel.custom5,
      Custom6: camel.custom6,
      Custom7: camel.custom7,
      Custom8: camel.custom8,
      LastModifiedTime: camel.lastModifiedTime,
      ModUser: camel.modUser,
    };
  },
};

/**
 * Helper functions for Products table
 */
export const productHelpers = {
  /**
   * Decode bitwise flags field into boolean properties
   * @param flags - The numeric flags value from MoneyWorks
   * @returns Object with individual flag states
   */
  decodeFlags(flags: number): ProductFlags {
    return {
      weBuy: (flags & 0x0001) !== 0,
      weSell: (flags & 0x0002) !== 0,
      weInventory: (flags & 0x0004) !== 0,
      inactive: (flags & 0x0008) !== 0,
      isBuilt: (flags & 0x0010) !== 0,
      isComponent: (flags & 0x0020) !== 0,
      trackSerials: (flags & 0x0040) !== 0,
      trackLots: (flags & 0x0080) !== 0,
    };
  },

  /**
   * Encode boolean flags into bitwise numeric value
   * @param flags - Object with individual flag states
   * @returns Numeric value for MoneyWorks flags field
   */
  encodeFlags(flags: ProductFlags): number {
    let result = 0;
    if (flags.weBuy) result |= 0x0001;
    if (flags.weSell) result |= 0x0002;
    if (flags.weInventory) result |= 0x0004;
    if (flags.inactive) result |= 0x0008;
    if (flags.isBuilt) result |= 0x0010;
    if (flags.isComponent) result |= 0x0020;
    if (flags.trackSerials) result |= 0x0040;
    if (flags.trackLots) result |= 0x0080;
    return result;
  },

  /**
   * Get all price levels as an object
   * @param product - The product record
   * @returns Object with all price levels
   */
  getPriceLevels(product: Product): ProductPrices {
    return {
      A: product.SellPrice || 0,
      B: product.SellPriceB,
      C: product.SellPriceC,
      D: product.SellPriceD,
      E: product.SellPriceE,
      F: product.SellPriceF,
    };
  },

  /**
   * Get stock information as a grouped object
   * @param product - The product record
   * @returns Stock information object
   */
  getStockInfo(product: Product): StockInfo {
    return {
      OnHand: product.StockOnHand || 0,
      Value: product.StockValue || 0,
      TakeStartQty: product.StockTakeStartQty,
      TakeNewQty: product.StockTakeNewQty,
    };
  },

  /**
   * Check if product is a physical item
   * @param type - The product type
   * @returns True if the product is a physical item
   */
  isPhysicalProduct(type?: ProductType): boolean {
    return (
      type === ProductType.Product ||
      type === ProductType.RawMaterial ||
      type === ProductType.Other
    );
  },

  /**
   * Check if product is a service
   * @param type - The product type
   * @returns True if the product is a service or time
   */
  isService(type?: ProductType): boolean {
    return type === ProductType.Service || type === ProductType.Time;
  },

  /**
   * Calculate markup percentage
   * @param sellPrice - Selling price
   * @param buyPrice - Buying price
   * @returns Markup percentage
   */
  calculateMarkup(sellPrice?: number, buyPrice?: number): number | null {
    if (!sellPrice || !buyPrice || buyPrice === 0) return null;
    return ((sellPrice - buyPrice) / buyPrice) * 100;
  },

  /**
   * Calculate margin percentage
   * @param sellPrice - Selling price
   * @param buyPrice - Buying price
   * @returns Margin percentage
   */
  calculateMargin(sellPrice?: number, buyPrice?: number): number | null {
    if (!sellPrice || !buyPrice || sellPrice === 0) return null;
    return ((sellPrice - buyPrice) / sellPrice) * 100;
  },
};
