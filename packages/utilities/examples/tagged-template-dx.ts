/**
 * Tagged Template Literals for MoneyWorks Types
 * 
 * This example demonstrates the improved developer experience
 * using tagged template literals for branded types
 */

import { d, p, YYYYMMDDUtils, PeriodUtils, createYYYYMMDD, createPeriod } from '@moneyworks/utilities';
import type { YYYYMMDDType, PeriodType } from '@moneyworks/utilities';

const oldWay = {
  transDate: createYYYYMMDD('20250115'),
  period: createPeriod(202501),
  dueDate: createYYYYMMDD('20250215')
};

// ===== AFTER: Tagged template literals =====
// Clean, intuitive, and type-safe!

// Basic usage - much cleaner!
const transDate = d`20250115`;
const period = p`202501`;

// Works with various date formats
const iso = d`2025-01-15`;
const slash = d`2025/01/15`;

// Dynamic values with interpolation
const today = d`${new Date()}`;
const currentPeriod = p`${new Date()}`;

// Compose from parts
const year = 2025;
const month = 1;
const day = 15;
const composed = d`${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
const composedPeriod = p`${year}${String(month).padStart(2, '0')}`;

// Using tagged template literals
const invoice = {
  id: 1001,
  transDate: d`20250115`,
  dueDate: d`20250215`,
  period: p`202501`,
  amount: 1500.00
};

// Type-safe function parameters
function processInvoice(date: YYYYMMDDType, period: PeriodType) {
  console.log(`Processing invoice for ${date} in period ${period}`);
}

// Clean function calls
processInvoice(d`20250115`, p`202501`);

// Works perfectly with comparisons
if (d`20250115` < d`20250120`) {
  console.log('First date is earlier');
}

// Array operations
const holidays = [
  d`20250101`, // New Year
  d`20250704`, // Independence Day  
  d`20251225`, // Christmas
];

const fiscalPeriods = [
  p`202501`, p`202502`, p`202503`, // Q1
  p`202504`, p`202505`, p`202506`, // Q2
];

// Conditional logic
const effectiveDate = d`${
  new Date().getMonth() === 0 
    ? new Date(new Date().getFullYear(), 0, 1)
    : new Date()
}`;

// Error handling
try {
  const invalid = d`20251301`; // Invalid month
} catch (error) {
  console.error('Invalid date format');
}

// JSON serialization works perfectly
const data = {
  startDate: d`20250101`,
  endDate: d`20251231`,
  period: p`202501`
};

console.log(JSON.stringify(data));
// Output: {"startDate":"20250101","endDate":"20251231","period":202501}

// Integration with MoneyWorks API
const transaction = {
  TransDate: d`20250115`,
  Period: p`202501`,
  DueDate: d`20250215`,
  Amount: 1500.00,
  Description: "Invoice #1234"
};

// Real-world example: Date calculations
const invoiceDate = d`20250115`;
const paymentTerms = 30; // days
const dueDate = invoiceDate.addDays(paymentTerms);

// Period calculations
const currentMonth = p`202501`;
const nextQuarter = PeriodUtils.addMonths(currentMonth, 3);

// Complex business logic
function getDiscountDeadline(invoiceDate: YYYYMMDDType): YYYYMMDDType {
  // 2% discount if paid within 10 days
  return YYYYMMDDUtils.addDays(invoiceDate, 10);
}

const discountBy = getDiscountDeadline(d`20250115`);

// Template literal in template literal!
const dynamicQuery = `
  SELECT * FROM transactions 
  WHERE TransDate >= '${d`20250101`}'
  AND TransDate <= '${d`20251231`}'
  AND Period = ${p`202501`}
`;

// The beauty is in the simplicity and type safety!
// No more verbose function calls, just clean, readable code
// that looks like the actual date formats you're working with.