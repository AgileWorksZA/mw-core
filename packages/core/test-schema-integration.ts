#!/usr/bin/env bun

/**
 * Test script for schema-aware XML parser integration
 */

import { MoneyWorksRESTClient } from './src/rest/client';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load config
const configPath = join(__dirname, '../../mw-config.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Create client
const client = new MoneyWorksRESTClient({
  ...config,
  debug: true,
});

async function testSchemaIntegration() {
  console.log('Testing schema-aware XML parser integration...\n');

  try {
    // Test 1: Export Name records
    console.log('Test 1: Exporting Name records...');
    const names = await client.export('Name', { 
      limit: 2,
      format: 'json', // This will use XML internally and parse with schema
    });
    
    if (typeof names === 'string') {
      console.error('Expected array, got string');
      return;
    }
    
    console.log(`✓ Exported ${names.length} Name records`);
    console.log('Sample Name record:', JSON.stringify(names[0], null, 2));
    
    // Check field types
    const name = names[0];
    if (name) {
      console.log('\nField type checks for Name:');
      console.log(`- code: ${typeof name.code} (should be string)`);
      console.log(`- taxNumber: ${typeof name.taxNumber} (should be string)`);
      console.log(`- creditCardNum: ${typeof name.creditCardNum} (should be string)`);
      console.log(`- lastModifiedTime: ${typeof name.lastModifiedTime} (should be string)`);
      console.log(`- creditLimit: ${typeof name.creditLimit} (should be number)`);
    }
    
    // Test 2: Export Transaction with Details
    console.log('\n\nTest 2: Exporting Transaction with Details...');
    const transactions = await client.export('Transaction', {
      limit: 1,
      filter: 'Details IS NOT NULL',
      format: 'json',
    });
    
    if (typeof transactions === 'string') {
      console.error('Expected array, got string');
      return;
    }
    
    console.log(`✓ Exported ${transactions.length} Transaction records`);
    
    const transaction = transactions[0];
    if (transaction) {
      console.log('Transaction fields:', Object.keys(transaction));
      
      // Check for details array
      if ('details' in transaction && Array.isArray(transaction.details)) {
        console.log(`\n✓ Transaction has ${transaction.details.length} detail lines`);
        
        const detail = transaction.details[0];
        if (detail) {
          console.log('Sample Detail record:', JSON.stringify(detail, null, 2));
          
          console.log('\nField type checks for Detail:');
          console.log(`- sequenceNumber: ${typeof detail.sequenceNumber} (should be string)`);
          console.log(`- parentSeq: ${typeof detail.parentSeq} (should be string)`);
          console.log(`- debit: ${typeof detail.debit} (should be number)`);
          console.log(`- credit: ${typeof detail.credit} (should be number)`);
        }
      } else {
        console.log('⚠️  No details found in transaction');
      }
    }
    
    console.log('\n✅ Schema integration tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testSchemaIntegration();