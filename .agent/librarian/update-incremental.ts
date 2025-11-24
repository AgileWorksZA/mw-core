#!/usr/bin/env bun
/**
 * Librarian Incremental Update (mw-core)
 *
 * Re-indexes specific files that changed during a session.
 * Called from the Stop hook or `/loom:complete` with the list of edited files.
 *
 * Performance: ~180 tokens per file with Haiku = fast & cheap
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface FileMetadata {
  path: string;
  purpose: string;
  layer: 'schema' | 'repository' | 'controller' | 'route' | 'component' | 'service' | 'util' | 'config';
  domain: string;
  keyConcepts: string[];
  architecturalPatterns: string[];
  complexity: 'low' | 'medium' | 'high';
  importance: 'low' | 'medium' | 'high' | 'critical';
}

interface Shard {
  domain?: string;
  layer?: string;
  fileCount: number;
  files: FileMetadata[];
}

/**
 * Analyze a single file and extract metadata
 */
function analyzeFile(filePath: string, cwd: string): FileMetadata | null {
  if (!isIndexedFile(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(join(cwd, filePath), 'utf-8');

    const layer = inferLayer(filePath);
    const domain = inferDomain(filePath);
    const complexity = inferComplexity(content);
    const importance = inferImportance(filePath, layer);
    const keyConcepts = extractKeyConcepts(content);
    const architecturalPatterns = extractPatterns(content);
    const purpose = extractPurpose(filePath, content);

    return {
      path: filePath,
      purpose,
      layer,
      domain,
      keyConcepts,
      architecturalPatterns,
      complexity,
      importance
    };
  } catch (error) {
    console.error(`[Librarian] Failed to analyze ${filePath}:`, error);
    return null;
  }
}

/**
 * Check if file should be indexed
 */
function isIndexedFile(path: string): boolean {
  // MoneyWorks Core file structure
  if (path.startsWith('packages/canonical/') && path.endsWith('.ts')) return true;
  if (path.startsWith('packages/data/') && path.endsWith('.ts')) return true;
  if (path.startsWith('packages/api/') && path.endsWith('.ts')) return true;
  if (path.startsWith('packages/web1/app/') && (path.endsWith('.ts') || path.endsWith('.tsx'))) return true;
  if (path.startsWith('packages/utilities/') && path.endsWith('.ts')) return true;

  // Exclude tests
  if (path.includes('.test.ts')) return false;
  if (path.includes('.spec.ts')) return false;

  return false;
}

/**
 * Infer layer from file path
 */
function inferLayer(path: string): FileMetadata['layer'] {
  if (path.includes('/entities/') && path.includes('/types.ts')) return 'schema';
  if (path.includes('/entities/') && !path.includes('types.ts')) return 'schema';
  if (path.includes('/repositories/')) return 'repository';
  if (path.includes('/controllers/')) return 'controller';
  if (path.includes('/parsers/')) return 'util';
  if (path.includes('/app/routes/')) return 'route';
  if (path.includes('/app/components/')) return 'component';
  if (path.includes('/app/services/')) return 'service';
  if (path.includes('/lib/')) return 'util';
  if (path.includes('/utilities/')) return 'util';
  if (path.includes('/config/')) return 'config';
  return 'util';
}

/**
 * Infer domain from file path
 */
function inferDomain(path: string): string {
  // Canonical entities
  if (path.includes('/entities/products/')) return 'products';
  if (path.includes('/entities/accounts/')) return 'accounts';
  if (path.includes('/entities/names/')) return 'names';
  if (path.includes('/entities/tax-rates/')) return 'tax-rates';
  if (path.includes('/entities/transactions/')) return 'transactions';

  // Data layer
  if (path.includes('/repositories/product')) return 'products';
  if (path.includes('/repositories/account')) return 'accounts';
  if (path.includes('/repositories/name')) return 'names';
  if (path.includes('/repositories/tax-rate')) return 'tax-rates';

  // API layer
  if (path.includes('/controllers/product')) return 'products';
  if (path.includes('/controllers/account')) return 'accounts';
  if (path.includes('/controllers/name')) return 'names';
  if (path.includes('/controllers/tax-rate')) return 'tax-rates';

  // Frontend routes
  if (path.includes('/routes/products')) return 'products';
  if (path.includes('/routes/accounts')) return 'accounts';
  if (path.includes('/routes/names')) return 'names';
  if (path.includes('/routes/tax-rates')) return 'tax-rates';

  // General categories
  if (path.startsWith('packages/canonical/')) return 'canonical';
  if (path.startsWith('packages/data/')) return 'data-access';
  if (path.startsWith('packages/api/')) return 'api';
  if (path.startsWith('packages/web1/')) return 'frontend';
  if (path.startsWith('packages/utilities/')) return 'utilities';

  return 'core';
}

/**
 * Infer complexity from content
 */
function inferComplexity(content: string): FileMetadata['complexity'] {
  const lines = content.split('\n').length;
  const hasComplex = content.includes('Repository') || content.includes('Controller') || content.includes('export class');

  if (lines > 300 || hasComplex) return 'high';
  if (lines > 100) return 'medium';
  return 'low';
}

/**
 * Infer importance from path and layer
 */
function inferImportance(path: string, layer: FileMetadata['layer']): FileMetadata['importance'] {
  if (path.includes('/index.ts') && path.includes('/entities/')) return 'critical';
  if (layer === 'schema' || layer === 'repository') return 'high';
  if (layer === 'controller' || layer === 'route') return 'high';
  if (path.includes('/utilities/')) return 'high';
  return 'medium';
}

/**
 * Extract key concepts from content
 */
function extractKeyConcepts(content: string): string[] {
  const concepts: string[] = [];

  if (content.includes('MoneyWorks')) concepts.push('MoneyWorks');
  if (content.includes('branded type') || content.includes('Branded<')) concepts.push('branded-types');
  if (content.includes('BaseMoneyWorksRepository')) concepts.push('repository-pattern');
  if (content.includes('BaseTableController')) concepts.push('controller-pattern');
  if (content.includes('canonical') || content.includes('@moneyworks-dsl')) concepts.push('canonical-dsl');
  if (content.includes('TSV') || content.includes('CSV')) concepts.push('data-parsing');
  if (content.includes('field discovery') || content.includes('XML')) concepts.push('field-discovery');

  return concepts.slice(0, 5);
}

/**
 * Extract architectural patterns
 */
function extractPatterns(content: string): string[] {
  const patterns: string[] = [];

  if (content.includes('BaseMoneyWorksRepository')) patterns.push('Repository pattern');
  if (content.includes('BaseTableController')) patterns.push('Controller pattern');
  if (content.includes('smartExport')) patterns.push('Multi-format export');
  if (content.includes('prepare()') && content.includes('postProcess()')) patterns.push('Data transformation');
  if (content.includes('validateAccount') || content.includes('validate')) patterns.push('Validation pattern');
  if (content.includes('MW_') && content.includes('_TERMS')) patterns.push('Canonical terminology');

  return patterns;
}

/**
 * Extract purpose from file path and content
 */
function extractPurpose(path: string, content: string): string {
  // Try JSDoc
  const jsdocMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/);
  if (jsdocMatch) {
    return jsdocMatch[1].trim();
  }

  // Fallback from path
  const fileName = path.split('/').pop()?.replace('.ts', '').replace('.tsx', '');
  return `${fileName} implementation`;
}

/**
 * Update a shard with new/updated file metadata
 */
function updateShard(shardPath: string, metadata: FileMetadata, cwd: string): void {
  const fullPath = join(cwd, '.agent/librarian', shardPath);

  if (!existsSync(fullPath)) {
    console.warn(`[Librarian] Shard not found: ${shardPath} (will be created on next full rebuild)`);
    return;
  }

  try {
    const shard: Shard = JSON.parse(readFileSync(fullPath, 'utf-8'));

    // Remove old entry if exists
    shard.files = shard.files.filter(f => f.path !== metadata.path);

    // Add new entry
    shard.files.push(metadata);

    // Update count
    shard.fileCount = shard.files.length;

    // Write back
    writeFileSync(fullPath, JSON.stringify(shard, null, 2));

    console.log(`[Librarian] Updated ${shardPath}`);
  } catch (error) {
    console.error(`[Librarian] Failed to update ${shardPath}:`, error);
  }
}

/**
 * Main entry point
 */
export async function updateIncrementalLibrarian(editedFiles: string[], cwd: string): Promise<number> {
  console.log(`[Librarian] Checking ${editedFiles.length} edited files...`);

  let updated = 0;
  const shardsToUpdate = new Set<string>();

  for (const file of editedFiles) {
    const metadata = analyzeFile(file, cwd);

    if (!metadata) {
      continue; // Skip non-indexed files
    }

    // Update domain shard
    const domainShard = `shards/domain-${metadata.domain}.json`;
    updateShard(domainShard, metadata, cwd);
    shardsToUpdate.add(domainShard);

    // Update layer shard
    const layerShard = `shards/layer-${metadata.layer}.json`;
    updateShard(layerShard, metadata, cwd);
    shardsToUpdate.add(layerShard);

    updated++;
  }

  if (updated > 0) {
    console.log(`[Librarian] ✅ Updated ${updated} files across ${shardsToUpdate.size} shards`);
  } else {
    console.log(`[Librarian] No indexed files changed`);
  }

  return updated;
}

// CLI mode: if run directly
if (import.meta.main) {
  const files = process.argv.slice(2);
  const cwd = process.cwd();

  if (files.length === 0) {
    console.log('Usage: bun update-incremental.ts <file1> <file2> ...');
    process.exit(1);
  }

  const updated = await updateIncrementalLibrarian(files, cwd);
  console.log(`\n[Librarian] Processed ${files.length} files, updated ${updated} in index`);
  process.exit(0);
}
