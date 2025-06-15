/**
 * Account service for MCP server using @moneyworks/core
 */

import { BaseTableService } from "../base.service";
import type { TableMapCamel } from "@moneyworks/core/tables";

export class AccountService extends BaseTableService<"Account"> {
  constructor(client: any) {
    super(client, "Account");
  }

  /**
   * Get account by code
   */
  async getByCode(code: string): Promise<TableMapCamel["Account"] | null> {
    return this.getOne(`Code="${code}"`);
  }

  /**
   * Get accounts by type
   */
  async getByType(type: string): Promise<TableMapCamel["Account"][]> {
    return this.list({
      filter: `Type="${type}"`,
    });
  }

  /**
   * Get child accounts of a parent
   */
  async getChildren(parentCode: string): Promise<TableMapCamel["Account"][]> {
    return this.list({
      filter: `ParentAccount="${parentCode}"`,
      orderBy: "Code",
    });
  }

  /**
   * Get accounts with balance
   */
  async getWithBalance(minBalance?: number): Promise<TableMapCamel["Account"][]> {
    const filter = minBalance !== undefined
      ? `Balance>${minBalance}`
      : "Balance<>0";
    
    return this.list({
      filter,
      orderBy: "Balance DESC",
    });
  }

  /**
   * Search accounts by description
   */
  async searchByDescription(searchTerm: string): Promise<TableMapCamel["Account"][]> {
    return this.list({
      filter: `Description~"${searchTerm}"`,
      orderBy: "Description",
    });
  }

  /**
   * Get active accounts only
   */
  async getActive(): Promise<TableMapCamel["Account"][]> {
    return this.list({
      filter: 'Inactive=0',
      orderBy: "Code",
    });
  }

  /**
   * Get field list for accounts
   */
  getFieldList(): string[] {
    // Common account fields
    return [
      "Code", "Description", "Type", "SystemAccount",
      "Balance", "Budget", "Inactive", "ParentAccount",
      "GroupID", "TaxCode", "Memo", "Department"
    ];
  }

  /**
   * Get display name for this table
   */
  getDisplayName(): string {
    return "Accounts";
  }
}