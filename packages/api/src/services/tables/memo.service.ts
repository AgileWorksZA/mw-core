import { type Memo, MemoFields } from "../../types/interface/tables/memo";
import schema from "../../types/optimized/table/memo-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Memo table
 * Memo entries in MoneyWorks
 */
export class MemoService extends TableService<Memo> {
  constructor() {
    super("memo", schema, MemoFields);
  }
}
