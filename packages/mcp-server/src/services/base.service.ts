/**
 * Base service for MCP server using @moneyworks/core
 * 
 * This provides a compatibility layer between the core REST client
 * and the service pattern used by MCP tools.
 */

import { MoneyWorksRESTClient } from "@moneyworks/core/rest";
import type { TableMapCamel, TableName } from "@moneyworks/core/tables";
import type { ExportOptions } from "@moneyworks/core/rest";

export abstract class BaseTableService<T extends TableName> {
  protected client: MoneyWorksRESTClient;
  protected tableName: T;

  constructor(client: MoneyWorksRESTClient, tableName: T) {
    this.client = client;
    this.tableName = tableName;
  }

  /**
   * List records with optional filtering and pagination
   */
  async list(options: {
    limit?: number;
    offset?: number;
    filter?: string;
    orderBy?: string;
  } = {}): Promise<TableMapCamel[T][]> {
    const exportOptions: ExportOptions = {
      format: "json",
      limit: options.limit,
      start: options.offset,
      filter: options.filter,
      orderBy: options.orderBy,
    };

    const result = await this.client.export(this.tableName, exportOptions);
    
    // Ensure we always return an array
    if (typeof result === "string") {
      throw new Error("Unexpected string result from JSON export");
    }
    
    return result;
  }

  /**
   * Get a single record by filter
   */
  async getOne(filter: string): Promise<TableMapCamel[T] | null> {
    const results = await this.list({
      filter,
      limit: 1,
    });

    return results[0] || null;
  }

  /**
   * Count records matching a filter
   */
  async count(filter?: string): Promise<number> {
    const expression = filter 
      ? `Count(${this.tableName}, ${filter})`
      : `Count(${this.tableName}, true)`;
    
    const result = await this.client.evaluate(expression);
    return parseInt(result, 10);
  }

  /**
   * Export data in various formats
   */
  async export(options: ExportOptions = {}): Promise<TableMapCamel[T][] | string> {
    return this.client.export(this.tableName, options);
  }

  /**
   * Stream large datasets
   */
  async *stream(options: {
    filter?: string;
    orderBy?: string;
    chunkSize?: number;
  } = {}) {
    yield* this.client.exportStream(this.tableName, options);
  }

  /**
   * Get field list for this table
   */
  abstract getFieldList(): string[];

  /**
   * Get display name for this table
   */
  abstract getDisplayName(): string;
}