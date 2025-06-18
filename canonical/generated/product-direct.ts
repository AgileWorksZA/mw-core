export enum ProductType {
  Stockable = 'ST',
  Service = 'SV',
  Assembly = 'ASM',
  Autobuild = 'AB',
  Voucher = 'VO',
  Freight = 'FR',
  Comment = 'CM',
  Subtotal = 'SB',
  Discount = 'DI'
}

export enum StockLocations {
  Head_Office = 'HO'
}

export enum SerialNumberType {
  None = 0,
  Optional = 1,
  Required = 2
}

export enum PricingLevel {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F'
}

// Product interface
export interface Product {
  Code: string;
  Description: string;
  Comment?: string;
  Type: ProductType;
  Flags?: number;
  SuppCode?: string;
  CustomSuppPartNo?: string;
  SellUnit?: string;
  StockLocations?: string;
  CategoryCode?: string;
  BuyUnit?: string;
  SpecialAccounts?: string;
  SellPrice?: Record<PricingLevel, number>;
  BuyPrice?: number;
  SellAccount?: string;
  StockAccount?: string;
  COGAccount?: string;
  CustomColour?: number;
  TaxCode?: string;
  _Taxable?: boolean;
  LeadDays?: number;
  StockTakeQty?: number;
  SupplierPartNo?: string;
  SalesAccrualAccount?: string;
  PurchaseAccrualAccount?: string;
  SerialNumberType?: SerialNumberType;
  BinLocation?: string;
  ProductCustom1?: string;
  ProductCustom2?: string;
  ProductCustom3?: string;
  ProductCustom4?: string;
  Weight?: number;
  IsInactive?: boolean;
  Barcode?: string;
  ReorderLevel?: number;
  ReorderQuantity?: number;
  CreateDate?: Date;
  ModDate?: Date;
  CreateTime?: Date;
  ModTime?: Date;
  CreateWho?: string;
  ModWho?: string;
}

// Type guards
export function isStockableProduct(product: Product): boolean {
  return product.Type === ProductType.Stockable;
}

export function isServiceProduct(product: Product): boolean {
  return product.Type === ProductType.Service;
}

export function isAssemblyProduct(product: Product): boolean {
  return product.Type === ProductType.Assembly;
}

export function hasSerialNumbers(product: Product): boolean {
  return product.SerialNumberType !== undefined && product.SerialNumberType !== SerialNumberType.None;
}

export function requiresSerialNumbers(product: Product): boolean {
  return product.SerialNumberType === SerialNumberType.Required;
}

// Validation functions
export function validateProductCode(code: string): boolean {
  return code.length > 0 && code.length <= 40 && /^[A-Za-z0-9_\-\.]+$/.test(code);
}

export function validateProductType(type: string): boolean {
  return Object.values(ProductType).includes(type as ProductType);
}

export function validatePricingLevel(level: string): boolean {
  return Object.values(PricingLevel).includes(level as PricingLevel);
}

export function validateSerialNumberType(type: number): boolean {
  return Object.values(SerialNumberType).includes(type);
}

export function validateSellPrice(prices: Record<PricingLevel, number> | undefined): boolean {
  if (!prices) return true;
  return Object.entries(prices).every(([level, price]) => 
    validatePricingLevel(level) && typeof price === 'number' && price >= 0
  );
}

export function validateProduct(product: Product): string[] {
  const errors: string[] = [];
  
  if (!validateProductCode(product.Code)) {
    errors.push('Invalid product code');
  }
  
  if (!validateProductType(product.Type)) {
    errors.push('Invalid product type');
  }
  
  if (!product.Description || product.Description.length === 0) {
    errors.push('Description is required');
  }
  
  if (product.SerialNumberType !== undefined && !validateSerialNumberType(product.SerialNumberType)) {
    errors.push('Invalid serial number type');
  }
  
  if (!validateSellPrice(product.SellPrice)) {
    errors.push('Invalid sell price structure');
  }
  
  if (product.BuyPrice !== undefined && product.BuyPrice < 0) {
    errors.push('Buy price cannot be negative');
  }
  
  if (product.Weight !== undefined && product.Weight < 0) {
    errors.push('Weight cannot be negative');
  }
  
  if (product.ReorderLevel !== undefined && product.ReorderLevel < 0) {
    errors.push('Reorder level cannot be negative');
  }
  
  if (product.ReorderQuantity !== undefined && product.ReorderQuantity < 0) {
    errors.push('Reorder quantity cannot be negative');
  }
  
  return errors;
}

// Query builder
export class ProductQueryBuilder {
  private query: Record<string, any> = {};
  
  byCode(code: string): this {
    this.query['=code'] = code;
    return this;
  }
  
  byType(type: ProductType): this {
    this.query['=type'] = type;
    return this;
  }
  
  byCategory(categoryCode: string): this {
    this.query['=categorycode'] = categoryCode;
    return this;
  }
  
  bySupplier(supplierCode: string): this {
    this.query['=suppcode'] = supplierCode;
    return this;
  }
  
  byBarcode(barcode: string): this {
    this.query['=barcode'] = barcode;
    return this;
  }
  
  isActive(): this {
    this.query['=isinactive'] = false;
    return this;
  }
  
  isInactive(): this {
    this.query['=isinactive'] = true;
    return this;
  }
  
  hasStock(): this {
    this.query['>stocktakeqty'] = 0;
    return this;
  }
  
  needsReorder(): this {
    this.query['<stocktakeqty'] = 'reorderlevel';
    return this;
  }
  
  byDescription(description: string): this {
    this.query['~description'] = description;
    return this;
  }
  
  bySellPriceRange(level: PricingLevel, min: number, max: number): this {
    this.query[`>sellprice.${level}`] = min;
    this.query[`<sellprice.${level}`] = max;
    return this;
  }
  
  byBuyPriceRange(min: number, max: number): this {
    this.query['>buyprice'] = min;
    this.query['<buyprice'] = max;
    return this;
  }
  
  hasSerialNumbers(): this {
    this.query['>serialnumbertype'] = SerialNumberType.None;
    return this;
  }
  
  requiresSerialNumbers(): this {
    this.query['=serialnumbertype'] = SerialNumberType.Required;
    return this;
  }
  
  modifiedAfter(date: Date): this {
    this.query['>moddate'] = date.toISOString().split('T')[0];
    return this;
  }
  
  createdAfter(date: Date): this {
    this.query['>createdate'] = date.toISOString().split('T')[0];
    return this;
  }
  
  withCustomField(fieldNumber: 1 | 2 | 3 | 4, value: string): this {
    this.query[`=productcustom${fieldNumber}`] = value;
    return this;
  }
  
  sortBy(field: keyof Product, descending: boolean = false): this {
    this.query['@sort'] = `${descending ? '-' : ''}${field.toLowerCase()}`;
    return this;
  }
  
  limit(count: number, offset: number = 0): this {
    this.query['@limit'] = count;
    if (offset > 0) {
      this.query['@offset'] = offset;
    }
    return this;
  }
  
  build(): string {
    return Object.entries(this.query)
      .map(([key, value]) => {
        if (typeof value === 'string' && value.includes(' ')) {
          return `${key}="${value}"`;
        }
        return `${key}=${value}`;
      })
      .join('&');
  }
}

// Helper functions
export function createProduct(code: string, description: string, type: ProductType): Product {
  return {
    Code: code,
    Description: description,
    Type: type
  };
}

export function getSellPrice(product: Product, level: PricingLevel): number | undefined {
  return product.SellPrice?.[level];
}

export function setSellPrice(product: Product, level: PricingLevel, price: number): Product {
  if (!product.SellPrice) {
    product.SellPrice = {} as Record<PricingLevel, number>;
  }
  product.SellPrice[level] = price;
  return product;
}

export function getStockValue(product: Product): number | undefined {
  if (!isStockableProduct(product) || !product.StockTakeQty || !product.BuyPrice) {
    return undefined;
  }
  return product.StockTakeQty * product.BuyPrice;
}

export function needsReorder(product: Product): boolean {
  if (!isStockableProduct(product) || product.ReorderLevel === undefined) {
    return false;
  }
  return (product.StockTakeQty || 0) <= product.ReorderLevel;
}

export function getReorderQuantity(product: Product): number | undefined {
  if (!needsReorder(product)) {
    return undefined;
  }
  return product.ReorderQuantity || 1;
}

export function formatProductDisplay(product: Product): string {
  return `${product.Code} - ${product.Description} (${product.Type})`;
}