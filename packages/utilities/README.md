# @moneyworks/utilities

Shared utilities for MoneyWorks packages, providing type-safe date handling, JSON parsing, and branded types.

## Installation

```bash
bun add @moneyworks/utilities
```

## Features

### Branded Types

Branded types provide compile-time type safety for primitive values:

```typescript
import { YYYYMMDD, Period, AccountCode } from '@moneyworks/utilities';

// These are distinct types, not just strings/numbers
const date: YYYYMMDD = '20250115'; // ✓ Valid
const period: Period = 202501; // ✓ Valid
const account: AccountCode = 'BANK-001' as AccountCode; // ✓ Valid

// Type errors:
const badDate: YYYYMMDD = '2025-01-15'; // ✗ Type error
const badPeriod: Period = 2025; // ✗ Type error
```

### Date Handling (YYYYMMDD)

MoneyWorks uses YYYYMMDD format for dates. This package provides comprehensive utilities:

```typescript
import { YYYYMMDD, createYYYYMMDD, parseToYYYYMMDD } from '@moneyworks/utilities';

// Create with validation
const date = createYYYYMMDD('20250115'); // Returns YYYYMMDD type
const invalid = createYYYYMMDD('20251301'); // Throws error

// Parse various formats
const parsed1 = parseToYYYYMMDD('2025-01-15'); // Returns: '20250115'
const parsed2 = parseToYYYYMMDD('2025/01/15'); // Returns: '20250115'
const parsed3 = parseToYYYYMMDD(new Date()); // Returns: '20250118' (today)

// Date operations
const today = YYYYMMDD.today(); // '20250118'
const tomorrow = YYYYMMDD.addDays(today, 1); // '20250119'
const nextMonth = YYYYMMDD.addMonths(today, 1); // '20250218'

// Comparisons (works with regular string comparison)
console.log(date === '20250115'); // true
console.log(date < '20250120'); // true

// Formatting
const formatted = YYYYMMDD.format(date, '/'); // '2025/01/15'

// Convert to/from Date
const jsDate = YYYYMMDD.toDate(date); // Date object
const backToYYYYMMDD = YYYYMMDD.fromDate(jsDate); // YYYYMMDD
```

### Period Handling

MoneyWorks periods are in YYYYMM format as numbers:

```typescript
import { Period, createPeriod } from '@moneyworks/utilities';

// Create periods
const period = createPeriod(202501); // January 2025
const current = Period.current(); // Current month

// Period operations
const nextPeriod = Period.addMonths(period, 1); // 202502
const year = Period.year(period); // 2025
const month = Period.month(period); // 1

// Date conversion
const startDate = Period.startDate(period); // '20250101'
const endDate = Period.endDate(period); // '20250131'

// Ranges
const range = Period.range(202501, 202503); // [202501, 202502, 202503]
```

### JSON Parsing with Automatic Type Conversion

Automatically convert date strings to YYYYMMDD types during parsing:

```typescript
import { parseMoneyWorksJSON, YYYYMMDD } from '@moneyworks/utilities';

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

console.log(transaction.transDate === '20250115'); // true
console.log(transaction.enterDate === '20250110'); // true (converted from ISO)
console.log(transaction.dueDate === '20250215'); // true (converted from slash format)
```

### Custom Parsing Options

```typescript
import { parseMoneyWorksJSON, createTypedParser } from '@moneyworks/utilities';

// Parse with options
const data = parseMoneyWorksJSON(json, {
  convertDates: true,    // Convert date fields (default: true)
  convertPeriods: true,  // Convert period fields (default: true)
  convertTimes: false,   // Don't convert time fields
  additionalDateFields: ['customDate'], // Additional fields to treat as dates
  excludeFields: ['rawDate'], // Fields to skip
  strict: true // Throw on invalid values instead of keeping original
});

// Create a typed parser for specific types
const parseTransaction = createTypedParser<Transaction>(
  ['transDate', 'enterDate', 'dueDate'], // Date fields
  ['period'], // Period fields
  [] // Time fields
);

const transaction = parseTransaction(json);
```

### JSON Stringification

```typescript
import { stringifyMoneyWorks, stringifyForAPI, stringifyForDisplay } from '@moneyworks/utilities';

const transaction = {
  id: 1001,
  transDate: createYYYYMMDD('20250115'),
  period: createPeriod(202501),
  amount: 1500
};

// For API - no formatting, compact
const apiJson = stringifyForAPI(transaction);
// {"id":1001,"transDate":"20250115","period":202501,"amount":1500}

// For display - formatted dates, pretty print
const displayJson = stringifyForDisplay(transaction);
// {
//   "id": 1001,
//   "transDate": "2025-01-15",
//   "period": "2025/01",
//   "amount": 1500
// }

// Custom formatting
const customJson = stringifyMoneyWorks(transaction, {
  formatDates: true,
  dateSeparator: '/',
  indent: 2
});
```

## Integration with MoneyWorks Client

```typescript
import { MoneyWorksRESTClient } from '@moneyworks/core';
import { parseMoneyWorksJSON, YYYYMMDD } from '@moneyworks/utilities';

class EnhancedClient extends MoneyWorksRESTClient {
  async export<T extends TableName>(
    table: T,
    options?: ExportOptions
  ): Promise<TableMapCamel[T][]> {
    const response = await this.request(...);
    const text = await response.text();
    
    // Automatically converts all date fields to YYYYMMDD types
    return parseMoneyWorksJSON<TableMapCamel[T][]>(text);
  }
}

// Usage
const client = new EnhancedClient(config);
const transactions = await client.export('transaction');

// transDate is now typed as YYYYMMDD
transactions.forEach(t => {
  console.log(t.transDate); // YYYYMMDD type
  console.log(t.transDate === '20250115'); // Works!
});
```

## Type Safety Benefits

```typescript
import { YYYYMMDD, Period } from '@moneyworks/utilities';

interface Invoice {
  transDate: YYYYMMDD;
  dueDate: YYYYMMDD;
  period: Period;
}

function createInvoice(date: YYYYMMDD): Invoice {
  return {
    transDate: date,
    dueDate: YYYYMMDD.addDays(date, 30),
    period: YYYYMMDD.toPeriod(date)
  };
}

// Type safe - won't compile with invalid dates
// createInvoice('2025-01-15'); // ✗ Type error
// createInvoice('invalid'); // ✗ Type error

// Must use valid YYYYMMDD
const invoice = createInvoice(createYYYYMMDD('20250115')); // ✓ Valid
```

## API Reference

### YYYYMMDD Namespace

- `YYYYMMDD.create(value: string): YYYYMMDD` - Create with validation
- `YYYYMMDD.tryCreate(value: string): YYYYMMDD | null` - Create without throwing
- `YYYYMMDD.is(value: string): value is YYYYMMDD` - Type guard
- `YYYYMMDD.parse(value: string | Date): YYYYMMDD` - Parse various formats
- `YYYYMMDD.today(): YYYYMMDD` - Get today's date
- `YYYYMMDD.format(date: YYYYMMDD, separator?: string): string` - Format for display
- `YYYYMMDD.toDate(date: YYYYMMDD): Date` - Convert to JS Date
- `YYYYMMDD.fromDate(date: Date): YYYYMMDD` - Convert from JS Date
- `YYYYMMDD.addDays(date: YYYYMMDD, days: number): YYYYMMDD` - Add days
- `YYYYMMDD.addMonths(date: YYYYMMDD, months: number): YYYYMMDD` - Add months
- `YYYYMMDD.daysBetween(from: YYYYMMDD, to: YYYYMMDD): number` - Calculate days
- `YYYYMMDD.compare(a: YYYYMMDD, b: YYYYMMDD): number` - Compare dates
- `YYYYMMDD.isBefore(date: YYYYMMDD, compare: YYYYMMDD): boolean` - Check if before
- `YYYYMMDD.isAfter(date: YYYYMMDD, compare: YYYYMMDD): boolean` - Check if after

### Period Namespace

- `Period.create(value: number): Period` - Create with validation
- `Period.fromYearMonth(year: number, month: number): Period` - Create from components
- `Period.current(): Period` - Get current period
- `Period.year(period: Period): number` - Extract year
- `Period.month(period: Period): number` - Extract month
- `Period.toDate(period: Period): Date` - Convert to Date
- `Period.fromDate(date: Date): Period` - Convert from Date
- `Period.fromYYYYMMDD(date: YYYYMMDD): Period` - Convert from YYYYMMDD
- `Period.startDate(period: Period): YYYYMMDD` - Get first day
- `Period.endDate(period: Period): YYYYMMDD` - Get last day
- `Period.addMonths(period: Period, months: number): Period` - Add months
- `Period.format(period: Period, separator?: string): string` - Format for display

### JSON Functions

- `parseMoneyWorksJSON<T>(text: string, options?: MoneyWorksParseOptions): T`
- `createMoneyWorksReviver(options?: MoneyWorksParseOptions): Reviver`
- `stringifyMoneyWorks(value: any, options?: MoneyWorksStringifyOptions): string`
- `stringifyForAPI(value: any): string`
- `stringifyForDisplay(value: any): string`

## License

MIT