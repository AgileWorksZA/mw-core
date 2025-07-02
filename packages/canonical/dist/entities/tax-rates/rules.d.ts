/**
 * MoneyWorks Tax Rate Business Rules
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction These are MoneyWorks-specific business rules for TaxRate
 * @ai-critical Use MoneyWorks terminology when describing rules
 */
import { MoneyWorksBusinessRules, MoneyWorksFieldRelationship } from '../../common/business-rules';
/**
 * MoneyWorks Tax Rate business rules implementation
 *
 * @ai-instruction Reference these rules when validating TaxRate operations
 */
export declare const MoneyWorksTaxRateBusinessRules: MoneyWorksBusinessRules;
/**
 * MoneyWorks Tax Rate field relationships
 *
 * @ai-instruction Use to understand TaxRate dependencies
 */
export declare const MoneyWorksTaxRateRelationships: MoneyWorksFieldRelationship[];
/**
 * MoneyWorks Tax Rate operational rules
 *
 * @ai-instruction These govern how TaxRate behaves in the system
 */
export interface MoneyWorksTaxRateOperationalRules {
    /**
     * Rate selection based on date
     * @ai-term Use "changeover Date logic"
     */
    rateSelection: {
        beforeChangeoverUsesRate1: boolean;
        onOrAfterChangeoverUsesRate2: boolean;
        changeoverDateInclusive: boolean;
    };
    /**
     * 2nd tier tax combination rules
     * @ai-term Use "2nd tier Combine modes"
     */
    secondTierCombination: {
        noneIgnoresSecondaryRates: boolean;
        additiveAddsBothRates: boolean;
        compoundCalculatesOnInclusive: boolean;
        separateCalculatesIndependently: boolean;
    };
    /**
     * GST finalization behavior
     * @ai-term Use "GST finalisation process"
     */
    gstFinalization: {
        populatesGSTPaidReceived: boolean;
        populatesNetPaidReceived: boolean;
        readOnlyFinalizationFields: boolean;
        preservesHistoricalData: boolean;
    };
    /**
     * Account type requirements
     * @ai-term Use "control account requirements"
     */
    accountRequirements: {
        paidAccountMustBeGSTControl: boolean;
        recAccountMustBeGSTControl: boolean;
        accountsMustExistInChart: boolean;
    };
}
/**
 * Complete operational rules for MoneyWorks Tax Rates
 */
export declare const TaxRateOperationalRules: MoneyWorksTaxRateOperationalRules;
/**
 * Get applicable business rules for a specific operation
 *
 * @ai-instruction Use when explaining TaxRate behavior
 */
export declare function getApplicableRules(operation: 'create' | 'update' | 'calculate' | 'finalize'): string[];
//# sourceMappingURL=rules.d.ts.map