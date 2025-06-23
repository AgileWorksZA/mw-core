/**
 * MoneyWorks Inventory Entity - Canonical Ontology
 * 
 * PURE MoneyWorks staging definitions extracted from official manual
 * Source: moneyworks_appendix_inventory.html
 * Authority: MoneyWorks Manual - Inventory Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks Inventory is a sophisticated stock tracking
 * subfile that manages stock on hand by location, serial/batch numbers, and
 * supports comprehensive stock take functionality.
 * 
 * ENTITY CLASSIFICATION:
 * - Type: Product Subfile (related to Products entity)
 * - Purpose: Location-based stock quantity tracking
 * - Scope: Serial/batch number inventory management
 * - Function: Stock take and location-specific stock control
 */

// ============================================================================
// CANONICAL MONEYWORKS INVENTORY RELATIONSHIP
// ============================================================================

/**
 * MoneyWorks Inventory entity relationship to Products
 * Source: moneyworks_appendix_inventory.html - "subfile of Product"
 */
export enum MoneyWorksInventoryRelationshipType {
  /** Inventory is a subfile of Product entity */
  PRODUCT_SUBFILE = "product_subfile"
}

/**
 * MoneyWorks staging inventory tracking modes
 * Derived from field structure and manual descriptions
 */
export enum MoneyWorksInventoryTrackingMode {
  /** Standard quantity tracking by location */
  LOCATION_QUANTITY = "location_quantity",
  
  /** Serial number tracking */
  SERIAL_NUMBER = "serial_number",
  
  /** Batch/lot number tracking */
  BATCH_LOT = "batch_lot",
  
  /** Expiring batch tracking */
  EXPIRING_BATCH = "expiring_batch"
}

/**
 * MoneyWorks stock take operational states
 * Source: moneyworks_appendix_inventory.html - StockTake fields
 */
export enum MoneyWorksStockTakeState {
  /** Normal operation - no stock take active */
  NORMAL = "normal",
  
  /** Stock take commenced - StartQty recorded */
  COMMENCED = "commenced",
  
  /** Stock take in progress - NewQty being entered */
  IN_PROGRESS = "in_progress",
  
  /** Stock take completed - variances calculated */
  COMPLETED = "completed"
}

// ============================================================================
// CANONICAL MONEYWORKS INVENTORY FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks inventory fields as defined in manual
 * Source: moneyworks_appendix_inventory.html - Inventory table
 */
export const MONEYWORKS_INVENTORY_FIELDS = [
  {
    fieldName: "Expiry",
    dataType: "D" as const,
    canonicalDescription: "The expiry date for expiring batches",
    manualSource: "moneyworks_appendix_inventory.html",
    relationshipTarget: "Products",
    relationshipRule: "Used when product has batch/lot tracking with expiration"
  },
  {
    fieldName: "Identifier",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "The serial/batch number of the item",
    manualSource: "moneyworks_appendix_inventory.html",
    isRequired: true,
    isIndexed: true,
    relationshipTarget: "Products",
    relationshipRule: "Unique identifier for serial/batch within product"
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "Date and time the record was last altered",
    manualSource: "moneyworks_appendix_inventory.html"
  },
  {
    fieldName: "Location",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "The location",
    manualSource: "moneyworks_appendix_inventory.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "ProductSeq",
    dataType: "N" as const,
    canonicalDescription: "The sequence number of the product master record for the item",
    manualSource: "moneyworks_appendix_inventory.html",
    isRequired: true,
    isIndexed: true,
    relationshipTarget: "Products",
    relationshipRule: "Must reference valid Product record sequence number"
  },
  {
    fieldName: "Qty",
    dataType: "N" as const,
    canonicalDescription: "The qty (stock on hand) of the item at this location. Use the SOHForLocation(location) function for the stock at a given location.",
    manualSource: "moneyworks_appendix_inventory.html",
    isRequired: true
  },
  {
    fieldName: "StockTakeNewQty",
    dataType: "N" as const,
    canonicalDescription: "The total entered stock count for a stock take. Use the StocktakeNewQtyForLocation(location) function for the stock at a given location.",
    manualSource: "moneyworks_appendix_inventory.html"
  },
  {
    fieldName: "StockTakeStartQty",
    dataType: "N" as const,
    canonicalDescription: "The total stock on hand when a stock take is commenced. Use the StocktakeStartQtyForLocation(location) function for the stock at a given location.",
    manualSource: "moneyworks_appendix_inventory.html"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS INVENTORY FUNCTIONS
// ============================================================================

/**
 * MoneyWorks staging inventory calculation functions
 * Source: moneyworks_appendix_inventory.html - Referenced functions
 */
export const MONEYWORKS_INVENTORY_FUNCTIONS = [
  {
    functionName: "SOHForLocation",
    canonicalSignature: "SOHForLocation(location)",
    purpose: "Get stock on hand for a specific location",
    description: "Returns the quantity of stock on hand for the specified location. Use empty string (\"\") for default location.",
    manualSource: "moneyworks_appendix_inventory.html"
  },
  {
    functionName: "StocktakeNewQtyForLocation", 
    canonicalSignature: "StocktakeNewQtyForLocation(location)",
    purpose: "Get entered stock count for stock take at location",
    description: "Returns the entered stock count for a stock take at the specified location",
    manualSource: "moneyworks_appendix_inventory.html"
  },
  {
    functionName: "StocktakeStartQtyForLocation",
    canonicalSignature: "StocktakeStartQtyForLocation(location)", 
    purpose: "Get commencing stock for stock take at location",
    description: "Returns the stock on hand when stock take was commenced at the specified location",
    manualSource: "moneyworks_appendix_inventory.html"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS INVENTORY TERMINOLOGY
// ============================================================================

/**
 * CRITICAL ARCHITECTURAL INSIGHT:
 * 
 * MoneyWorks Inventory entity reveals sophisticated multi-location stock tracking:
 * 
 * LOCATION-BASED TRACKING:
 * - Stock quantities maintained separately for each physical location
 * - Location field allows warehouse/store-specific inventory management
 * - SOHForLocation() function provides location-specific stock queries
 * - Default Location: Empty string ("") represents the default/unspecified location
 * 
 * SERIAL/BATCH TRACKING:
 * - Identifier field supports both serial numbers and batch/lot numbers
 * - Expiry field enables expiration date tracking for perishable/dated stock
 * - Individual item-level tracking within location-based structure
 * 
 * STOCK TAKE INTEGRATION:
 * - StockTakeStartQty: Baseline quantity when stock take begins
 * - StockTakeNewQty: Counted quantity during stock take process
 * - Variance calculation: System can compute differences for adjustments
 * 
 * PRODUCT RELATIONSHIP:
 * - ProductSeq links to Products.SequenceNumber (master record)
 * - Inventory is subfile providing detailed stock breakdown
 * - Product flags determine if serial/batch tracking is enabled
 * 
 * This reveals MoneyWorks as enterprise-grade inventory management system
 * with location-based stock control and comprehensive audit capabilities.
 */

export const MONEYWORKS_INVENTORY_CANONICAL_TERMS = {
  // Location-based stock management (MoneyWorks staging)
  STOCK_LOCATION: "Stock Location",                    // Physical location identifier
  LOCATION_CODE: "Location Code",                      // Location field
  DEFAULT_LOCATION: "Default Location",                // Empty string location (MoneyWorks staging)
  STOCK_ON_HAND: "Stock On Hand",                     // Qty field
  LOCATION_QUANTITY: "Location Quantity",             // Stock at specific location
  
  // Serial/batch tracking (MoneyWorks staging)
  SERIAL_NUMBER: "Serial Number",                     // Individual item identifier
  BATCH_NUMBER: "Batch Number",                       // Batch/lot identifier
  LOT_NUMBER: "Lot Number",                           // Alternative batch term
  ITEM_IDENTIFIER: "Item Identifier",                 // Identifier field (generic)
  BATCH_EXPIRY: "Batch Expiry",                       // Expiry field
  EXPIRY_DATE: "Expiry Date",                         // Expiration tracking
  
  // Stock take operations (MoneyWorks staging)
  STOCK_TAKE: "Stock Take",                           // Physical inventory count
  STOCK_COUNT: "Stock Count",                         // Physical counting process
  STARTING_QUANTITY: "Starting Quantity",             // StockTakeStartQty field
  COUNTED_QUANTITY: "Counted Quantity",               // StockTakeNewQty field
  STOCK_VARIANCE: "Stock Variance",                   // Difference calculation
  INVENTORY_ADJUSTMENT: "Inventory Adjustment",       // Correction transactions
  
  // Product relationships (MoneyWorks staging)
  PRODUCT_SEQUENCE: "Product Sequence",               // ProductSeq field
  PRODUCT_MASTER: "Product Master",                   // Main product record
  INVENTORY_SUBFILE: "Inventory Subfile",             // Relationship type
  STOCK_ITEM: "Stock Item",                           // Individual inventory record
  
  // Inventory control functions (MoneyWorks staging)
  STOCK_INQUIRY: "Stock Inquiry",                     // SOHForLocation function
  LOCATION_STOCK_QUERY: "Location Stock Query",       // Location-specific inquiry
  STOCK_TAKE_INQUIRY: "Stock Take Inquiry",           // Stock take function queries
  INVENTORY_TRACKING: "Inventory Tracking",           // Overall tracking system
  
  // System operations (MoneyWorks staging)
  INVENTORY_RECORD: "Inventory Record",               // Individual inventory entry
  STOCK_MOVEMENT: "Stock Movement",                   // Quantity changes
  LAST_MODIFIED: "Last Modified",                     // LastModifiedTime field
  INVENTORY_AUDIT: "Inventory Audit",                 // Change tracking
  
  // Location management (MoneyWorks staging)
  WAREHOUSE_LOCATION: "Warehouse Location",           // Storage facility
  STORE_LOCATION: "Store Location",                   // Retail location
  MULTI_LOCATION: "Multi-Location",                   // Multiple location support
  LOCATION_TRANSFER: "Location Transfer"              // Inter-location movement
} as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate MoneyWorks inventory location code format
 */
export function validateInventoryLocationCanonical(location: string): {
  isValid: boolean;
  isDefaultLocation: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // MoneyWorks staging behavior: empty string represents the "default location"
  // Source: moneyworks_serials_locations.html - "The default location is a location with no code"
  // Source: moneyworks_calculations_sohforlocation.html - "For the default location, use an empty string"
  const isDefaultLocation = !location || location.trim().length === 0;
  
  if (location && location.length > 15) {
    warnings.push("MoneyWorks location code maximum length is 15 characters");
  }
  
  return {
    isValid: warnings.length === 0,
    isDefaultLocation,
    warnings
  };
}

/**
 * Validate MoneyWorks inventory identifier (serial/batch number)
 */
export function validateInventoryIdentifierCanonical(identifier: string): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!identifier || identifier.trim().length === 0) {
    warnings.push("Identifier is required for MoneyWorks inventory tracking");
  }
  
  if (identifier.length > 31) {
    warnings.push("MoneyWorks inventory identifier maximum length is 31 characters");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Validate MoneyWorks stock take quantities
 */
export function validateStockTakeQuantitiesCanonical(
  startQty: number,
  newQty: number,
  currentQty: number
): {
  isValid: boolean;
  variance: number;
  adjustmentRequired: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (startQty < 0) {
    warnings.push("MoneyWorks stock take start quantity cannot be negative");
  }
  
  if (newQty < 0) {
    warnings.push("MoneyWorks stock take new quantity cannot be negative");
  }
  
  if (currentQty < 0) {
    warnings.push("MoneyWorks current stock quantity cannot be negative");
  }
  
  const variance = newQty - startQty;
  const adjustmentRequired = Math.abs(variance) > 0.001; // Allow for rounding
  
  return {
    isValid: warnings.length === 0,
    variance,
    adjustmentRequired,
    warnings
  };
}

/**
 * Check if location represents the MoneyWorks default location
 */
export function isDefaultLocation(location: string): boolean {
  // MoneyWorks staging: default location is represented by empty string
  // Source: moneyworks_serials_locations.html - "The default location is a location with no code"
  return !location || location.trim().length === 0;
}

/**
 * Check if inventory record supports expiry date tracking
 */
export function supportsExpiryTracking(identifier: string): boolean {
  // In MoneyWorks, expiry tracking is typically used with batch/lot numbers
  // Serial numbers usually don't expire
  return identifier && identifier.length > 0;
}

/**
 * Validate MoneyWorks inventory product sequence relationship
 */
export function validateProductSequenceRelationship(productSeq: number): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!productSeq || productSeq <= 0) {
    warnings.push("ProductSeq must reference a valid Product record sequence number");
  }
  
  if (!Number.isInteger(productSeq)) {
    warnings.push("MoneyWorks ProductSeq must be an integer");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Generate staging inventory record key
 */
export function generateInventoryRecordKey(
  productSeq: number,
  location: string,
  identifier: string
): string {
  return `${productSeq}-${location}-${identifier}`;
}

/**
 * Parse staging inventory record key
 */
export function parseInventoryRecordKey(key: string): {
  productSeq: number;
  location: string;
  identifier: string;
  isValid: boolean;
} {
  const parts = key.split('-');
  
  if (parts.length !== 3) {
    return {
      productSeq: 0,
      location: '',
      identifier: '',
      isValid: false
    };
  }
  
  const productSeq = parseInt(parts[0], 10);
  
  return {
    productSeq,
    location: parts[1],
    identifier: parts[2],
    isValid: !isNaN(productSeq) && productSeq > 0
  };
}

/**
 * Calculate stock variance for MoneyWorks stock take
 */
export function calculateStockVariance(
  startQty: number,
  countedQty: number
): {
  variance: number;
  varianceType: 'surplus' | 'shortage' | 'exact';
  adjustmentRequired: boolean;
} {
  const variance = countedQty - startQty;
  const adjustmentRequired = Math.abs(variance) > 0.001;
  
  let varianceType: 'surplus' | 'shortage' | 'exact';
  if (variance > 0.001) {
    varianceType = 'surplus';
  } else if (variance < -0.001) {
    varianceType = 'shortage';
  } else {
    varianceType = 'exact';
  }
  
  return {
    variance,
    varianceType,
    adjustmentRequired
  };
}

export default {
  MONEYWORKS_INVENTORY_FIELDS,
  MONEYWORKS_INVENTORY_FUNCTIONS,
  MONEYWORKS_INVENTORY_CANONICAL_TERMS,
  MoneyWorksInventoryTrackingMode,
  MoneyWorksStockTakeState
};