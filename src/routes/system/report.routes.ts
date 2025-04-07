import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { ReportService } from "../../services/system/report.service";

// Initialize the report service with configuration
const config = loadMoneyWorksConfig();
const reportService = new ReportService(config);

export const reportRoutes = new Elysia({ prefix: "/api" }).get(
  "/report/:name",
  async ({ params }) => {
    try {
      // Generate the report and return the HTML content
      return await reportService.generateReport(params.name);
    } catch (error) {
      console.error(`Error in GET /report/${params.name}:`, error);
      throw error;
    }
  },
  {
    params: t.Object({
      name: t.String({
        description: "Name of the MoneyWorks report to generate",
        examples: ["Balance Sheet", "Profit & Loss", "Aged Receivables"],
      }),
    }),
    detail: {
      summary: "Generate MoneyWorks Report",
      description: `Generates a MoneyWorks report with the specified name.
      
The report is returned as HTML with hardcoded formatting parameters:
- Format: HTML
- Leading: 8
- Font: Verdana
- Size: 10`,
    },
    tags: ["System"],
    response: {
      200: t.String({
        description: "The HTML content of the generated report",
        // Override the default content type to return HTML
        contentMediaType: "text/html",
      }),
      400: t.Object({
        error: t.String(),
      }),
      500: t.Object({
        error: t.String(),
      }),
    },
  },
);
