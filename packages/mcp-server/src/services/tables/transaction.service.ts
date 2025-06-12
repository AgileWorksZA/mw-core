/**
 * Transaction service for MCP server using @moneyworks/core
 */

import { BaseTableService } from "../base.service";
import type { TableMapCamel } from "@moneyworks/core/tables";

export class TransactionService extends BaseTableService<"Transaction"> {
  constructor(client: any) {
    super(client, "Transaction");
  }

  /**
   * Get transaction by sequence number
   */
  async getBySequence(sequenceNumber: number): Promise<TableMapCamel["Transaction"] | null> {
    return this.getOne(`SequenceNumber=${sequenceNumber}`);
  }

  /**
   * Get transactions for a specific period
   */
  async getByPeriod(period: number): Promise<TableMapCamel["Transaction"][]> {
    return this.list({
      filter: `Period=${period}`,
      orderBy: "TransDate DESC, SequenceNumber DESC",
    });
  }

  /**
   * Get transactions for a date range
   */
  async getByDateRange(fromDate: string, toDate: string): Promise<TableMapCamel["Transaction"][]> {
    return this.list({
      filter: `TransDate>="${fromDate}" AND TransDate<="${toDate}"`,
      orderBy: "TransDate DESC, SequenceNumber DESC",
    });
  }

  /**
   * Get transactions for an account
   */
  async getByAccount(accountCode: string): Promise<TableMapCamel["Transaction"][]> {
    return this.list({
      filter: `Account="${accountCode}"`,
      orderBy: "TransDate DESC, SequenceNumber DESC",
    });
  }

  /**
   * Get transactions for a name (customer/supplier)
   */
  async getByName(nameCode: string): Promise<TableMapCamel["Transaction"][]> {
    return this.list({
      filter: `NameCode="${nameCode}"`,
      orderBy: "TransDate DESC, SequenceNumber DESC",
    });
  }

  /**
   * Get unposted transactions
   */
  async getUnposted(): Promise<TableMapCamel["Transaction"][]> {
    return this.list({
      filter: "Status=0", // 0 = unposted
      orderBy: "TransDate DESC, SequenceNumber DESC",
    });
  }

  /**
   * Get posted transactions
   */
  async getPosted(): Promise<TableMapCamel["Transaction"][]> {
    return this.list({
      filter: "Status=1", // 1 = posted
      orderBy: "TransDate DESC, SequenceNumber DESC",
    });
  }

  /**
   * Search transactions by description
   */
  async searchByDescription(searchTerm: string): Promise<TableMapCamel["Transaction"][]> {
    return this.list({
      filter: `Description~"${searchTerm}"`,
      orderBy: "TransDate DESC, SequenceNumber DESC",
    });
  }

  /**
   * Get transactions by type
   */
  async getByType(type: string): Promise<TableMapCamel["Transaction"][]> {
    return this.list({
      filter: `Type="${type}"`,
      orderBy: "TransDate DESC, SequenceNumber DESC",
    });
  }

  /**
   * Get outstanding invoices
   */
  async getOutstandingInvoices(): Promise<TableMapCamel["Transaction"][]> {
    return this.list({
      filter: '(Type="DI" OR Type="CI") AND Gross<>0 AND Status=1',
      orderBy: "TransDate DESC",
    });
  }

  /**
   * Get field list for transactions
   */
  getFieldList(): string[] {
    return [
      "SequenceNumber",
      "TransDate",
      "Period",
      "TransType",
      "Status",
      "Reference",
      "Particulars",
      "Analysis",
      "Account",
      "Contra",
      "DebitAccount",
      "CreditAccount",
      "Amount",
      "Net",
      "Tax",
      "Gross",
      "NameCode",
      "Description"
    ];
  }

  /**
   * Get display name for this table
   */
  getDisplayName(): string {
    return "Transactions";
  }
}