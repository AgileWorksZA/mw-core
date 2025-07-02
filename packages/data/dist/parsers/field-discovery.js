/**
 * MoneyWorks Field Discovery
 *
 * Since MoneyWorks TSV exports have NO headers, we must discover
 * field names and order from XML exports. This is the only way
 * to dynamically determine the structure of any table.
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This is critical infrastructure for parsing MoneyWorks data
 */
import { parseMoneyWorksXML, extractFieldOrder, xmlFieldToPascalCase } from '../parsers/xml/moneyworks-xml-parser';
import { getTSVFieldMapping } from '../parsers/moneyworks-field-mappings';
/**
 * Field structure cache to avoid repeated XML requests
 * In production, this could be persisted to disk/database
 */
const fieldStructureCache = new Map();
/**
 * Discover field structure for a MoneyWorks table
 *
 * @ai-instruction MoneyWorks only provides field names in XML format
 * @param client - MoneyWorks REST client
 * @param tableName - Table to discover (e.g., 'TaxRate')
 * @param useCache - Whether to use cached structure if available
 * @returns Table structure with field names and positions
 */
export async function discoverTableStructure(client, tableName, useCache = true) {
    // Check cache first
    if (useCache && fieldStructureCache.has(tableName)) {
        return fieldStructureCache.get(tableName);
    }
    // Check if we have a predefined TSV mapping
    const tsvMapping = getTSVFieldMapping(tableName);
    if (tsvMapping) {
        // Use predefined mapping
        const structure = {
            tableName,
            fields: tsvMapping.map(field => ({
                name: field.pascalName,
                position: field.position,
                dataType: field.dataType
            })),
            discoveredAt: new Date()
        };
        // Cache the structure
        fieldStructureCache.set(tableName, structure);
        return structure;
    }
    // Otherwise, discover from XML
    const xmlData = await client.export(tableName, {
        format: 'xml-verbose',
        limit: 1
    });
    if (typeof xmlData !== 'string') {
        throw new Error('Expected XML string response for field discovery');
    }
    // Parse the XML to extract field names
    const structure = parseXMLStructure(xmlData, tableName);
    // Cache the structure
    fieldStructureCache.set(tableName, structure);
    return structure;
}
/**
 * Parse XML to extract field structure using proper parser
 */
function parseXMLStructure(xml, tableName) {
    // Use the proper XML parser
    const { records, fieldNames } = parseMoneyWorksXML(xml);
    if (records.length === 0) {
        throw new Error(`No records found for table ${tableName}`);
    }
    // Extract field order from XML
    const xmlFieldOrder = extractFieldOrder(xml);
    const sampleRecord = records[0];
    // Build field info with proper order and types
    const fields = xmlFieldOrder.map((xmlFieldName, position) => {
        const pascalFieldName = xmlFieldToPascalCase(xmlFieldName);
        const value = sampleRecord[xmlFieldName] || '';
        const dataType = inferDataType(value);
        return {
            name: pascalFieldName,
            position,
            dataType
        };
    });
    // Convert sample record to PascalCase
    const pascalSampleRecord = {};
    for (const [key, value] of Object.entries(sampleRecord)) {
        const pascalKey = xmlFieldToPascalCase(key);
        pascalSampleRecord[pascalKey] = parseValue(value, fields.find(f => f.name === pascalKey)?.dataType || 'string');
    }
    return {
        tableName,
        fields,
        discoveredAt: new Date(),
        sampleRecord: pascalSampleRecord
    };
}
/**
 * Infer data type from field value
 */
function inferDataType(value) {
    if (value === '')
        return 'string';
    // Boolean
    if (value === '0' || value === '1') {
        return 'boolean';
    }
    // Date (YYYYMMDD format)
    if (/^\d{8}$/.test(value)) {
        return 'date';
    }
    // Number (including decimals)
    if (/^-?\d+(\.\d+)?$/.test(value)) {
        return 'number';
    }
    return 'string';
}
/**
 * Parse value based on inferred type
 */
function parseValue(value, dataType) {
    if (value === '')
        return null;
    switch (dataType) {
        case 'boolean':
            return value === '1';
        case 'number':
            return parseFloat(value);
        case 'date':
            // Keep as string for YYYYMMDD format
            return value;
        default:
            return value;
    }
}
/**
 * Clear the field structure cache
 */
export function clearFieldCache() {
    fieldStructureCache.clear();
}
/**
 * Get cached structure if available
 */
export function getCachedStructure(tableName) {
    return fieldStructureCache.get(tableName);
}
/**
 * Build TSV headers array from table structure
 * This creates the headers array needed for TSV parsing
 */
export function buildTSVHeaders(structure) {
    return structure.fields
        .sort((a, b) => a.position - b.position)
        .map(field => field.name);
}
