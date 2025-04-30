import { type BankRecs, BankRecsFields } from "../../types/interface/tables/bankrecs";
import schema from "../../types/optimized/table/bankrecs-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks BankRecs table
 * Bank reconciliations represent bank statement reconciliations
 */
export class BankRecsService extends TableService<BankRecs> {
  constructor() {
    super("bankrecs", schema, BankRecsFields);
  }
}
