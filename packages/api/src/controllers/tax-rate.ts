/**
 * Tax Rate Controller
 * Implementation for the TaxRate table
 * 
 * @moneyworks-dsl PURE
 */

import { BaseTableController, type TableExportParams } from '@moneyworks/api/controllers/base-table';

export class TaxRateController extends BaseTableController {
  readonly tableName = 'TaxRate';
  readonly displayName = 'Tax Rates';
  readonly description = 'Tax codes and rates configuration';
  
  /**
   * Get primary key for TaxRate table
   */
  protected getPrimaryKey(): string {
    return 'TaxCode';
  }
  
  /**
   * Additional validation specific to TaxRate
   */
  protected validateTableSpecific(params: TableExportParams): void {
    // Validate orderBy field if provided
    if (params.orderBy) {
      const validFields = ['TaxCode', 'Description', 'Rate', 'Active'];
      const field = params.orderBy.split(' ')[0]; // Handle "field DESC"
      
      if (!validFields.includes(field)) {
        throw new Error(`Invalid orderBy field: ${field}. Valid fields: ${validFields.join(', ')}`);
      }
    }
    
    // Validate filter expressions if needed
    if (params.filter) {
      // Basic validation - check for SQL injection patterns
      const dangerousPatterns = [';', '--', '/*', '*/'];
      for (const pattern of dangerousPatterns) {
        if (params.filter.includes(pattern)) {
          throw new Error('Invalid filter expression');
        }
      }
    }
  }
}