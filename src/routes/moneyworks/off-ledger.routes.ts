import { OffLedgerService } from "../../services/tables/off-ledger.service";
import { offLedgerObject } from "../../types/constants.eden";
import type { OffLedger } from "../../types/interface/tables/offledger";
import { moneyworksRoute } from "./base/moneyworks.route";

export const offLedgerRoutes = moneyworksRoute<OffLedger, "OffLedger", typeof offLedgerObject>(
  "OffLedger",
  offLedgerObject,
  new OffLedgerService(),
  {
    summary: "Off-Ledgers",
    description: "Stores non-financial periodic data (e.g., KPIs, statistical units) and associated budgets, identified by Kind and Name. Also used internally for currency data.",
    tags: ["Transaction"],
  },
);
