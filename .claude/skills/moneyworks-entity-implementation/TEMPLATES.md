# MoneyWorks Entity Implementation Templates

Ready-to-use code templates for each layer. Replace `{Entity}`, `{entity}`, `{PrimaryKey}`, and `{DisplayName}` with actual values.

## Template: Canonical Types

**File**: `packages/canonical/src/entities/{entity}/types.ts`

```typescript
/**
 * MoneyWorks {Entity} Type Definitions
 *
 * @moneyworks-entity {Entity}
 * @moneyworks-table {Entity}
 * @moneyworks-dsl PURE
 *
 * @ai-instruction USE ONLY MoneyWorks field names. NEVER translate to generic terms.
 * @ai-forbidden [list generic terms to avoid]
 * @ai-required [list required MW fields]
 */

import type { AccountCode, YYYYMMDD } from "@moneyworks/utilities";

/**
 * MoneyWorks {Entity} Entity
 *
 * @ai-critical NEVER translate MoneyWorks field names
 */
export interface MoneyWorks{Entity} {
  /**
   * Primary key
   * @moneyworks-field {PrimaryKey}
   * @moneyworks-type T(31)
   */
  {PrimaryKey}: string;

  /**
   * Description/Name
   * @moneyworks-field Description
   * @moneyworks-type T(255)
   */
  Description?: string;

  /**
   * Hash for searching
   * @moneyworks-field Hash
   * @moneyworks-type N
   */
  Hash?: number;

  /**
   * Operational flags
   * @moneyworks-field Flags
   * @moneyworks-type N
   */
  Flags?: number;

  // Add remaining fields from MoneyWorks schema...
}

/**
 * Input for creating new {Entity}
 */
export interface MoneyWorks{Entity}CreateInput {
  {PrimaryKey}: string;
  Description?: string;
  // Required and optional creation fields...
}

/**
 * Input for updating existing {Entity}
 */
export interface MoneyWorks{Entity}UpdateInput {
  Description?: string;
  // Optional update fields (PrimaryKey typically not updatable)...
}

/**
 * Filter options for querying {Entity}
 */
export interface MoneyWorks{Entity}Filter {
  {PrimaryKey}?: string;
  Description?: string;
  // Filter criteria...
}
```

## Template: Enums (if needed)

**File**: `packages/canonical/src/entities/{entity}/enums.ts`

```typescript
/**
 * MoneyWorks {Entity} Enumerations
 *
 * @moneyworks-dsl PURE
 */

/**
 * {Entity} Type Classification
 * @moneyworks-field Type
 */
export type MoneyWorks{Entity}Type =
  | "A"  // Type A
  | "B"  // Type B
  | "C"; // Type C

/**
 * {Entity} Status Flags (bitmask)
 * @moneyworks-field Flags
 */
export enum MoneyWorks{Entity}Flags {
  FLAG_ONE = 0x0001,
  FLAG_TWO = 0x0002,
  FLAG_THREE = 0x0004,
}
```

## Template: Index Export

**File**: `packages/canonical/src/entities/{entity}/index.ts`

```typescript
export * from "./types";
export * from "./enums";
```

## Template: Repository

**File**: `packages/data/src/repositories/{entity}.repository.ts`

```typescript
/**
 * MoneyWorks {Entity} Repository
 *
 * @moneyworks-entity {Entity}
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles all {Entity} data operations
 * @ai-critical Use MoneyWorks {Entity} terminology exclusively
 */

import type {
  MoneyWorks{Entity},
  MoneyWorks{Entity}CreateInput,
  MoneyWorks{Entity}UpdateInput,
} from "@moneyworks/canonical/entities/{entity}";
import type { AccountCode } from "@moneyworks/utilities";
import { formatMWNumber } from "../parsers/number-parser";
import { BaseMoneyWorksRepository } from "./base.repository";

/**
 * Repository for MoneyWorks {Entity} entity
 *
 * @ai-instruction Use this for all {Entity} data operations
 */
export class {Entity}Repository extends BaseMoneyWorksRepository<
  MoneyWorks{Entity},
  MoneyWorks{Entity}CreateInput,
  MoneyWorks{Entity}UpdateInput
> {
  /**
   * MoneyWorks table name
   * @ai-critical Must be exact MW table name
   */
  protected readonly tableName = "{Entity}";

  /**
   * Primary key field
   */
  protected readonly primaryKey = "{PrimaryKey}";

  /**
   * Post-process records to add branded types and parse MW data
   */
  protected postProcess(record: any): MoneyWorks{Entity} {
    const numericFields = [
      "Hash",
      "Flags",
      // Add all numeric fields...
    ];

    const processed: any = { ...record };

    for (const field of numericFields) {
      if (processed[field] !== undefined) {
        processed[field] = Number(processed[field]) || 0;
      }
    }

    // Add branded types for account fields
    const accountFields = ["COGAcct", "SalesAcct", "StockAcct"];
    for (const field of accountFields) {
      if (processed[field]) {
        processed[field] = processed[field] as AccountCode;
      }
    }

    return processed as MoneyWorks{Entity};
  }

  /**
   * Prepare input data for MoneyWorks format
   */
  protected prepare(
    input: MoneyWorks{Entity}CreateInput | MoneyWorks{Entity}UpdateInput
  ): any {
    const prepared: any = { ...input };

    // Format numeric fields
    const numericFields = ["Hash", "Flags"];
    for (const field of numericFields) {
      if (prepared[field] !== undefined) {
        prepared[field] = formatMWNumber(prepared[field]);
      }
    }

    return prepared;
  }

  // ============ Specialized Query Methods ============

  /**
   * Find by primary key
   * @param code The {PrimaryKey} value
   */
  async findBy{PrimaryKey}(code: string): Promise<MoneyWorks{Entity} | null> {
    const results = await this.find({
      search: `{PrimaryKey}="${code}"`,
      limit: 1,
    });
    return results[0] || null;
  }

  /**
   * Search by description
   * @param searchTerm Partial description to match
   */
  async searchByDescription(searchTerm: string): Promise<MoneyWorks{Entity}[]> {
    return this.find({
      search: `Description contains "${searchTerm}"`,
    });
  }

  // Add more specialized queries as needed...
}
```

## Template: Controller

**File**: `packages/api/src/controllers/{entity}.ts`

```typescript
/**
 * {Entity} Controller
 * Handles {Entity} entity operations for the API
 *
 * @moneyworks-dsl PURE
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { {Entity}Repository } from "@moneyworks/data";
import { BaseTableController, type TableExportParams } from "./base-table";

export class {Entity}Controller extends BaseTableController {
  readonly tableName = "{Entity}";
  readonly displayName = "{DisplayName}";
  readonly description = "{Description of what this entity represents in MoneyWorks}";
  private repo: {Entity}Repository;

  constructor(client: SmartMoneyWorksClient) {
    super(client);
    this.repo = new {Entity}Repository(client);
  }

  /**
   * Get primary key for {Entity} table
   */
  protected getPrimaryKey(): string {
    return "{PrimaryKey}";
  }

  /**
   * Additional validation specific to {Entity}
   */
  protected validateTableSpecific(params: TableExportParams): void {
    // Validate orderBy field if provided
    if (params.orderBy) {
      const validFields = ["{PrimaryKey}", "Description", /* ... */];
      const field = params.orderBy.split(" ")[0];

      if (!validFields.includes(field)) {
        throw new Error(
          `Invalid orderBy field: ${field}. Valid fields: ${validFields.join(", ")}`
        );
      }
    }

    // Validate filter expressions
    if (params.filter) {
      const dangerousPatterns = [";", "--", "/*", "*/"];
      for (const pattern of dangerousPatterns) {
        if (params.filter.includes(pattern)) {
          throw new Error("Invalid filter expression");
        }
      }
    }
  }
}
```

## Template: TableRegistry Update

**File**: `packages/api/src/registry/table-registry.ts`

Add these changes:

```typescript
// At the imports section (top of file)
import { {Entity}Controller } from "../controllers/{entity}";

// In registerTables() method
private registerTables(): void {
  // ... existing registrations ...
  this.register(new {Entity}Controller(this.client));
}

// Remove from upcoming array if present
private upcoming = [
  // "{Entity}",  <-- REMOVE THIS LINE
  "Transaction",
  "Job",
  // ...
];
```

## Template: Bitfield Utilities (for flag/role entities)

**File**: `packages/canonical/src/entities/{entity}/enums.ts`

```typescript
/**
 * {Entity} Flags/Roles (bitmask)
 * @moneyworks-field Flags
 */
export enum MoneyWorks{Entity}Flags {
  FLAG_ONE = 0x0001,
  FLAG_TWO = 0x0002,
  FLAG_THREE = 0x0004,
  // Add all flag values...
}

/**
 * Encode multiple flags into a single bitmask value
 */
export function encode{Entity}Flags(flags: MoneyWorks{Entity}Flags[]): number {
  return flags.reduce((acc, flag) => acc | flag, 0);
}

/**
 * Decode a bitmask value into individual flags
 */
export function decode{Entity}Flags(value: number): MoneyWorks{Entity}Flags[] {
  return Object.values(MoneyWorks{Entity}Flags)
    .filter(flag => typeof flag === 'number' && (value & flag) !== 0) as MoneyWorks{Entity}Flags[];
}

/**
 * Check if a specific flag is set
 */
export function has{Entity}Flag(value: number, flag: MoneyWorks{Entity}Flags): boolean {
  return (value & flag) !== 0;
}

/**
 * Add a flag to an existing bitmask
 */
export function add{Entity}Flag(value: number, flag: MoneyWorks{Entity}Flags): number {
  return value | flag;
}

/**
 * Remove a flag from an existing bitmask
 */
export function remove{Entity}Flag(value: number, flag: MoneyWorks{Entity}Flags): number {
  return value & ~flag;
}
```

## Template: Specialized Query with Bitwise Search

**File**: `packages/data/src/repositories/{entity}.repository.ts`

```typescript
/**
 * Find records by flag/role bit (uses MW bitwise search)
 * @param flagBit The flag bit value to search for
 */
async findByFlag(flagBit: number): Promise<MoneyWorks{Entity}[]> {
  const hexBit = flagBit.toString(16);
  return this.find({
    search: `(Flags&#${hexBit})!=0`,
  });
}

/**
 * Find records by multiple flags (AND logic)
 */
async findByFlags(flags: MoneyWorks{Entity}Flags[]): Promise<MoneyWorks{Entity}[]> {
  const combined = encode{Entity}Flags(flags);
  const hexBit = combined.toString(16);
  return this.find({
    search: `(Flags&#${hexBit})=${hexBit}`,
  });
}
```

## Template: TSV Field Mapping

**File**: `packages/data/src/parsers/moneyworks-field-mappings.ts`

```typescript
/**
 * Field mapping for {Entity} TSV exports
 * Order must match MoneyWorks TSV column order exactly
 *
 * @ai-critical Order discovered by exporting with compact-headers format
 */
export const {ENTITY}_TSV_FIELD_MAPPING: string[] = [
  "{PrimaryKey}",
  "Description",
  "Hash",
  "Flags",
  // ... all fields in exact TSV order
];
```
