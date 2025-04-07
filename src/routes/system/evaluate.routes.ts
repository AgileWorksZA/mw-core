import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { EvaluateService } from "../../services/system/evaluate.service";

// Initialize the evaluate service with configuration
const config = loadMoneyWorksConfig();
const evaluateService = new EvaluateService(config);

export const evaluateRoutes = new Elysia({ prefix: "/api" }).post(
  "/evaluate",
  async ({ body }) => {
    try {
      return {
        result: await evaluateService.evaluateExpression(body.expression),
      };
    } catch (error) {
      console.error("Error in POST /evaluate:", error);
      throw error;
    }
  },
  {
    body: t.Object({
      expression: t.String({
        description: "MoneyWorks expression to evaluate",
        examples: [
          "GetCompanyName()",
          'Concat("Hello", " ", "World")',
          "GetDatabaseFiles()",
        ],
      }),
    }),
    detail: {
      summary: "Evaluate MoneyWorks expression",
      description: "Evaluates a MoneyWorks expression and returns the result",
    },
    tags: ["System"],
  },
);
