/**
 * MoneyWorks Date Parser
 *
 * @moneyworks-dsl PURE
 */
import { YYYYMMDD } from '@moneyworks/utilities';
/**
 * Parse MoneyWorks date format (YYYYMMDD string)
 */
export declare function parseMWDate(value: string | null | undefined): YYYYMMDD | null;
/**
 * Parse MoneyWorks timestamp format
 */
export declare function parseMWTimestamp(value: string | null | undefined): Date | null;
/**
 * Format date for MoneyWorks
 */
export declare function formatMWDate(date: YYYYMMDD | Date | string | null | undefined): string;
//# sourceMappingURL=date-parser.d.ts.map