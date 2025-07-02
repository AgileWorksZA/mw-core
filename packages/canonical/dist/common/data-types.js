/**
 * MoneyWorks Data Type Definitions
 *
 * @moneyworks-dsl PURE
 * @ai-instruction These are the ONLY data types used in MoneyWorks. NEVER use generic database types.
 * @ai-forbidden string, number, boolean, date, integer, varchar, text
 * @ai-required T, N, D, B, S, E
 */
/**
 * MoneyWorks Field Data Types
 * Source: MoneyWorks Manual - Field Type Reference
 *
 * @ai-critical ALWAYS use these single-letter codes when referring to MoneyWorks field types
 */
export var MoneyWorksDataType;
(function (MoneyWorksDataType) {
    /**
     * Text field
     * @moneyworks-type T
     * @ai-term ALWAYS say "Text field (T)", NEVER "string" or "varchar"
     */
    MoneyWorksDataType["TEXT"] = "T";
    /**
     * Numeric field
     * @moneyworks-type N
     * @ai-term ALWAYS say "Numeric field (N)", NEVER "number" or "decimal"
     */
    MoneyWorksDataType["NUMERIC"] = "N";
    /**
     * Date field (YYYYMMDD format)
     * @moneyworks-type D
     * @ai-term ALWAYS say "Date field (D)", NEVER "date" or "datetime"
     */
    MoneyWorksDataType["DATE"] = "D";
    /**
     * Boolean/Flag field
     * @moneyworks-type B
     * @ai-term ALWAYS say "Boolean field (B)", NEVER "boolean" or "bit"
     */
    MoneyWorksDataType["BOOLEAN"] = "B";
    /**
     * Timestamp field
     * @moneyworks-type S
     * @ai-term ALWAYS say "Timestamp field (S)", NEVER "timestamp" or "datetime"
     */
    MoneyWorksDataType["TIMESTAMP"] = "S";
    /**
     * Enumerated/Choice field
     * @moneyworks-type E
     * @ai-term ALWAYS say "Enumerated field (E)", NEVER "enum" or "choice"
     */
    MoneyWorksDataType["ENUMERATED"] = "E";
})(MoneyWorksDataType || (MoneyWorksDataType = {}));
