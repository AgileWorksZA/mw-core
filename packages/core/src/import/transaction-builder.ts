/**
 * Transaction Builder
 * 
 * Specialized builder for transactions with line details.
 */

import type { TransactionCamel, DetailCamel } from '../tables';
import { detailHelpers } from '../tables/detail';
import { XMLBuilder } from '../xml/builder';
import { MoneyWorksRESTClient } from '../rest/client';
import type { ImportResult } from '../rest/types';

/**
 * Transaction import structure
 */
export interface TransactionImport {
  transaction: Partial<TransactionCamel>;
  details: Partial<DetailCamel>[];
}

/**
 * Builder for transactions with details
 */
export class TransactionBuilder {
  private transaction: Partial<TransactionCamel> = {};
  private details: Partial<DetailCamel>[] = [];
  
  /**
   * Set transaction header fields
   */
  setHeader(data: Partial<TransactionCamel>): this {
    this.transaction = { ...this.transaction, ...data };
    return this;
  }
  
  /**
   * Set specific header field
   */
  setField<K extends keyof TransactionCamel>(
    field: K,
    value: TransactionCamel[K]
  ): this {
    this.transaction[field] = value;
    return this;
  }
  
  /**
   * Add a detail line
   */
  addDetail(detail: Partial<DetailCamel>): this {
    this.details.push(detail);
    this.recalculateTotals();
    return this;
  }
  
  /**
   * Add multiple detail lines
   */
  addDetails(details: Partial<DetailCamel>[]): this {
    this.details.push(...details);
    this.recalculateTotals();
    return this;
  }
  
  /**
   * Add a simple debit/credit line
   */
  addLine(
    account: string,
    amount: number,
    description?: string,
    taxCode?: string
  ): this {
    const detail: Partial<DetailCamel> = {
      account,
      description
    };
    
    if (amount >= 0) {
      detail.debit = amount;
      detail.credit = 0;
    } else {
      detail.debit = 0;
      detail.credit = Math.abs(amount);
    }
    
    if (taxCode) {
      detail.taxCode = taxCode;
    }
    
    return this.addDetail(detail);
  }
  
  /**
   * Add an inventory line
   */
  addInventoryLine(
    account: string,
    stockCode: string,
    quantity: number,
    unitPrice: number,
    description?: string,
    taxCode?: string
  ): this {
    const gross = quantity * unitPrice;
    
    const detail: Partial<DetailCamel> = {
      account,
      stockCode,
      stockQty: quantity,
      unitPrice,
      gross,
      description: description || stockCode,
      taxCode
    };
    
    return this.addDetail(detail);
  }
  
  /**
   * Clear all details
   */
  clearDetails(): this {
    this.details = [];
    this.recalculateTotals();
    return this;
  }
  
  /**
   * Recalculate transaction totals
   */
  private recalculateTotals(): void {
    let totalDebit = 0;
    let totalCredit = 0;
    let totalTax = 0;
    
    for (const detail of this.details) {
      totalDebit += detail.debit || 0;
      totalCredit += detail.credit || 0;
      totalTax += detail.tax || 0;
    }
    
    // Update transaction totals
    this.transaction.gross = totalDebit; // Or totalCredit for credit transactions
    this.transaction.tax = totalTax;
    this.transaction.net = this.transaction.gross - totalTax;
  }
  
  /**
   * Validate the transaction
   */
  validate(): string[] {
    const errors: string[] = [];
    
    // Check required fields
    if (!this.transaction.nameCode) {
      errors.push('Transaction requires nameCode');
    }
    
    if (!this.transaction.transDate) {
      errors.push('Transaction requires transDate');
    }
    
    if (this.details.length === 0) {
      errors.push('Transaction requires at least one detail line');
    }
    
    // Check debits = credits
    let totalDebit = 0;
    let totalCredit = 0;
    
    for (const detail of this.details) {
      if (!detail.account) {
        errors.push('Detail line missing account');
      }
      
      totalDebit += detail.debit || 0;
      totalCredit += detail.credit || 0;
    }
    
    // Allow small rounding differences
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      errors.push(`Debits (${totalDebit}) must equal credits (${totalCredit})`);
    }
    
    return errors;
  }
  
  /**
   * Build the import structure
   */
  build(): TransactionImport {
    return {
      transaction: { ...this.transaction },
      details: [...this.details]
    };
  }
  
  /**
   * Build XML for import
   */
  toXML(): string {
    const transactionWithDetails = {
      ...this.transaction,
      subfile: this.details
    };
    
    return XMLBuilder.build('Transaction', [transactionWithDetails], {
      mode: 'create'
    });
  }
  
  /**
   * Execute import
   */
  async execute(client: MoneyWorksRESTClient): Promise<ImportResult> {
    // Validate first
    const errors = this.validate();
    if (errors.length > 0) {
      throw new Error(`Transaction validation failed: ${errors.join(', ')}`);
    }
    
    // Import with details as subfile
    const transactionWithDetails = {
      ...this.transaction,
      subfile: this.details
    };
    
    return client.import('Transaction', [transactionWithDetails]);
  }
  
  /**
   * Get the current state
   */
  getState(): TransactionImport {
    return this.build();
  }
  
  /**
   * Create from existing transaction
   */
  static from(existing: TransactionImport): TransactionBuilder {
    const builder = new TransactionBuilder();
    builder.transaction = { ...existing.transaction };
    builder.details = existing.details.map(d => ({ ...d }));
    return builder;
  }
}

/**
 * Create a new transaction builder
 */
export function buildTransaction(): TransactionBuilder {
  return new TransactionBuilder();
}