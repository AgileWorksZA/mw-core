import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Product,
  type ProductField,
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

  dataCenterJsonToProductUsingFields(
    fields: ProductField[],
    data: ANY,
  ): Product {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Product record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Product);
  }

  dataCenterJsonToProduct(data: ANY): Product {
    return ProductFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Product record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
    skip_validation?: boolean;
  }) {
    // Validate fields against ProductFields if provided and skip_validation is not true
    if (params.fields && params.fields.length > 0 && !params.skip_validation) {
      for (const field of params.fields) {
        if (!ProductFields.includes(field as ProductField)) {
          throw new Error(
            `Invalid field '${field}' for Product table. Valid fields are: ${ProductFields.join(", ")}`,
          );
        }
      }
    }

    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Product> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("product", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to product objects
      const products = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToProductUsingFields(
              params.fields as ProductField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToProduct);

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
