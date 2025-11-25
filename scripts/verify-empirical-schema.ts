#!/usr/bin/env node
/**
 * Empirical Schema Verification Script
 *
 * Purpose: Verify mw-core canonical ontology against empirical API data
 * Input: /Users/hjonck/Development/gitprojects/AgileWorksZA/ai_cfo_poc/mpoc/data/moneyworks-schemas/2025-11-25_full-schema_now.json
 * Output: Verification report with discrepancies
 *
 * TASK-010: API Schema Validation
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EmpiricalTable {
  name: string;
  fields: string[];
  fieldCount: number;
  sampleRecord?: Record<string, any>;
}

interface EmpiricalSchema {
  metadata: {
    extractedAt: string;
    environment: string;
    tableCount: number;
    totalFields: number;
  };
  tables: EmpiricalTable[];
}

interface OntologyField {
  fieldName: string;
  dataType: string;
  maxLength?: number;
  canonicalDescription?: string;
  isRequired?: boolean;
  isIndexed?: boolean;
}

interface VerificationResult {
  entity: string;
  empiricalFieldCount: number;
  ontologyFieldCount: number;
  match: boolean;
  missingInOntology: string[];
  missingInEmpirical: string[];
  notes: string[];
}

// ============================================================================
// ENTITY NAME MAPPING
// ============================================================================

const ENTITY_MAPPING: Record<string, string> = {
  // Empirical name → mw-core ontology file
  'Account': 'moneyworks-accounts-canonical-ontology',
  'Name': 'moneyworks-names-canonical-ontology',
  'Product': 'moneyworks-products-canonical-ontology',
  'Job': 'moneyworks-jobs-canonical-ontology',
  'JobSheet': 'moneyworks-jobsheet-canonical-ontology',
  'Transaction': 'moneyworks-transactions-canonical-ontology',
  'Detail': 'moneyworks-detail-canonical-ontology',
  'TaxRate': 'moneyworks-taxrates-canonical-ontology',
  'Payments': 'moneyworks-payments-canonical-ontology',
  'Contacts': 'moneyworks-contacts-canonical-ontology',
  'Inventory': 'moneyworks-inventory-canonical-ontology',
  'Asset': 'moneyworks-assets-canonical-ontology',
  'AssetCat': 'moneyworks-assetcat-canonical-ontology',
  'AssetLog': 'moneyworks-assetlog-canonical-ontology',
  'Build': 'moneyworks-build-records-canonical-ontology',
  'Department': 'moneyworks-departments-canonical-ontology',
  'General': 'moneyworks-general-classifications-canonical-ontology',
  'Ledger': 'moneyworks-ledger-canonical-ontology',
  'BankRecs': 'moneyworks-reconciliation-canonical-ontology',
  'AutoSplit': 'moneyworks-allocations-canonical-ontology',
  'Memo': 'moneyworks-memo-canonical-ontology',
  'Login': 'moneyworks-login-canonical-ontology',
  'User': 'moneyworks-user-canonical-ontology',
  'User2': 'moneyworks-user2-canonical-ontology',
};

// ============================================================================
// FIELD EXTRACTION FUNCTIONS
// ============================================================================

function extractFieldsFromOntology(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract fields from MONEYWORKS_*_FIELDS array (with optional type annotation and 'as const')
  // Matches: export const MONEYWORKS_NAME_FIELDS = [...] as const; or export const MONEYWORKS_LEDGER_FIELDS: Type[] = [...]
  const fieldArrayMatch = content.match(/export const MONEYWORKS_\w+_FIELDS\s*(?::\s*[\w\[\]]+)?\s*=\s*\[([\s\S]*?)\]\s*(?:as const)?;/);

  if (!fieldArrayMatch) {
    console.warn(`⚠️  No MONEYWORKS_*_FIELDS array found in ${path.basename(filePath)}`);
    return [];
  }

  const fieldsContent = fieldArrayMatch[1];
  const fieldMatches = fieldsContent.matchAll(/fieldName:\s*["'](\w+)["']/g);

  return Array.from(fieldMatches, match => match[1]);
}

function normalizeFieldName(field: string): string {
  // MoneyWorks API returns PascalCase, but exports use lowercase
  // Normalize to PascalCase for comparison
  return field;
}

// ============================================================================
// VERIFICATION LOGIC
// ============================================================================

function verifyEntity(
  empiricalTable: EmpiricalTable,
  ontologyFilePath: string | null
): VerificationResult {
  const result: VerificationResult = {
    entity: empiricalTable.name,
    empiricalFieldCount: empiricalTable.fieldCount,
    ontologyFieldCount: 0,
    match: false,
    missingInOntology: [],
    missingInEmpirical: [],
    notes: []
  };

  if (!ontologyFilePath) {
    result.notes.push('❌ No ontology file mapped for this entity');
    return result;
  }

  if (!fs.existsSync(ontologyFilePath)) {
    result.notes.push(`❌ Ontology file not found: ${ontologyFilePath}`);
    return result;
  }

  // Extract fields from ontology
  const ontologyFields = extractFieldsFromOntology(ontologyFilePath);
  result.ontologyFieldCount = ontologyFields.length;

  // Normalize field names for comparison
  const empiricalFieldsSet = new Set(empiricalTable.fields.map(normalizeFieldName));
  const ontologyFieldsSet = new Set(ontologyFields.map(normalizeFieldName));

  // Find discrepancies
  result.missingInOntology = empiricalTable.fields.filter(
    field => !ontologyFieldsSet.has(normalizeFieldName(field))
  );

  result.missingInEmpirical = ontologyFields.filter(
    field => !empiricalFieldsSet.has(normalizeFieldName(field))
  );

  // Check if counts match
  result.match = result.empiricalFieldCount === result.ontologyFieldCount &&
                 result.missingInOntology.length === 0 &&
                 result.missingInEmpirical.length === 0;

  // Add summary notes
  if (result.match) {
    result.notes.push('✅ Perfect match');
  } else {
    if (result.empiricalFieldCount !== result.ontologyFieldCount) {
      const diff = result.empiricalFieldCount - result.ontologyFieldCount;
      result.notes.push(`⚠️  Field count mismatch: ${diff > 0 ? '+' : ''}${diff}`);
    }
    if (result.missingInOntology.length > 0) {
      result.notes.push(`❌ ${result.missingInOntology.length} fields missing in ontology`);
    }
    if (result.missingInEmpirical.length > 0) {
      result.notes.push(`⚠️  ${result.missingInEmpirical.length} ontology fields not in empirical data`);
    }
  }

  return result;
}

// ============================================================================
// MAIN VERIFICATION
// ============================================================================

async function main() {
  console.log('🔍 MoneyWorks Empirical Schema Verification');
  console.log('='.repeat(80));
  console.log();

  // Load empirical schema
  const empiricalSchemaPath = '/Users/hjonck/Development/gitprojects/AgileWorksZA/ai_cfo_poc/mpoc/data/moneyworks-schemas/2025-11-25_full-schema_now.json';

  if (!fs.existsSync(empiricalSchemaPath)) {
    console.error(`❌ Empirical schema not found: ${empiricalSchemaPath}`);
    process.exit(1);
  }

  const empiricalSchema: EmpiricalSchema = JSON.parse(
    fs.readFileSync(empiricalSchemaPath, 'utf-8')
  );

  console.log(`📊 Empirical Schema Metadata:`);
  console.log(`   Extracted: ${empiricalSchema.metadata.extractedAt}`);
  console.log(`   Environment: ${empiricalSchema.metadata.environment}`);
  console.log(`   Tables: ${empiricalSchema.metadata.tableCount}`);
  console.log(`   Total Fields: ${empiricalSchema.metadata.totalFields}`);
  console.log();

  // Verify each entity
  const results: VerificationResult[] = [];
  const generatedDir = path.join(__dirname, '../generated');

  for (const table of empiricalSchema.tables) {
    const ontologyFileName = ENTITY_MAPPING[table.name];
    const ontologyFilePath = ontologyFileName
      ? path.join(generatedDir, `${ontologyFileName}.ts`)
      : null;

    const result = verifyEntity(table, ontologyFilePath);
    results.push(result);
  }

  // Display results
  console.log('📋 Verification Results:');
  console.log('='.repeat(80));
  console.log();

  const priorityEntities = ['Name', 'Product', 'Job', 'Account', 'Transaction', 'Detail'];

  // Show priority entities first
  console.log('🎯 Priority Entities:');
  console.log();

  for (const entityName of priorityEntities) {
    const result = results.find(r => r.entity === entityName);
    if (result) {
      displayResult(result);
    }
  }

  console.log();
  console.log('📦 Other Entities:');
  console.log();

  for (const result of results) {
    if (!priorityEntities.includes(result.entity)) {
      displayResult(result);
    }
  }

  // Summary statistics
  console.log();
  console.log('📊 Summary:');
  console.log('='.repeat(80));

  const perfectMatches = results.filter(r => r.match).length;
  const totalEntities = results.length;
  const matchRate = ((perfectMatches / totalEntities) * 100).toFixed(1);

  console.log(`   Perfect Matches: ${perfectMatches}/${totalEntities} (${matchRate}%)`);
  console.log(`   Entities with discrepancies: ${totalEntities - perfectMatches}`);

  const totalMissingInOntology = results.reduce((sum, r) => sum + r.missingInOntology.length, 0);
  const totalMissingInEmpirical = results.reduce((sum, r) => sum + r.missingInEmpirical.length, 0);

  console.log(`   Total fields missing in ontology: ${totalMissingInOntology}`);
  console.log(`   Total ontology fields not in empirical: ${totalMissingInEmpirical}`);
  console.log();

  // Write detailed report
  const reportPath = path.join(__dirname, '../moneyworks-ontology/EMPIRICAL_VERIFICATION_REPORT.md');
  writeDetailedReport(results, reportPath);

  console.log(`📄 Detailed report written to: ${reportPath}`);
  console.log();
}

function displayResult(result: VerificationResult) {
  const icon = result.match ? '✅' : '⚠️ ';
  console.log(`${icon} ${result.entity.padEnd(20)} | Empirical: ${result.empiricalFieldCount.toString().padStart(3)} | Ontology: ${result.ontologyFieldCount.toString().padStart(3)}`);

  if (!result.match) {
    result.notes.forEach(note => {
      console.log(`      ${note}`);
    });
  }
}

function writeDetailedReport(results: VerificationResult[], outputPath: string) {
  let report = `# MoneyWorks Empirical Schema Verification Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n`;
  report += `**Task:** TASK-010 - API Schema Validation\n\n`;
  report += `## Executive Summary\n\n`;

  const perfectMatches = results.filter(r => r.match).length;
  const totalEntities = results.length;
  const matchRate = ((perfectMatches / totalEntities) * 100).toFixed(1);

  report += `- **Perfect Matches:** ${perfectMatches}/${totalEntities} (${matchRate}%)\n`;
  report += `- **Entities with Discrepancies:** ${totalEntities - perfectMatches}\n\n`;

  report += `## Detailed Results\n\n`;

  for (const result of results) {
    report += `### ${result.entity}\n\n`;
    report += `- **Empirical Field Count:** ${result.empiricalFieldCount}\n`;
    report += `- **Ontology Field Count:** ${result.ontologyFieldCount}\n`;
    report += `- **Match:** ${result.match ? '✅ Yes' : '❌ No'}\n\n`;

    if (result.missingInOntology.length > 0) {
      report += `**Missing in Ontology (${result.missingInOntology.length}):**\n`;
      result.missingInOntology.forEach(field => {
        report += `- \`${field}\`\n`;
      });
      report += `\n`;
    }

    if (result.missingInEmpirical.length > 0) {
      report += `**In Ontology but Not in Empirical (${result.missingInEmpirical.length}):**\n`;
      result.missingInEmpirical.forEach(field => {
        report += `- \`${field}\`\n`;
      });
      report += `\n`;
    }

    if (result.notes.length > 0) {
      report += `**Notes:**\n`;
      result.notes.forEach(note => {
        report += `- ${note}\n`;
      });
      report += `\n`;
    }

    report += `---\n\n`;
  }

  fs.writeFileSync(outputPath, report);
}

// Run verification
main().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
