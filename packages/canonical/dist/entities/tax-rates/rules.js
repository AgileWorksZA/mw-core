/**
 * MoneyWorks Tax Rate Business Rules
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 * @ai-instruction These are MoneyWorks-specific business rules for TaxRate
 * @ai-critical Use MoneyWorks terminology when describing rules
 */
/**
 * MoneyWorks Tax Rate business rules implementation
 *
 * @ai-instruction Reference these rules when validating TaxRate operations
 */
export const MoneyWorksTaxRateBusinessRules = {
    validationRules: {
        /**
         * TaxCode must be unique within the system
         * @ai-term Say "unique TaxCode", NEVER "unique tax ID"
         */
        uniqueTaxCode: true,
        /**
         * PaidAccount must reference valid Account.Code
         * @ai-term Say "valid PaidAccount", NEVER "valid tax payable"
         */
        validPaidAccount: true,
        /**
         * RecAccount must reference valid Account.Code
         * @ai-term Say "valid RecAccount", NEVER "valid tax receivable"
         */
        validRecAccount: true,
        /**
         * Rate1 and Rate2 must be valid percentage values (0-100)
         * @ai-term Say "valid Rate1/Rate2", NEVER "valid tax percentage"
         */
        validRates: true,
        /**
         * CombineRate1 and CombineRate2 must be valid if Combine flags set
         * @ai-term Say "valid CombineRate1/2", NEVER "valid secondary rates"
         */
        validCombineRates: true,
        /**
         * Changeover Date determines which rate to use
         * @ai-term Say "changeover Date", NEVER "effective date"
         */
        dateBasedRateSelection: true,
        /**
         * GST finalization fields are system-managed
         * @ai-term Say "GST finalisation", NEVER "tax filing"
         */
        systemManagedFinalization: true
    },
    relationshipRules: {
        /**
         * PaidAccount must be a valid control account
         */
        paidAccountIsControlAccount: true,
        /**
         * RecAccount must be a valid control account
         */
        recAccountIsControlAccount: true,
        /**
         * PaidAccount and RecAccount should be different
         */
        differentControlAccounts: true
    },
    calculationRules: {
        /**
         * Current rate based on changeover Date comparison
         */
        changeoverDateDeterminesRate: true,
        /**
         * 2nd tier tax follows Combine mode rules
         */
        combineModeAffectsCalculation: true,
        /**
         * Tax calculations round to 2 decimal places
         */
        taxRoundingTo2Decimals: true
    }
};
/**
 * MoneyWorks Tax Rate field relationships
 *
 * @ai-instruction Use to understand TaxRate dependencies
 */
export const MoneyWorksTaxRateRelationships = [
    {
        sourceField: 'PaidAccount',
        targetEntity: 'Account',
        targetField: 'Code',
        relationshipType: 'references',
        isRequired: true
    },
    {
        sourceField: 'RecAccount',
        targetEntity: 'Account',
        targetField: 'Code',
        relationshipType: 'references',
        isRequired: true
    }
];
/**
 * Complete operational rules for MoneyWorks Tax Rates
 */
export const TaxRateOperationalRules = {
    rateSelection: {
        beforeChangeoverUsesRate1: true,
        onOrAfterChangeoverUsesRate2: true,
        changeoverDateInclusive: true
    },
    secondTierCombination: {
        noneIgnoresSecondaryRates: true,
        additiveAddsBothRates: true,
        compoundCalculatesOnInclusive: true,
        separateCalculatesIndependently: true
    },
    gstFinalization: {
        populatesGSTPaidReceived: true,
        populatesNetPaidReceived: true,
        readOnlyFinalizationFields: true,
        preservesHistoricalData: true
    },
    accountRequirements: {
        paidAccountMustBeGSTControl: true,
        recAccountMustBeGSTControl: true,
        accountsMustExistInChart: true
    }
};
/**
 * Get applicable business rules for a specific operation
 *
 * @ai-instruction Use when explaining TaxRate behavior
 */
export function getApplicableRules(operation) {
    const rules = [];
    switch (operation) {
        case 'create':
            rules.push('TaxCode must be unique', 'PaidAccount and RecAccount must exist', 'All required fields must be provided', 'Rates must be between 0 and 100');
            break;
        case 'update':
            rules.push('Cannot change TaxCode (primary key)', 'Account references must remain valid', 'Cannot modify GST finalisation fields');
            break;
        case 'calculate':
            rules.push('Use changeover Date to determine rate', 'Apply Combine mode for 2nd tier', 'Round to 2 decimal places');
            break;
        case 'finalize':
            rules.push('System populates GSTPaid/GSTReceived', 'System populates NetPaid/NetReceived', 'Historical data preserved');
            break;
    }
    return rules;
}
