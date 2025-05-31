import {
  type CompanyInformation,
  CompanyInformationFields,
} from "../../types/interface/system/company-information";
import type { MoneyWorksConfig } from "../../types/moneyworks";
import { MoneyWorksApiService } from "../moneyworks-api.service";

export class CompanyInformationService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  /**
   * Get company information from MoneyWorks with pagination and filtering
   *
   * @returns Parsed company-information data with pagination metadata
   */
  async getCompanyInformation(select = CompanyInformationFields) {
    try {
      // Call MoneyWorks API
      const companyInformation: Partial<CompanyInformation> = {};
      const fields = [...select];
      const expression = `ConcatAllWith("\\t",${fields.join(",")})`;
      const values = ((await this.api.evaluate(expression)) ?? "").split("\t");
      for (let i = 0; i < fields.length; i++) {
        (companyInformation as unknown as Record<string, string>)[fields[i]] =
          values[i];
      }
      this.parseCompanyInformation(companyInformation, select);

      // Parse the response
      return companyInformation as CompanyInformation;
    } catch (error) {
      console.error("Error fetching company-information:", error);
      throw error;
    }
  }

  private parseCompanyInformation(
    companyInformation: Partial<CompanyInformation>,
    select: string[],
  ) {
    if (select.includes("Have_Logo")) {
      companyInformation.Have_Logo = !!companyInformation.Have_Logo;
    }
    if (select.includes("NavigatorActive")) {
      companyInformation.NavigatorActive = !!companyInformation.NavigatorActive;
    }
    if (select.includes("MultiCurrencyEnabled")) {
      companyInformation.MultiCurrencyEnabled =
        !!companyInformation.MultiCurrencyEnabled;
    }
    if (select.includes("GSTProcessingSuppressed")) {
      companyInformation.GSTProcessingSuppressed =
        !!companyInformation.GSTProcessingSuppressed;
    }
    if (select.includes("GSTIncomeInvoiceBasis")) {
      companyInformation.GSTIncomeInvoiceBasis =
        !!companyInformation.GSTIncomeInvoiceBasis;
    }
    if (select.includes("GSTExpensesInvoiceBasis")) {
      companyInformation.GSTExpensesInvoiceBasis =
        !!companyInformation.GSTExpensesInvoiceBasis;
    }
    if (select.includes("ExtendedJobCosting")) {
      companyInformation.ExtendedJobCosting =
        !!companyInformation.ExtendedJobCosting;
    }
    if (select.includes("GstIncomeInvoiceBasis")) {
      companyInformation.GstIncomeInvoiceBasis =
        !!companyInformation.GstIncomeInvoiceBasis;
    }

    if (select.includes("PeriodsInYear")) {
      companyInformation.PeriodsInYear = Number(
        companyInformation.PeriodsInYear,
      );
    }
    if (select.includes("GSTCycleMonths")) {
      companyInformation.GSTCycleMonths = Number(
        companyInformation.GSTCycleMonths,
      );
    }
    if (select.includes("NetworkLatency")) {
      companyInformation.NetworkLatency = Number(
        companyInformation.NetworkLatency,
      );
    }
    if (select.includes("StartupSequenceNumJob")) {
      companyInformation.StartupSequenceNumJob = Number(
        companyInformation.StartupSequenceNumJob,
      );
    }
    if (select.includes("CurrentPer")) {
      companyInformation.CurrentPer = Number(companyInformation.CurrentPer);
    }
    if (select.includes("AgingCycle")) {
      companyInformation.AgingCycle = Number(companyInformation.AgingCycle);
    }
    if (select.includes("GstCycleNum")) {
      companyInformation.GstCycleNum = Number(companyInformation.GstCycleNum);
    }
  }
}
