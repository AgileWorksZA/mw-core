import { type User2, User2Fields } from "../../types/interface/tables/user2";
import schema from "../../types/optimized/table/user2-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks User2 table
 * User2 entries in MoneyWorks
 */
export class User2Service extends TableService<User2> {
  constructor() {
    super("user2", schema, User2Fields);
  }
}
