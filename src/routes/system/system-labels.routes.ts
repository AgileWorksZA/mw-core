import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { SystemLabelsService } from "../../services/system/system-labels.service";
import { TableNames } from "../../types/constants";
import { SupportedLanguages } from "../../types/interface/system/system-labels";

// Initialize the system labels service with configuration
const config = loadMoneyWorksConfig();
const systemLabelsService = new SystemLabelsService(config);

export const systemLabelsRoutes = new Elysia({ prefix: "/api" })
  .get(
    "/system-labels/:table",
    async ({ params, query }) => {
      try {
        return await systemLabelsService.getTableLabels(
          params.table,
          query.language || "en",
        );
      } catch (error) {
        console.error(`Error in GET /system-labels/${params.table}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        table: t.String(),
      }),
      query: t.Optional(
        t.Object({
          language: t.Optional(
            t.Enum({ ...SupportedLanguages, English: "en" }),
          ),
        }),
      ),
      detail: {
        summary: "Get field labels for a specific table",
        description:
          "Returns field labels for the specified table in the requested language (default: English)",
      },
      tags: ["System"],
      response: t.Record(t.String(), t.String()),
    },
  )
  .post(
    "/system-labels",
    async () => {
      try {
        return await systemLabelsService.generateAllLabels();
      } catch (error) {
        console.error("Error in POST /system-labels:", error);
        throw error;
      }
    },
    {
      detail: {
        summary: "Generate and cache labels for all tables",
        description: `Generates and caches field labels for all MoneyWorks tables: ${TableNames.join(
          ", ",
        )}`,
      },
      tags: ["System"],
      response: t.Record(t.String(), t.Number()),
    },
  );
