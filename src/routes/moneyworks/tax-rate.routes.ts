import { TaxRateService } from "../../services/tables/tax-rate.service";
import { taxRateObject } from "../../types/constants.eden";
import type { TaxRate } from "../../types/interface/tables/taxrate";
import { moneyworksRoute } from "./base/moneyworks.route";

export const taxRateRoutes = moneyworksRoute<
  TaxRate,
  "TaxRate",
  typeof taxRateObject
>("TaxRate", taxRateObject, new TaxRateService(), {
  summary: "tax-rates",
  description: "",
  tags: ["System"],
});
