/**
 * Smart MoneyWorks Client Test
 *
 * Tests the field discovery infrastructure
 */
import { describe, test, expect, beforeAll } from 'bun:test';
import { createSmartClient } from './moneyworks-smart-client';
import { loadConfig } from '../config/index';
describe('SmartMoneyWorksClient', () => {
    let client;
    beforeAll(async () => {
        const config = await loadConfig('../../mw-config.json');
        client = createSmartClient(config);
    });
    test('should discover fields and export tax rates', async () => {
        // Act - Smart export will discover fields automatically
        const taxRates = await client.smartExport('TaxRate', { limit: 5 });
        // Assert
        expect(taxRates).toBeDefined();
        expect(Array.isArray(taxRates)).toBe(true);
        expect(taxRates.length).toBeGreaterThan(0);
        // Verify structure
        const firstRate = taxRates[0];
        expect(firstRate).toHaveProperty('TaxCode');
        expect(firstRate).toHaveProperty('Rate1');
        expect(firstRate).toHaveProperty('Rate2');
        console.log('Smart export results:', {
            count: taxRates.length,
            firstRecord: firstRate
        });
    });
    test('should use cached structure on second export', async () => {
        // First export already done above
        // Act - Second export should use cache
        const startTime = Date.now();
        const taxRates = await client.smartExport('TaxRate', { limit: 10 });
        const endTime = Date.now();
        // Assert - Should be fast (no XML discovery)
        expect(taxRates.length).toBeGreaterThan(0);
        expect(endTime - startTime).toBeLessThan(1000); // Should be under 1 second
        console.log(`Second export took ${endTime - startTime}ms`);
    });
    test('should inspect field structure', async () => {
        // Act - Get discovered structure
        const structure = client.getFieldStructure('TaxRate');
        // Assert
        expect(structure).toBeDefined();
        expect(structure.tableName).toBe('TaxRate');
        expect(structure.fields.length).toBeGreaterThan(10);
        // Verify key fields
        const taxCodeField = structure.fields.find(f => f.name === 'TaxCode');
        expect(taxCodeField).toBeDefined();
        expect(taxCodeField.dataType).toBe('string');
        const rate1Field = structure.fields.find(f => f.name === 'Rate1');
        expect(rate1Field).toBeDefined();
        expect(rate1Field.dataType).toBe('number');
        console.log('Discovered field structure:', {
            fieldCount: structure.fields.length,
            sampleFields: structure.fields.slice(0, 5)
        });
    });
});
