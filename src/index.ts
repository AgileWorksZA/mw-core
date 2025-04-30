import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { accountRoutes } from "./routes/moneyworks/account.routes";
import { assetCatRoutes } from "./routes/moneyworks/asset-cat.routes";
import { assetLogRoutes } from "./routes/moneyworks/asset-log.routes";
import { assetRoutes } from "./routes/moneyworks/asset.routes";
import { autoSplitRoutes } from "./routes/moneyworks/auto-split.routes";
import { bankRecsRoutes } from "./routes/moneyworks/bank-recs.routes";
import { buildRoutes } from "./routes/moneyworks/build.routes";
import { contactsRoutes } from "./routes/moneyworks/contacts.routes";
import { departmentRoutes } from "./routes/moneyworks/department.routes";
import { detailRoutes } from "./routes/moneyworks/detail.routes";
import { filterRoutes } from "./routes/moneyworks/filter.routes";
import { generalRoutes } from "./routes/moneyworks/general.routes";
import { inventoryRoutes } from "./routes/moneyworks/inventory.routes";
import { jobSheetRoutes } from "./routes/moneyworks/job-sheet.routes";
import { jobRoutes } from "./routes/moneyworks/job.routes";
import { ledgerRoutes } from "./routes/moneyworks/ledger.routes";
import { linkRoutes } from "./routes/moneyworks/link.routes";
import { listsRoutes } from "./routes/moneyworks/lists.routes";
import { logRoutes } from "./routes/moneyworks/log.routes";
import { loginRoutes } from "./routes/moneyworks/login.routes";
import { memoRoutes } from "./routes/moneyworks/memo.routes";
import { messageRoutes } from "./routes/moneyworks/message.routes";
import { nameRoutes } from "./routes/moneyworks/name.routes";
import { offLedgerRoutes } from "./routes/moneyworks/off-ledger.routes";
import { paymentsRoutes } from "./routes/moneyworks/payments.routes";
import { productRoutes } from "./routes/moneyworks/product.routes";
import { stickiesRoutes } from "./routes/moneyworks/stickies.routes";
import { taxRateRoutes } from "./routes/moneyworks/tax-rate.routes";
import { transactionRoutes } from "./routes/moneyworks/transaction.routes";
import { userRoutes } from "./routes/moneyworks/user.routes";
import { user2Routes } from "./routes/moneyworks/user2.routes";

import { companyInformationRoutes } from "./routes/system/company-information.routes";
import { evaluateRoutes } from "./routes/system/evaluate.routes";
import { reportRoutes } from "./routes/system/report.routes";
import { systemLabelsRoutes } from "./routes/system/system-labels.routes";

const app = new Elysia({
  serve: {
    idleTimeout: 30,
  },
})
  .use(cors())
  // Add Swagger documentation
  .use(
    swagger({
      documentation: {
        info: {
          title: "MoneyWorks API",
          version: "1.0.0",
          description: "API for interacting with MoneyWorks accounting data",
        },
        tags: [{ name: "MoneyWorks", description: "MoneyWorks endpoints" }],
      },
    }),
  )
  // Register all table routes
  .use(accountRoutes)
  .use(assetRoutes)
  .use(assetCatRoutes)
  .use(assetLogRoutes)
  .use(autoSplitRoutes)
  .use(bankRecsRoutes)
  .use(buildRoutes)
  .use(contactsRoutes)
  .use(departmentRoutes)
  .use(detailRoutes)
  .use(filterRoutes)
  .use(generalRoutes)
  .use(inventoryRoutes)
  .use(jobRoutes)
  .use(jobSheetRoutes)
  .use(ledgerRoutes)
  .use(linkRoutes)
  .use(listsRoutes)
  .use(logRoutes)
  .use(loginRoutes)
  .use(memoRoutes)
  .use(messageRoutes)
  .use(nameRoutes)
  .use(offLedgerRoutes)
  .use(paymentsRoutes)
  .use(productRoutes)
  .use(stickiesRoutes)
  .use(taxRateRoutes)
  .use(transactionRoutes)
  .use(userRoutes)
  .use(user2Routes)
  // Register all system routes
  .use(companyInformationRoutes)
  .use(evaluateRoutes)
  .use(reportRoutes)
  .use(systemLabelsRoutes)

  .listen(3131);

console.log(
  `🦊 MoneyWorks API is running at ${app.server?.hostname}:${app.server?.port}`,
);
console.log(
  `📚 Swagger documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger\``,
);
