import { type AutoSplit, AutoSplitFields } from "../../types/interface/tables/autosplit";
import schema from "../../types/optimized/table/autosplit-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks AutoSplit table
 * Auto splits represent automatic transaction splits
 */
export class AutoSplitService extends TableService<AutoSplit> {
  constructor() {
    super("autosplit", schema, AutoSplitFields);
  }
}
