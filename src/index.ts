import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { nameRoutes } from "./routes/name.routes";
import { transactionRoutes } from "./routes/transaction.routes";

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
    }
  }))
  .use(nameRoutes)
  .use(transactionRoutes)
  .listen(3131);

console.log(
  `🦊 MoneyWorks API is running at http://${app.server?.hostname}:${app.server?.port}/swagger`
);
console.log(`📚 Swagger documentation available at /swagger`);
