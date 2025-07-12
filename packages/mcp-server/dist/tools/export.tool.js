/**
 * MoneyWorks Export Tool for MCP
 *
 * @moneyworks-dsl PURE
 */
// Currently vetted entities
const VETTED_ENTITIES = [
    "TaxRate",
    "Account",
    "Transaction",
    "Name",
    "Product",
    "Job",
    "Contact",
    "Department",
    "General",
    "Inventory",
    "Payment",
];
export const exportTool = {
    definition: {
        name: "mw_export",
        description: "Export data from MoneyWorks tables",
        inputSchema: {
            type: "object",
            properties: {
                table: {
                    type: "string",
                    description: "Table name to export from",
                    enum: VETTED_ENTITIES,
                },
                exportFormat: {
                    type: "string",
                    description: "Export format: compact, compact-headers, full, schema",
                    enum: ["compact", "compact-headers", "full", "schema"],
                    default: "full",
                },
                filter: {
                    type: "string",
                    description: "MoneyWorks filter expression (e.g., \"TaxCode='GST10'\")",
                },
                limit: {
                    type: "number",
                    description: "Maximum number of records to return",
                    minimum: 1,
                    maximum: 10000,
                },
                offset: {
                    type: "number",
                    description: "Number of records to skip",
                    minimum: 0,
                },
                orderBy: {
                    type: "string",
                    description: "Field to order results by",
                },
            },
            required: ["table"],
        },
    },
    async handler(client, params) {
        const { table, exportFormat = "full", filter, limit, offset, orderBy, } = params;
        // Validate table is vetted
        if (!VETTED_ENTITIES.includes(table)) {
            throw new Error(`Table '${table}' is not yet available. Currently available: ${VETTED_ENTITIES.join(", ")}`);
        }
        try {
            const data = await client.smartExport(table, {
                exportFormat,
                search: filter,
                limit,
                offset,
                sort: orderBy,
            });
            // Calculate record count
            let recordCount = 0;
            if (Array.isArray(data)) {
                recordCount = data.length;
            }
            else if (data && typeof data === "object" && "data" in data) {
                recordCount = Array.isArray(data.data) ? data.data.length : 0;
            }
            const result = {
                data,
                recordCount,
                format: typeof exportFormat === 'string' ? exportFormat : 'custom',
                table,
            };
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    }],
            };
        }
        catch (error) {
            throw new Error(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    },
};
