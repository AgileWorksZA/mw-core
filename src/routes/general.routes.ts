import { Elysia } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { GeneralService } from "../services/tables/general.service";
import { GeneralOne } from "../types/eden/General";

// Initialize the general service with configuration
const config = loadMoneyWorksConfig();
const generalService = new GeneralService(config);

export const generalRoutes = new Elysia({ prefix: "/api" }).get(
  "/general",
  async () => {
    try {
      return await generalService.getGeneralSettings();
    } catch (error) {
      console.error("Error in GET /general:", error);
      throw error;
    }
  },
  {
    detail: {
      summary: "Get general settings",
      tags: ["MoneyWorks Data"],
    },
    response: GeneralOne,
  },
);
