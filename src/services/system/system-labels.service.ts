import * as fs from "node:fs";
import * as path from "node:path";
import translate from "translate";
import { TableNames, tableNames } from "../../types/constants";
import {
  SupportedLanguages,
  type TableLabels,
} from "../../types/interface/system/system-labels";
import type { MoneyWorksConfig } from "../../types/moneyworks";
import { MoneyWorksApiService } from "../moneyworks-api.service";

export class SystemLabelsService {
  private api: MoneyWorksApiService;
  private cacheDir: string;
  private supportedLanguages = Object.values(SupportedLanguages);

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
    this.cacheDir = path.join(process.cwd(), "cache");

    // Ensure cache directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Get field labels for a specific table and language
   *
   * @param tableName The table name
   * @param language The language code (default: "en")
   * @returns The table labels
   */
  async getTableLabels(
    tableName: string,
    language = "en",
  ): Promise<TableLabels> {
    try {
      // Validate table name
      if (!tableNames.includes(tableName.toLowerCase())) {
        throw new Error(`Invalid table name: ${tableName}`);
      }

      // Validate language
      if (!this.supportedLanguages.includes(language as SupportedLanguages)) {
        throw new Error(`Unsupported language: ${language}`);
      }

      // Format table name to match MoneyWorks naming convention
      const formattedTableName =
        TableNames[tableNames.indexOf(tableName.toLowerCase())];

      // Try to load from cache
      const cacheFilePath = path.join(
        this.cacheDir,
        `${formattedTableName}-labels-${language}.json`,
      );

      if (fs.existsSync(cacheFilePath)) {
        const cachedLabels = JSON.parse(
          fs.readFileSync(cacheFilePath, "utf-8"),
        );
        return cachedLabels;
      }

      // If English labels are requested but not cached, generate them
      if (language === "en") {
        return this.generateLabelsForTable(formattedTableName);
      }

      // For other languages, first ensure we have English labels
      const englishLabels = await this.getTableLabels(tableName, "en");

      // Translate English labels to the requested language
      const translatedLabels: TableLabels = {};

      for (const [field, label] of Object.entries(englishLabels)) {
        translatedLabels[field] = await translate(label, {
          from: "en",
          to: language,
        });
      }

      // Cache the translated labels
      fs.writeFileSync(
        cacheFilePath,
        JSON.stringify(translatedLabels, null, 2),
      );

      return translatedLabels;
    } catch (error) {
      console.error(
        `Error getting ${tableName} labels for ${language}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Generate and cache field labels for all tables
   *
   * @returns Summary of generated labels
   */
  async generateAllLabels(): Promise<Record<string, number>> {
    try {
      const results: Record<string, number> = {};

      for (const tableName of TableNames) {
        const labels = await this.generateLabelsForTable(tableName);
        results[tableName] = Object.keys(labels).length;
      }

      return results;
    } catch (error) {
      console.error("Error generating all labels:", error);
      throw error;
    }
  }

  /**
   * Generate and cache field labels for a single table
   *
   * @param tableName The table name
   * @returns The generated labels
   */
  private async generateLabelsForTable(
    tableName: string,
  ): Promise<TableLabels> {
    try {
      // Dynamic import to get field names for the table
      const tableFields = await this.getTableFields(tableName);

      if (!tableFields || tableFields.length === 0) {
        console.warn(`No fields found for table: ${tableName}`);
        return {};
      }

      const labels: TableLabels = {};

      // Process fields in chunks of 30 (MoneyWorks Concat limit)
      const chunks = this.chunkArray(tableFields, 30);

      for (const chunk of chunks) {
        const expression = this.buildFieldLabelExpression(tableName, chunk);
        const response = await this.api.evaluate(expression);

        if (response) {
          const values = response.split("\t");

          for (let i = 0; i < chunk.length; i++) {
            labels[chunk[i]] = values[i] || chunk[i];
          }
        }
      }

      // Also process special enumerated fields if applicable
      await this.addEnumeratedLabels(tableName, labels);

      // Cache the English labels
      const cacheFilePath = path.join(
        this.cacheDir,
        `${tableName}-labels-en.json`,
      );
      fs.writeFileSync(cacheFilePath, JSON.stringify(labels, null, 2));

      return labels;
    } catch (error) {
      console.error(`Error generating labels for ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Add enumerated field labels for tables that support them
   *
   * @param tableName The table name
   * @param labels The existing labels object to add to
   */
  private async addEnumeratedLabels(
    tableName: string,
    labels: TableLabels,
  ): Promise<void> {
    // Tables with enumerated color fields
    const colorTables = [
      "Transaction",
      "Name",
      "Product",
      "Job",
      "Account",
      "Asset",
    ];
    if (colorTables.includes(tableName)) {
      for (let i = 0; i < 8; i++) {
        const expression = `FieldLabel("${tableName}.Colour", ${i})`;
        const response = await this.api.evaluate(expression);
        if (response) {
          labels[`Colour_${i}`] = response;
        }
      }
    }

    // Payment methods (Transaction table)
    if (tableName === "Transaction") {
      for (let i = 0; i < 8; i++) {
        const expression = `FieldLabel("Transaction.PaymentMethod", ${i})`;
        const response = await this.api.evaluate(expression);
        if (response) {
          labels[`PaymentMethod_${i}`] = response;
        }
      }
    }

    // Contact roles (Contacts table)
    if (tableName === "Contacts") {
      // Contacts.Role uses bitmask, so check powers of 2
      for (let i = 0; i < 6; i++) {
        const bitValue = 2 ** i;
        const expression = `FieldLabel("Contacts.Role", ${bitValue})`;
        const response = await this.api.evaluate(expression);
        if (response) {
          labels[`Role_${bitValue}`] = response;
        }
      }
    }
  }

  /**
   * Build a MoneyWorks expression to get field labels
   *
   * @param tableName The table name
   * @param fields The field names
   * @returns The MoneyWorks expression
   */
  private buildFieldLabelExpression(
    tableName: string,
    fields: string[],
  ): string {
    const fieldExpressions = fields.map(
      (field) => `FieldLabel("${tableName}.${field}"), "\\t"`,
    );
    return `Concat(${fieldExpressions.join(",")})`;
  }

  /**
   * Split an array into chunks of a specified size
   *
   * @param array The array to split
   * @param size The chunk size
   * @returns Array of chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Get field names for a specific table
   *
   * @param tableName The table name
   * @returns Array of field names
   */
  private async getTableFields(tableName: string): Promise<string[]> {
    try {
      // This dynamically imports the fields from the type definition
      const module = await import(
        `../../types/interface/tables/${tableName.toLowerCase()}`
      );
      const fieldsConstant = `${tableName}Fields`;

      if (module?.[fieldsConstant]) {
        return module[fieldsConstant];
      }

      throw new Error(`Fields not found for table: ${tableName}`);
    } catch (error) {
      console.error(`Error loading fields for ${tableName}:`, error);
      throw error;
    }
  }
}
