import { ProductService } from "../../services/tables/product.service";
import { productObject } from "../../types/constants.eden";
import type { Product } from "../../types/interface/tables/product";
import { moneyworksRoute } from "./base/moneyworks.route";

export const productRoutes = moneyworksRoute<Product, "Product", typeof productObject>(
  "Product",
  productObject,
  new ProductService(),
  {
    summary: "products",
    description: "",
    tags: ["System"],
  },
);
