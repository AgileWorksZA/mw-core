/**
 * Export Format Converters for MoneyWorks Data
 *
 * @moneyworks-dsl PURE
 * @ai-instruction These converters transform between different export formats
 * @ai-critical Maintain field order and data integrity during conversions
 */
/**
 * Convert array data to object format using field information
 *
 * @param data - Raw array data from MoneyWorks TSV export
 * @param fields - Field information from discovery
 * @returns Array of objects with proper field names
 *
 * @example
 * const arrays = [["GST10", "1400", "2400", ...]];
 * const fields = [{ name: "TaxCode", position: 0, ... }];
 * const objects = arrayToObject(arrays, fields);
 * // Result: [{ TaxCode: "GST10", PaidAccount: "1400", ... }]
 */
export function arrayToObject(data, fields) {
    return data.map(row => {
        const obj = {};
        fields.forEach(field => {
            const value = row[field.position];
            obj[field.name] = parseFieldValue(value, field.dataType);
        });
        return obj;
    });
}
/**
 * Convert object data to array format using field information
 *
 * @param data - Object data with field names
 * @param fields - Field information for ordering
 * @returns Array of arrays in correct field order
 *
 * @example
 * const objects = [{ TaxCode: "GST10", PaidAccount: "1400", ... }];
 * const arrays = objectToArray(objects, fields);
 * // Result: [["GST10", "1400", "2400", ...]]
 */
export function objectToArray(data, fields) {
    return data.map(obj => {
        const row = new Array(fields.length);
        fields.forEach(field => {
            row[field.position] = formatFieldValue(obj[field.name], field.dataType);
        });
        return row;
    });
}
/**
 * Add header row to array data
 *
 * @param data - Array data without headers
 * @param fields - Field information
 * @returns Array data with header row as first element
 *
 * @example
 * const data = [["GST10", "1400", ...]];
 * const withHeaders = addHeaders(data, fields);
 * // Result: [["TaxCode", "PaidAccount", ...], ["GST10", "1400", ...]]
 */
export function addHeaders(data, fields) {
    const headers = fields
        .sort((a, b) => a.position - b.position)
        .map(f => f.name);
    return [headers, ...data];
}
/**
 * Enrich data with schema information
 *
 * @param data - Object data
 * @param structure - Table structure with field metadata
 * @param table - Table name
 * @returns Schema-enriched export format
 *
 * @example
 * const enriched = enrichWithSchema(data, structure, "TaxRate");
 * // Result: { schema: {...}, data: [...], metadata: {...} }
 */
export function enrichWithSchema(data, structure, table) {
    const schema = {};
    structure.fields.forEach(field => {
        schema[field.name] = {
            type: field.dataType,
            maxLength: field.maxLength,
            required: field.required,
            description: field.description || `MoneyWorks ${table} field: ${field.name}`
        };
    });
    return {
        schema,
        data,
        metadata: {
            table,
            exportedAt: new Date().toISOString(),
            recordCount: data.length
        }
    };
}
/**
 * Parse field value based on data type
 * @private
 */
function parseFieldValue(value, dataType) {
    if (value === '' || value === null || value === undefined) {
        return dataType === 'string' ? '' : null;
    }
    switch (dataType) {
        case 'number':
            const str = String(value);
            return str.includes('.') ? parseFloat(str) : parseInt(str, 10);
        case 'boolean':
            return value === '1' || value === 1 || value === true;
        case 'date':
            return value; // Keep as YYYYMMDD string
        default:
            return String(value);
    }
}
/**
 * Format field value for array export
 * @private
 */
function formatFieldValue(value, dataType) {
    if (value === null || value === undefined) {
        return '';
    }
    switch (dataType) {
        case 'boolean':
            return value ? '1' : '0';
        case 'date':
            return value || ''; // Already in YYYYMMDD format
        default:
            return String(value);
    }
}
/**
 * Convert between export formats
 *
 * @param data - Input data in any supported format
 * @param fromFormat - Current format of the data
 * @param toFormat - Desired output format
 * @param structure - Table structure (required for conversions)
 * @returns Data in the requested format
 *
 * @ai-instruction This is the main conversion function
 * @example
 * const objects = convertExportFormat(arrays, 'compact', 'full', structure);
 */
export function convertExportFormat(data, fromFormat, toFormat, structure, table) {
    // If formats are the same, return as-is
    if (fromFormat === toFormat) {
        return data;
    }
    // First, normalize to object format
    let objects;
    switch (fromFormat) {
        case 'compact':
            objects = arrayToObject(data, structure.fields);
            break;
        case 'compact-headers':
            // Skip header row
            const dataWithoutHeaders = data.slice(1);
            objects = arrayToObject(dataWithoutHeaders, structure.fields);
            break;
        case 'full':
            objects = data;
            break;
        case 'schema':
            objects = data.data;
            break;
        default:
            throw new Error(`Unsupported source format: ${fromFormat}`);
    }
    // Then convert to target format
    switch (toFormat) {
        case 'compact':
            return objectToArray(objects, structure.fields);
        case 'compact-headers':
            const arrays = objectToArray(objects, structure.fields);
            return addHeaders(arrays, structure.fields);
        case 'full':
            return objects;
        case 'schema':
            return enrichWithSchema(objects, structure, table || 'Unknown');
        default:
            throw new Error(`Unsupported target format: ${toFormat}`);
    }
}
