#!/usr/bin/env bun

import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

// Get entity name from command line
const entityName = process.argv[2];
if (!entityName) {
  console.error('Usage: create-canonical-entity <entity-name>');
  console.error('Example: create-canonical-entity accounts');
  process.exit(1);
}

// Convert to different cases
const kebabCase = entityName.toLowerCase().replace(/\s+/g, '-');
const pascalCase = entityName
  .split(/[-_\s]+/)
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join('');
const camelCase = pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
const upperSnakeCase = entityName.toUpperCase().replace(/[-\s]+/g, '_');
const titleCase = entityName
  .split(/[-_\s]+/)
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(' ');

// Base path for the entity
const basePath = join(process.cwd(), 'packages/canonical/src/entities', kebabCase);

// Create directory
await mkdir(basePath, { recursive: true });

// Template for enums.ts
const enumsContent = `/**
 * MoneyWorks ${titleCase} Enumerations
 * 
 * @moneyworks-entity ${pascalCase}
 * @moneyworks-dsl PURE
 * @ai-instruction Use ONLY these enum values when working with MoneyWorks ${kebabCase}
 * @ai-critical NEVER create your own ${kebabCase}-related enums or use generic terms
 */

/**
 * MoneyWorks ${titleCase} Type Enumeration
 * Source: moneyworks_appendix_${kebabCase.replace(/-/g, '_')}.html
 * 
 * @ai-instruction When discussing ${titleCase} types, ALWAYS use these values
 * @ai-forbidden [Add forbidden generic terms here]
 * @ai-required [Add required MW terms here]
 */
export enum MoneyWorks${pascalCase}Type {
  /**
   * [Add type description]
   * @moneyworks-value "[value]"
   * @ai-term Say "[MW term]", NEVER "[generic term]"
   */
  // Add enum values here
}

// Add more enums as needed for this entity`;

// Template for types.ts
const typesContent = `/**
 * MoneyWorks ${titleCase} Type Definitions
 * 
 * @moneyworks-entity ${pascalCase}
 * @moneyworks-table ${pascalCase}
 * @moneyworks-manual moneyworks_appendix_${kebabCase.replace(/-/g, '_')}.html
 * @moneyworks-dsl PURE
 * 
 * @ai-instruction USE ONLY MoneyWorks field names. NEVER translate to generic business terms.
 * @ai-forbidden [Add forbidden generic terms]
 * @ai-required [Add required MW field names]
 */

import { YYYYMMDD, AccountCode, NameCode } from '@moneyworks/utilities';
// Import enums from this entity
// import { MoneyWorks${pascalCase}Type } from './enums';

/**
 * MoneyWorks ${titleCase} Entity
 * 
 * [Add critical MW concept description]
 * 
 * @ai-critical [Add critical terminology notes]
 * @ai-context [Add context about MW usage]
 */
export interface MoneyWorks${pascalCase} {
  /**
   * [Field description from manual]
   * @moneyworks-field [FieldName]
   * @moneyworks-type [T/N/D/B/S/E]([length])
   * @ai-term ALWAYS use "[FieldName]", NEVER "[generic term]"
   * @example "[example value]"
   */
  // Add fields here based on the canonical ontology
}

/**
 * MoneyWorks ${titleCase} creation input
 * Only required fields for creating a new ${camelCase}
 * 
 * @ai-instruction When creating ${kebabCase}, use this interface
 */
export interface MoneyWorks${pascalCase}CreateInput {
  // Add required fields only
}

/**
 * MoneyWorks ${titleCase} update input
 * All fields optional except primary key for identification
 * 
 * @ai-instruction When updating ${kebabCase}, use this interface
 */
export interface MoneyWorks${pascalCase}UpdateInput {
  // Add fields with primary key required
}`;

// Template for fields.ts
const fieldsContent = `/**
 * MoneyWorks ${titleCase} Field Definitions
 * 
 * @moneyworks-entity ${pascalCase}
 * @moneyworks-manual moneyworks_appendix_${kebabCase.replace(/-/g, '_')}.html
 * @ai-instruction Use these field definitions as the source of truth for ${pascalCase} fields
 * @ai-critical NEVER add fields not listed here. These are ALL the ${pascalCase} fields.
 */

import { MoneyWorksDataType, MoneyWorksFieldMetadata } from '../../common/data-types';

/**
 * Complete field definitions for MoneyWorks ${titleCase} entity
 * Source: moneyworks_appendix_${kebabCase.replace(/-/g, '_')}.html - ${titleCase} Field Descriptions
 * 
 * @ai-instruction When describing ${pascalCase} fields, reference this constant
 * @ai-example Say "[FieldName] is a [Type] field (X) with max length Y" not "[FieldName] is a string"
 */
export const MONEYWORKS_${upperSnakeCase}_FIELDS: readonly MoneyWorksFieldMetadata[] = [
  // Copy field definitions from the canonical ontology file
  // Example:
  // {
  //   fieldName: "Code",
  //   dataType: MoneyWorksDataType.TEXT,
  //   maxLength: 7,
  //   canonicalDescription: "The account code",
  //   manualSource: "moneyworks_appendix_${kebabCase.replace(/-/g, '_')}.html",
  //   isRequired: true,
  //   isIndexed: true
  // },
] as const;

/**
 * Get field metadata by field name
 * 
 * @ai-instruction Use this to get exact field specifications
 */
export function getFieldMetadata(fieldName: string): MoneyWorksFieldMetadata | undefined {
  return MONEYWORKS_${upperSnakeCase}_FIELDS.find(f => f.fieldName === fieldName);
}

/**
 * Get all required fields
 * 
 * @ai-instruction These are the minimum fields needed to create a ${pascalCase}
 */
export function getRequiredFields(): readonly MoneyWorksFieldMetadata[] {
  return MONEYWORKS_${upperSnakeCase}_FIELDS.filter(f => f.isRequired);
}

/**
 * Get all indexed fields
 * 
 * @ai-instruction These fields can be used for efficient lookups
 */
export function getIndexedFields(): readonly MoneyWorksFieldMetadata[] {
  return MONEYWORKS_${upperSnakeCase}_FIELDS.filter(f => f.isIndexed);
}`;

// Template for .ai-schema.json
const aiSchemaContent = `{
  "entity": "MoneyWorks ${titleCase}",
  "tableName": "${pascalCase}",
  "manualSource": "moneyworks_appendix_${kebabCase.replace(/-/g, '_')}.html",
  "instruction": "CRITICAL: Use ONLY MoneyWorks terminology. Never use generic terms.",
  "ubiquitousLanguage": {
    "ALWAYS_USE": {
      "entity": "${pascalCase} (singular) or ${titleCase} (plural)",
      "primaryKey": "[Primary key field name]",
      "fields": {
        "[FieldName]": "[Field description] - NEVER '[generic term]'"
      },
      "concepts": {
        "[concept]": "[MoneyWorks-specific explanation]"
      }
    },
    "NEVER_USE": [
      "[List generic terms to avoid]"
    ]
  },
  "examples": {
    "CORRECT": [
      "[Example of correct MW language usage]"
    ],
    "INCORRECT": [
      "❌ [Example of incorrect generic language]"
    ]
  },
  "queryExamples": {
    "CORRECT": [
      "Find ${pascalCase} where [Field]='[value]'"
    ],
    "INCORRECT": [
      "❌ Find [generic term] where [wrong field name]='[value]'"
    ]
  },
  "aiResponseRules": [
    "ALWAYS prefix field names with '${pascalCase}.' when unclear",
    "NEVER translate MW terms to 'friendly' business language",
    "NEVER suggest field names not in the official field list"
  ],
  "contextualGuidance": {
    "whenDiscussing[Topic]": "[MW-specific guidance]"
  }
}`;

// Template for terms.ts
const termsContent = `/**
 * MoneyWorks ${titleCase} Canonical Terminology
 * 
 * @moneyworks-entity ${pascalCase}
 * @moneyworks-dsl PURE
 * @ai-instruction This is the DEFINITIVE terminology map for ${pascalCase} concepts
 * @ai-critical ALWAYS use the MoneyWorks term (key), NEVER the description
 */

/**
 * MoneyWorks ${titleCase} canonical terms mapping
 * Keys = MoneyWorks canonical terms (USE THESE)
 * Values = Explanatory descriptions (for understanding only)
 * 
 * @ai-rule When speaking about ${kebabCase}, use the KEY not the value
 * @example Say "[MW term]" not "[description]"
 */
export const MONEYWORKS_${upperSnakeCase}_CANONICAL_TERMS = {
  // === Entity and Structure Terms ===
  "${pascalCase}": "The MoneyWorks ${camelCase} entity (singular)",
  "${titleCase}": "The MoneyWorks ${kebabCase} table (plural)",
  
  // === [Category] Terms ===
  // Add terms from the canonical ontology
  
} as const;

/**
 * Get the MoneyWorks term for a concept
 * 
 * @ai-instruction Use this to ensure you're using correct MW terminology
 */
export function getCanonicalTerm(concept: string): string {
  // This would be used by tooling to enforce terminology
  const lowercaseConcept = concept.toLowerCase();
  
  // Check common mistakes
  const mistakes: Record<string, string> = {
    // "[generic term]": "[MW term]",
  };
  
  return mistakes[lowercaseConcept] || concept;
}

/**
 * MoneyWorks ${camelCase}-specific action terms
 * 
 * @ai-instruction Use these verbs when describing ${camelCase} operations
 */
export const MONEYWORKS_${upperSnakeCase}_ACTIONS = {
  // "[action MW term]": "[description]",
} as const;`;

// Template for README-AI.md
const readmeAIContent = `# MoneyWorks ${titleCase} - AI Language Guide

## 🚨 CRITICAL: MoneyWorks DSL Enforcement

This document ensures AI agents use ONLY MoneyWorks terminology when working with ${titleCase}.

## 📋 Quick Reference Card

| ❌ NEVER SAY | ✅ ALWAYS SAY | 📖 Context |
|-------------|---------------|------------|
| [generic term] | [MW term] | [Context] |

## 🏗️ Core Concepts

### The ${pascalCase} Entity

\`\`\`typescript
// ✅ CORRECT MoneyWorks Language
const ${camelCase}: MoneyWorks${pascalCase} = {
  // Use exact MW field names
};
\`\`\`

### Key MoneyWorks Concepts

1. **[Concept Name]**
   - [MoneyWorks-specific explanation]

## 📝 Example Dialogues

### ✅ CORRECT AI Responses

\`\`\`
User: "[Question about ${kebabCase}]"

AI: [Response using only MW terminology]
\`\`\`

### ❌ INCORRECT AI Responses

\`\`\`
User: "[Question about ${kebabCase}]"

AI: [Example of incorrect generic language] ❌
\`\`\`

## 🔍 Field-by-Field Language Guide

### [FieldName]
- ✅ Say: "[MW term]", "[MW phrase]"
- ❌ Don't: "[generic term]", "[business term]"

## 🛠️ Common Operations

### Creating a ${pascalCase}
\`\`\`typescript
// ✅ CORRECT
"[MW language example]"

// ❌ INCORRECT  
"[Generic language example]"
\`\`\`

### Querying ${titleCase}
\`\`\`typescript
// ✅ CORRECT
"Find ${pascalCase} where [Field]='[value]'"

// ❌ INCORRECT
"[Generic query example]"
\`\`\`

## 🎯 Key Rules for AI

1. **NEVER translate MoneyWorks terms** to "friendly" language
2. **ALWAYS use MW field names** exactly as defined
3. **NEVER suggest fields** not in the official MoneyWorks field list
4. **ALWAYS preserve exact field name casing**

## 📚 Advanced Topics

### [Topic Name]
[MoneyWorks-specific explanation using only MW terms]

## 🔧 Troubleshooting Language

### [Common Confusion]
\`\`\`
User: "[Confused question]"

AI: [Clear explanation using only MW terminology]
\`\`\`

---

**Remember**: This guide ensures consistent MoneyWorks language. When in doubt, check the \`.ai-schema.json\` file for the authoritative terminology.`;

// Template for validators.ts
const validatorsContent = `/**
 * MoneyWorks ${titleCase} Validation Functions
 * 
 * @moneyworks-entity ${pascalCase}
 * @moneyworks-dsl PURE
 * @ai-instruction Use these validators for MW ${camelCase} validation
 * @ai-critical Validation messages must use MoneyWorks terminology
 */

import { MoneyWorksValidationResult } from '../../common/data-types';
import { MoneyWorks${pascalCase} } from './types';

/**
 * Validate complete MoneyWorks ${pascalCase} entity
 * 
 * @ai-instruction Use this for comprehensive ${pascalCase} validation
 * @ai-critical All validation messages must use MoneyWorks field names
 */
export function validate${pascalCase}(${camelCase}: Partial<MoneyWorks${pascalCase}>): MoneyWorksValidationResult {
  const warnings: string[] = [];
  
  // Add validation logic based on the entity's business rules
  
  return {
    isValid: warnings.length === 0,
    warnings,
    context: ${camelCase}
  };
}

/**
 * Validate that required fields are present for creation
 * 
 * @ai-instruction Use when creating new ${pascalCase} records
 */
export function validateRequiredFields(${camelCase}: Partial<MoneyWorks${pascalCase}>): MoneyWorksValidationResult {
  const warnings: string[] = [];
  const required = [/* list required field names */];
  
  for (const field of required) {
    if (!(field in ${camelCase})) {
      warnings.push(\`\${field} is required for MoneyWorks ${pascalCase}\`);
    }
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    context: { requiredFields: required, provided: Object.keys(${camelCase}) }
  };
}`;

// Template for calculators.ts (optional - only if entity has calculations)
const calculatorsContent = `/**
 * MoneyWorks ${titleCase} Calculation Functions
 * 
 * @moneyworks-entity ${pascalCase}
 * @moneyworks-dsl PURE
 * @ai-instruction Use these for ALL MoneyWorks ${camelCase} calculations
 * @ai-critical ALWAYS use MoneyWorks terminology in results
 */

import { MoneyWorks${pascalCase} } from './types';

// Add calculation functions specific to this entity
// Only include this file if the entity has business logic calculations`;

// Template for rules.ts
const rulesContent = `/**
 * MoneyWorks ${titleCase} Business Rules
 * 
 * @moneyworks-entity ${pascalCase}
 * @moneyworks-dsl PURE
 * @ai-instruction These are MoneyWorks-specific business rules for ${pascalCase}
 * @ai-critical Use MoneyWorks terminology when describing rules
 */

import { MoneyWorksBusinessRules, MoneyWorksFieldRelationship } from '../../common/business-rules';

/**
 * MoneyWorks ${titleCase} business rules implementation
 * 
 * @ai-instruction Reference these rules when validating ${pascalCase} operations
 */
export const MoneyWorks${pascalCase}BusinessRules: MoneyWorksBusinessRules = {
  validationRules: {
    // Add entity-specific validation rules
  },
  
  relationshipRules: {
    // Add cross-entity relationship rules
  },
  
  calculationRules: {
    // Add calculation rules if applicable
  }
};

/**
 * MoneyWorks ${titleCase} field relationships
 * 
 * @ai-instruction Use to understand ${pascalCase} dependencies
 */
export const MoneyWorks${pascalCase}Relationships: MoneyWorksFieldRelationship[] = [
  // Define relationships to other entities
];

/**
 * Get applicable business rules for a specific operation
 * 
 * @ai-instruction Use when explaining ${pascalCase} behavior
 */
export function getApplicableRules(operation: 'create' | 'update' | 'delete'): string[] {
  const rules: string[] = [];
  
  switch (operation) {
    case 'create':
      rules.push(
        // Add create-specific rules
      );
      break;
      
    case 'update':
      rules.push(
        // Add update-specific rules
      );
      break;
      
    case 'delete':
      rules.push(
        // Add delete-specific rules
      );
      break;
  }
  
  return rules;
}`;

// Template for index.ts
const indexContent = `/**
 * MoneyWorks ${titleCase} Canonical Module
 * 
 * @moneyworks-entity ${pascalCase}
 * @moneyworks-dsl PURE
 * @ai-instruction This is the entry point for ALL ${pascalCase} canonical types
 * @ai-critical Import from here, not from individual files
 */

// Export all enums
export {
  // MoneyWorks${pascalCase}Type,
  // Add other enums
} from './enums';

// Export all types
export {
  MoneyWorks${pascalCase},
  MoneyWorks${pascalCase}CreateInput,
  MoneyWorks${pascalCase}UpdateInput
} from './types';

// Export field definitions
export {
  MONEYWORKS_${upperSnakeCase}_FIELDS,
  getFieldMetadata,
  getRequiredFields,
  getIndexedFields
} from './fields';

// Export canonical terms
export {
  MONEYWORKS_${upperSnakeCase}_CANONICAL_TERMS,
  MONEYWORKS_${upperSnakeCase}_ACTIONS,
  getCanonicalTerm
} from './terms';

// Export validators
export {
  validate${pascalCase},
  validateRequiredFields
} from './validators';

// Export calculators (if applicable)
// export {
//   calculate${pascalCase}Something
// } from './calculators';

// Export business rules
export {
  MoneyWorks${pascalCase}BusinessRules,
  MoneyWorks${pascalCase}Relationships,
  getApplicableRules
} from './rules';

// Re-export common types that are frequently used with ${kebabCase}
export type { MoneyWorksFieldMetadata, MoneyWorksValidationResult } from '../../common/data-types';

/**
 * @ai-instruction When working with ${titleCase}, import like this:
 * import { MoneyWorks${pascalCase}, validate${pascalCase} } from '@moneyworks/canonical/${kebabCase}';
 * 
 * NEVER import from the individual files
 */`;

// Write all files
const files = [
  { path: join(basePath, 'enums.ts'), content: enumsContent },
  { path: join(basePath, 'types.ts'), content: typesContent },
  { path: join(basePath, 'fields.ts'), content: fieldsContent },
  { path: join(basePath, '.ai-schema.json'), content: aiSchemaContent },
  { path: join(basePath, 'terms.ts'), content: termsContent },
  { path: join(basePath, 'README-AI.md'), content: readmeAIContent },
  { path: join(basePath, 'validators.ts'), content: validatorsContent },
  { path: join(basePath, 'rules.ts'), content: rulesContent },
  { path: join(basePath, 'index.ts'), content: indexContent },
];

for (const { path, content } of files) {
  await writeFile(path, content);
  console.log(`✅ Created: ${path}`);
}

console.log(`
✨ Successfully created canonical entity: ${entityName}

Next steps:
1. Review and update field definitions from staging/generated/moneyworks-${kebabCase}-canonical-ontology.ts
2. Add entity-specific enums to enums.ts
3. Fill in the field definitions in fields.ts
4. Customize validators for the entity
5. Update .ai-schema.json with entity-specific terms
6. Add to packages/canonical/src/index.ts:
   export * as ${pascalCase} from './entities/${kebabCase}';

7. Update tsconfig paths if needed for direct imports
`);