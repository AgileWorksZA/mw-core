import axios from "axios";
import type { MoneyWorksConfig } from "../../types/moneyworks";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for generating MoneyWorks reports
 */
export class ReportService {
  private config: MoneyWorksConfig;
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.config = config;
    this.api = new MoneyWorksApiService(config);
  }

  /**
   * Create authentication headers for MoneyWorks REST API
   * (Copied from MoneyWorksApiService)
   */
  private createAuthHeaders() {
    // Document auth (always required)
    const documentCredentials = `${this.config.username}:Document:${this.config.password}`;
    const documentAuth = `Basic ${Buffer.from(documentCredentials).toString("base64")}`;

    // Folder auth (only if configured)
    if (this.config.folderAuth) {
      const { folderName, password } = this.config.folderAuth;
      const folderCredentials = `${folderName}:Datacentre:${password}`;
      const folderAuth = `Basic ${Buffer.from(folderCredentials).toString("base64")}`;

      // Return combined auth headers
      return {
        Authorization: `${documentAuth}, ${folderAuth}`,
      };
    }

    // Return document auth only
    return {
      Authorization: documentAuth,
    };
  }

  /**
   * Build the base URL for MoneyWorks REST API
   * (Copied from MoneyWorksApiService)
   */
  private getBaseUrl() {
    return `http://${this.config.host}:${this.config.port}/REST/${encodeURIComponent(this.config.dataFile)}`;
  }

  /**
   * Generate a MoneyWorks report with the specified name
   *
   * @param reportName The name of the report to generate
   * @returns The HTML report content
   */
  async generateReport(reportName: string): Promise<string> {
    try {
      // Create the URL with hardcoded params
      const url = `${this.getBaseUrl()}/doreport/report=${encodeURIComponent(reportName)}&format=html&leading=8&font=Verdana&size=10`;

      // Add auth headers
      const headers = this.createAuthHeaders();

      // Make the request
      const response = await axios.get(url, {
        headers,
        responseType: "text",
      });

      return response.data;
    } catch (error) {
      console.error(`Error generating report "${reportName}":`, error);

      // Re-throw the error after logging
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `MoneyWorks Report Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
          );
        }
        if (error.request) {
          throw new Error(
            `MoneyWorks Report Error: No response received - ${error.message}`,
          );
        }
      }

      throw new Error(`MoneyWorks Report Error: ${(error as Error).message}`);
    }
  }
}
