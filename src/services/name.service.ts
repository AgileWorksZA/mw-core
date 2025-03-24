
import { MoneyWorksApiService } from "./moneyworks-api.service";
import { Name } from "../moneyworks/types/name";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";

/**
 * Service for interacting with MoneyWorks Name table
 * Names are customers, suppliers, and other contacts
 */
export class NameService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  /**
   * Get names from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed name data with pagination metadata
   */
  async getNames(params: {
    limit?: number;
    offset?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose"
      };

      // Call MoneyWorks API
      const response = await this.api.export("name", mwParams);

      console.log("API Response:", JSON.stringify(response, null, 2), !response?.table?.n);

      if (!response?.table?.name) {
        return { data: [], pagination: this.createPagination(0, params) };
      }

      // Parse the response
      const names = this.parseNameResponse(response.table);

      // Create pagination metadata
      const total = response.table.$ && response.table.$.count
        ? parseInt(response.table.$.count, 10)
        : (response.table._ && response.table._.count ? parseInt(response.table._.count, 10) : 0);

      const pagination = this.createPagination(total, params);

      return {
        data: names,
        pagination
      };
    } catch (error) {
      console.error("Error fetching names:", error);
      throw error;
    }
  }

  /**
   * Get a single name by ID (code)
   *
   * @param code The name code to look up
   * @returns Name details
   */
  async getNameByCode(code: string) {
    try {
      const response = await this.api.export("name", {
        search: `code=\`${code}\``,
        format: "xml-verbose"
      });

      if (!response?.table?.n) {
        throw new Error(`Name with code "${code}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const nameData = Array.isArray(response.table.n) ? response.table.n[0] : response.table.n;
      return this.parseNameRecord(nameData);
    } catch (error) {
      console.error(`Error fetching name with code ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get a single name by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Name details
   */
  async getNameBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("name", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.table?.n) {
        throw new Error(`Name with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const nameData = Array.isArray(response.table.n) ? response.table.n[0] : response.table.n;
      return this.parseNameRecord(nameData);
    } catch (error) {
      console.error(`Error fetching name with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }

  /**
   * Parse XML name response into structured data
   */
  private parseNameResponse(tableData: any): Partial<Name>[] {
    // Handle case when only one name is returned
    if (!Array.isArray(tableData.name)) {
      return [this.parseNameRecord(tableData.name)];
    }

    // Handle multiple names
    return tableData.name.map((record: any) => this.parseNameRecord(record));
  }

  /**
   * Parse a single name record from XML response
   */
  private parseNameRecord(record: Name): Partial<Name> {
    const result: Partial<Name> = {};

    // Loop through all properties in the record
    for (const [key, value] of Object.entries(record)) {
      // Skip attributes and nested objects
      if (key === "$" || key === "_" || (typeof value === "object" && !("text" in value))) continue;

      // Get the text value if its available
      const textValue = value && typeof value === "object" && "text" in value ? value.text : value;

      // Skip empty values
      if (textValue === undefined || textValue === null) continue;

      // Handle dates
      if (key.toLowerCase().includes("date") && typeof textValue === "string") {
        result[key as keyof Name] = this.parseMoneyWorksDate(textValue) as any;
        continue;
      }

      // Handle numbers
      if (!isNaN(Number(textValue)) && typeof textValue === "string" &&
          !["Name", "Code", "Contact", "Address1", "Phone", "Fax", "Email", "eMail"].includes(key)) {
        result[key as keyof Name] = Number(textValue) as any;
        continue;
      }

      // For everything else, just copy the value
      result[key as keyof Name] = textValue as any;
    }

    return result;
  }

  /**
   * Parse MoneyWorks date format (YYYYMMDD) to JavaScript Date
   */
  private parseMoneyWorksDate(dateStr: string): Date | null {
    if (!dateStr || dateStr === "0") return null;

    // Handle YYYYMMDD format
    if (/^\d{8}$/.test(dateStr)) {
      const year = parseInt(dateStr.substring(0, 4), 10);
      const month = parseInt(dateStr.substring(4, 6), 10) - 1; // JS months are 0-based
      const day = parseInt(dateStr.substring(6, 8), 10);
      return new Date(year, month, day);
    }

    // Try standard date parsing
    return new Date(dateStr);
  }

  /**
   * Create pagination metadata
   */
  private createPagination(total: number, params: { limit?: number, offset?: number }) {
    const limit = params.limit || 10;
    const offset = params.offset || 0;

    return {
      total,
      limit,
      offset,
      next: offset + limit < total ? offset + limit : null,
      prev: offset > 0 ? Math.max(0, offset - limit) : null
    };
  }
}

