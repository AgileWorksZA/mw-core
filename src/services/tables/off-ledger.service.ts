import { type OffLedger, OffLedgerFields } from "../../types/interface/tables/offledger";
import schema from "../../types/optimized/table/offledger-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks OffLedger table
 * Off ledger items represent items not in the general ledger
 */
export class OffLedgerService extends TableService<OffLedger> {
  constructor() {
    super("offledger", schema, OffLedgerFields);
  }
}
