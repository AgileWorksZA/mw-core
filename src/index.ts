import {Elysia} from "elysia";
import {swagger} from "@elysiajs/swagger";
import {nameRoutes} from "./routes/name.routes";
import {accountRoutes} from "./routes/account.routes";
import {transactionRoutes} from "./routes/transaction.routes";
import {departmentRoutes} from "./routes/department.routes";
import {jobRoutes} from "./routes/job.routes";
import {productRoutes} from "./routes/product.routes";
import {memoRoutes} from "./routes/memo.routes";
import {taxRateRoutes} from "./routes/tax-rate.routes";
import {userRoutes} from "./routes/user.routes";
import {detailRoutes} from "./routes/detail.routes";
import {ledgerRoutes} from "./routes/ledger.routes";
import {buildRoutes} from "./routes/build.routes";
import {autoSplitRoutes} from "./routes/auto-split.routes";
import {bankRecsRoutes} from "./routes/bank-recs.routes";
import {filterRoutes} from "./routes/filter.routes";
import {generalRoutes} from "./routes/general.routes";
import {jobSheetRoutes} from "./routes/job-sheet.routes";
import {linkRoutes} from "./routes/link.routes";
import {listsRoutes} from "./routes/lists.routes";
import {logRoutes} from "./routes/log.routes";
import {loginRoutes} from "./routes/login.routes";
import {messageRoutes} from "./routes/message.routes";
import {offLedgerRoutes} from "./routes/off-ledger.routes";
import {paymentsRoutes} from "./routes/payments.routes";
import {stickiesRoutes} from "./routes/stickies.routes";
import {user2Routes} from "./routes/user2.routes";
import {type OpenAPIV3} from "openapi-types";

import Account from "./moneyworks/json-schema/account-schema.json";
import AutoSplit from "./moneyworks/json-schema/autosplit-schema.json";
import BankRecs from "./moneyworks/json-schema/bankrecs-schema.json";
import Build from "./moneyworks/json-schema/build-schema.json";
import Department from "./moneyworks/json-schema/department-schema.json";
import Detail from "./moneyworks/json-schema/detail-schema.json";
import Filter from "./moneyworks/json-schema/filter-schema.json";
import General from "./moneyworks/json-schema/general-schema.json";
import Job from "./moneyworks/json-schema/job-schema.json";
import JobSheet from "./moneyworks/json-schema/jobsheet-schema.json";
import Ledger from "./moneyworks/json-schema/ledger-schema.json";
import Link from "./moneyworks/json-schema/link-schema.json";
import List from "./moneyworks/json-schema/list-schema.json";
import Log from "./moneyworks/json-schema/log-schema.json";
import Login from "./moneyworks/json-schema/login-schema.json";
import Memo from "./moneyworks/json-schema/memo-schema.json";
import Message from "./moneyworks/json-schema/message-schema.json";
import Name from "./moneyworks/json-schema/name-schema.json";
import OffLedger from "./moneyworks/json-schema/offledger-schema.json";
import Payments from "./moneyworks/json-schema/payments-schema.json";
import Product from "./moneyworks/json-schema/product-schema.json";
import Stickies from "./moneyworks/json-schema/stickies-schema.json";
import TaxRate from "./moneyworks/json-schema/taxrate-schema.json";
import Transaction from "./moneyworks/json-schema/transaction-schema.json";
import User from "./moneyworks/json-schema/user-schema.json";
import User2 from "./moneyworks/json-schema/user2-schema.json";

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
      {name: "MoneyWorks", description: "MoneyWorks endpoints"},
      {name: "MoneyWorks Data", description: "MoneyWorks data endpoints"}
    ],
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
      }
    }
  },
}))
// Register all routes
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
.listen(3131);

console.log(
  `🦊 MoneyWorks API is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(`📚 Swagger documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger\``);
