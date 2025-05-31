# Custom Field Format Parameter

This document outlines the implementation of the `format` query parameter for table endpoints, which allows clients to specify which fields they want to retrieve in a specific order.

## Overview

The `format` parameter accepts an array of field names that should be included in the response. MoneyWorks will only return data for the specified fields in the exact order requested. This provides several benefits:

1. **Reduced payload size** - Only request the fields you need
2. **Optimized client processing** - Simplify front-end code by receiving data in the expected format
3. **Flexible field selection** - Dynamically decide which fields to retrieve
4. **Custom field ordering** - Control the order of fields in the response

## Implementation Details

### API Request

Clients can specify the `format` parameter in two ways:

1. **Single field**: `?format=Code`
2. **Multiple fields**: `?format=Code&format=Description&format=Type`

### Backend Processing

For each table, the implementation follows these steps:

1. Extract the `format` parameter from the query and convert it to an array of field names
2. Validate each field name against the table's field list (e.g., `AccountFields`)
3. Pass the validated fields to the service layer
4. In the service layer, convert the fields to a MoneyWorks-specific format string
5. Use TSV format with custom field headers rather than XML format
6. Parse the response and return the data with the requested fields

### MoneyWorks Format Specification

When sending field names to MoneyWorks DataCentre, we format them as follows:

```
format=[FieldName1]\t[FieldName2]\t[FieldName3]
```

For Detail table, which is special and attached to the Transaction table:

```
format=[Detail:FieldName1]\t[Detail:FieldName2]\t[Detail:FieldName3]
```

The square brackets and tab characters must be properly URL-encoded when sent in an HTTP request.

## Implementation Template for Other Tables

To add the format parameter to a table endpoint:

1. Update the table service to accept and validate fields:

```typescript
async getTableData(params: {
  limit?: number;
  offset?: number;
  search?: Partial<TableType>;
  sort?: string;
  order?: "asc" | "desc";
  fields?: string[]; // Array of field names to include
}) {
  // Validate fields against TableFields if provided
  if (params.fields && params.fields.length > 0) {
    for (const field of params.fields) {
      if (!TableFields.includes(field as any)) {
        throw new Error(`Invalid field '${field}' for Table. Valid fields are: ${TableFields.join(', ')}`);
      }
    }
  }

  // Convert API params to MoneyWorks params
  const mwParams: MoneyWorksQueryParams<TableType> = {
    limit: params.limit,
    start: params.offset,
    search: params.search,
    sort: params.sort,
    direction: params.order === "desc" ? "descending" : "ascending",
    format: params.fields ? undefined : "xml-verbose",
    fields: params.fields,
  };

  // Call MoneyWorks API
  const { data, pagination } = await this.api.export("tableName", mwParams);

  // Use the appropriate data mapper based on whether fields were specified
  const tableData = params.fields
    ? data as unknown as TableType[]
    : data.map(this.dataCenterJsonToTableData);

  return {
    data: tableData,
    pagination,
  };
}
```

2. Update the route handler to accept the format parameter:

```typescript
export const tableRoutes = new Elysia({ prefix: "/api" }).get(
  "/tablename",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    
    // Parse the format parameter as an array of field names if provided
    const fields = format ? (Array.isArray(format) ? format : [format]) : undefined;

    try {
      return await tableService.getTableData({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<TableType>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /tablename:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(tableObject),
      format: t.Optional(t.Union([t.String(), t.Array(t.String())])),
    }),
    detail: {
      summary: "Table Name",
      description: `Get all table data. Search by: ${TableFields.join(", ")}. 
      Optionally specify field names with "format" parameter to retrieve only specific fields.
      Example: /api/tablename?format=Field1&format=Field2`,
    },
    tags: ["Category"],
    response: TableMany,
  },
);
```

## Special Case: Detail Table

For the Detail table, which is handled differently in MoneyWorks, use the "transaction" table as the export table, but prefix all field names with "Detail:":

```typescript
// In MoneyWorksApiService.buildQueryParams:
const formatStr = params.fields
  .map(field => {
    if (parent) {
      return `[${parent}:${field}]`;
    }
    return `[${field}]`;
  })
  .join("\\t");
```

## Example Usage

### Request

```
GET /api/accounts?format=Code&format=Description&format=Type&limit=5
```

### Response

```json
{
  "data": [
    {
      "Code": "1000",
      "Description": "Sales Revenue",
      "Type": "S"
    },
    {
      "Code": "1100",
      "Description": "Cost of Goods Sold",
      "Type": "C"
    },
    ...
  ],
  "pagination": {
    "total": 100,
    "limit": 5,
    "offset": 0,
    "next": 5,
    "prev": 0
  }
}
```