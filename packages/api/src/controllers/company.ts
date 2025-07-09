/**
 * Company Information Controller
 * Handles company metadata operations with caching
 * 
 * @moneyworks-dsl PURE
 */

import type { SmartMoneyWorksClient } from '@moneyworks/data';
import type { CacheService } from '../services/cache';
import { CompanyFields, type CompanyField } from '../schemas/company';

export interface CompanyInfo {
  name?: string;
  address?: {
    line1?: string;
    line2?: string;
    line3?: string;
    line4?: string;
    country?: string;
  };
  contact?: {
    phone?: string;
    fax?: string;
    email?: string;
    website?: string;
  };
  accounting?: {
    periodsInYear?: number;
    currentPeriod?: number;
    baseCurrency?: string;
    multiCurrencyEnabled?: boolean;
    extendedJobCosting?: boolean;
  };
  tax?: {
    gstEnabled?: boolean;
    gstCycleMonths?: number;
    gstRegistrationNumber?: string;
  };
  system?: {
    version?: string;
    platform?: string;
    databaseFiles?: string;
  };
}

/**
 * Controller for company information operations
 */
export class CompanyController {
  constructor(
    private client: SmartMoneyWorksClient,
    private cache: CacheService
  ) {}

  /**
   * Get company information with optional field selection
   */
  async getCompanyInfo(
    fields?: string[], 
    format: 'nested' | 'flat' = 'nested'
  ): Promise<CompanyInfo | Record<string, any>> {
    // Determine which fields to fetch
    const requestedFields = fields?.length ? 
      fields.filter(f => CompanyFields.includes(f as CompanyField)) :
      [...CompanyFields];

    if (requestedFields.length === 0) {
      throw new Error('No valid fields requested');
    }

    // Create cache key
    const cacheKey = `company:${requestedFields.sort().join(',')}:${format}`;

    // Try cache first
    const result = await this.cache.getOrSet(
      cacheKey,
      async () => {
        // Fetch data using batch technique
        const data = await this.fetchCompanyData(requestedFields as CompanyField[]);
        
        // Format based on preference
        return format === 'nested' ? 
          this.formatNested(data) : 
          data;
      },
      5 * 60 * 1000 // 5 minutes TTL
    );

    return result.value;
  }

  /**
   * Fetch company data from MoneyWorks
   */
  private async fetchCompanyData(
    fields: CompanyField[]
  ): Promise<Record<string, string>> {
    // Use ConcatAllWith for efficient batching
    // MoneyWorks has a limit on Concat parameters, so chunk if needed
    const chunkSize = 30;
    const chunks: CompanyField[][] = [];
    
    for (let i = 0; i < fields.length; i += chunkSize) {
      chunks.push(fields.slice(i, i + chunkSize));
    }

    const results: Record<string, string> = {};

    for (const chunk of chunks) {
      const expression = `ConcatAllWith("\\t", ${chunk.join(', ')})`;
      const response = await this.client.evaluate(expression);
      const values = response.split('\t');

      chunk.forEach((field, index) => {
        results[field] = values[index] || '';
      });
    }

    return results;
  }

  /**
   * Format flat data into nested structure
   */
  private formatNested(data: Record<string, string>): CompanyInfo {
    const info: CompanyInfo = {};

    // Basic info
    if (data.Name) {
      info.name = data.Name;
    }

    // Address
    if (data.Address1 || data.Address2 || 
        data.Address3 || data.Address4) {
      info.address = {
        line1: data.Address1,
        line2: data.Address2,
        line3: data.Address3,
        line4: data.Address4,
        country: undefined // Not available in simplified field list
      };
    }

    // Contact
    if (data.Phone || data.Fax || 
        data.Email || data.WebURL) {
      info.contact = {
        phone: data.Phone,
        fax: data.Fax,
        email: data.Email,
        website: data.WebURL
      };
    }

    // Accounting
    if (data.PeriodsInYear || data.CurrentPer || 
        data.BaseCurrency || data.MultiCurrencyEnabled !== undefined || 
        data.ExtendedJobCosting !== undefined) {
      info.accounting = {
        periodsInYear: data.PeriodsInYear ? parseInt(data.PeriodsInYear) : undefined,
        currentPeriod: data.CurrentPer ? parseInt(data.CurrentPer) : undefined,
        baseCurrency: data.BaseCurrency,
        multiCurrencyEnabled: data.MultiCurrencyEnabled === 'true' || data.MultiCurrencyEnabled === '1',
        extendedJobCosting: data.ExtendedJobCosting === 'true' || data.ExtendedJobCosting === '1'
      };
    }

    // Tax
    if (data.GSTCycleMonths || data.GstNum) {
      info.tax = {
        gstEnabled: undefined, // Would need to check if GST fields are present
        gstCycleMonths: data.GSTCycleMonths ? parseInt(data.GSTCycleMonths) : undefined,
        gstRegistrationNumber: data.GstNum
      };
    }

    // System
    if (data.Version || data.Locale) {
      info.system = {
        version: data.Version,
        platform: data.Locale, // Using locale as platform info
        databaseFiles: undefined // Not available as simple field
      };
    }

    return info;
  }
}