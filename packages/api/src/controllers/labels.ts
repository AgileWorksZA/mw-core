/**
 * Field Labels Controller
 * Handles field label operations with i18n support
 * 
 * @moneyworks-dsl PURE
 */

import type { SmartMoneyWorksClient } from '@moneyworks/data';
import type { CacheService } from '../services/cache';
import type { SupportedLanguage } from '../middleware/i18n';
import { getMoneyWorksLanguage } from '../middleware/i18n';

export interface FieldLabels {
  [fieldName: string]: string;
}

export interface LabelResponse {
  language: SupportedLanguage;
  table: string;
  labels: FieldLabels;
  enumerated?: Record<string, FieldLabels>;
}

/**
 * Controller for field label operations
 */
export class LabelsController {
  constructor(
    private client: SmartMoneyWorksClient,
    private cache: CacheService
  ) {}

  /**
   * Get field labels for a table in specified language
   */
  async getTableLabels(
    table: string, 
    language: SupportedLanguage
  ): Promise<LabelResponse> {
    // Create cache key
    const cacheKey = `labels:${table}:${language}`;

    // Try cache first
    const result = await this.cache.getOrSet(
      cacheKey,
      async () => {
        // For non-English, we need English labels first for translation
        if (language !== 'en') {
          const englishLabels = await this.getTableLabels(table, 'en');
          return this.translateLabels(englishLabels, language);
        }

        // Fetch from MoneyWorks
        return this.fetchLabelsFromMoneyWorks(table, language);
      },
      60 * 60 * 1000 // 1 hour TTL
    );

    return result.value;
  }

  /**
   * Fetch labels directly from MoneyWorks
   */
  private async fetchLabelsFromMoneyWorks(
    table: string,
    language: SupportedLanguage
  ): Promise<LabelResponse> {
    // Get table info to get field list
    const tableInfo = await this.client.getTableInfo(table);
    if (!tableInfo || !tableInfo.fields) {
      throw new Error(`Table '${table}' not found or has no fields`);
    }

    const fields = Object.keys(tableInfo.fields);
    const labels: FieldLabels = {};
    const enumerated: Record<string, FieldLabels> = {};

    // Process fields in chunks (MoneyWorks Concat limit)
    const chunkSize = 30;
    for (let i = 0; i < fields.length; i += chunkSize) {
      const chunk = fields.slice(i, i + chunkSize);
      const fieldExpressions = chunk.map(
        field => `FieldLabel("${table}.${field}")`
      );
      
      const expression = `ConcatAllWith("\\t", ${fieldExpressions.join(', ')})`;
      const response = await this.client.evaluate(expression);
      const values = response.split('\t');

      chunk.forEach((field, index) => {
        labels[field] = values[index] || field;
      });
    }

    // Handle special enumerated fields
    await this.addEnumeratedLabels(table, enumerated);

    return {
      language,
      table,
      labels,
      enumerated: Object.keys(enumerated).length > 0 ? enumerated : undefined
    };
  }

  /**
   * Add enumerated field labels (colors, payment methods, etc.)
   */
  private async addEnumeratedLabels(
    table: string,
    enumerated: Record<string, FieldLabels>
  ): Promise<void> {
    // Color fields for various tables
    const colorTables = ['Transaction', 'Name', 'Product', 'Job', 'Account', 'Asset'];
    if (colorTables.includes(table)) {
      const colorLabels: FieldLabels = {};
      for (let i = 0; i < 8; i++) {
        const expression = `FieldLabel("${table}.Colour", ${i})`;
        const response = await this.client.evaluate(expression);
        if (response && response !== `${i}`) {
          colorLabels[i.toString()] = response;
        }
      }
      if (Object.keys(colorLabels).length > 0) {
        enumerated.Colour = colorLabels;
      }
    }

    // Payment methods (Transaction table)
    if (table === 'Transaction') {
      const paymentLabels: FieldLabels = {};
      for (let i = 0; i < 8; i++) {
        const expression = `FieldLabel("Transaction.PaymentMethod", ${i})`;
        const response = await this.client.evaluate(expression);
        if (response && response !== `${i}`) {
          paymentLabels[i.toString()] = response;
        }
      }
      if (Object.keys(paymentLabels).length > 0) {
        enumerated.PaymentMethod = paymentLabels;
      }
    }

    // Contact roles (Contacts table) - uses bitmask
    if (table === 'Contacts') {
      const roleLabels: FieldLabels = {};
      for (let i = 0; i < 6; i++) {
        const bitValue = Math.pow(2, i);
        const expression = `FieldLabel("Contacts.Role", ${bitValue})`;
        const response = await this.client.evaluate(expression);
        if (response && response !== `${bitValue}`) {
          roleLabels[bitValue.toString()] = response;
        }
      }
      if (Object.keys(roleLabels).length > 0) {
        enumerated.Role = roleLabels;
      }
    }
  }

  /**
   * Translate labels to another language
   * For now, returns a placeholder - in production would use a translation service
   */
  private async translateLabels(
    englishResponse: LabelResponse,
    targetLanguage: SupportedLanguage
  ): Promise<LabelResponse> {
    // In a real implementation, this would use a translation service
    // For now, we'll just append the language code to demonstrate
    const translatedLabels: FieldLabels = {};
    
    for (const [field, label] of Object.entries(englishResponse.labels)) {
      // Simulate translation by appending language code
      // In production, this would call a translation API
      translatedLabels[field] = `${label} (${targetLanguage})`;
    }

    const translatedEnumerated: Record<string, FieldLabels> = {};
    if (englishResponse.enumerated) {
      for (const [enumField, enumLabels] of Object.entries(englishResponse.enumerated)) {
        translatedEnumerated[enumField] = {};
        for (const [value, label] of Object.entries(enumLabels)) {
          translatedEnumerated[enumField][value] = `${label} (${targetLanguage})`;
        }
      }
    }

    return {
      language: targetLanguage,
      table: englishResponse.table,
      labels: translatedLabels,
      enumerated: Object.keys(translatedEnumerated).length > 0 ? 
        translatedEnumerated : undefined
    };
  }

  /**
   * Get labels for all available tables
   */
  async getAllTableLabels(language: SupportedLanguage): Promise<Record<string, LabelResponse>> {
    const cacheKey = `labels:all:${language}`;

    const result = await this.cache.getOrSet(
      cacheKey,
      async () => {
        // Get all available tables
        const tables = await this.client.listTables();
        const allLabels: Record<string, LabelResponse> = {};

        // Fetch labels for each table
        await Promise.all(
          tables.map(async (tableName: string) => {
            try {
              allLabels[tableName] = await this.getTableLabels(tableName, language);
            } catch (error) {
              console.error(`Failed to get labels for ${tableName}:`, error);
            }
          })
        );

        return allLabels;
      },
      60 * 60 * 1000 // 1 hour TTL
    );

    return result.value;
  }
}