import {
  type Product,
  ProductFields,
} from "../../types/interface/tables/product";
import schema from "../../types/optimized/table/product-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Product table
 * Product entries in MoneyWorks
 */
export class ProductService extends TableService<Product> {
  constructor() {
    super("product", schema, ProductFields);
  }
}
