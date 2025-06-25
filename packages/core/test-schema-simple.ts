#!/usr/bin/env bun

import { parseXMLWithSchema } from './src/xml/schema-parser';

const sampleXML = `<?xml version="1.0"?>
<table>
  <name>
    <Code>TEST001</Code>
    <Name>Test Company</Name>
    <TaxNumber>1234567890</TaxNumber>
    <CreditLimit>5000</CreditLimit>
    <LastModifiedTime>20250128143522</LastModifiedTime>
  </name>
</table>`;

async function test() {
  console.log('Testing parseXMLWithSchema...');
  
  try {
    const result = await parseXMLWithSchema(sampleXML, 'Name', 'xml-verbose');
    console.log('✓ Parse successful');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    // Check types
    const record = result[0];
    if (record) {
      console.log('\nType checks:');
      console.log(`- taxNumber: ${record.taxNumber} (${typeof record.taxNumber})`);
      console.log(`- creditLimit: ${record.creditLimit} (${typeof record.creditLimit})`);
      console.log(`- lastModifiedTime: ${record.lastModifiedTime} (${typeof record.lastModifiedTime})`);
    }
  } catch (error) {
    console.error('✗ Parse failed:', error);
  }
}

test();