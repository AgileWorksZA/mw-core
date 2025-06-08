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
  
  // Debug endpoint to check config
  .get("/debug/config", () => {
    const { loadMoneyWorksConfig } = require("./config/moneyworks.config");
    const config = loadMoneyWorksConfig();
    return {
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password ? '***' + config.password.slice(-3) : 'MISSING',
      dataFile: config.dataFile,
      folderAuth: config.folderAuth ? {
        folderName: config.folderAuth.folderName,
        password: config.folderAuth.password ? '***' + config.folderAuth.password.slice(-3) : 'MISSING'
      } : null,
      workingDirectory: process.cwd()
    };
  })
  
  // Debug endpoint to test MoneyWorks API directly
  .get("/debug/moneyworks", async () => {
    try {
      const { loadMoneyWorksConfig } = require("./config/moneyworks.config");
      const { MoneyWorksApiService } = require("./services/moneyworks-api.service");
      
      const config = loadMoneyWorksConfig();
      const api = new MoneyWorksApiService(config);
      
      // Test simple expression first
      const expression = await api.evaluate("1+1");
      
      // Test name export
      const nameResult = await api.export("name", { limit: 2, format: "xml-verbose" });
      
      return {
        status: "success",
        expression: expression,
        nameExport: {
          recordCount: nameResult.data.length,
          totalRecords: nameResult.pagination.total,
          sampleFields: nameResult.data[0] ? Object.keys(nameResult.data[0]).slice(0, 5) : []
        }
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
        stack: error.stack
      };
    }
  })
  
  // Direct name test bypassing TableService
  .get("/debug/names-direct", async () => {
    try {
      const { loadMoneyWorksConfig } = require("./config/moneyworks.config");
      const { MoneyWorksApiService } = require("./services/moneyworks-api.service");
      
      const config = loadMoneyWorksConfig();
      const api = new MoneyWorksApiService(config);
      
      // Call export directly with same params as the API endpoint
      const result = await api.export("name", { 
        limit: 5, 
        start: 0,
        format: "xml-verbose" 
      });
      
      return {
        status: "success",
        recordCount: result.data.length,
        totalRecords: result.pagination.total,
        pagination: result.pagination,
        sampleRecord: result.data[0] || null
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  })

  .listen(3131);

console.log(
  `🦊 MoneyWorks API is running at ${app.server?.hostname}:${app.server?.port}`,
);
console.log(
  `📚 Swagger documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger\``,
);
