import { type Detail, DetailFields } from "../../types/interface/tables/detail";
import schema from "../../types/optimized/table/detail-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Detail table
 * Detail entries in MoneyWorks
 */
export class DetailService extends TableService<Detail> {
  constructor() {
    super("detail", schema, DetailFields);
  }
}
