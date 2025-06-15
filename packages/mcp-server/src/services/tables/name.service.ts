/**
 * Name service for MCP server using @moneyworks/core
 * Handles customers, suppliers, and other contacts
 */

import { BaseTableService } from "../base.service";
import type { TableMapCamel } from "@moneyworks/core/tables";

export class NameService extends BaseTableService<"Name"> {
  constructor(client: any) {
    super(client, "Name");
  }

  /**
   * Get name by code
   */
  async getByCode(code: string): Promise<TableMapCamel["Name"] | null> {
    return this.getOne(`Code="${code}"`);
  }

  /**
   * Get customers only
   */
  async getCustomers(): Promise<TableMapCamel["Name"][]> {
    return this.list({
      filter: "Customer=1",
      orderBy: "Name",
    });
  }

  /**
   * Get suppliers only
   */
  async getSuppliers(): Promise<TableMapCamel["Name"][]> {
    return this.list({
      filter: "Supplier=1",
      orderBy: "Name",
    });
  }

  /**
   * Get both customers and suppliers
   */
  async getCustomersAndSuppliers(): Promise<TableMapCamel["Name"][]> {
    return this.list({
      filter: "Customer=1 AND Supplier=1",
      orderBy: "Name",
    });
  }

  /**
   * Search names by name or company
   */
  async searchByName(searchTerm: string): Promise<TableMapCamel["Name"][]> {
    return this.list({
      filter: `(Name~"${searchTerm}" OR Company~"${searchTerm}")`,
      orderBy: "Name",
    });
  }

  /**
   * Search by email
   */
  async searchByEmail(email: string): Promise<TableMapCamel["Name"][]> {
    return this.list({
      filter: `Email~"${email}"`,
      orderBy: "Name",
    });
  }

  /**
   * Search by phone
   */
  async searchByPhone(phone: string): Promise<TableMapCamel["Name"][]> {
    // Remove spaces and special characters for phone search
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    return this.list({
      filter: `(Phone~"${cleanPhone}" OR Mobile~"${cleanPhone}" OR Fax~"${cleanPhone}")`,
      orderBy: "Name",
    });
  }

  /**
   * Get names by type
   */
  async getByType(type: string): Promise<TableMapCamel["Name"][]> {
    return this.list({
      filter: `Type="${type}"`,
      orderBy: "Name",
    });
  }

  /**
   * Get names with outstanding balance
   */
  async getWithBalance(): Promise<TableMapCamel["Name"][]> {
    return this.list({
      filter: "Balance<>0",
      orderBy: "Balance DESC",
    });
  }

  /**
   * Get names by credit status
   */
  async getByCreditStatus(onHold: boolean): Promise<TableMapCamel["Name"][]> {
    return this.list({
      filter: onHold ? "Hold=1" : "Hold=0",
      orderBy: "Name",
    });
  }

  /**
   * Get active names only
   */
  async getActive(): Promise<TableMapCamel["Name"][]> {
    return this.list({
      filter: "Inactive=0",
      orderBy: "Name",
    });
  }

  /**
   * Get names in a specific category
   */
  async getByCategory(category: string): Promise<TableMapCamel["Name"][]> {
    return this.list({
      filter: `Category="${category}"`,
      orderBy: "Name",
    });
  }

  /**
   * Get field list for names
   */
  getFieldList(): string[] {
    return [
      "Code",
      "Name",
      "Contact",
      "Address1",
      "Address2",
      "Address3",
      "Address4",
      "Postcode",
      "Phone",
      "Fax",
      "Email",
      "BankName",
      "BankBranch",
      "BankAccount",
      "TaxNumber",
      "CustomerType",
      "SupplierType",
      "CreditLimit",
      "Discount",
      "Comment",
      "Inactive",
      "Hold"
    ];
  }

  /**
   * Get display name for this table
   */
  getDisplayName(): string {
    return "Names (Customers/Suppliers)";
  }
}