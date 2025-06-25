/**
 * MoneyWorks Inventory Table Interface
 *
 * The Inventory file tracks stock levels by location and batch/serial number.
 * It maintains quantity on hand for products that have inventory tracking enabled,
 * including support for multiple locations and batch/serial tracking.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_inventory.html
 */

/**
 * MoneyWorks Inventory Table (Raw Interface)
 * @description Complete interface for the Inventory table with exact field names
 */
export interface Inventory {
  /**
   * Product sequence number
   * @description Links to the product master record
   * @relationship References Product via sequence number
   * @required
   */
  ProductSeq: number;

  /**
   * Location code
   * @maxLength 15
   * @description Storage location for this inventory
   * @example "Warehouse A"
   */
  Location?: string;

  /**
   * Serial/batch identifier
   * @maxLength 31
   * @description Serial number or batch code
   * @example "BATCH-2024-001"
   */
  Identifier?: string;

  /**
   * Quantity on hand
   * @description Current stock level at this location
   * @note Use SOHForLocation() function to retrieve stock at a location
   * @example 150.5
   */
  Qty?: number;

  /**
   * Expiry date
   * @format date
   * @description Expiration date for perishable items
   */
  Expiry?: Date | string;

  /**
   * Stock take start quantity
   * @description Quantity when stock take commenced
   * @note Use StocktakeStartQtyForLocation() function
   * @readonly
   */
  StockTakeStartQty?: number;

  /**
   * Stock take new quantity
   * @description Counted quantity during stock take
   * @note Use StocktakeNewQtyForLocation() function
   */
  StockTakeNewQty?: number;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @description Date and time of last record change
   * @readonly
   */
  LastModifiedTime?: string;
}

/**
 * MoneyWorks Inventory Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface InventoryCamel {
  /**
   * Product sequence number
   * @description Links to the product master record
   * @relationship References Product via sequence number
   * @required
   */
  productSeq: number;

  /**
   * Location code
   * @maxLength 15
   * @description Storage location for this inventory
   * @example "Warehouse A"
   */
  location?: string;

  /**
   * Serial/batch identifier
   * @maxLength 31
   * @description Serial number or batch code
   * @example "BATCH-2024-001"
   */
  identifier?: string;

  /**
   * Quantity on hand
   * @description Current stock level at this location
   * @note Use SOHForLocation() function to retrieve stock at a location
   * @example 150.5
   */
  qty?: number;

  /**
   * Expiry date
   * @format date
   * @description Expiration date for perishable items
   */
  expiry?: Date | string;

  /**
   * Stock take start quantity
   * @description Quantity when stock take commenced
   * @note Use StocktakeStartQtyForLocation() function
   * @readonly
   */
  stockTakeStartQty?: number;

  /**
   * Stock take new quantity
   * @description Counted quantity during stock take
   * @note Use StocktakeNewQtyForLocation() function
   */
  stockTakeNewQty?: number;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @description Date and time of last record change
   * @readonly
   */
  lastModifiedTime?: string;
}

/**
 * Converter utilities for Inventory table
 */
export const inventoryConverters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: Inventory): InventoryCamel {
    return {
      productSeq: raw.ProductSeq,
      location: raw.Location,
      identifier: raw.Identifier,
      qty: raw.Qty,
      expiry: raw.Expiry,
      stockTakeStartQty: raw.StockTakeStartQty,
      stockTakeNewQty: raw.StockTakeNewQty,
      lastModifiedTime: raw.LastModifiedTime,
    };
  },

  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  fromCamelCase(camel: InventoryCamel): Inventory {
    return {
      ProductSeq: camel.productSeq,
      Location: camel.location,
      Identifier: camel.identifier,
      Qty: camel.qty,
      Expiry: camel.expiry,
      StockTakeStartQty: camel.stockTakeStartQty,
      StockTakeNewQty: camel.stockTakeNewQty,
      LastModifiedTime: camel.lastModifiedTime,
    };
  },
};

/**
 * Helper functions for Inventory table
 */
export const inventoryHelpers = {
  /**
   * Check if inventory item has expired
   * @param expiry - The expiry date
   * @returns True if the item has expired
   */
  isExpired(expiry?: Date | string): boolean {
    if (!expiry) return false;
    const expiryDate = typeof expiry === "string" ? new Date(expiry) : expiry;
    return expiryDate < new Date();
  },

  /**
   * Calculate days until expiry
   * @param expiry - The expiry date
   * @returns Number of days until expiry (negative if expired)
   */
  daysUntilExpiry(expiry?: Date | string): number | null {
    if (!expiry) return null;
    const expiryDate = typeof expiry === "string" ? new Date(expiry) : expiry;
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Check if item is in stock
   * @param qty - Current quantity
   * @returns True if quantity is greater than zero
   */
  isInStock(qty?: number): boolean {
    return (qty || 0) > 0;
  },

  /**
   * Check if item is low stock
   * @param qty - Current quantity
   * @param threshold - Low stock threshold
   * @returns True if quantity is below threshold
   */
  isLowStock(qty?: number, threshold = 10): boolean {
    return (qty || 0) <= threshold && (qty || 0) > 0;
  },

  /**
   * Calculate stock variance during stock take
   * @param startQty - Quantity at start of stock take
   * @param newQty - Counted quantity
   * @returns Variance (positive = gain, negative = loss)
   */
  calculateStockVariance(startQty?: number, newQty?: number): number {
    return (newQty || 0) - (startQty || 0);
  },

  /**
   * Calculate stock variance percentage
   * @param startQty - Quantity at start of stock take
   * @param newQty - Counted quantity
   * @returns Variance as percentage of start quantity
   */
  calculateStockVariancePercent(
    startQty?: number,
    newQty?: number,
  ): number | null {
    if (!startQty || startQty === 0) return null;
    const variance = this.calculateStockVariance(startQty, newQty);
    return Math.round((variance / startQty) * 10000) / 100; // Round to 2 decimal places
  },

  /**
   * Format location and identifier for display
   * @param inventory - The inventory record
   * @returns Formatted location/batch string
   */
  getLocationBatchDisplay(inventory: Inventory): string {
    const parts: string[] = [];

    if (inventory.Location) {
      parts.push(inventory.Location);
    }

    if (inventory.Identifier) {
      parts.push(`[${inventory.Identifier}]`);
    }

    return parts.join(" ") || "Default Location";
  },

  /**
   * Check if inventory record is for a specific batch/serial
   * @param identifier - The identifier field
   * @returns True if this is a batch/serial tracked item
   */
  isBatchTracked(identifier?: string): boolean {
    return !!identifier && identifier.trim().length > 0;
  },
};
