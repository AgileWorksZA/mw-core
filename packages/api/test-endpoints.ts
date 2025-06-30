#!/usr/bin/env bun
/**
 * Test script for new API endpoints
 */

const BASE_URL = 'http://localhost:3000/api/v1';

async function testEndpoint(name: string, url: string, options?: RequestInit) {
  console.log(`\n=== Testing ${name} ===`);
  console.log(`URL: ${url}`);
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    console.log(`Response:`, JSON.stringify(data, null, 2));
    
    return { success: response.ok, data };
  } catch (error) {
    console.error(`Error:`, error);
    return { success: false, error };
  }
}

async function main() {
  // Test company endpoint
  await testEndpoint('Company Info', `${BASE_URL}/company`);
  
  // Test company fields
  await testEndpoint('Company Fields', `${BASE_URL}/company/fields`);
  
  // Test i18n languages
  await testEndpoint('I18n Languages', `${BASE_URL}/i18n/languages`);
  
  // Test UI translations
  await testEndpoint('UI Translations (EN)', `${BASE_URL}/i18n/translations/en`);
  await testEndpoint('UI Translations (FR)', `${BASE_URL}/i18n/translations/fr`);
  
  // Test field labels
  await testEndpoint('TaxRate Labels (EN)', `${BASE_URL}/tables/TaxRate/labels`);
  await testEndpoint('TaxRate Labels (FR)', `${BASE_URL}/tables/TaxRate/labels?lang=fr`);
  
  // Test eval template
  await testEndpoint('Eval Template', `${BASE_URL}/eval/template/TaxRate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template: '[Code] - [Description] (Rate: [Rate]%)',
      limit: 5
    })
  });
  
  // Test basic eval
  await testEndpoint('Eval Expression', `${BASE_URL}/eval`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      expression: '1 + 1'
    })
  });
}

main().catch(console.error);