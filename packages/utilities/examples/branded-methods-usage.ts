/**
 * Examples of using branded types with methods
 * 
 * This demonstrates different approaches for adding methods to branded types
 */

import { d } from '@moneyworks/utilities';
import { 
  YYYYMMDDClass, 
  createYYYYMMDDWithMethods,
  chain,
  YYYYMMDD
} from '@moneyworks/utilities/src/types/branded-with-methods';

// ===== Approach 1: Class-based wrapper =====
console.log('=== Class-based approach ===');

const classDate = new YYYYMMDDClass(d`20250115`);

// Intuitive method calls
if (classDate.gt(new Date())) {
  console.log('Date is in the future');
}

// Chainable operations
const futureDate = classDate
  .addMonths(1)
  .addDays(15);

console.log(futureDate.format('/')); // "2025/03/02"

// Works with comparisons
if (classDate.lt(futureDate)) {
  console.log('Original date is earlier');
}

// Get days between
const daysDiff = classDate.daysBetween(futureDate);
console.log(`Days difference: ${daysDiff}`);

// ===== Approach 2: Proxy-based enhancement =====
console.log('\n=== Proxy-based approach ===');

const proxyDate = createYYYYMMDDWithMethods(d`20250115`);

// Looks and feels like a string but has methods!
console.log(proxyDate.substring(0, 4)); // "2025" - string methods work!
console.log(proxyDate.length); // 8 - string properties work!

// But also has our custom methods
if (proxyDate.gt(new Date())) {
  console.log('Date is in the future');
}

// Can use in string contexts
const message = `The date is ${proxyDate}`;
console.log(message); // "The date is 20250115"

// Method chaining
const nextMonth = proxyDate.addMonths(1);
console.log(nextMonth.format()); // "2025-02-15"

// Direct comparison still works
if (proxyDate < '20251231') {
  console.log('Date is before end of year');
}

// ===== Approach 3: Fluent chain wrapper =====
console.log('\n=== Fluent chain approach ===');

const chainDate = d`20250115`;

// Start chaining when you need methods
const result = chain(chainDate)
  .addMonths(2)
  .addDays(10)
  .format('/');

console.log(result); // "2025/03/25"

// Can still use the original for string operations
if (chainDate < '20250120') {
  console.log('Before Jan 20');
}

// Chain for complex operations
const isNextQuarter = chain(chainDate)
  .addMonths(3)
  .gt(new Date());

// ===== Approach 4: Utility object =====
console.log('\n=== Utility object approach ===');

const utilDate = d`20250115`;

// Use utility methods
if (YYYYMMDD.gt(utilDate, new Date())) {
  console.log('Date is in the future');
}

// Not chainable, but clear and simple
const isBeforeEndOfYear = YYYYMMDD.lt(utilDate, '20251231');

// ===== Real-world usage comparison =====
console.log('\n=== Real-world scenarios ===');

// Scenario 1: Check if invoice is overdue
const invoiceDate = d`20250101`;
const dueDate = d`20250131`;

// Class approach
const invoiceClass = new YYYYMMDDClass(invoiceDate);
const isOverdueClass = new YYYYMMDDClass(dueDate).lt(new Date());

// Proxy approach
const invoiceProxy = createYYYYMMDDWithMethods(invoiceDate);
const isOverdueProxy = createYYYYMMDDWithMethods(dueDate).lt(new Date());

// Chain approach
const isOverdueChain = chain(dueDate).lt(new Date());

// Utility approach
const isOverdueUtil = YYYYMMDD.lt(dueDate, new Date());

// Scenario 2: Calculate payment terms
const orderDate = d`20250115`;

// Class: Clear and chainable
const paymentDueClass = new YYYYMMDDClass(orderDate)
  .addDays(30)
  .format();

// Proxy: Most natural feeling
const paymentDueProxy = createYYYYMMDDWithMethods(orderDate)
  .addDays(30)
  .format();

// Chain: Explicit when using methods
const paymentDueChain = chain(orderDate)
  .addDays(30)
  .format();

// Scenario 3: Date range validation
function isWithinFiscalYear(date: string, fiscalYearStart = '20250401') {
  // Using proxy (most convenient for this use case)
  const dateProxy = createYYYYMMDDWithMethods(d`${date}`);
  const yearStart = createYYYYMMDDWithMethods(d`${fiscalYearStart}`);
  const yearEnd = yearStart.addMonths(12).addDays(-1);
  
  return dateProxy.gte(yearStart) && dateProxy.lte(yearEnd);
}

// ===== Which approach to use? =====
/*
1. Class-based: 
   - Best when you need a rich API and don't mind the wrapper
   - Good for domain models where the date is a core concept

2. Proxy-based:
   - Best when you want the most natural DX
   - Good when you need both string operations and custom methods
   - May have slight performance overhead

3. Chain wrapper:
   - Best when you want clear separation between string and methods
   - Good for complex date calculations

4. Utility object:
   - Best for simple comparisons and one-off operations
   - Most performant and tree-shakeable
   - Good when you prefer functional style

For MoneyWorks, I'd recommend the Proxy approach for the best DX,
with the utility object as a fallback for performance-critical paths.
*/