import { BankRecsService } from "../../services/tables/bank-recs.service";
import { bankRecsObject } from "../../types/constants.eden";
import type { BankRecs } from "../../types/interface/tables/bankrecs";
import { moneyworksRoute } from "./base/moneyworks.route";

export const bankRecsRoutes = moneyworksRoute<BankRecs, "BankRecs", typeof bankRecsObject>(
  "BankRecs",
  bankRecsObject,
  new BankRecsService(),
  {
    summary: "Bank Reconciliations",
    description: "Stores historical records of completed bank reconciliations, including statement details and balances.",
    tags: ["Banking"],
  },
);
