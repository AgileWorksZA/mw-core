#!/usr/bin/env bun

/**
 * Build the complete librarian index from collected file metadata
 */

interface FileMetadata {
  path: string;
  purpose: string;
  layer: string;
  domain: string;
  keyConcepts: string[];
  architecturalPatterns: string[];
  exports: {
    main: string | null;
    types: string[];
    functions: string[];
  };
  dependencies: {
    internal: string[];
    external: string[];
  };
  relatedFiles: string[];
  queries: string[];
  complexity: 'low' | 'medium' | 'high';
  importance: 'low' | 'medium' | 'high' | 'critical';
}

interface LibrarianIndex {
  metadata: {
    totalFiles: number;
    gitCommit: string;
    timestamp: string;
    version: string;
  };
  files: FileMetadata[];
  indexes: {
    byDomain: Record<string, string[]>;
    byLayer: Record<string, string[]>;
    byPattern: Record<string, string[]>;
    byConcept: Record<string, string[]>;
    byImportance: Record<string, string[]>;
    byComplexity: Record<string, string[]>;
  };
  conceptMap: Record<string, {
    description: string;
    primaryFiles: string[];
    relatedConcepts: string[];
  }>;
}

// This will be populated with all file metadata from the agents
const ALL_FILE_METADATA: FileMetadata[] = [];

function buildIndexes(files: FileMetadata[]) {
  const indexes = {
    byDomain: {} as Record<string, string[]>,
    byLayer: {} as Record<string, string[]>,
    byPattern: {} as Record<string, string[]>,
    byConcept: {} as Record<string, string[]>,
    byImportance: {} as Record<string, string[]>,
    byComplexity: {} as Record<string, string[]>,
  };

  for (const file of files) {
    // Index by domain
    if (!indexes.byDomain[file.domain]) indexes.byDomain[file.domain] = [];
    indexes.byDomain[file.domain].push(file.path);

    // Index by layer
    if (!indexes.byLayer[file.layer]) indexes.byLayer[file.layer] = [];
    indexes.byLayer[file.layer].push(file.path);

    // Index by patterns
    for (const pattern of file.architecturalPatterns) {
      if (!indexes.byPattern[pattern]) indexes.byPattern[pattern] = [];
      indexes.byPattern[pattern].push(file.path);
    }

    // Index by concepts
    for (const concept of file.keyConcepts) {
      if (!indexes.byConcept[concept]) indexes.byConcept[concept] = [];
      indexes.byConcept[concept].push(file.path);
    }

    // Index by importance
    if (!indexes.byImportance[file.importance]) indexes.byImportance[file.importance] = [];
    indexes.byImportance[file.importance].push(file.path);

    // Index by complexity
    if (!indexes.byComplexity[file.complexity]) indexes.byComplexity[file.complexity] = [];
    indexes.byComplexity[file.complexity].push(file.path);
  }

  return indexes;
}

function buildConceptMap(files: FileMetadata[]): Record<string, any> {
  const conceptMap: Record<string, any> = {};

  // Authentication & Security
  const authFiles = files.filter(f =>
    f.domain === 'auth' ||
    f.keyConcepts.some(c => c.toLowerCase().includes('auth') || c.toLowerCase().includes('token'))
  );
  if (authFiles.length > 0) {
    conceptMap['authentication'] = {
      description: 'Bearer token authentication, connection management, and client caching',
      primaryFiles: authFiles.map(f => f.path),
      relatedConcepts: ['JWT', 'Bearer tokens', 'Client caching', 'Connection lifecycle']
    };
  }

  // Data Access Layer
  const dataAccessFiles = files.filter(f => f.domain === 'data-access');
  if (dataAccessFiles.length > 0) {
    conceptMap['data-access'] = {
      description: 'MoneyWorks data client, parsers, repositories, and converters',
      primaryFiles: dataAccessFiles.filter(f => f.importance === 'critical').map(f => f.path),
      relatedConcepts: ['Smart client', 'Field discovery', 'Repository pattern', 'TSV parsing']
    };
  }

  // Canonical DSL
  const canonicalFiles = files.filter(f => f.domain === 'canonical');
  if (canonicalFiles.length > 0) {
    conceptMap['canonical-dsl'] = {
      description: 'Pure MoneyWorks type definitions preserving exact field names and terminology',
      primaryFiles: canonicalFiles.filter(f => f.importance === 'critical').map(f => f.path),
      relatedConcepts: ['Branded types', 'Tax rates', 'Names entity', 'Field metadata']
    };
  }

  // API Layer
  const apiFiles = files.filter(f => f.domain === 'api' && f.layer === 'routes');
  if (apiFiles.length > 0) {
    conceptMap['api-routes'] = {
      description: 'REST API endpoints for MoneyWorks data access and operations',
      primaryFiles: apiFiles.map(f => f.path),
      relatedConcepts: ['Elysia', 'Export formats', 'Schema discovery', 'Validation']
    };
  }

  return conceptMap;
}

async function main() {
  const gitCommit = Bun.spawnSync(['git', 'rev-parse', 'HEAD']).stdout.toString().trim();

  const index: LibrarianIndex = {
    metadata: {
      totalFiles: ALL_FILE_METADATA.length,
      gitCommit,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    },
    files: ALL_FILE_METADATA,
    indexes: buildIndexes(ALL_FILE_METADATA),
    conceptMap: buildConceptMap(ALL_FILE_METADATA)
  };

  await Bun.write(
    '.agent/librarian/index.json',
    JSON.stringify(index, null, 2)
  );

  console.log(`✅ Librarian index built successfully`);
  console.log(`   Files indexed: ${index.metadata.totalFiles}`);
  console.log(`   Git commit: ${index.metadata.gitCommit.substring(0, 8)}`);
  console.log(`   Domains: ${Object.keys(index.indexes.byDomain).join(', ')}`);
  console.log(`   Layers: ${Object.keys(index.indexes.byLayer).join(', ')}`);
  console.log(`   Patterns: ${Object.keys(index.indexes.byPattern).length}`);
  console.log(`   Concepts: ${Object.keys(index.indexes.byConcept).length}`);
}

main().catch(console.error);
