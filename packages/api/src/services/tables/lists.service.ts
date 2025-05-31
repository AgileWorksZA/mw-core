import { type Lists, ListsFields } from "../../types/interface/tables/lists";
import schema from "../../types/optimized/table/lists-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Lists table
 * Lists entries in MoneyWorks
 */
export class ListsService extends TableService<Lists> {
  constructor() {
    super("lists", schema, ListsFields);
  }
}