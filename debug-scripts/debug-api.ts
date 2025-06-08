#!/usr/bin/env bun

/**
 * API SERVICE DEBUG SCRIPT
 * 
 * Purpose: Test MoneyWorks API service configuration and basic functionality
 * Created during: Authentication debugging session (previous session)
 * 
 * What this script does:
 * 1. Loads MoneyWorks configuration from mw-config.json
 * 2. Creates MoneyWorksApiService instance with loaded config
 * 3. Tests basic expression evaluation (1+1)
 * 4. Tests name table export with XML format
 * 
 * Used to verify:
 * - Configuration loading works correctly
 * - API service can connect to MoneyWorks DataCentre
 * - Authentication headers are properly formatted
 * - Basic API operations function as expected
 * 
 * Status: WORKING - This was used to validate fixes
 * Dependencies: Requires mw-config.json with correct credentials
 */
import { loadMoneyWorksConfig } from "./src/config/moneyworks.config";
import { MoneyWorksApiService } from "./src/services/moneyworks-api.service";

console.log('=== API SERVICE DEBUG ===');

// Load config
const config = loadMoneyWorksConfig();
console.log('Config loaded:');
console.log('  Host:', config.host);
console.log('  Port:', config.port);
console.log('  Username:', config.username);
console.log('  Password:', config.password ? '***' + config.password.slice(-3) : 'MISSING');
console.log('  DataFile:', config.dataFile);
console.log('  Folder Auth:', config.folderAuth ? 'YES' : 'NO');

// Create API service
const api = new MoneyWorksApiService(config);

// Test simple expression (this should work based on our previous tests)
console.log('\n=== TESTING SIMPLE EXPRESSION ===');
try {
  const result = await api.evaluate("1+1");
  console.log('✅ Expression "1+1" =', result);
} catch (error) {
  console.log('❌ Expression failed:', error.message);
}

// Test name table export (this is what the API endpoint does)
console.log('\n=== TESTING NAME TABLE EXPORT ===');
try {
  const result = await api.export("name", { limit: 3, format: "xml-verbose" });
  console.log('✅ Name export succeeded:');
  console.log('  Records found:', result.data.length);
  console.log('  Total records:', result.pagination.total);
  console.log('  Sample record:', result.data[0] ? Object.keys(result.data[0]).slice(0, 3) : 'No records');
} catch (error) {
  console.log('❌ Name export failed:', error.message);
}