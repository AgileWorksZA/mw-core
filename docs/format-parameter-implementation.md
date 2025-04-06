# Format Parameter Implementation Specification

This document provides a detailed specification for implementing the `format` parameter across all table routes and services. The `format` parameter allows clients to specify which fields they want to retrieve from a table, in the exact order they request.

## Requirements

The `format` parameter implementation requires changes to:

1. Route files - Add the format parameter to query parameters
2. Service files - Add field validation and passing to the MoneyWorks API
3. Data conversion - Add a new method to handle custom field formats

## 1. Changes to Route Files

Update each table route file following this pattern:

```typescript
// Example: src/routes/tables/asset.routes.ts

import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { AssetService } from "../../services/tables/asset.service";
import { assetObject } from "../../types/constants.eden";
import { AssetMany } from "../../types/eden/tables/Asset";
import { type Asset, AssetFields } from "../../types/interface/tables/asset";

// Initialize the asset service with configuration
const config = loadMoneyWorksConfig();
const assetService = new AssetService(config);

export const assetRoutes = new Elysia({ prefix: "/api" }).get(
  "/assets",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;

    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await assetService.getAssets({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Asset>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /assets:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(assetObject),
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Assets",
      description: `Get all assets. Search by: ${AssetFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/assets?format=SequenceNumber,Code,Description`,
    },
    tags: ["Assets"],
    response: AssetMany,
  },
);
```

Specifically add:

1. Extract the `format` parameter from the query
2. Split it by commas to get an array of field names
3. Add `format: t.Optional(t.String())` to the query schema
4. Update the description to include information about the format parameter

## 2. Changes to Service Files

Update each table service file following this pattern:

```typescript
// Example: src/services/tables/asset.service.ts

import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { 
  type Asset, 
  type AssetField, 
  AssetFields
} from "../../types/interface/tables/asset";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/asset-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Asset table
 * Assets represent fixed assets in the system
 */
export class AssetService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToAssetUsingFields(
    fields: AssetField[],
    data: ANY,
  ): Asset {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Asset record`,
        );
      }
      const value = enforceType(data[key], schema[key as keyof typeof schema] as "string");
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Asset);
  }

  dataCenterJsonToAsset(data: ANY): Asset {
    return AssetFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Asset record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Asset);
  }

  /**
   * Get assets from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed asset data with pagination metadata
   */
  async getAssets(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Asset>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[]; // Array of field names to include in the response
  }) {
    // Validate fields against AssetFields if provided
    if (params.fields && params.fields.length > 0) {
      for (const field of params.fields) {
        if (!AssetFields.includes(field as AssetField)) {
          throw new Error(
            `Invalid field '${field}' for Asset table. Valid fields are: ${AssetFields.join(", ")}`,
          );
        }
      }
    }

    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Asset> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("asset", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to asset objects
      const assets = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToAssetUsingFields(
              params.fields as AssetField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToAsset);

      return {
        data: assets,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
  }
}
```

Specifically add:

1. Add a new method `dataCenterJsonToXxxUsingFields` that maps data based on specified fields
2. Add the `fields` parameter to the method signature
3. Validate fields against the table's field list
4. Pass the fields to the MoneyWorks API
5. Use the appropriate data mapper based on whether fields were specified

## 3. Type Definition Updates

For each table, ensure the interface file has an exported type for field names:

```typescript
// Example: src/types/interface/tables/asset.ts

export type AssetField = keyof Asset;
```

## Implementation Notes

1. **Format parameter format:**
   - The format parameter should be a comma-separated list of field names
   - Example: `?format=SequenceNumber,Code,Description`

2. **Error handling:**
   - Invalid field names should result in a clear error message
   - The error should list valid field names for reference

3. **Response format:**
   - The response will contain only the requested fields in the order specified
   - Empty or null fields will be represented as `null` in the response

4. **Eden schema updates:**
   - Change the response schema definition to use `t.Partial(TableOne)` instead of `TableOne`
   - Example: `data: t.Array(t.Partial(AssetOne))` instead of `data: t.Array(AssetOne)`
   - This is necessary to validate partial objects when only specific fields are requested

## Testing

For each implemented table, test the following scenarios:

1. **Single field:**
   - Request a single numeric field (e.g., `?format=SequenceNumber`)
   - Request a single text field (e.g., `?format=Description`)

2. **Multiple fields:**
   - Request a combination of fields (e.g., `?format=Code,Description,Type`)
   - Request fields in a different order than the default

3. **Edge cases:**
   - Invalid field names
   - Empty format parameter
   - Format parameter with spaces or other special characters

## Summary of Changes From Asset to Account

To implement the format parameter, the following changes were made to the Account routes and service compared to the Asset implementation:

1. **Route Changes:**
   - Added format parameter to the query destructuring
   - Added parsing of the format parameter as comma-separated values
   - Added format to the query schema definition
   - Updated the description to include information about the format parameter

2. **Service Changes:**
   - Added a new method `dataCenterJsonToAccountUsingFields` for custom field mapping
   - Added field validation against AccountFields
   - Updated mwParams to include fields and set format conditionally
   - Updated the data mapping to use the appropriate mapper based on whether fields were specified
   - Added proper handling of empty string values as null
   - Fixed type safety by using `schema[key as keyof typeof schema]` instead of `schema[key]` when indexing into the schema object

3. **Schema Changes:**
   - Updated the Eden schema to use `t.Partial(TableOne)` instead of `TableOne`
   - This allows validation to succeed when only a subset of fields is returned

4. **Fixed Issues:**
   - Added support for special parsing of single-field results like SequenceNumber and Code
   - Enhanced MoneyWorksApiService to parse custom field format responses
   - Added handling for various field types (numeric, text, code)