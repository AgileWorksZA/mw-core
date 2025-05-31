import {
  type TaxRate,
  TaxRateFields,
} from "../../types/interface/tables/taxrate";
import schema from "../../types/optimized/table/tax-rate-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks TaxRate table
 * TaxRateUrate entries in MoneyWorks
 */
export class TaxRateService extends TableService<TaxRate> {
  constructor() {
    super("TaxRate", schema, TaxRateFields);
  }
}
