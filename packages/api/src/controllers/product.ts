/**
 * Product Controller
 * Handles Product entity operations for the API
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Products can be stock, service, or assembly items
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { ProductRepository } from "@moneyworks/data";
import { BaseTableController, type TableExportParams } from "./base-table";

export class ProductController extends BaseTableController {
	readonly tableName = "Product";
	readonly displayName = "Products";
	readonly description =
		"Stock, service, and assembly items in MoneyWorks inventory";
	private repo: ProductRepository;

	constructor(client: SmartMoneyWorksClient) {
		super(client);
		this.repo = new ProductRepository(client);
	}

	/**
	 * Get primary key for Product table
	 */
	protected getPrimaryKey(): string {
		return "Code";
	}

	/**
	 * Additional validation specific to Product
	 */
	protected validateTableSpecific(params: TableExportParams): void {
		// Validate orderBy field if provided
		if (params.orderBy) {
			const validFields = [
				"Code",
				"Description",
				"Type",
				"SellPrice",
				"StockLevel",
				"Supplier",
			];
			const field = params.orderBy.split(" ")[0]; // Handle "field DESC"

			if (!validFields.includes(field)) {
				throw new Error(
					`Invalid orderBy field: ${field}. Valid fields: ${validFields.join(", ")}`,
				);
			}
		}

		// Validate filter expressions
		if (params.filter) {
			// Basic validation - check for SQL injection patterns
			const dangerousPatterns = [";", "--", "/*", "*/"];
			for (const pattern of dangerousPatterns) {
				if (params.filter.includes(pattern)) {
					throw new Error("Invalid filter expression");
				}
			}
		}
	}
}
