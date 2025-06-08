#!/usr/bin/env node

/**
 * CONFIGURATION DEBUG SCRIPT
 * 
 * Purpose: Verify MoneyWorks configuration file loading and validation
 * Created during: Authentication debugging session (previous session)
 * 
 * What this script does:
 * 1. Checks if mw-config.json exists in current directory
 * 2. Loads and parses the configuration file
 * 3. Displays configuration values with masked passwords
 * 4. Validates presence of required authentication fields
 * 
 * Used to verify:
 * - Configuration file path resolution
 * - JSON parsing works correctly
 * - All required fields are present
 * - Password fields are properly configured
 * 
 * Status: UTILITY - Basic config validation tool
 * Note: Safe to run - passwords are masked in output
 */
const fs = require('fs');
const path = require('path');

console.log('=== CONFIG DEBUG ===');
console.log('Current working directory:', process.cwd());
console.log('Expected config path:', path.join(process.cwd(), 'mw-config.json'));
console.log('Config file exists:', fs.existsSync(path.join(process.cwd(), 'mw-config.json')));

if (fs.existsSync(path.join(process.cwd(), 'mw-config.json'))) {
  const configData = fs.readFileSync(path.join(process.cwd(), 'mw-config.json'), 'utf8');
  const config = JSON.parse(configData);
  console.log('Config loaded successfully:');
  console.log('  Host:', config.host);
  console.log('  Port:', config.port);
  console.log('  Username:', config.username);
  console.log('  Password:', config.password ? '***' + config.password.slice(-3) : 'MISSING');
  console.log('  Folder Auth:', config.folderAuth ? 'YES' : 'NO');
  if (config.folderAuth) {
    console.log('    Folder Name:', config.folderAuth.folderName);
    console.log('    Folder Password:', config.folderAuth.password ? '***' + config.folderAuth.password.slice(-3) : 'MISSING');
  }
}