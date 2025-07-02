/**
 * MoneyWorks Business Rules Base Interfaces
 *
 * @moneyworks-dsl PURE
 * @ai-instruction These define MoneyWorks-specific business logic patterns
 * @ai-critical NEVER use generic business rule terms - use MoneyWorks terminology
 */
/**
 * Base interface for MoneyWorks entity business rules
 *
 * @ai-instruction Each entity implements this with MW-specific rules
 */
export interface MoneyWorksBusinessRules {
    /**
     * Entity-specific validation rules
     * @ai-term Say "validation rules", NEVER "constraints" or "validators"
     */
    validationRules: Record<string, boolean>;
    /**
     * Cross-entity relationship rules
     * @ai-term Say "relationship rules", NEVER "foreign keys" or "references"
     */
    relationshipRules?: Record<string, boolean>;
    /**
     * MoneyWorks calculation rules
     * @ai-term Say "calculation rules", NEVER "computed fields" or "formulas"
     */
    calculationRules?: Record<string, boolean>;
}
/**
 * MoneyWorks field relationship definition
 *
 * @ai-instruction Use to define how MW entities reference each other
 */
export interface MoneyWorksFieldRelationship {
    /**
     * Source field name
     * @ai-term Use exact MW field name
     */
    sourceField: string;
    /**
     * Target entity name
     * @ai-term Use exact MW entity name (e.g., "Account", "Name", "TaxRate")
     */
    targetEntity: string;
    /**
     * Target field name
     * @ai-term Use exact MW field name
     */
    targetField: string;
    /**
     * Relationship type
     * @ai-term Use MW terms: "references", "subfile_of", "linked_to"
     */
    relationshipType: 'references' | 'subfile_of' | 'linked_to';
    /**
     * Whether relationship is required
     * @ai-term Say "required", NEVER "mandatory"
     */
    isRequired: boolean;
}
/**
 * MoneyWorks calculation context
 *
 * @ai-instruction For MW calculations like tax, depreciation, etc.
 */
export interface MoneyWorksCalculationContext {
    /**
     * Entity performing calculation
     * @ai-term Use MW entity name
     */
    entity: string;
    /**
     * Calculation type
     * @ai-term Use MW terms like "tax_calculation", "depreciation_calculation"
     */
    calculationType: string;
    /**
     * Input fields required
     * @ai-term List exact MW field names
     */
    inputFields: string[];
    /**
     * Output fields produced
     * @ai-term List exact MW field names
     */
    outputFields: string[];
    /**
     * MoneyWorks manual reference
     * @ai-term Cite exact manual section
     */
    manualReference: string;
}
//# sourceMappingURL=business-rules.d.ts.map