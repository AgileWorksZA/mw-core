# MoneyWorks REST API Patterns

## 1. Authentication & Connection (URL Construction)
MoneyWorks Datacentre does not use standard `Authorization: Basic` headers for its REST API. Instead, it embeds credentials into the URL path.

### The Pattern
**Format**: `http://{host}:{port}/REST/{username}:{password}@{datafile}/{endpoint}`

### TypeScript Implementation
```typescript
const encodedDataFile = config.dataFile.replace(/\//g, "%2f"); // Handle subfolders
const encodedUsername = encodeURIComponent(config.username);
const encodedPassword = encodeURIComponent(config.password || "");

const baseUrl = `${protocol}://${host}:${port}/REST/${encodedUsername}:${encodedPassword}@${encodedDataFile}`;
```

> **Warning**: Do not put the password in the Header. It must be in the URL.

---

## 2. The "Hybrid Export" Pattern (Performance)
MoneyWorks offers two main export formats:
*   **XML (`xml-verbose`)**: Includes field names and metadata. **Slow** for large datasets.
*   **TSV (`tsv`)**: Raw tab-separated values. **Fast** but has no headers (just values).

To get the best of both worlds (Type Safety + Performance), use the **Hybrid Discovery Pattern**.

### The Recipe
1.  **Discovery Phase**: Fetch **1 record** using `format=xml-verbose`.
    *   Parse the XML to get the list of field names and their order.
    *   Cache this "Schema" in memory.
2.  **Bulk Phase**: Fetch **all records** using `format=tsv` (Default).
    *   You get a raw array of arrays.
3.  **Hydration Phase**: Map the raw TSV arrays to objects using the cached Schema.

### Why?
TSV is orders of magnitude faster to generate and parse than XML, but brittle if columns change. This pattern creates a robust, high-performance client.

```typescript
// Pseudo-code
async function smartExport(table) {
  // 1. Check cache
  let schema = cache.get(table);
  
  if (!schema) {
     // 2. Discovery (Low overhead, 1 record)
     const xml = await fetch(`${baseUrl}/export?table=${table}&format=xml-verbose&limit=1`);
     schema = parseXmlSchema(xml); // Extract field names
     cache.set(table, schema);
  }

  // 3. Bulk Fetch (High speed)
  const tsv = await fetch(`${baseUrl}/export?table=${table}&format=tsv`);
  
  // 4. Hydrate
  return tsv.split('\n').map(line => {
     const values = line.split('\t');
     return schema.fields.reduce((obj, field, i) => {
        obj[field] = values[i];
        return obj;
     }, {});
  });
}
```

---

## 3. Error Handling Heuristics
MoneyWorks REST API sometimes returns a `200 OK` status even when an error occurs (especially for expression evaluation or search errors). It returns the error message as plain text in the body.

### The Recipe
Check the response body for specific "Error Signatures" before attempting to parse.

```typescript
const responseText = await response.text();
const trimmed = responseText.trim();

// Signature 1: "could not understand" (Search syntax error)
if (trimmed.startsWith("could not understand")) throw new Error(trimmed);

// Signature 2: "Bad search expression"
if (trimmed.includes("Bad search expression")) throw new Error(trimmed);

// Signature 3: "Expression optimisation failed"
if (trimmed.includes("Expression optimisation failed")) throw new Error(trimmed);

// Signature 4: Single word response that isn't data
// (Valid TSV/XML usually contains tabs or brackets)
if (
    !trimmed.includes("\t") && 
    !trimmed.includes("<") && 
    trimmed.length > 0 &&
    trimmed.indexOf(" ") === -1
) {
    // Likely an error code like "error" or "failed"
    throw new Error(`MoneyWorks Error: ${trimmed}`);
}
```

---

## 4. Data Type Conversion
MoneyWorks TSV exports everything as strings. You need to convert them based on the discovered type.

| MoneyWorks Type | TSV Value | Conversion Logic |
|-----------------|-----------|------------------|
| **Boolean** | `"1"` or `"0"` | `val === "1"` |
| **Date** | `"20231231"` | Keep as string (it sorts correctly) or parse YYYY, MM, DD. |
| **Number** | `"123.45"` | `parseFloat(val)` |
| **Empty** | `""` (Empty String) | `null` or `undefined` (depending on preference). |

### Date Handling Tip
MoneyWorks dates are often 8-digit integers (`20231231`).
*   **To JS Date**: `new Date(y, m-1, d)`
*   **Comparisons**: You can compare them directly as numbers/strings (`20240101 > 20231231`).
