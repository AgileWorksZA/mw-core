# @moneyworks/utilities

Shared utilities for MoneyWorks packages. This package provides a growing collection of type-safe utilities for common MoneyWorks operations.

## Installation

```bash
bun add @moneyworks/utilities
```

## Package Overview

The utilities package is organized into several categories:

- **[Date Utilities](#date-utilities)** - Type-safe date handling with YYYYMMDD format, periods, and time
- **[JSON Utilities](#json-utilities)** - Smart JSON parsing and stringification with automatic type conversion  
- **[Type Utilities](#type-utilities)** - Branded types for enhanced type safety
- *(More utilities coming soon)*

---

## Date Utilities

The date utilities module provides comprehensive support for MoneyWorks' date formats with type safety and an excellent developer experience.

### Date Types Overview

MoneyWorks uses specific formats for dates and time:
- **YYYYMMDD** - Date format (e.g., "20250115" for January 15, 2025)
- **Period** - Accounting period as YYYYMM number (e.g., 202501 for January 2025)
- **HHMMSS** - Time format (e.g., "143000" for 2:30:00 PM)

### YYYYMMDD - Enhanced Date Strings

The crown jewel of our date utilities is the YYYYMMDD type with its new tagged template literal syntax and method support:

#### Tagged Template Literals (New! 🎉)

```typescript
import { d } from '@moneyworks/utilities';

// Clean, intuitive syntax
const date1 = d`20250115`;          // Simple and clean
const date2 = d`2025-01-15`;        // Works with dashes
const date3 = d`2025/01/15`;        // Works with slashes
const today = d`${new Date()}`;     // Dynamic values
const composed = d`${year}${month}${day}`; // Interpolation

// Use in objects
const invoice = {
  id: 1001,
  transDate: d`20250115`,
  dueDate: d`20250215`,
  amount: 1500.00
};
```

#### Methods on YYYYMMDD (New! 🚀)

YYYYMMDD values now have methods while still behaving as strings:

```typescript
const date = d`20250115`;

// Comparison methods
if (date.gt(new Date())) {
  console.log('Date is in the future');
}
date.lt(other)   // less than
date.gte(other)  // greater than or equal
date.lte(other)  // less than or equal  
date.eq(other)   // equal

// Date arithmetic
const nextMonth = date.addMonths(1);    // d`20250215`
const nextWeek = date.addDays(7);       // d`20250122`
const daysBetween = date.subtract(otherDate); // number

// Formatting & conversion
date.format('/');     // "2025/01/15"
date.toDate();        // JavaScript Date
date.toPeriod();      // 202501

// Validation
date.isWeekend();     // false
date.isLeapYear();    // false

// String methods still work!
date.substring(0, 4); // "2025"
date.length;          // 8
```

#### Traditional YYYYMMDD Functions

All the traditional utility functions are still available:

```typescript
import { YYYYMMDDUtils, createYYYYMMDD, parseToYYYYMMDD } from '@moneyworks/utilities';

// Create with validation
const date = createYYYYMMDD('20250115'); // Returns YYYYMMDD type
const invalid = createYYYYMMDD('20251301'); // Throws error

// Parse various formats
const parsed1 = parseToYYYYMMDD('2025-01-15'); // '20250115'
const parsed2 = parseToYYYYMMDD('2025/01/15'); // '20250115'
const parsed3 = parseToYYYYMMDD(new Date());   // '20250118' (today)

// Using the namespace
const today = YYYYMMDDUtils.today();
const tomorrow = YYYYMMDDUtils.addDays(today, 1);
const formatted = YYYYMMDDUtils.format(date, '/'); // '2025/01/15'
```

### Period - Accounting Periods

MoneyWorks periods represent year/month combinations as numbers:

```typescript
import { p, PeriodUtils, createPeriod } from '@moneyworks/utilities';

// Tagged template literal (New!)
const period1 = p`2025/01`;    // 202501
const period2 = p`2025-03`;    // 202503
const current = p`${new Date()}`; // Current period

// Traditional creation
const period = createPeriod(202501); // January 2025
const currentPeriod = PeriodUtils.current(); // Current month

// Period operations
const nextPeriod = PeriodUtils.addMonths(period, 1); // 202502
const year = PeriodUtils.year(period);  // 2025
const month = PeriodUtils.month(period); // 1

// Date conversion
const startDate = PeriodUtils.startDate(period); // '20250101'
const endDate = PeriodUtils.endDate(period);     // '20250131'

// Ranges
const quarters = PeriodUtils.range(202501, 202503); // [202501, 202502, 202503]
```

### Time Handling (HHMMSS)

```typescript
import { createHHMMSS, HHMMSSUtils } from '@moneyworks/utilities';

const time = createHHMMSS('143000'); // 2:30:00 PM
const now = HHMMSSUtils.now();       // Current time as HHMMSS

// Formatting
const formatted = HHMMSSUtils.format(time, ':'); // '14:30:00'
```

---

## JSON Utilities

Smart JSON handling with automatic type conversion for MoneyWorks data.

### Automatic Type Conversion

Parse JSON with automatic conversion of date, period, and time fields:

```typescript
import { parseMoneyWorksJSON } from '@moneyworks/utilities';
import type { YYYYMMDD, Period } from '@moneyworks/utilities';

const json = `{
  "id": 1001,
  "transDate": "20250115",
  "enterDate": "2025-01-10",
  "dueDate": "2025/02/15",
  "period": 202501,
  "amount": 1500
}`;

interface Transaction {
  id: number;
  transDate: YYYYMMDD;
  enterDate: YYYYMMDD;
  dueDate: YYYYMMDD;
  period: Period;
  amount: number;
}

// Automatically converts date fields to YYYYMMDD
const transaction = parseMoneyWorksJSON<Transaction>(json);

// All dates are now YYYYMMDD branded types!
console.log(transaction.transDate); // '20250115' as YYYYMMDD
```

### JSON Stringification

Format your data for different contexts:

```typescript
import { stringifyForAPI, stringifyForDisplay } from '@moneyworks/utilities';

const data = {
  transDate: d`20250115`,
  period: p`2025/01`,
  amount: 1500
};

// For API - compact, no formatting
const apiJson = stringifyForAPI(data);
// {"transDate":"20250115","period":202501,"amount":1500}

// For display - formatted, pretty
const displayJson = stringifyForDisplay(data);
// {
//   "transDate": "2025-01-15",
//   "period": "2025/01",
//   "amount": 1500
// }
```

---

## Type Utilities

### Branded Types

Branded types provide compile-time type safety for primitive values:

```typescript
import type { YYYYMMDD, Period, HHMMSS, AccountCode } from '@moneyworks/utilities';

// Create your own branded types
export type InvoiceNumber = Brand<string, 'InvoiceNumber'>;
export type CustomerCode = Brand<string, 'CustomerCode'>;

// Use for type safety
function processInvoice(
  invoice: InvoiceNumber,
  customer: CustomerCode,
  date: YYYYMMDD
) {
  // Type safe operations
}

// Type errors prevent mistakes
const inv: InvoiceNumber = 'INV001' as InvoiceNumber;
const cust: CustomerCode = 'CUST001' as CustomerCode;

processInvoice(cust, inv, d`20250115`); // ✗ Type error - wrong order!
processInvoice(inv, cust, d`20250115`); // ✓ Correct
```

---

## Integration Examples

### With MoneyWorks Client

```typescript
import { MoneyWorksRESTClient } from '@moneyworks/core';
import { parseMoneyWorksJSON, d } from '@moneyworks/utilities';

// Extend the client with automatic type conversion
class EnhancedClient extends MoneyWorksRESTClient {
  async export<T extends TableName>(
    table: T,
    options?: ExportOptions
  ): Promise<TableMapCamel[T][]> {
    const response = await super.export(table, options);
    const text = await response.text();
    
    // Automatically converts all date/period fields
    return parseMoneyWorksJSON<TableMapCamel[T][]>(text);
  }
}

// Usage
const client = new EnhancedClient(config);
const transactions = await client.export('transaction');

// All dates are now properly typed!
transactions.forEach(t => {
  if (t.transDate.gt(d`20250101`)) {
    console.log(`Transaction ${t.sequenceNumber} is from this year`);
  }
});
```

### Real-World Example

```typescript
import { d, p } from '@moneyworks/utilities';

interface Invoice {
  number: string;
  transDate: ReturnType<typeof d>;
  dueDate: ReturnType<typeof d>;
  period: ReturnType<typeof p>;
  amount: number;
}

function createInvoice(date: string | Date): Invoice {
  const transDate = d`${date}`;
  
  return {
    number: generateInvoiceNumber(),
    transDate,
    dueDate: transDate.addDays(30),
    period: p`${transDate.toPeriod()}`,
    amount: 0
  };
}

// Check overdue invoices
function getOverdueInvoices(invoices: Invoice[]): Invoice[] {
  const today = d`${new Date()}`;
  
  return invoices.filter(inv => 
    inv.dueDate.lt(today) && 
    inv.amount > 0
  );
}
```

---

## API Reference

### Date Utilities API

#### YYYYMMDDUtils Namespace
All YYYYMMDD functions are available through the `YYYYMMDDUtils` namespace:
- `create()`, `tryCreate()`, `is()`, `parse()`
- `today()`, `fromDate()`, `toDate()` 
- `format()`, `addDays()`, `addMonths()`
- `daysBetween()`, `compare()`, `isBefore()`, `isAfter()`
- `startOfMonth()`, `endOfMonth()`

#### PeriodUtils Namespace
All Period functions are available through the `PeriodUtils` namespace:
- `create()`, `fromYearMonth()`, `current()`
- `year()`, `month()`, `toDate()`, `fromDate()`
- `startDate()`, `endDate()`, `addMonths()`
- `monthsBetween()`, `format()`, `range()`

### JSON Utilities API

- `parseMoneyWorksJSON<T>(text: string, options?: MoneyWorksParseOptions): T`
- `createMoneyWorksReviver(options?: MoneyWorksParseOptions): Reviver`
- `createTypedParser<T>(...fields): Parser<T>`
- `stringifyMoneyWorks(value: any, options?: MoneyWorksStringifyOptions): string`
- `stringifyForAPI(value: any): string`
- `stringifyForDisplay(value: any): string`

---

## Future Utilities

This package is designed to grow. Planned additions include:

- **Validation Utilities** - Schema validation for MoneyWorks data
- **Formatting Utilities** - Number, currency, and text formatting
- **Calculation Utilities** - Common financial calculations
- **Query Utilities** - Type-safe query builders

---

## License

MIT