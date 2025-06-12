/**
 * Build service for MCP server using @moneyworks/core
 * Handles bill of materials and manufacturing builds
 */

import { BaseTableService } from "../base.service";
import type { TableMapCamel } from "@moneyworks/core/tables";

export class BuildService extends BaseTableService<"Build"> {
  constructor(client: any) {
    super(client, "Build");
  }

  /**
   * Get build by sequence number
   */
  async getBySequence(sequenceNumber: number): Promise<TableMapCamel["Build"] | null> {
    return this.getOne(`SequenceNumber=${sequenceNumber}`);
  }

  /**
   * Get builds for a specific product
   */
  async getByProduct(productCode: string): Promise<TableMapCamel["Build"][]> {
    return this.list({
      filter: `ProductCode="${productCode}"`,
      orderBy: "BuildDate DESC",
    });
  }

  /**
   * Get builds by date range
   */
  async getByDateRange(fromDate: string, toDate: string): Promise<TableMapCamel["Build"][]> {
    return this.list({
      filter: `BuildDate>="${fromDate}" AND BuildDate<="${toDate}"`,
      orderBy: "BuildDate DESC",
    });
  }

  /**
   * Get builds by status
   */
  async getByStatus(posted: boolean): Promise<TableMapCamel["Build"][]> {
    return this.list({
      filter: posted ? "Status=1" : "Status=0",
      orderBy: "BuildDate DESC",
    });
  }

  /**
   * Get builds by location
   */
  async getByLocation(location: string): Promise<TableMapCamel["Build"][]> {
    return this.list({
      filter: `Location="${location}"`,
      orderBy: "BuildDate DESC",
    });
  }

  /**
   * Get builds with specific quantity range
   */
  async getByQuantityRange(minQty: number, maxQty?: number): Promise<TableMapCamel["Build"][]> {
    let filter = `Quantity>=${minQty}`;
    if (maxQty !== undefined) {
      filter += ` AND Quantity<=${maxQty}`;
    }
    
    return this.list({
      filter,
      orderBy: "Quantity DESC",
    });
  }

  /**
   * Get recent builds
   */
  async getRecent(days: number = 30): Promise<TableMapCamel["Build"][]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    const fromDateStr = fromDate.toISOString().slice(0, 10).replace(/-/g, "");
    
    return this.list({
      filter: `BuildDate>="${fromDateStr}"`,
      orderBy: "BuildDate DESC",
    });
  }

  /**
   * Search builds by description
   */
  async searchByDescription(searchTerm: string): Promise<TableMapCamel["Build"][]> {
    return this.list({
      filter: `Description~"${searchTerm}"`,
      orderBy: "BuildDate DESC",
    });
  }

  /**
   * Get builds with cost variance
   */
  async getWithVariance(minVariance: number = 0): Promise<TableMapCamel["Build"][]> {
    return this.list({
      filter: `ABS(ActualCost-StandardCost)>${minVariance}`,
      orderBy: "ABS(ActualCost-StandardCost) DESC",
    });
  }

  /**
   * Get field list for builds
   */
  getFieldList(): string[] {
    // Build table fields
    return [
      "LastModifiedTime",
      "Build.Memo",
      "Build.ProductSeq",
      "Build.Qty", 
      "Build.PartCode"
    ];
  }

  /**
   * Get display name for this table
   */
  getDisplayName(): string {
    return "Builds (Manufacturing)";
  }
}