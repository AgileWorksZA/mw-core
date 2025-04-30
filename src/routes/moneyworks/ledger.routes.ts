import { LedgerService } from "../../services/tables/ledger.service";
import { ledgerObject } from "../../types/constants.eden";
import type { Ledger } from "../../types/interface/tables/ledger";
import { moneyworksRoute } from "./base/moneyworks.route";

export const ledgerRoutes = moneyworksRoute<Ledger, "Ledger", typeof ledgerObject>(
  "Ledger",
  ledgerObject,
  new LedgerService(),
  {
    summary: "Ledgers",
    description: "Stores periodic balances (actuals and budgets) for General Ledger accounts, potentially including departmental breakdowns.",
    tags: ["Transaction"],
  },
);
