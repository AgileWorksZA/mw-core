import { enforceType } from "../../types/helpers";
import { type Product, ProductFields } from "../../types/interface/product";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/product-schema";
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

  dataCenterJsonToProduct(data: any): Product {
    return ProductFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Product record`,
        );
      }
      (acc as any)[key] = enforceType(
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
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams = {
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

  /**
   * Get a single product by code
   *
   * @param code The product code to look up
   * @returns Product details
   */
  async getProductByCode(code: string) {
    try {
      const response = await this.api.export("product", {
        search: `code=\`${code}\``,
        format: "xml-verbose",
      });

      if (!response.data[0]) {
        throw new Error(`Product with code "${code}" not found`);
      }

      return this.dataCenterJsonToProduct(response.data[0]);
    } catch (error) {
      console.error(`Error fetching product with code ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get a single product by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Product details
   */
  async getProductBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("product", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose",
      });

      if (!response?.data) {
        throw new Error(
          `Product with sequence number "${seqNumber}" not found`,
        );
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const productData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return this.dataCenterJsonToProduct(productData);
    } catch (error) {
      console.error(
        `Error fetching product with sequence number ${seqNumber}:`,
        error,
      );
      throw error;
    }
  }
}
