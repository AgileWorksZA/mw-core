import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Product,
  ProductFields,
} from "../../types/interface/tables/product";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/product-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Product table
 * Products represent inventory items, services, or other items that can be sold
 */
export class ProductService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToProduct(data: ANY): Product {
    return ProductFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for record`);
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Product);
  }

  /**
   * Get products from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed product data with pagination metadata
   */
  async getProducts(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Product>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Product> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("product", mwParams);

      // Parse the response
      const products = data.map(this.dataCenterJsonToProduct);

      return {
        data: products,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
}
