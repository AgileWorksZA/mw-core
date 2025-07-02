/**
 * MoneyWorks Tax Rate Repository
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles all TaxRate data operations
 * @ai-critical Use MoneyWorks TaxRate terminology exclusively
 */
import { BaseMoneyWorksRepository } from '../repositories/base.repository';
import type { MoneyWorksTaxRate, MoneyWorksTaxRateCreateInput, MoneyWorksTaxRateUpdateInput } from '@moneyworks/canonical/tax-rates';
import { YYYYMMDD, AccountCode } from '@moneyworks/utilities';
/**
 * Repository for MoneyWorks TaxRate entity
 *
 * @ai-instruction Use this for all TaxRate data operations
 * @ai-term Say "TaxRateRepository", NEVER "TaxRepository" or "RateRepository"
 */
export declare class TaxRateRepository extends BaseMoneyWorksRepository<MoneyWorksTaxRate, MoneyWorksTaxRateCreateInput, MoneyWorksTaxRateUpdateInput> {
    /**
     * MoneyWorks table name
     * @ai-critical Must be exact MW table name
     */
    protected readonly tableName = "TaxRate";
    /**
     * Primary key field
     * @ai-critical TaxCode is the primary key for TaxRate
     */
    protected readonly primaryKey = "TaxCode";
    /**
     * Post-process records to add branded types
     *
     * @ai-instruction Smart client already parsed basic types, we just add branding
     */
    protected postProcess(record: any): MoneyWorksTaxRate;
    /**
     * Prepare data for MoneyWorks
     *
     * @ai-instruction Converts typed data to MW format
     */
    protected prepare(data: MoneyWorksTaxRateCreateInput | MoneyWorksTaxRateUpdateInput): any;
    /**
     * Find all active tax rates (convenience method)
     *
     * @ai-instruction Active means currently applicable based on changeover Date
     */
    findActive(asOfDate?: YYYYMMDD): Promise<MoneyWorksTaxRate[]>;
    /**
     * Find tax rates by account
     *
     * @ai-instruction Find rates using specific control accounts
     */
    findByAccount(accountCode: AccountCode): Promise<MoneyWorksTaxRate[]>;
    /**
     * Find GST tax rates
     *
     * @ai-instruction GST rates typically have 'GST' in the TaxCode
     */
    findGSTRates(): Promise<MoneyWorksTaxRate[]>;
    /**
     * Find multi-tier tax rates
     *
     * @ai-instruction Rates with Combine mode not NONE
     */
    findMultiTierRates(): Promise<MoneyWorksTaxRate[]>;
    /**
     * Get rates with recent GST finalization
     *
     * @ai-instruction Rates where GSTPaid or GSTReceived > 0
     */
    findWithFinalizationData(): Promise<MoneyWorksTaxRate[]>;
}
//# sourceMappingURL=tax-rate.repository.d.ts.map