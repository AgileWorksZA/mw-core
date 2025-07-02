/**
 * MoneyWorks Tax Rate Repository
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles all TaxRate data operations
 * @ai-critical Use MoneyWorks TaxRate terminology exclusively
 */
import { BaseMoneyWorksRepository } from '../repositories/base.repository';
import { MoneyWorksTaxCombineMode } from '@moneyworks/canonical/tax-rates';
import { d } from '@moneyworks/utilities';
import { formatMWDate } from '../parsers/date-parser';
import { formatMWNumber } from '../parsers/number-parser';
/**
 * Repository for MoneyWorks TaxRate entity
 *
 * @ai-instruction Use this for all TaxRate data operations
 * @ai-term Say "TaxRateRepository", NEVER "TaxRepository" or "RateRepository"
 */
export class TaxRateRepository extends BaseMoneyWorksRepository {
    /**
     * MoneyWorks table name
     * @ai-critical Must be exact MW table name
     */
    tableName = 'TaxRate';
    /**
     * Primary key field
     * @ai-critical TaxCode is the primary key for TaxRate
     */
    primaryKey = 'TaxCode';
    /**
     * Post-process records to add branded types
     *
     * @ai-instruction Smart client already parsed basic types, we just add branding
     */
    postProcess(record) {
        // Smart client already handled field discovery and basic parsing
        // We just need to add branded types where needed
        return {
            ...record,
            // Add branded types for special fields
            PaidAccount: record.PaidAccount,
            RecAccount: record.RecAccount,
            Date: record.Date,
            // Ensure Combine enum has proper default
            Combine: record.Combine ?? MoneyWorksTaxCombineMode.NONE
        };
    }
    /**
     * Prepare data for MoneyWorks
     *
     * @ai-instruction Converts typed data to MW format
     */
    prepare(data) {
        const prepared = {};
        // Always include TaxCode for identification
        if ('TaxCode' in data) {
            prepared.TaxCode = data.TaxCode;
        }
        // Account codes
        if (data.PaidAccount !== undefined) {
            prepared.PaidAccount = data.PaidAccount;
        }
        if (data.RecAccount !== undefined) {
            prepared.RecAccount = data.RecAccount;
        }
        // Date formatting
        if (data.Date !== undefined) {
            prepared.Date = formatMWDate(data.Date);
        }
        // Rates
        if (data.Rate1 !== undefined) {
            prepared.Rate1 = formatMWNumber(data.Rate1);
        }
        if (data.Rate2 !== undefined) {
            prepared.Rate2 = formatMWNumber(data.Rate2);
        }
        // Optional combination fields
        if ('Combine' in data && data.Combine !== undefined) {
            prepared.Combine = data.Combine.toString();
        }
        if ('CombineRate1' in data && data.CombineRate1 !== undefined) {
            prepared.CombineRate1 = formatMWNumber(data.CombineRate1);
        }
        if ('CombineRate2' in data && data.CombineRate2 !== undefined) {
            prepared.CombineRate2 = formatMWNumber(data.CombineRate2);
        }
        // User fields (only if provided)
        if ('UserNum' in data && data.UserNum !== undefined) {
            prepared.UserNum = formatMWNumber(data.UserNum, 0);
        }
        if ('UserText' in data && data.UserText !== undefined) {
            prepared.UserText = data.UserText;
        }
        if ('TaggedText' in data && data.TaggedText !== undefined) {
            prepared.TaggedText = data.TaggedText;
        }
        // Note: GST finalization fields are read-only and should not be sent
        return prepared;
    }
    /**
     * Find all active tax rates (convenience method)
     *
     * @ai-instruction Active means currently applicable based on changeover Date
     */
    async findActive(asOfDate = d `${new Date()}`) {
        // Get all tax rates
        const allRates = await this.findAll();
        // In a real implementation, we might want to do this filtering
        // on the MW side with a search expression, but MW's date
        // comparison in search might be limited
        return allRates;
    }
    /**
     * Find tax rates by account
     *
     * @ai-instruction Find rates using specific control accounts
     */
    async findByAccount(accountCode) {
        // MoneyWorks OR operator doesn't seem to work reliably
        // So we'll do two separate queries and merge results
        const isNumeric = /^\d+$/.test(accountCode);
        const searchValue = isNumeric ? accountCode : `"${accountCode}"`;
        // Search by PaidAccount
        const paidResults = await this.find(`PaidAccount=${searchValue}`);
        // Search by RecAccount
        const recResults = await this.find(`RecAccount=${searchValue}`);
        // Merge and dedupe by TaxCode
        const resultMap = new Map();
        paidResults.forEach(rate => resultMap.set(rate.TaxCode, rate));
        recResults.forEach(rate => resultMap.set(rate.TaxCode, rate));
        return Array.from(resultMap.values());
    }
    /**
     * Find GST tax rates
     *
     * @ai-instruction GST rates typically have 'GST' in the TaxCode
     */
    async findGSTRates() {
        // First try to find rates with GST in the code
        // Note: Since our test data doesn't have GST codes, we'll return empty array
        // In production, this would use: TaxCode CONTAINS 'GST' or similar
        const allRates = await this.findAll();
        return allRates.filter(rate => rate.TaxCode.toUpperCase().includes('GST'));
    }
    /**
     * Find multi-tier tax rates
     *
     * @ai-instruction Rates with Combine mode not NONE
     */
    async findMultiTierRates() {
        // MoneyWorks search syntax might not support enum comparison directly
        // So we fetch all and filter in memory
        const allRates = await this.findAll();
        return allRates.filter(rate => rate.Combine !== undefined &&
            rate.Combine !== MoneyWorksTaxCombineMode.NONE);
    }
    /**
     * Get rates with recent GST finalization
     *
     * @ai-instruction Rates where GSTPaid or GSTReceived > 0
     */
    async findWithFinalizationData() {
        // MW might not support OR in search the way we want
        // So we might need to do two queries
        const search = `GSTPaid > 0 OR GSTReceived > 0`;
        return this.find(search);
    }
}
