/**
 * MoneyWorks Product Repository
 *
 * @moneyworks-entity Product
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles all Product data operations
 * @ai-critical Use MoneyWorks Product terminology exclusively
 */

import type {
	MoneyWorksProduct,
	MoneyWorksProductCreateInput,
	MoneyWorksProductUpdateInput,
	MoneyWorksProductType,
} from "@moneyworks/canonical/products";
import { type AccountCode, formatMWNumber } from "@moneyworks/utilities";
import { BaseMoneyWorksRepository } from "./base.repository";

/**
 * Repository for MoneyWorks Product entity
 *
 * @ai-instruction Use this for all Product data operations
 * @ai-term Say "ProductRepository", NEVER "ItemRepository" or "SKURepository"
 */
export class ProductRepository extends BaseMoneyWorksRepository<
	MoneyWorksProduct,
	MoneyWorksProductCreateInput,
	MoneyWorksProductUpdateInput
> {
	/**
	 * MoneyWorks table name
	 * @ai-critical Must be exact MW table name
	 */
	protected readonly tableName = "Product";

	/**
	 * Primary key field
	 * @ai-critical Code is the primary key for Product
	 */
	protected readonly primaryKey = "Code";

	/**
	 * Post-process records to add branded types and parse MW data
	 *
	 * @ai-instruction Smart client already parsed basic types, we add branding and parse flags
	 */
	protected postProcess(record: any): MoneyWorksProduct {
		// Smart client already handled field discovery and basic parsing
		// We just need to add branded types where needed and ensure proper types

		// Parse numeric fields
		const numericFields = [
			"Hash",
			"Flags",
			"BuyPrice",
			"BuyWeight",
			"ConversionFactor",
			"CostPrice",
			"SellPrice",
			"SellPriceB",
			"SellPriceC",
			"SellPriceD",
			"SellPriceE",
			"SellPriceF",
			"SellWeight",
			"SellDiscount",
			"SellDiscountMode",
			"QtyBreak1",
			"QtyBreak2",
			"QtyBreak3",
			"QtyBreak4",
			"QtyBrkSellPriceA1",
			"QtyBrkSellPriceA2",
			"QtyBrkSellPriceA3",
			"QtyBrkSellPriceA4",
			"QtyBrkSellPriceB1",
			"QtyBrkSellPriceB2",
			"QtyBrkSellPriceB3",
			"QtyBrkSellPriceB4",
			"StockOnHand",
			"StockValue",
			"AverageValue",
			"ReorderLevel",
			"NormalBuildQty",
			"MinBuildQty",
			"LeadTimeDays",
			"StockTakeNewQty",
			"StockTakeStartQty",
			"JobPricingMode",
			"MarginWarning",
			"Plussage",
			"Colour",
			"UserNum",
		];

		const processed: any = { ...record };

		// Parse numeric fields
		for (const field of numericFields) {
			if (
				field in processed &&
				processed[field] !== null &&
				processed[field] !== ""
			) {
				processed[field] = Number(processed[field]);
			}
		}

		// Parse boolean field
		if ("UseMultiplePrices" in processed) {
			processed.UseMultiplePrices =
				processed.UseMultiplePrices === "true" ||
				processed.UseMultiplePrices === true;
		}

		// Add branded types for account fields
		if (processed.COGAcct) {
			processed.COGAcct = processed.COGAcct as AccountCode;
		}
		if (processed.SalesAcct) {
			processed.SalesAcct = processed.SalesAcct as AccountCode;
		}
		if (processed.StockAcct) {
			processed.StockAcct = processed.StockAcct as AccountCode;
		}

		return processed as MoneyWorksProduct;
	}

	/**
	 * Prepare data for MoneyWorks
	 *
	 * @ai-instruction Converts typed data to MW format
	 */
	protected prepare(
		data: MoneyWorksProductCreateInput | MoneyWorksProductUpdateInput,
	): any {
		const prepared: any = {};

		// Always include Code for identification
		if ("Code" in data) {
			prepared.Code = data.Code;
		}

		// Required fields for creation
		if ("Type" in data && data.Type !== undefined) {
			prepared.Type = data.Type;
		}
		if ("Description" in data && data.Description !== undefined) {
			prepared.Description = data.Description;
		}
		if ("Hash" in data && data.Hash !== undefined) {
			prepared.Hash = data.Hash;
		}

		// Optional fields
		if ("BarCode" in data && data.BarCode !== undefined) {
			prepared.BarCode = data.BarCode;
		}
		if ("Flags" in data && data.Flags !== undefined) {
			prepared.Flags = data.Flags;
		}

		// Purchasing fields
		if ("BuyPrice" in data && data.BuyPrice !== undefined) {
			prepared.BuyPrice = formatMWNumber(data.BuyPrice);
		}
		if ("BuyPriceCurrency" in data && data.BuyPriceCurrency !== undefined) {
			prepared.BuyPriceCurrency = data.BuyPriceCurrency;
		}
		if ("BuyUnit" in data && data.BuyUnit !== undefined) {
			prepared.BuyUnit = data.BuyUnit;
		}
		if ("BuyWeight" in data && data.BuyWeight !== undefined) {
			prepared.BuyWeight = formatMWNumber(data.BuyWeight);
		}
		if ("ConversionFactor" in data && data.ConversionFactor !== undefined) {
			prepared.ConversionFactor = formatMWNumber(data.ConversionFactor);
		}
		if ("CostPrice" in data && data.CostPrice !== undefined) {
			prepared.CostPrice = formatMWNumber(data.CostPrice);
		}
		if ("Supplier" in data && data.Supplier !== undefined) {
			prepared.Supplier = data.Supplier;
		}
		if ("SuppliersCode" in data && data.SuppliersCode !== undefined) {
			prepared.SuppliersCode = data.SuppliersCode;
		}

		// Selling fields
		if ("SellPrice" in data && data.SellPrice !== undefined) {
			prepared.SellPrice = formatMWNumber(data.SellPrice);
		}
		if ("SellPriceB" in data && data.SellPriceB !== undefined) {
			prepared.SellPriceB = formatMWNumber(data.SellPriceB);
		}
		if ("SellPriceC" in data && data.SellPriceC !== undefined) {
			prepared.SellPriceC = formatMWNumber(data.SellPriceC);
		}
		if ("SellPriceD" in data && data.SellPriceD !== undefined) {
			prepared.SellPriceD = formatMWNumber(data.SellPriceD);
		}
		if ("SellPriceE" in data && data.SellPriceE !== undefined) {
			prepared.SellPriceE = formatMWNumber(data.SellPriceE);
		}
		if ("SellPriceF" in data && data.SellPriceF !== undefined) {
			prepared.SellPriceF = formatMWNumber(data.SellPriceF);
		}
		if ("SellUnit" in data && data.SellUnit !== undefined) {
			prepared.SellUnit = data.SellUnit;
		}
		if ("SellWeight" in data && data.SellWeight !== undefined) {
			prepared.SellWeight = formatMWNumber(data.SellWeight);
		}
		if ("SellDiscount" in data && data.SellDiscount !== undefined) {
			prepared.SellDiscount = formatMWNumber(data.SellDiscount);
		}
		if ("SellDiscountMode" in data && data.SellDiscountMode !== undefined) {
			prepared.SellDiscountMode = data.SellDiscountMode;
		}
		if ("UseMultiplePrices" in data && data.UseMultiplePrices !== undefined) {
			prepared.UseMultiplePrices = data.UseMultiplePrices ? "true" : "false";
		}

		// Inventory fields
		if ("ReorderLevel" in data && data.ReorderLevel !== undefined) {
			prepared.ReorderLevel = formatMWNumber(data.ReorderLevel);
		}
		if ("NormalBuildQty" in data && data.NormalBuildQty !== undefined) {
			prepared.NormalBuildQty = formatMWNumber(data.NormalBuildQty);
		}
		if ("MinBuildQty" in data && data.MinBuildQty !== undefined) {
			prepared.MinBuildQty = formatMWNumber(data.MinBuildQty);
		}
		if ("LeadTimeDays" in data && data.LeadTimeDays !== undefined) {
			prepared.LeadTimeDays = formatMWNumber(data.LeadTimeDays, 0);
		}

		// Account fields (branded types)
		if ("COGAcct" in data && data.COGAcct !== undefined) {
			prepared.COGAcct = data.COGAcct;
		}
		if ("SalesAcct" in data && data.SalesAcct !== undefined) {
			prepared.SalesAcct = data.SalesAcct;
		}
		if ("StockAcct" in data && data.StockAcct !== undefined) {
			prepared.StockAcct = data.StockAcct;
		}

		// Category fields
		if ("Category1" in data && data.Category1 !== undefined) {
			prepared.Category1 = data.Category1;
		}
		if ("Category2" in data && data.Category2 !== undefined) {
			prepared.Category2 = data.Category2;
		}
		if ("Category3" in data && data.Category3 !== undefined) {
			prepared.Category3 = data.Category3;
		}
		if ("Category4" in data && data.Category4 !== undefined) {
			prepared.Category4 = data.Category4;
		}

		// Job costing fields
		if ("JobPricingMode" in data && data.JobPricingMode !== undefined) {
			prepared.JobPricingMode = data.JobPricingMode;
		}
		if ("MarginWarning" in data && data.MarginWarning !== undefined) {
			prepared.MarginWarning = formatMWNumber(data.MarginWarning);
		}
		if ("Plussage" in data && data.Plussage !== undefined) {
			prepared.Plussage = formatMWNumber(data.Plussage);
		}

		// Metadata
		if ("Colour" in data && data.Colour !== undefined) {
			prepared.Colour = data.Colour;
		}
		if ("Comment" in data && data.Comment !== undefined) {
			prepared.Comment = data.Comment;
		}

		// Custom fields
		if ("Custom1" in data && data.Custom1 !== undefined) {
			prepared.Custom1 = data.Custom1;
		}
		if ("Custom2" in data && data.Custom2 !== undefined) {
			prepared.Custom2 = data.Custom2;
		}
		if ("Custom3" in data && data.Custom3 !== undefined) {
			prepared.Custom3 = data.Custom3;
		}
		if ("Custom4" in data && data.Custom4 !== undefined) {
			prepared.Custom4 = data.Custom4;
		}
		if ("Custom5" in data && data.Custom5 !== undefined) {
			prepared.Custom5 = data.Custom5;
		}
		if ("Custom6" in data && data.Custom6 !== undefined) {
			prepared.Custom6 = data.Custom6;
		}
		if ("Custom7" in data && data.Custom7 !== undefined) {
			prepared.Custom7 = data.Custom7;
		}
		if ("Custom8" in data && data.Custom8 !== undefined) {
			prepared.Custom8 = data.Custom8;
		}

		// User-defined fields
		if ("UserNum" in data && data.UserNum !== undefined) {
			prepared.UserNum = formatMWNumber(data.UserNum);
		}
		if ("UserText" in data && data.UserText !== undefined) {
			prepared.UserText = data.UserText;
		}
		if ("TaggedText" in data && data.TaggedText !== undefined) {
			prepared.TaggedText = data.TaggedText;
		}

		return prepared;
	}

	/**
	 * Find product by code (primary key lookup)
	 *
	 * @param code - The product code to search for
	 * @returns The product if found, null otherwise
	 *
	 * @example
	 * ```typescript
	 * const product = await repo.findByCode("PROD-001");
	 * if (product) {
	 *   console.log(`Found: ${product.Description}`);
	 * }
	 * ```
	 *
	 * @ai-instruction Use this for single product lookups by Code
	 */
	async findByCode(code: string): Promise<MoneyWorksProduct | null> {
		const records = await this.find(`Code="${code}"`);
		return records.length > 0 ? records[0] : null;
	}

	/**
	 * Find products by type classification
	 *
	 * @param type - The product type (P=product, R=resource, T=time, S=ship method, O=other)
	 * @returns Array of products matching the type
	 *
	 * @example
	 * ```typescript
	 * import { MoneyWorksProductType } from "@moneyworks/canonical/products";
	 *
	 * // Find all standard products
	 * const products = await repo.findByType(MoneyWorksProductType.PRODUCT);
	 *
	 * // Find all time-based services
	 * const services = await repo.findByType(MoneyWorksProductType.TIME);
	 * ```
	 *
	 * @ai-instruction Use this to filter products by their Type field
	 */
	async findByType(type: MoneyWorksProductType): Promise<MoneyWorksProduct[]> {
		return this.find(`Type="${type}"`);
	}

	/**
	 * Find all products with inventory tracking enabled
	 *
	 * Products are considered inventoried when their Hash field has the inventory bit set (0x0008).
	 * Per MoneyWorks canonical: all inventoried items have Hash >= 8.
	 *
	 * @returns Array of products that are tracked in inventory
	 *
	 * @example
	 * ```typescript
	 * const inventoried = await repo.findInventoried();
	 * console.log(`${inventoried.length} products tracked in inventory`);
	 *
	 * // Check stock levels
	 * for (const product of inventoried) {
	 *   console.log(`${product.Code}: ${product.StockOnHand} units`);
	 * }
	 * ```
	 *
	 * @ai-instruction Use this to find products with StockOnHand tracking
	 * @ai-context Hash field bit flags: buy=#0002, sell=#0004, inventory=#0008
	 */
	async findInventoried(): Promise<MoneyWorksProduct[]> {
		// MoneyWorks Hash field: inventory bit is 0x0008
		// All inventoried items have Hash >= 8
		return this.find("Hash >= 8");
	}

	/**
	 * Find all products from a specific supplier
	 *
	 * @param supplierCode - The supplier's code from the Names table
	 * @returns Array of products supplied by this supplier
	 *
	 * @example
	 * ```typescript
	 * // Find all products from a specific supplier
	 * const products = await repo.findBySupplier("SUP001");
	 * console.log(`Supplier SUP001 provides ${products.length} products`);
	 *
	 * // Show supplier's product codes
	 * products.forEach(p => {
	 *   console.log(`${p.Code}: ${p.SuppliersCode} (their code)`);
	 * });
	 * ```
	 *
	 * @ai-instruction Use this to find products by their usual supplier
	 * @ai-context Supplier field references Names.Code where SupplierType > 0
	 */
	async findBySupplier(supplierCode: string): Promise<MoneyWorksProduct[]> {
		return this.find(`Supplier="${supplierCode}"`);
	}

	/**
	 * Search products by category field
	 *
	 * MoneyWorks provides 4 category fields (Category1 through Category4) for custom classification.
	 *
	 * @param categoryNumber - Which category field to search (1, 2, 3, or 4)
	 * @param value - The category value to match
	 * @returns Array of products in this category
	 *
	 * @example
	 * ```typescript
	 * // Find all products in "Electronics" category
	 * const electronics = await repo.searchByCategory(1, "Electronics");
	 *
	 * // Find all products in "Clearance" (Category2)
	 * const clearance = await repo.searchByCategory(2, "Clearance");
	 * ```
	 *
	 * @ai-instruction Use this for custom product classification
	 * @ai-context Category fields are user-defined for analysis purposes
	 */
	async searchByCategory(
		categoryNumber: 1 | 2 | 3 | 4,
		value: string,
	): Promise<MoneyWorksProduct[]> {
		const fieldName = `Category${categoryNumber}`;
		return this.find(`${fieldName}="${value}"`);
	}

	/**
	 * Find products with low stock levels (below reorder threshold)
	 *
	 * Returns inventoried products where StockOnHand < ReorderLevel.
	 * Only includes products that:
	 * - Are inventoried (Hash >= 8)
	 * - Have a reorder level set (ReorderLevel > 0)
	 * - Have stock below that level
	 *
	 * @returns Array of products needing reorder
	 *
	 * @example
	 * ```typescript
	 * const lowStock = await repo.findLowStock();
	 *
	 * if (lowStock.length > 0) {
	 *   console.log("Products needing reorder:");
	 *   lowStock.forEach(product => {
	 *     const needed = product.ReorderLevel! - (product.StockOnHand || 0);
	 *     console.log(`${product.Code}: ${product.StockOnHand} in stock, ` +
	 *                 `reorder level ${product.ReorderLevel} (need ${needed})`);
	 *   });
	 * }
	 * ```
	 *
	 * @ai-instruction Use this for inventory reorder alerts
	 * @ai-context Filtered in JavaScript since MW search doesn't support field comparisons
	 */
	async findLowStock(): Promise<MoneyWorksProduct[]> {
		// Get all inventoried products
		const allProducts = await this.findAll();

		// Filter in JS for products where StockOnHand < ReorderLevel
		// Only check products that are inventoried and have a reorder level set
		return allProducts.filter((product) => {
			const isInventoried = product.Hash && product.Hash >= 8;
			const hasReorderLevel =
				product.ReorderLevel !== undefined && product.ReorderLevel > 0;
			const stockOnHand = product.StockOnHand || 0;

			return (
				isInventoried &&
				hasReorderLevel &&
				stockOnHand < (product.ReorderLevel || 0)
			);
		});
	}
}
