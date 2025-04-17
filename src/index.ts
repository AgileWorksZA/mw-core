import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import type { OpenAPIV3 } from "openapi-types";

import { accountRoutes } from "./routes/tables/account.routes";
import { assetCatRoutes } from "./routes/tables/asset-cat.routes";
import { assetLogRoutes } from "./routes/tables/asset-log.routes";
import { assetRoutes } from "./routes/tables/asset.routes";
import { autoSplitRoutes } from "./routes/tables/auto-split.routes";
import { bankRecsRoutes } from "./routes/tables/bank-recs.routes";
import { buildRoutes } from "./routes/tables/build.routes";
import { contactsRoutes } from "./routes/tables/contacts.routes";
import { departmentRoutes } from "./routes/tables/department.routes";
import { detailRoutes } from "./routes/tables/detail.routes";
import { filterRoutes } from "./routes/tables/filter.routes";
import { generalRoutes } from "./routes/tables/general.routes";
import { inventoryRoutes } from "./routes/tables/inventory.routes";
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
import { evaluateRoutes } from "./routes/system/evaluate.routes";
import { reportRoutes } from "./routes/system/report.routes";
import { systemLabelsRoutes } from "./routes/system/system-labels.routes";

import { z } from "zod";
import { accountZod } from "./types/zod/tables/account";
import { assetZod } from "./types/zod/tables/asset";
import { assetCatZod } from "./types/zod/tables/asset-cat";
import { assetLogZod } from "./types/zod/tables/asset-log";
import { autoSplitZod } from "./types/zod/tables/auto-split";
import { bankRecsZod } from "./types/zod/tables/bank-recs";
import { buildZod } from "./types/zod/tables/build";
import { contactsZod } from "./types/zod/tables/contacts";
import { departmentZod } from "./types/zod/tables/department";
import { detailZod } from "./types/zod/tables/detail";
import { filterZod } from "./types/zod/tables/filter";
import { generalZod } from "./types/zod/tables/general";
import { inventoryZod } from "./types/zod/tables/inventory";
import { jobZod } from "./types/zod/tables/job";
import { jobSheetZod } from "./types/zod/tables/job-sheet";
import { ledgerZod } from "./types/zod/tables/ledger";
import { linkZod } from "./types/zod/tables/link";
import { listsZod } from "./types/zod/tables/lists";
import { logZod } from "./types/zod/tables/log";
import { loginZod } from "./types/zod/tables/login";
import { memoZod } from "./types/zod/tables/memo";
import { messageZod } from "./types/zod/tables/message";
import { nameZod } from "./types/zod/tables/name";
import { offLedgerZod } from "./types/zod/tables/off-ledger";
import { paymentsZod } from "./types/zod/tables/payments";
import { productZod } from "./types/zod/tables/product";
import { stickiesZod } from "./types/zod/tables/stickies";
import { taxRateZod } from "./types/zod/tables/tax-rate";
import { transactionZod } from "./types/zod/tables/transaction";
import { userZod } from "./types/zod/tables/user";
import { user2Zod } from "./types/zod/tables/user2";

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
        components: {
          schemas: {
            pagination: z.toJSONSchema(
              z.object({
                total: z.number(),
                limit: z.number(),
                offset: z.number(),
                next: z.number(),
                prev: z.number(),
              }),
            ) as OpenAPIV3.SchemaObject,
            Account: z.toJSONSchema(accountZod) as OpenAPIV3.SchemaObject,
            Accounts: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Account",
                  },
                },
                pagination: {
                  $ref: "#/components/schemas/pagination",
                },
              },
            },
            Asset: z.toJSONSchema(assetZod) as OpenAPIV3.SchemaObject,
            AssetCat: z.toJSONSchema(assetCatZod) as OpenAPIV3.SchemaObject,
            AssetLog: z.toJSONSchema(assetLogZod) as OpenAPIV3.SchemaObject,
            AutoSplit: z.toJSONSchema(autoSplitZod) as OpenAPIV3.SchemaObject,
            BankRecs: z.toJSONSchema(bankRecsZod) as OpenAPIV3.SchemaObject,
            Build: z.toJSONSchema(buildZod) as OpenAPIV3.SchemaObject,
            Contacts: z.toJSONSchema(contactsZod) as OpenAPIV3.SchemaObject,
            Department: z.toJSONSchema(departmentZod) as OpenAPIV3.SchemaObject,
            Detail: z.toJSONSchema(detailZod) as OpenAPIV3.SchemaObject,
            Filter: z.toJSONSchema(filterZod) as OpenAPIV3.SchemaObject,
            General: z.toJSONSchema(generalZod) as OpenAPIV3.SchemaObject,
            Inventory: z.toJSONSchema(inventoryZod) as OpenAPIV3.SchemaObject,
            Job: z.toJSONSchema(jobZod) as OpenAPIV3.SchemaObject,
            JobSheet: z.toJSONSchema(jobSheetZod) as OpenAPIV3.SchemaObject,
            Ledger: z.toJSONSchema(ledgerZod) as OpenAPIV3.SchemaObject,
            Link: z.toJSONSchema(linkZod) as OpenAPIV3.SchemaObject,
            List: z.toJSONSchema(listsZod) as OpenAPIV3.SchemaObject,
            Log: z.toJSONSchema(logZod) as OpenAPIV3.SchemaObject,
            Login: z.toJSONSchema(loginZod) as OpenAPIV3.SchemaObject,
            Memo: z.toJSONSchema(memoZod) as OpenAPIV3.SchemaObject,
            Message: z.toJSONSchema(messageZod) as OpenAPIV3.SchemaObject,
            Name: z.toJSONSchema(nameZod) as OpenAPIV3.SchemaObject,
            OffLedger: z.toJSONSchema(offLedgerZod) as OpenAPIV3.SchemaObject,
            Payments: z.toJSONSchema(paymentsZod) as OpenAPIV3.SchemaObject,
            Product: z.toJSONSchema(productZod) as OpenAPIV3.SchemaObject,
            Stickies: z.toJSONSchema(stickiesZod) as OpenAPIV3.SchemaObject,
            TaxRate: z.toJSONSchema(taxRateZod) as OpenAPIV3.SchemaObject,
            Transaction: z.toJSONSchema(
              transactionZod,
            ) as OpenAPIV3.SchemaObject,
            User: z.toJSONSchema(userZod) as OpenAPIV3.SchemaObject,
            User2: z.toJSONSchema(user2Zod) as OpenAPIV3.SchemaObject,
          },
        },
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
