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

## Template: Web List Route

**File**: `packages/web1/app/routes/{entity}.tsx`

```typescript
import { useLoaderData, useSearchParams, Link } from "react-router";
import { data } from "react-router";
import type { Route } from "./+types/{entity}";
import { createMWClient } from "~/lib/mw-client.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;
  const search = url.searchParams.get("search") || "";

  const client = await createMWClient();

  const searchFilter = search
    ? `Description contains "${search}"`
    : undefined;

  const items = await client.smartExport("{Entity}", {
    exportFormat: "full",
    search: searchFilter,
    limit,
    offset,
  });

  return data({ items, page, search });
}

export default function {Entity}List() {
  const { items, page, search } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{DisplayName}</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          defaultValue={search}
          onChange={(e) => {
            setSearchParams({ search: e.target.value, page: "1" });
          }}
          className="border p-2 rounded"
        />
      </div>

      {/* List */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">{PrimaryKey}</th>
            <th className="border p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.{PrimaryKey}}>
              <td className="border p-2">
                <Link to={`/{entity}/${item.{PrimaryKey}}`}>
                  {item.{PrimaryKey}}
                </Link>
              </td>
              <td className="border p-2">{item.Description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        {page > 1 && (
          <Link to={`?page=${page - 1}&search=${search}`}>Previous</Link>
        )}
        <span>Page {page}</span>
        {items.length === 50 && (
          <Link to={`?page=${page + 1}&search=${search}`}>Next</Link>
        )}
      </div>
    </div>
  );
}
```

## Template: Web Detail Route

**File**: `packages/web1/app/routes/{entity}.$code.tsx`

```typescript
import { useLoaderData, Link } from "react-router";
import { data, redirect } from "react-router";
import type { Route } from "./+types/{entity}.$code";
import { createMWClient } from "~/lib/mw-client.server";

export async function loader({ params }: Route.LoaderArgs) {
  const { code } = params;
  if (!code) throw new Error("Code is required");

  const client = await createMWClient();

  const items = await client.smartExport("{Entity}", {
    exportFormat: "full",
    search: `{PrimaryKey}="${code}"`,
    limit: 1,
  });

  if (!items || items.length === 0) {
    throw new Response("Not Found", { status: 404 });
  }

  return data({ item: items[0] });
}

export default function {Entity}Detail() {
  const { item } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <Link to="/{entity}" className="text-blue-500 mb-4 inline-block">
        &larr; Back to {DisplayName}
      </Link>

      <h1 className="text-2xl font-bold mb-4">
        {item.{PrimaryKey}}: {item.Description}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold">Details</h2>
          <dl className="mt-2">
            <dt className="font-medium">{PrimaryKey}</dt>
            <dd>{item.{PrimaryKey}}</dd>

            <dt className="font-medium mt-2">Description</dt>
            <dd>{item.Description}</dd>

            {/* Add more fields */}
          </dl>
        </div>
      </div>
    </div>
  );
}
```

## Template: Routes Registration

**File**: `packages/web1/app/routes.ts`

```typescript
// Add these lines in the route array:
route("{entity}", "routes/{entity}.tsx"),
route("{entity}/:code", "routes/{entity}.$code.tsx"),
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
