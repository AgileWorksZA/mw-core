import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import type { OpenAPIV3 } from "openapi-types";

import { accountRoutes } from "./routes/tables/account.routes";
import { autoSplitRoutes } from "./routes/tables/auto-split.routes";
import { bankRecsRoutes } from "./routes/tables/bank-recs.routes";
import { buildRoutes } from "./routes/tables/build.routes";
import { departmentRoutes } from "./routes/tables/department.routes";
import { detailRoutes } from "./routes/tables/detail.routes";
import { filterRoutes } from "./routes/tables/filter.routes";
import { generalRoutes } from "./routes/tables/general.routes";
import { jobSheetRoutes } from "./routes/tables/job-sheet.routes";
import { jobRoutes } from "./routes/tables/job.routes";
import { ledgerRoutes } from "./routes/tables/ledger.routes";
import { linkRoutes } from "./routes/tables/link.routes";
import { listsRoutes } from "./routes/tables/lists.routes";
import { logRoutes } from "./routes/tables/log.routes";
import { loginRoutes } from "./routes/tables/login.routes";
import { memoRoutes } from "./routes/tables/memo.routes";
import { messageRoutes } from "./routes/tables/message.routes";
import { nameRoutes } from "./routes/tables/name.routes";
import { offLedgerRoutes } from "./routes/tables/off-ledger.routes";
import { paymentsRoutes } from "./routes/tables/payments.routes";
import { productRoutes } from "./routes/tables/product.routes";
import { stickiesRoutes } from "./routes/tables/stickies.routes";
import { taxRateRoutes } from "./routes/tables/tax-rate.routes";
import { transactionRoutes } from "./routes/tables/transaction.routes";
import { userRoutes } from "./routes/tables/user.routes";
import { user2Routes } from "./routes/tables/user2.routes";

import { companyInformationRoutes } from "./routes/system/company-information.routes";
import Account from "./types/json-schema/table/account-schema.json";
import AutoSplit from "./types/json-schema/table/autosplit-schema.json";
import BankRecs from "./types/json-schema/table/bankrecs-schema.json";
import Build from "./types/json-schema/table/build-schema.json";
import Department from "./types/json-schema/table/department-schema.json";
import Detail from "./types/json-schema/table/detail-schema.json";
import Filter from "./types/json-schema/table/filter-schema.json";
import General from "./types/json-schema/table/general-schema.json";
import Job from "./types/json-schema/table/job-schema.json";
import JobSheet from "./types/json-schema/table/jobsheet-schema.json";
import Ledger from "./types/json-schema/table/ledger-schema.json";
import Link from "./types/json-schema/table/link-schema.json";
import List from "./types/json-schema/table/list-schema.json";
import Log from "./types/json-schema/table/log-schema.json";
import Login from "./types/json-schema/table/login-schema.json";
import Memo from "./types/json-schema/table/memo-schema.json";
import Message from "./types/json-schema/table/message-schema.json";
import Name from "./types/json-schema/table/name-schema.json";
import OffLedger from "./types/json-schema/table/offledger-schema.json";
import Payments from "./types/json-schema/table/payments-schema.json";
import Product from "./types/json-schema/table/product-schema.json";
import Stickies from "./types/json-schema/table/stickies-schema.json";
import TaxRate from "./types/json-schema/table/taxrate-schema.json";
import Transaction from "./types/json-schema/table/transaction-schema.json";
import User from "./types/json-schema/table/user-schema.json";
import User2 from "./types/json-schema/table/user2-schema.json";

const app = new Elysia()
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
        components: {
          schemas: {
            Account: Account as OpenAPIV3.SchemaObject,
            AutoSplit: AutoSplit as OpenAPIV3.SchemaObject,
            BankRecs: BankRecs as OpenAPIV3.SchemaObject,
            Build: Build as OpenAPIV3.SchemaObject,
            Department: Department as OpenAPIV3.SchemaObject,
            Detail: Detail as OpenAPIV3.SchemaObject,
            Filter: Filter as OpenAPIV3.SchemaObject,
            General: General as OpenAPIV3.SchemaObject,
            Job: Job as OpenAPIV3.SchemaObject,
            JobSheet: JobSheet as OpenAPIV3.SchemaObject,
            Ledger: Ledger as OpenAPIV3.SchemaObject,
            Link: Link as OpenAPIV3.SchemaObject,
            List: List as OpenAPIV3.SchemaObject,
            Log: Log as OpenAPIV3.SchemaObject,
            Login: Login as OpenAPIV3.SchemaObject,
            Memo: Memo as OpenAPIV3.SchemaObject,
            Message: Message as OpenAPIV3.SchemaObject,
            Name: Name as OpenAPIV3.SchemaObject,
            OffLedger: OffLedger as OpenAPIV3.SchemaObject,
            Payments: Payments as OpenAPIV3.SchemaObject,
            Product: Product as OpenAPIV3.SchemaObject,
            Stickies: Stickies as OpenAPIV3.SchemaObject,
            TaxRate: TaxRate as OpenAPIV3.SchemaObject,
            Transaction: Transaction as OpenAPIV3.SchemaObject,
            User: User as OpenAPIV3.SchemaObject,
            User2: User2 as OpenAPIV3.SchemaObject,
          },
        },
      },
    }),
  )
  // Register all table routes
  .use(accountRoutes)
  .use(autoSplitRoutes)
  .use(bankRecsRoutes)
  .use(buildRoutes)
  .use(departmentRoutes)
  .use(detailRoutes)
  .use(filterRoutes)
  .use(generalRoutes)
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

  .listen(3131);

console.log(
  `🦊 MoneyWorks API is running at ${app.server?.hostname}:${app.server?.port}`,
);
console.log(
  `📚 Swagger documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger\``,
);
