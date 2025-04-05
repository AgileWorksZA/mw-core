import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { CompanyInformationService } from "../../services/system/company-information.service";
import { CompanyInformationOne } from "../../types/eden/system/company-information";
import {
  CompanyInformationEnum,
  CompanyInformationFields,
} from "../../types/interface/system/company-information";

// Initialize the companyInformation service with configuration
const config = loadMoneyWorksConfig();
const companyInformationService = new CompanyInformationService(config);

export const companyInformationRoutes = new Elysia({ prefix: "/api" }).get(
  "/company-information",
  async ({ query }) => {
    try {
      return await companyInformationService.getCompanyInformation(
        query.select,
      );
    } catch (error) {
      console.error("Error in GET /company-information:", error);
      throw error;
    }
  },
  {
    query: t.Optional(
      t.Object({
        select: t.Optional(t.Array(t.Enum(CompanyInformationEnum))),
      }),
    ),
    detail: {
      summary: "Get company-information.",
      description: `Get all company-information. Search by: ${CompanyInformationFields.join(", ")}`,
    },
    tags: ["Company"],
    response: t.Partial(CompanyInformationOne),
  },
);
