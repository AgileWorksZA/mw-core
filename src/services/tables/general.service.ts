import { MoneyWorksApiService } from "../moneyworks-api.service";
import { General, GeneralFields } from "../../moneyworks/types/general";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../../types/moneyworks";
import { enforceType } from "../../moneyworks/helpers";
import schema from "../../moneyworks/optimized/general-schema";

/**
 * Service for interacting with MoneyWorks General table
 * General contains system-wide preferences and settings
 */
export class GeneralService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToGeneral(data: any): General {
    return GeneralFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for General record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
      return acc;
    }, {} as General);
  }

  /**
   * Get general settings from MoneyWorks
   *
   * @returns Parsed general settings data
   */
  async getGeneralSettings() {
    try {
      // Call MoneyWorks API
      const response = await this.api.export("general", {
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error("General settings not found");
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const generalData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToGeneral(generalData);
    } catch (error) {
      console.error("Error fetching general settings:", error);
      throw error;
    }
  }
}