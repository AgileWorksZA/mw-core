/**
 * Example: Using the Smart MoneyWorks Client
 *
 * This shows how the field discovery infrastructure works
 * to handle any MoneyWorks table without hardcoded mappings
 */
import { createSmartClient } from '../client/moneyworks-smart-client';
async function example() {
    // Configuration
    const config = {
        host: 'localhost',
        port: 6710,
        protocol: 'http',
        dataFile: 'acme.moneyworks',
        username: 'Herman Geldenhuys',
        password: ''
    };
    // Create smart client
    const client = createSmartClient(config);
    // Example 1: Export any table without knowing its structure
    console.log('=== Example 1: Smart Export ===');
    // First time: Will fetch 1 record as XML to discover fields
    const taxRates = await client.smartExport('TaxRate', { limit: 10 });
    console.log('Exported', taxRates.length, 'tax rates');
    console.log('First record:', taxRates[0]);
    // Second time: Uses cached structure, goes straight to TSV
    const moreTaxRates = await client.smartExport('TaxRate', {
        search: 'Rate1 > 0'
    });
    console.log('Filtered export found', moreTaxRates.length, 'records');
    // Example 2: Pre-discover multiple tables at startup
    console.log('\n=== Example 2: Pre-discovery ===');
    await client.preDiscoverTables(['Account', 'Transaction', 'Name']);
    console.log('Pre-discovered 3 tables');
    // Now exports will be fast (no XML discovery needed)
    const accounts = await client.smartExport('Account', { limit: 5 });
    console.log('Got', accounts.length, 'accounts');
    // Example 3: Inspect discovered structure
    console.log('\n=== Example 3: Field Structure ===');
    const structure = client.getFieldStructure('TaxRate');
    if (structure) {
        console.log('TaxRate has', structure.fields.length, 'fields:');
        structure.fields.forEach(field => {
            console.log(`  ${field.position}: ${field.name} (${field.dataType})`);
        });
    }
    // Example 4: Export with specific format
    console.log('\n=== Example 4: Format Control ===');
    // Get XML for integration with other systems
    const xmlData = await client.exportWithFormat('TaxRate', 'xml-verbose', {
        limit: 1
    });
    console.log('XML export:', typeof xmlData === 'string' ?
        xmlData.substring(0, 200) + '...' : 'unexpected format');
    // Get TSV for maximum performance (no field names)
    const tsvData = await client.exportWithFormat('TaxRate', 'tsv', {
        limit: 1
    });
    console.log('TSV export (raw arrays):', tsvData);
}
// Run example
if (require.main === module) {
    example()
        .then(() => console.log('Done'))
        .catch(console.error);
}
