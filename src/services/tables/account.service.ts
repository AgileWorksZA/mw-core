import {
  type Account,
  AccountFields,
} from "../../types/interface/tables/account";
import schema from "../../types/optimized/table/account-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Account table
 * Accounts represent GL accounts in the chart of accounts
 */
export class AccountService extends TableService<Account> {
  constructor() {
    super("account", schema, AccountFields);
  }
}
