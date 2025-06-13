#!/usr/bin/env bun

// Direct import to test
import { parseXMLWithSchema } from './src/xml/schema-parser';

console.log('parseXMLWithSchema function imported:', typeof parseXMLWithSchema);

// Also test from main export
import { parseXMLWithSchema as parseFromMain } from './src/export-import';

console.log('parseXMLWithSchema from main export:', typeof parseFromMain);

console.log('✓ Schema parser successfully integrated!');