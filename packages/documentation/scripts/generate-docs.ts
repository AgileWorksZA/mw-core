#!/usr/bin/env bun

/**
 * Documentation generator script
 * Analyzes source packages and generates documentation content
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, relative } from "path";
import { existsSync } from "fs";
import { TypeScriptExtractor } from "./extract-types";

const PACKAGES_DIR = join(process.cwd(), "..");
const CONTENT_DIR = join(process.cwd(), "content", "packages");

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  repository?: string;
  exports: any;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function analyzePackage(packageName: string): Promise<PackageInfo | null> {
  const packagePath = join(PACKAGES_DIR, packageName);
  const packageJsonPath = join(packagePath, "package.json");
  
  try {
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));
    
    console.log(`📦 Analyzing ${packageName}...`);
    
    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description || "",
      repository: packageJson.repository,
      exports: packageJson.exports || {},
      dependencies: packageJson.dependencies,
      devDependencies: packageJson.devDependencies,
    };
  } catch (error) {
    console.error(`❌ Failed to analyze ${packageName}:`, error);
    return null;
  }
}

async function generatePackageContent(packageName: string, info: PackageInfo) {
  const packageContentDir = join(CONTENT_DIR, packageName);
  await ensureDir(packageContentDir);
  
  // Extract TypeScript information
  let apiData: {
    functions: any[];
    types: any[];
    constants: any[];
  } = {
    functions: [],
    types: [],
    constants: [],
  };
  
  try {
    const packagePath = join(PACKAGES_DIR, packageName);
    const extractor = new TypeScriptExtractor(packagePath);
    apiData = await extractor.extractFromIndex();
    console.log(`  ✓ Extracted ${apiData.functions.length} functions, ${apiData.types.length} types, ${apiData.constants.length} constants`);
  } catch (error) {
    console.warn(`  ⚠️  Could not extract TypeScript info:`, error);
  }
  
  // Generate overview.mdx
  const overviewContent = `---
title: "${info.name}"
description: "${info.description}"
version: "${info.version}"
package: "${packageName}"
---

# ${info.name}

<PackageInfo 
  npm="${info.name}"
  github="moneyworks/core/packages/${packageName}"
  version="${info.version}"
/>

## Overview

${info.description}

## Installation

<Tabs defaultValue="bun">
  <TabsList>
    <TabsTrigger value="bun">Bun</TabsTrigger>
    <TabsTrigger value="npm">npm</TabsTrigger>
    <TabsTrigger value="yarn">Yarn</TabsTrigger>
  </TabsList>
  <TabsContent value="bun">
    \`\`\`bash
    bun add ${info.name}
    \`\`\`
  </TabsContent>
  <TabsContent value="npm">
    \`\`\`bash
    npm install ${info.name}
    \`\`\`
  </TabsContent>
  <TabsContent value="yarn">
    \`\`\`bash
    yarn add ${info.name}
    \`\`\`
  </TabsContent>
</Tabs>

## API Overview

${apiData.functions.length > 0 ? `### Functions

${apiData.functions.slice(0, 5).map(f => `- **${f.name}** - ${f.description || 'No description'}`).join('\n')}

${apiData.functions.length > 5 ? `...and ${apiData.functions.length - 5} more functions` : ''}` : ''}

${apiData.types.length > 0 ? `### Types

${apiData.types.slice(0, 5).map(t => `- **${t.name}** (${t.kind}) - ${t.description || 'No description'}`).join('\n')}

${apiData.types.length > 5 ? `...and ${apiData.types.length - 5} more types` : ''}` : ''}

See the [API Reference](/packages/${packageName}/api) for complete documentation.
`;
  
  await writeFile(join(packageContentDir, "overview.mdx"), overviewContent);
  console.log(`  ✓ Generated overview.mdx`);
  
  // Generate api.json
  await writeFile(
    join(packageContentDir, "api.json"), 
    JSON.stringify(apiData, null, 2)
  );
  console.log(`  ✓ Generated api.json`);
}

async function main() {
  console.log("🚀 Starting documentation generation...\n");
  
  await ensureDir(CONTENT_DIR);
  
  // Get all packages
  const packages = ["utilities", "data", "canonical", "web1"];
  
  for (const pkg of packages) {
    const info = await analyzePackage(pkg);
    if (info) {
      await generatePackageContent(pkg, info);
    }
  }
  
  console.log("\n✅ Documentation generation complete!");
}

main().catch(console.error);