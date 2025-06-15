import { spawn } from 'child_process';
import { promisify } from 'util';

const execCommand = promisify(spawn);

// List of all MoneyWorks tables to generate
const MONEYWORKS_TABLES = [
  // Core business tables
  'names',
  'accounts',
  'products',
  'transactions',
  'jobs',
  'contacts',
  'assets',
  'departments',
  'inventory',
  'job-sheet-items',
  'tax-rate',
  // Authentication & security tables
  'login',
  'user',
  'user2',
  // Financial transaction tables
  'payments',
  'reconciliation',
  'auto-split',
  // Asset management tables
  'asset-log',
  'asset-categories',
  // Multi-currency & off-ledger
  'offledger',
  // Manufacturing & inventory
  'build',
  // CRM & documentation
  'memo',
  // Configuration tables
  'general',
  // Transaction subfiles
  'detail'
];

export default {
  name: "mw-generate-all-table-types",
  description: "Generate TypeScript interfaces for all MoneyWorks tables",
  
  async execute(args) {
    const results = {
      generated: [],
      failed: [],
      skipped: [],
    };
    
    // Allow filtering tables via argument
    const tablesToGenerate = args.tables 
      ? args.tables.split(',').map(t => t.trim().toLowerCase())
      : MONEYWORKS_TABLES;
    
    // Validate requested tables
    const invalidTables = tablesToGenerate.filter(t => !MONEYWORKS_TABLES.includes(t));
    if (invalidTables.length > 0) {
      results.skipped = invalidTables;
    }
    
    const validTables = tablesToGenerate.filter(t => MONEYWORKS_TABLES.includes(t));
    
    console.log(`🚀 Generating TypeScript interfaces for ${validTables.length} MoneyWorks tables...`);
    
    // Process tables sequentially to avoid overwhelming the system
    for (const table of validTables) {
      console.log(`\n📋 Processing table: ${table}`);
      
      try {
        // Call the individual table generation command
        // Note: This is a conceptual approach - the actual implementation
        // depends on how Claude commands can be invoked programmatically
        const commandResult = await callClaudeCommand('mw-generate-table-types', {
          table: table
        });
        
        if (commandResult.success) {
          results.generated.push(table);
          console.log(`✅ Successfully generated types for ${table}`);
        } else {
          results.failed.push({ table, error: commandResult.error });
          console.error(`❌ Failed to generate types for ${table}: ${commandResult.error}`);
        }
      } catch (error) {
        results.failed.push({ table, error: error.message });
        console.error(`❌ Error processing ${table}: ${error.message}`);
      }
      
      // Small delay between tables to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Summary report
    console.log('\n📊 Generation Summary:');
    console.log(`✅ Successfully generated: ${results.generated.length} tables`);
    if (results.generated.length > 0) {
      console.log(`   ${results.generated.join(', ')}`);
    }
    
    if (results.failed.length > 0) {
      console.log(`❌ Failed: ${results.failed.length} tables`);
      results.failed.forEach(f => {
        console.log(`   ${f.table}: ${f.error}`);
      });
    }
    
    if (results.skipped.length > 0) {
      console.log(`⏭️  Skipped (invalid): ${results.skipped.length} tables`);
      console.log(`   ${results.skipped.join(', ')}`);
    }
    
    // Return structured results
    return {
      summary: {
        total: validTables.length,
        generated: results.generated.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
      },
      details: results,
      instructions: [
        "Next steps:",
        "1. Review the generated interfaces in packages/core/src/tables/",
        "2. Run 'bun run typecheck' to ensure all types are valid",
        "3. Update the index.ts file to export all new table types",
        "4. Run tests to verify the generated types work correctly"
      ]
    };
  }
};

// Helper function to call another Claude command
// This is a placeholder - the actual implementation depends on Claude's command system
async function callClaudeCommand(commandName, args) {
  // In practice, this would need to interface with Claude's command execution system
  // For now, we'll return a placeholder that indicates the conceptual approach
  return {
    success: false,
    error: "Command chaining requires Claude's internal command execution API"
  };
}