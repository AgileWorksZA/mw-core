import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { nameRoutes } from "./routes/name.routes";
import { accountRoutes } from "./routes/account.routes";
import { transactionRoutes } from "./routes/transaction.routes";
import { departmentRoutes } from "./routes/department.routes";
import { jobRoutes } from "./routes/job.routes";
import { productRoutes } from "./routes/product.routes";
import { memoRoutes } from "./routes/memo.routes";
import { taxRateRoutes } from "./routes/tax-rate.routes";
import { userRoutes } from "./routes/user.routes";
import { detailRoutes } from "./routes/detail.routes";
import { ledgerRoutes } from "./routes/ledger.routes";
import { buildRoutes } from "./routes/build.routes";
import { autoSplitRoutes } from "./routes/auto-split.routes";
import { bankRecsRoutes } from "./routes/bank-recs.routes";
import { filterRoutes } from "./routes/filter.routes";
import { generalRoutes } from "./routes/general.routes";
import { jobSheetRoutes } from "./routes/job-sheet.routes";
import { linkRoutes } from "./routes/link.routes";
import { listsRoutes } from "./routes/lists.routes";
import { logRoutes } from "./routes/log.routes";
import { loginRoutes } from "./routes/login.routes";
import { messageRoutes } from "./routes/message.routes";
import { offLedgerRoutes } from "./routes/off-ledger.routes";
import { paymentsRoutes } from "./routes/payments.routes";
import { stickiesRoutes } from "./routes/stickies.routes";
import { user2Routes } from "./routes/user2.routes";

const app = new Elysia()
  // Add Swagger documentation
  .use(swagger({
    documentation: {
      info: {
        title: "MoneyWorks API",
        version: "1.0.0",
        description: "API for interacting with MoneyWorks accounting data",
      },
      tags: [
        { name: "MoneyWorks", description: "MoneyWorks endpoints" }
      ]
    },
  }))
  // Register all routes
  .use(nameRoutes)
  .use(accountRoutes)
  .use(transactionRoutes)
  .use(departmentRoutes)
  .use(jobRoutes)
  .use(productRoutes)
  .use(memoRoutes)
  .use(taxRateRoutes)
  .use(userRoutes)
  .use(detailRoutes)
  .use(ledgerRoutes)
  .use(buildRoutes)
  .use(autoSplitRoutes)
  .use(bankRecsRoutes)
  .use(filterRoutes)
  .use(generalRoutes)
  .use(jobSheetRoutes)
  .use(linkRoutes)
  .use(listsRoutes)
  .use(logRoutes)
  .use(loginRoutes)
  .use(messageRoutes)
  .use(offLedgerRoutes)
  .use(paymentsRoutes)
  .use(stickiesRoutes)
  .use(user2Routes)
  .listen(3131);

console.log(
  `🦊 MoneyWorks API is running at http://${app.server?.hostname}:${app.server?.port}/swagger`
);
console.log(`📚 Swagger documentation available at /swagger`);
