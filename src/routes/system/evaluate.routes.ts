import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { EvaluateService } from "../../services/system/evaluate.service";

// Initialize the evaluate service with configuration
const config = loadMoneyWorksConfig();
const evaluateService = new EvaluateService(config);

export const evaluateRoutes = new Elysia({ prefix: "/api" })
  .post(
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
  )
  .post(
    "/eval/:table",
    async ({ body, params }) => {
      try {
        const results = await evaluateService.evaluateTemplate(
          params.table,
          body.template
        );
        
        return {
          results,
          count: results.length
        };
      } catch (error) {
        console.error(`Error in POST /eval/${params.table}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        table: t.String({
          description: "MoneyWorks table name",
          examples: ["name", "account", "transaction", "product"]
        })
      }),
      body: t.Object({
        template: t.String({
          description: "Template string to evaluate against the table",
          examples: [
            "[Code] - [Description]",
            "[TransDate] [Description] @[Gross]",
            "[Code]: [Name] Phone: [Phone]"
          ]
        })
      }),
      detail: {
        summary: "Evaluate a custom template against a MoneyWorks table",
        description: `Evaluates a custom template against records in a MoneyWorks table.
        
The template format uses MoneyWorks template syntax with field names in square brackets.
Results are returned split on double-newline characters.

Example: 
POST /api/eval/account
Body: { "template": "[Code] - [Description]" }
Returns: { "results": ["1000 - Sales", "2000 - Expenses", ...], "count": 2 }`
      },
      tags: ["System"],
    },
  );
