/**
 * MoneyWorks Product Repository
 *
 * Data access layer for MoneyWorks Products entity
 * Handles CRUD operations and specialized queries
 *
 * @ai-instruction Products support multi-tier pricing (A-F), quantity breaks, and manufacturing
 * @ai-critical Preserve MW terminology: Code (not StockCode), SellPrice, CostPrice, BUILD flags, etc.
 */

import type {
	MoneyWorksProduct,
	MoneyWorksProductFilter,
	MoneyWorksProductInput,
} from "@moneyworks/canonical/products";
import {
	MoneyWorksProductFlags,
	MoneyWorksProductStatus,
	type MoneyWorksProductType,
	validateProduct,
} from "@moneyworks/canonical/products";
import type { ProductCode } from "@moneyworks/utilities";
import type { ExportFormat } from "../client/types";
import type {
	MoneyWorksQueryParams,
	MoneyWorksResponse,
} from "../config/types";
import { BaseMoneyWorksRepository } from "./base.repository";

export class ProductRepository extends BaseMoneyWorksRepository<MoneyWorksProduct> {
	protected readonly tableName = "Product";
	protected readonly primaryKey = "Code";

	/**
	 * Prepare data for MoneyWorks
	 * Convert typed data to MW format
	 */
	protected prepare(data: Partial<MoneyWorksProduct>): any {
		const prepared: any = { ...data };

		// Convert boolean fields to MW format (true/false strings or booleans)
		if (
			"UseMultiplePrices" in prepared &&
			typeof prepared.UseMultiplePrices === "boolean"
		) {
			prepared.UseMultiplePrices = prepared.UseMultiplePrices
				? "true"
				: "false";
		}

		// Ensure numeric fields are properly formatted
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

		for (const field of numericFields) {
			if (
				field in prepared &&
				prepared[field] !== null &&
				prepared[field] !== ""
			) {
				prepared[field] = Number(prepared[field]);
			}
		}

		return prepared;
	}

	/**
	 * Post-process data after export
	 * Convert MW data to typed format
	 */
	protected postProcess(record: any): MoneyWorksProduct {
		const processed = { ...record };

		// Convert UseMultiplePrices from string to boolean
		if ("UseMultiplePrices" in processed) {
			processed.UseMultiplePrices =
				processed.UseMultiplePrices === "true" ||
				processed.UseMultiplePrices === true;
		}

		// Ensure numeric fields are numbers
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

		for (const field of numericFields) {
			if (
				field in processed &&
				processed[field] !== null &&
				processed[field] !== ""
			) {
				processed[field] = Number(processed[field]);
			}
		}

		return processed as MoneyWorksProduct;
	}

	/**
	 * Find by key (Code)
	 */
	async findByKey(code: string): Promise<MoneyWorksProduct | null> {
		const records = await this.find(`Code="${code}"`);
		return records.length > 0 ? records[0] : null;
	}

	/**
	 * Find all products
	 */
	async findAll(params?: MoneyWorksQueryParams): Promise<MoneyWorksProduct[]> {
		return this.find(undefined, params);
	}

	/**
	 * Find products by MoneyWorks search expression
	 * Supports all 4 export formats via smartExport
	 */
	async find(
		search?: string,
		params?: MoneyWorksQueryParams,
	): Promise<MoneyWorksProduct[]> {
		// Check if we're in mock mode
		if (process.env.MONEYWORKS_MOCK_MODE === "true") {
			console.log("[ProductRepository] Using mock mode for search:", search);

			// Define mock product data
			const mockProducts = [
				{
					Code: "PROD001",
					Type: "P",
					Description: "Wireless Keyboard - Ergonomic",
					BarCode: "5012345678901",
					Hash: 0x000e, // Buy + Sell + Inventory
					Flags: 0x00000402, // WE_BUY_IT | WE_SELL_IT | WE_INVENTORY_IT
					BuyPrice: 45.0,
					BuyPriceCurrency: "",
					BuyUnit: "ea",
					ConversionFactor: 1,
					CostPrice: 45.0,
					SellPrice: 89.99,
					SellUnit: "ea",
					StockOnHand: 25,
					StockValue: 1125.0,
					ReorderLevel: 10,
					UseMultiplePrices: false,
					Category1: "Electronics",
					Category2: "Peripherals",
					TaxCode: "GST",
					Supplier: "SUP001",
					COGAcct: "5000",
					SalesAcct: "4000",
					StockAcct: "1300",
					LastModifiedTime: "2024-11-23T10:00:00Z",
					BuyWeight: 0,
					SellWeight: 0,
					SellDiscount: 0,
					SellDiscountMode: 1,
					QtyBreak1: 0,
					QtyBreak2: 0,
					QtyBreak3: 0,
					QtyBreak4: 0,
					SellPriceB: 0,
					SellPriceC: 0,
					SellPriceD: 0,
					SellPriceE: 0,
					SellPriceF: 0,
					QtyBrkSellPriceA1: 0,
					QtyBrkSellPriceA2: 0,
					QtyBrkSellPriceA3: 0,
					QtyBrkSellPriceA4: 0,
					QtyBrkSellPriceB1: 0,
					QtyBrkSellPriceB2: 0,
					QtyBrkSellPriceB3: 0,
					QtyBrkSellPriceB4: 0,
					NormalBuildQty: 0,
					MinBuildQty: 0,
					LeadTimeDays: 7,
					StockTakeNewQty: 0,
					StockTakeStartQty: 0,
					JobPricingMode: 1,
					MarginWarning: 0,
					Plussage: 0,
					Colour: 0,
					Comment: "",
					TaggedText: "",
					TaxCodePurchase: "GST",
					SuppliersCode: "KB-WL-001",
					Category3: "",
					Category4: "",
					Custom1: "",
					Custom2: "",
					Custom3: "",
					Custom4: "",
					Custom5: "",
					Custom6: "",
					Custom7: "",
					Custom8: "",
					UserNum: 0,
					UserText: "",
				},
				{
					Code: "PROD002",
					Type: "P",
					Description: "USB-C Cable 2m - Premium",
					BarCode: "5012345678902",
					Hash: 0x000e,
					Flags: 0x00000402,
					BuyPrice: 8.5,
					BuyPriceCurrency: "",
					BuyUnit: "ea",
					ConversionFactor: 1,
					CostPrice: 8.5,
					SellPrice: 19.99,
					SellUnit: "ea",
					StockOnHand: 150,
					StockValue: 1275.0,
					ReorderLevel: 50,
					UseMultiplePrices: false,
					Category1: "Electronics",
					Category2: "Cables",
					TaxCode: "GST",
					Supplier: "SUP001",
					COGAcct: "5000",
					SalesAcct: "4000",
					StockAcct: "1300",
					LastModifiedTime: "2024-11-23T10:15:00Z",
					BuyWeight: 0,
					SellWeight: 0,
					SellDiscount: 0,
					SellDiscountMode: 1,
					QtyBreak1: 0,
					QtyBreak2: 0,
					QtyBreak3: 0,
					QtyBreak4: 0,
					SellPriceB: 0,
					SellPriceC: 0,
					SellPriceD: 0,
					SellPriceE: 0,
					SellPriceF: 0,
					QtyBrkSellPriceA1: 0,
					QtyBrkSellPriceA2: 0,
					QtyBrkSellPriceA3: 0,
					QtyBrkSellPriceA4: 0,
					QtyBrkSellPriceB1: 0,
					QtyBrkSellPriceB2: 0,
					QtyBrkSellPriceB3: 0,
					QtyBrkSellPriceB4: 0,
					NormalBuildQty: 0,
					MinBuildQty: 0,
					LeadTimeDays: 5,
					StockTakeNewQty: 0,
					StockTakeStartQty: 0,
					JobPricingMode: 1,
					MarginWarning: 0,
					Plussage: 0,
					Colour: 0,
					Comment: "",
					TaggedText: "",
					TaxCodePurchase: "GST",
					SuppliersCode: "CBL-UC-2M",
					Category3: "",
					Category4: "",
					Custom1: "",
					Custom2: "",
					Custom3: "",
					Custom4: "",
					Custom5: "",
					Custom6: "",
					Custom7: "",
					Custom8: "",
					UserNum: 0,
					UserText: "",
				},
				{
					Code: "TIME001",
					Type: "T",
					Description: "Consulting Services - Hourly",
					BarCode: "",
					Hash: 0x0004, // Sell only
					Flags: 0x00000004,
					BuyPrice: 0,
					BuyPriceCurrency: "",
					BuyUnit: "hr",
					ConversionFactor: 1,
					CostPrice: 0,
					SellPrice: 150.0,
					SellUnit: "hr",
					StockOnHand: 0,
					StockValue: 0,
					ReorderLevel: 0,
					UseMultiplePrices: false,
					Category1: "Services",
					Category2: "Consulting",
					TaxCode: "GST",
					Supplier: "",
					COGAcct: "5100",
					SalesAcct: "4100",
					StockAcct: "",
					LastModifiedTime: "2024-11-23T09:00:00Z",
					BuyWeight: 0,
					SellWeight: 0,
					SellDiscount: 0,
					SellDiscountMode: 1,
					QtyBreak1: 0,
					QtyBreak2: 0,
					QtyBreak3: 0,
					QtyBreak4: 0,
					SellPriceB: 0,
					SellPriceC: 0,
					SellPriceD: 0,
					SellPriceE: 0,
					SellPriceF: 0,
					QtyBrkSellPriceA1: 0,
					QtyBrkSellPriceA2: 0,
					QtyBrkSellPriceA3: 0,
					QtyBrkSellPriceA4: 0,
					QtyBrkSellPriceB1: 0,
					QtyBrkSellPriceB2: 0,
					QtyBrkSellPriceB3: 0,
					QtyBrkSellPriceB4: 0,
					NormalBuildQty: 0,
					MinBuildQty: 0,
					LeadTimeDays: 0,
					StockTakeNewQty: 0,
					StockTakeStartQty: 0,
					JobPricingMode: 1,
					MarginWarning: 0,
					Plussage: 0,
					Colour: 0,
					Comment: "",
					TaggedText: "",
					TaxCodePurchase: "",
					SuppliersCode: "",
					Category3: "",
					Category4: "",
					Custom1: "",
					Custom2: "",
					Custom3: "",
					Custom4: "",
					Custom5: "",
					Custom6: "",
					Custom7: "",
					Custom8: "",
					UserNum: 0,
					UserText: "",
				},
				{
					Code: "SHIP001",
					Type: "S",
					Description: "Standard Shipping",
					BarCode: "",
					Hash: 0x0004,
					Flags: 0x00000004,
					BuyPrice: 0,
					BuyPriceCurrency: "",
					BuyUnit: "ea",
					ConversionFactor: 1,
					CostPrice: 0,
					SellPrice: 15.0,
					SellUnit: "ea",
					StockOnHand: 0,
					StockValue: 0,
					ReorderLevel: 0,
					UseMultiplePrices: false,
					Category1: "Shipping",
					Category2: "Standard",
					TaxCode: "GST",
					Supplier: "",
					COGAcct: "5200",
					SalesAcct: "4200",
					StockAcct: "",
					LastModifiedTime: "2024-11-23T08:30:00Z",
					BuyWeight: 0,
					SellWeight: 0,
					SellDiscount: 0,
					SellDiscountMode: 1,
					QtyBreak1: 0,
					QtyBreak2: 0,
					QtyBreak3: 0,
					QtyBreak4: 0,
					SellPriceB: 0,
					SellPriceC: 0,
					SellPriceD: 0,
					SellPriceE: 0,
					SellPriceF: 0,
					QtyBrkSellPriceA1: 0,
					QtyBrkSellPriceA2: 0,
					QtyBrkSellPriceA3: 0,
					QtyBrkSellPriceA4: 0,
					QtyBrkSellPriceB1: 0,
					QtyBrkSellPriceB2: 0,
					QtyBrkSellPriceB3: 0,
					QtyBrkSellPriceB4: 0,
					NormalBuildQty: 0,
					MinBuildQty: 0,
					LeadTimeDays: 0,
					StockTakeNewQty: 0,
					StockTakeStartQty: 0,
					JobPricingMode: 1,
					MarginWarning: 0,
					Plussage: 0,
					Colour: 0,
					Comment: "",
					TaggedText: "",
					TaxCodePurchase: "",
					SuppliersCode: "",
					Category3: "",
					Category4: "",
					Custom1: "",
					Custom2: "",
					Custom3: "",
					Custom4: "",
					Custom5: "",
					Custom6: "",
					Custom7: "",
					Custom8: "",
					UserNum: 0,
					UserText: "",
				},
				{
					Code: "BUILD001",
					Type: "P",
					Description: "Custom Computer Build - Gaming",
					BarCode: "5012345678903",
					Hash: 0x000e,
					Flags: 0x00000c02, // WE_BUY_IT | WE_SELL_IT | WE_INVENTORY_IT | WE_BUILD_IT
					BuyPrice: 0,
					BuyPriceCurrency: "",
					BuyUnit: "ea",
					ConversionFactor: 1,
					CostPrice: 1250.0,
					SellPrice: 2499.99,
					SellUnit: "ea",
					StockOnHand: 3,
					StockValue: 3750.0,
					ReorderLevel: 2,
					UseMultiplePrices: false,
					Category1: "Electronics",
					Category2: "Computers",
					TaxCode: "GST",
					Supplier: "",
					COGAcct: "5000",
					SalesAcct: "4000",
					StockAcct: "1300",
					LastModifiedTime: "2024-11-23T11:00:00Z",
					BuyWeight: 0,
					SellWeight: 0,
					SellDiscount: 0,
					SellDiscountMode: 1,
					QtyBreak1: 0,
					QtyBreak2: 0,
					QtyBreak3: 0,
					QtyBreak4: 0,
					SellPriceB: 0,
					SellPriceC: 0,
					SellPriceD: 0,
					SellPriceE: 0,
					SellPriceF: 0,
					QtyBrkSellPriceA1: 0,
					QtyBrkSellPriceA2: 0,
					QtyBrkSellPriceA3: 0,
					QtyBrkSellPriceA4: 0,
					QtyBrkSellPriceB1: 0,
					QtyBrkSellPriceB2: 0,
					QtyBrkSellPriceB3: 0,
					QtyBrkSellPriceB4: 0,
					NormalBuildQty: 1,
					MinBuildQty: 1,
					LeadTimeDays: 14,
					StockTakeNewQty: 0,
					StockTakeStartQty: 0,
					JobPricingMode: 1,
					MarginWarning: 20,
					Plussage: 0,
					Colour: 0,
					Comment: "Custom built gaming computer with high-end components",
					TaggedText: "",
					TaxCodePurchase: "GST",
					SuppliersCode: "",
					Category3: "Gaming",
					Category4: "",
					Custom1: "",
					Custom2: "",
					Custom3: "",
					Custom4: "",
					Custom5: "",
					Custom6: "",
					Custom7: "",
					Custom8: "",
					UserNum: 0,
					UserText: "",
				},
			];

			// Apply search filter if provided (simple mock implementation)
			let filteredProducts = mockProducts;
			if (search) {
				// Very basic MW search expression parsing for mock mode
				// Real MW would handle complex expressions, but this is good enough for testing

				// Handle combined expressions with AND
				if (search.includes(" AND ")) {
					const parts = search.split(" AND ");
					for (const part of parts) {
						const trimmedPart = part.trim();

						// Handle Type filters
						if (trimmedPart.includes("Type=")) {
							const typeMatch = trimmedPart.match(/Type="([^"]+)"/);
							if (typeMatch) {
								filteredProducts = filteredProducts.filter(
									(p) => p.Type === typeMatch[1],
								);
							}
						}
						// Handle Hash filters
						else if (trimmedPart.includes("Hash<8")) {
							filteredProducts = filteredProducts.filter(
								(p) => (p.Hash & 0x0008) === 0,
							);
						} else if (trimmedPart.includes("Hash>=8")) {
							filteredProducts = filteredProducts.filter(
								(p) => (p.Hash & 0x0008) !== 0,
							);
						} else if (trimmedPart.includes("Hash>0")) {
							filteredProducts = filteredProducts.filter((p) => p.Hash > 0);
						}
					}
				}
				// Handle exact match searches like Code="PROD001"
				else if (search.match(/Code="([^"]+)"/)) {
					const exactMatch = search.match(/Code="([^"]+)"/);
					if (exactMatch) {
						filteredProducts = mockProducts.filter(
							(p) => p.Code === exactMatch[1],
						);
					}
				}
				// Handle Category searches
				else if (search.includes("Category1=")) {
					const catMatch = search.match(/Category1="([^"]+)"/);
					if (catMatch) {
						filteredProducts = mockProducts.filter(
							(p) => p.Category1 === catMatch[1],
						);
					}
				} else if (search.includes("Category2=")) {
					const catMatch = search.match(/Category2="([^"]+)"/);
					if (catMatch) {
						filteredProducts = mockProducts.filter(
							(p) => p.Category2 === catMatch[1],
						);
					}
				}
				// Handle Hash filters (active/inventory status)
				else if (search.includes("Hash>0")) {
					// All our mock products are active
					filteredProducts = mockProducts;
				} else if (search.includes("Hash>=8")) {
					// Products with inventory
					filteredProducts = mockProducts.filter(
						(p) => (p.Hash & 0x0008) !== 0,
					);
				} else if (search.includes("Hash<8")) {
					// Non-stock products
					filteredProducts = mockProducts.filter(
						(p) => (p.Hash & 0x0008) === 0,
					);
				}
				// Handle CostPrice filters
				else if (search.includes("CostPrice>0")) {
					filteredProducts = mockProducts.filter((p) => p.CostPrice > 0);
				}
				// Handle Type filters
				else if (search.includes("Type=")) {
					const typeMatch = search.match(/Type="([^"]+)"/);
					if (typeMatch) {
						filteredProducts = mockProducts.filter(
							(p) => p.Type === typeMatch[1],
						);
					}
				}
				// Handle Supplier filters
				else if (search.includes("Supplier=")) {
					const suppMatch = search.match(/Supplier="([^"]+)"/);
					if (suppMatch) {
						filteredProducts = mockProducts.filter(
							(p) => p.Supplier === suppMatch[1],
						);
					}
				}
				// Default: text search in common fields
				else {
					const searchLower = search.toLowerCase();
					filteredProducts = mockProducts.filter(
						(p) =>
							p.Code.toLowerCase().includes(searchLower) ||
							p.Description.toLowerCase().includes(searchLower) ||
							p.Category1.toLowerCase().includes(searchLower),
					);
				}
			}

			// Apply sorting if specified
			if (params?.sort) {
				const sortField = params.sort as keyof typeof filteredProducts[0];
				filteredProducts.sort((a, b) => {
					const aVal = a[sortField];
					const bVal = b[sortField];
					if (typeof aVal === "string" && typeof bVal === "string") {
						return aVal.localeCompare(bVal);
					}
					if (typeof aVal === "number" && typeof bVal === "number") {
						return aVal - bVal;
					}
					return 0;
				});
			}

			// Apply pagination
			const offset = params?.offset || 0;
			const limit = params?.limit;
			if (limit !== undefined) {
				filteredProducts = filteredProducts.slice(offset, offset + limit);
			} else if (offset > 0) {
				filteredProducts = filteredProducts.slice(offset);
			}

			return filteredProducts.map((record) => this.postProcess(record));
		}

		// Use smartExport which returns objects by default
		console.log(
			"[ProductRepository.find] Calling smartExport with search:",
			search,
			"params:",
			params,
		);

		try {
			const result = await this.client.smartExport(this.tableName, {
				search,
				...params,
				exportFormat: "full",
			});

			// smartExport returns an array of objects when exportFormat is 'full'
			if (!Array.isArray(result)) {
				console.error(
					"[ProductRepository.find] Unexpected response format:",
					result,
				);
				throw new Error("Unexpected response format");
			}

			console.log(
				"[ProductRepository.find] Got",
				result.length,
				"records from MoneyWorks",
			);
			return result.map((record) => this.postProcess(record));
		} catch (error) {
			console.error("[ProductRepository.find] Error from smartExport:", error);
			throw error;
		}
	}

	// ============= SPECIALIZED QUERIES =============

	/**
	 * Get active products (not discontinued)
	 * Products with Hash > 0 (have BUY, SELL, or INVENTORY flags)
	 */
	async getActiveProducts(
		options: {
			orderBy?: string;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksProduct[]> {
		// In MoneyWorks, active products have Hash > 0
		const search = "Hash>0";

		return this.find(search, {
			sort: options.orderBy || "Code",
			limit: options.limit,
			offset: options.offset,
		});
	}

	/**
	 * Get products by category
	 * @param category Category value to match
	 * @param categoryNumber Which category field to search (1-4)
	 */
	async getByCategory(
		category: string,
		categoryNumber: 1 | 2 | 3 | 4 = 1,
	): Promise<MoneyWorksProduct[]> {
		const search = `Category${categoryNumber}="${category}"`;
		return this.find(search, { sort: "Description" });
	}

	/**
	 * Get products at a specific location
	 * Note: This requires location-specific stock functions in MW
	 * @param location Stock location code
	 */
	async getByLocation(location: string): Promise<MoneyWorksProduct[]> {
		// MoneyWorks uses SOHForLocation() function, which can't be used in REST API search
		// We need to fetch all inventory products and filter client-side
		const products = await this.find("Hash>=8"); // All inventoried items

		// In a real implementation, you would need to call MW functions to get location stock
		// For now, return all inventoried products
		return products;
	}

	/**
	 * Get kit/build products (products that can be manufactured)
	 * Products with WE_BUILD_IT flag (0x00000400)
	 */
	async getKitProducts(
		options: {
			orderBy?: string;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksProduct[]> {
		// Products with BUILD flag set
		// Note: MoneyWorks REST search doesn't support bitwise operations
		// We need to fetch products and filter client-side
		const allProducts = await this.find(undefined, {
			limit: options.limit || 1000,
		});

		const buildProducts = allProducts.filter(
			(p) => (p.Flags & MoneyWorksProductFlags.WE_BUILD_IT) !== 0,
		);

		// Apply sorting
		if (options.orderBy) {
			buildProducts.sort((a, b) => {
				const aVal = a[options.orderBy as keyof MoneyWorksProduct];
				const bVal = b[options.orderBy as keyof MoneyWorksProduct];
				if (typeof aVal === "string" && typeof bVal === "string") {
					return aVal.localeCompare(bVal);
				}
				return 0;
			});
		}

		return buildProducts;
	}

	/**
	 * Get non-stock products (services, time, shipping methods)
	 * Products without INVENTORY flag (Hash < 8)
	 */
	async getNonStockProducts(
		options: {
			type?: MoneyWorksProductType;
			orderBy?: string;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksProduct[]> {
		let search = "Hash<8";

		if (options.type) {
			search += ` AND Type="${options.type}"`;
		}

		return this.find(search, {
			sort: options.orderBy || "Description",
			limit: options.limit,
			offset: options.offset,
		});
	}

	/**
	 * Search products by text
	 * Searches across Code, Description, and BarCode fields
	 */
	async search(
		searchText: string,
		options: {
			searchFields?: (
				| "Code"
				| "Description"
				| "BarCode"
				| "Category1"
				| "Category2"
				| "Category3"
				| "Category4"
			)[];
			productType?: MoneyWorksProductType;
			includeInactive?: boolean;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksProduct[]> {
		// MoneyWorks search expressions are limited - fetch and filter in JavaScript
		let baseFilter = "";

		// Add product type filter if specified
		if (options.productType) {
			baseFilter = `Type="${options.productType}"`;
		}

		// Add active filter if needed
		if (!options.includeInactive) {
			baseFilter = baseFilter ? `${baseFilter} AND Hash>0` : "Hash>0";
		}

		// Fetch records with base filter
		const fetchLimit = Math.max(options.limit || 100, 1000);
		const allRecords = await this.find(baseFilter || undefined, {
			limit: fetchLimit,
		});

		// Now filter by search text in JavaScript
		const searchFields = options.searchFields || [
			"Code",
			"Description",
			"BarCode",
		];
		const searchTextLower = searchText.toLowerCase();

		let filteredRecords = allRecords;

		// Only apply text search if searchText is provided
		if (searchText.trim()) {
			filteredRecords = allRecords.filter((record) => {
				return searchFields.some((field) => {
					const fieldValue = record[field as keyof MoneyWorksProduct];
					if (typeof fieldValue === "string") {
						return fieldValue.toLowerCase().includes(searchTextLower);
					}
					return false;
				});
			});
		}

		// Apply offset and limit
		const offset = options.offset || 0;
		const limit = options.limit || filteredRecords.length;

		return filteredRecords.slice(offset, offset + limit);
	}

	/**
	 * Get products by pricing level
	 * Returns products that have a price set for the specified level
	 */
	async getByPricingLevel(
		level: "A" | "B" | "C" | "D" | "E" | "F",
	): Promise<MoneyWorksProduct[]> {
		// Fetch all products and filter for those with prices at this level
		const allProducts = await this.find("Hash>0");

		return allProducts.filter((p) => {
			const priceField = level === "A" ? "SellPrice" : `SellPrice${level}`;
			const price = p[priceField as keyof MoneyWorksProduct];
			return typeof price === "number" && price > 0;
		});
	}

	/**
	 * Get products with current costs
	 * Returns products that have a CostPrice > 0
	 */
	async getWithCurrentCosts(
		options: {
			orderBy?: string;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksProduct[]> {
		const search = "CostPrice>0";

		return this.find(search, {
			sort: options.orderBy || "Code",
			limit: options.limit,
			offset: options.offset,
		});
	}

	/**
	 * Get products below reorder level
	 * Returns inventoried products where StockOnHand < ReorderLevel
	 */
	async getBelowReorderLevel(): Promise<MoneyWorksProduct[]> {
		// Fetch all inventoried products
		const products = await this.find("Hash>=8");

		// Filter for products below reorder level
		return products.filter(
			(p) => p.ReorderLevel > 0 && p.StockOnHand < p.ReorderLevel,
		);
	}

	/**
	 * Get products by supplier
	 * Returns products from a specific supplier
	 */
	async getBySupplier(
		supplierCode: string,
		options: {
			orderBy?: string;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksProduct[]> {
		const search = `Supplier="${supplierCode}"`;

		return this.find(search, {
			sort: options.orderBy || "Code",
			limit: options.limit,
			offset: options.offset,
		});
	}

	/**
	 * Get products by type
	 * Returns products of a specific type (P/R/T/S/O)
	 */
	async getByType(
		type: MoneyWorksProductType,
		options: {
			orderBy?: string;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<MoneyWorksProduct[]> {
		const search = `Type="${type}"`;

		return this.find(search, {
			sort: options.orderBy || "Description",
			limit: options.limit,
			offset: options.offset,
		});
	}
}
