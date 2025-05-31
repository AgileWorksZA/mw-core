import { type User, UserFields } from "../../types/interface/tables/user";
import schema from "../../types/optimized/table/user-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks User table
 * User entries in MoneyWorks
 */
export class UserService extends TableService<User> {
  constructor() {
    super("user", schema, UserFields);
  }
}
