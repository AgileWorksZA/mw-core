import { type Login, LoginFields } from "../../types/interface/tables/login";
import schema from "../../types/optimized/table/login-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Login table
 * Login entries in MoneyWorks
 */
export class LoginService extends TableService<Login> {
  constructor() {
    super("login", schema, LoginFields);
  }
}
