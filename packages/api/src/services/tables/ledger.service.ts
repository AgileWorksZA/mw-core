import { type Ledger, LedgerFields } from "../../types/interface/tables/ledger";
import schema from "../../types/optimized/table/ledger-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Ledger table
 * Ledger entries in MoneyWorks
 */
export class LedgerService extends TableService<Ledger> {
  constructor() {
    super("ledger", schema, LedgerFields);
  }
}
