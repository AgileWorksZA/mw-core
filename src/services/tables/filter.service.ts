import { type Filter, FilterFields } from "../../types/interface/tables/filter";
import schema from "../../types/optimized/table/filter-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Filter table
 * Filter entries in MoneyWorks
 */
export class FilterService extends TableService<Filter> {
  constructor() {
    super("filter", schema, FilterFields);
  }
}
