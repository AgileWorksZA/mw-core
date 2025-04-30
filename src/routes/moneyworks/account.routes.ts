import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { AccountService } from "../../services/tables/account.service";
import { accountObject } from "../../types/constants.eden";
import type { Account } from "../../types/interface/tables/account";
import { moneyworksRoute } from "./base/moneyworks.route";

export const accountRoutes = moneyworksRoute<
  Account,
  "Account",
  typeof accountObject
>("Account", accountObject, new AccountService(loadMoneyWorksConfig()), {
  summary: "Accounts",
  description:
    "Defines the Chart of Accounts (CoA), storing all General Ledger accounts used for financial classification and reporting.",
  tags: ["CRM"],
});
