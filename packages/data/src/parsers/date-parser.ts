/**
 * MoneyWorks Date Parser
 * 
 * @moneyworks-dsl PURE
 */

import { YYYYMMDD } from '@moneyworks/utilities';

/**
 * Parse MoneyWorks date format (YYYYMMDD string)
 */
export function parseMWDate(value: string | null | undefined): YYYYMMDD | null {
  if (!value || value === '') return null;
  
  // MoneyWorks dates are YYYYMMDD format
  if (/^\d{8}$/.test(value)) {
    return value as YYYYMMDD;
  }
  
  return null;
}

/**
 * Parse MoneyWorks timestamp format
 */
export function parseMWTimestamp(value: string | null | undefined): Date | null {
  if (!value || value === '') return null;
  
  try {
    return new Date(value);
  } catch {
    return null;
  }
}

/**
 * Format date for MoneyWorks
 */
export function formatMWDate(date: YYYYMMDD | Date | string | null | undefined): string {
  if (!date) return '';
  
  if (typeof date === 'string' && /^\d{8}$/.test(date)) {
    return date; // Already in YYYYMMDD format
  }
  
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
  
  return '';
}