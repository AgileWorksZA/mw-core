#!/usr/bin/env bun
/**
 * MoneyWorks Entity Scaffolding Script
 *
 * Creates all boilerplate files for a new MoneyWorks entity.
 * Handles: canonical types, enums, index, repository, controller
 *
 * Usage:
 *   bun .claude/skills/moneyworks-entity-implementation/scripts/scaffold-entity.ts \
 *     --entity="Transaction" \
 *     --table="Transaction" \
 *     --primaryKey="SequenceNumber" \
 *     --displayName="Transactions" \
 *     --description="Financial transaction records"
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

// Parse CLI arguments
const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
	const arg = args.find((a) => a.startsWith(`--${name}=`));
	return arg?.split("=")[1];
};

const entity = getArg("entity");
const table = getArg("table") || entity;
const primaryKey = getArg("primaryKey") || "Code";
const displayName = getArg("displayName") || `${entity}s`;
const description = getArg("description") || `${entity} records from MoneyWorks`;

if (!entity) {
	console.error(`
Usage: bun scaffold-entity.ts --entity=EntityName [options]

Required:
  --entity        Entity name (PascalCase, e.g., "Transaction")

Optional:
  --table         MoneyWorks table name (default: same as entity)
  --primaryKey    Primary key field (default: "Code")
  --displayName   Human-readable plural (default: "{Entity}s")
  --description   Entity description

Example:
  bun scaffold-entity.ts --entity="Job" --primaryKey="Code" --displayName="Jobs"
`);
	process.exit(1);
}

const entityLower = entity.toLowerCase();
const entityUpper = entity.toUpperCase();

// Project root detection
const projectRoot = process.cwd();
const canonicalDir = join(
	projectRoot,
	"packages/canonical/src/entities",
	entityLower
);
const dataRepoDir = join(projectRoot, "packages/data/src/repositories");
const apiControllerDir = join(projectRoot, "packages/api/src/controllers");

console.log(`\n🚀 Scaffolding MoneyWorks ${entity} Entity\n`);
console.log(`  Entity:      ${entity}`);
console.log(`  Table:       ${table}`);
console.log(`  Primary Key: ${primaryKey}`);
console.log(`  Display:     ${displayName}`);
console.log(`  Description: ${description}`);
console.log("");

// Create canonical directory
if (!existsSync(canonicalDir)) {
	mkdirSync(canonicalDir, { recursive: true });
	console.log(`✅ Created: ${canonicalDir}`);
}

// =============================================================================
// Template: enums.ts
// =============================================================================
const enumsTemplate = `/**
 * MoneyWorks ${entity} Enumerations
 *
 * @moneyworks-entity ${entity}
 * @moneyworks-dsl PURE
 * @ai-instruction Use ONLY these enum values when working with MoneyWorks ${entityLower}s
 * @ai-critical NEVER create your own ${entityLower}-related enums or use generic terms
 */

/**
 * MoneyWorks ${entity} Type Classification
 * Source: MoneyWorks ${entity} documentation - "Type" field
 *
 * @ai-instruction When discussing ${entityLower} types, ALWAYS use these MoneyWorks classifications
 * TODO: Fill in actual type values from MoneyWorks
 */
export enum MoneyWorks${entity}Type {
	// TODO: Add actual type values from MoneyWorks
	// Example:
	// TYPE_A = "A",
	// TYPE_B = "B",
}

/**
 * MoneyWorks ${entity} Status
 *
 * @ai-instruction Use when discussing ${entityLower} availability/status
 */
export enum MoneyWorks${entity}Status {
	/**
	 * Active and available
	 * @ai-term Say "active", NEVER "enabled" or "open"
	 */
	ACTIVE = "ACTIVE",

	/**
	 * Inactive/discontinued
	 * @ai-term Say "inactive", NEVER "disabled" or "archived"
	 */
	INACTIVE = "INACTIVE",
}

/**
 * MoneyWorks ${entity} Flags (bitwise)
 * Control various ${entityLower} behaviors
 *
 * @ai-instruction Use bitwise operations to check ${entityLower} flags
 */
export enum MoneyWorks${entity}Flags {
	/**
	 * No special flags
	 */
	NONE = 0,

	// TODO: Add actual flag values from MoneyWorks
	// Example:
	// FLAG_ONE = 1,
	// FLAG_TWO = 2,
	// FLAG_FOUR = 4,
}
`;

// =============================================================================
// Template: types.ts
// =============================================================================
const typesTemplate = `/**
 * MoneyWorks ${entity} Type Definitions
 *
 * @moneyworks-entity ${entity}
 * @moneyworks-table ${table}
 * @moneyworks-dsl PURE
 *
 * @ai-instruction USE ONLY MoneyWorks field names. NEVER translate to generic business terms.
 * @ai-required ${primaryKey}
 */

import type { AccountCode } from "@moneyworks/utilities";
import type { MoneyWorks${entity}Type, MoneyWorks${entity}Status } from "./enums";

/**
 * MoneyWorks ${entity} Entity
 *
 * @ai-critical NEVER translate MoneyWorks field names
 */
export interface MoneyWorks${entity} {
	/**
	 * Primary key
	 * @moneyworks-field ${primaryKey}
	 * @ai-term ALWAYS use "${primaryKey}", NEVER use generic alternatives
	 */
	${primaryKey}: string;

	// TODO: Add all fields from MoneyWorks schema
	// Use XML export or field discovery to find all fields
	// Example fields:

	/**
	 * Description/Name field
	 * @moneyworks-field Description
	 * @moneyworks-type T(255)
	 */
	Description?: string;

	/**
	 * Hash for searching
	 * @moneyworks-field Hash
	 * @moneyworks-type N
	 */
	Hash?: number;

	/**
	 * Operational flags
	 * @moneyworks-field Flags
	 * @moneyworks-type N
	 */
	Flags?: number;

	/**
	 * Whether ${entityLower} is active
	 * @moneyworks-field Active
	 * @moneyworks-type B
	 */
	Active?: boolean;

	/**
	 * Colour index (0-7)
	 * @moneyworks-field Colour
	 * @moneyworks-type N
	 * @ai-term ALWAYS use "Colour" (British spelling)
	 */
	Colour?: number;

	/**
	 * Comment/notes
	 * @moneyworks-field Comment
	 * @moneyworks-type T(1020)
	 */
	Comment?: string;

	/**
	 * Last modified timestamp
	 * @moneyworks-field LastModifiedTime
	 * @moneyworks-type S
	 */
	LastModifiedTime?: string;

	// Add more fields below as discovered from MoneyWorks...
}

/**
 * MoneyWorks ${entity} creation input
 * Only required fields for creating a new ${entityLower}
 *
 * @ai-instruction When creating ${entityLower}s, use this interface
 */
export interface MoneyWorks${entity}CreateInput {
	${primaryKey}: string;
	Description?: string;
	// TODO: Add required and optional creation fields
}

/**
 * MoneyWorks ${entity} update input
 * All fields optional except ${primaryKey} for identification
 *
 * @ai-instruction When updating ${entityLower}s, use this interface
 */
export interface MoneyWorks${entity}UpdateInput {
	${primaryKey}: string;
	Description?: string;
	// TODO: Add optional update fields
}

/**
 * MoneyWorks ${entity} filter for search/query operations
 *
 * @ai-instruction When searching ${entityLower}s, use this interface
 */
export interface MoneyWorks${entity}Filter {
	/** Filter by ${primaryKey} */
	${primaryKey.toLowerCase()}?: string;

	/** Filter by description (partial match) */
	description?: string;

	/** Filter by active status */
	active?: boolean;

	/** Search text (searches ${primaryKey}, Description) */
	searchText?: string;
}
`;

// =============================================================================
// Template: index.ts
// =============================================================================
const indexTemplate = `/**
 * MoneyWorks ${entity} - Barrel Exports
 *
 * @moneyworks-entity ${entity}
 * @moneyworks-dsl PURE
 */

export * from "./enums";
export * from "./types";
`;

// =============================================================================
// Template: repository.ts
// =============================================================================
const repositoryTemplate = `/**
 * MoneyWorks ${entity} Repository
 *
 * @moneyworks-entity ${entity}
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles all ${entity} data operations
 * @ai-critical Use MoneyWorks ${entity} terminology exclusively
 */

import type {
	MoneyWorks${entity},
	MoneyWorks${entity}CreateInput,
	MoneyWorks${entity}UpdateInput,
} from "@moneyworks/canonical/entities/${entityLower}";
import { type AccountCode } from "@moneyworks/utilities";
import { BaseMoneyWorksRepository } from "./base.repository";

/**
 * Repository for MoneyWorks ${entity} entity
 *
 * @ai-instruction Use this for all ${entity} data operations
 */
export class ${entity}Repository extends BaseMoneyWorksRepository<
	MoneyWorks${entity},
	MoneyWorks${entity}CreateInput,
	MoneyWorks${entity}UpdateInput
> {
	/**
	 * MoneyWorks table name
	 * @ai-critical Must be exact MW table name
	 */
	protected readonly tableName = "${table}";

	/**
	 * Primary key field
	 * @ai-critical ${primaryKey} is the primary key for ${entity}
	 */
	protected readonly primaryKey = "${primaryKey}";

	/**
	 * Post-process records to add branded types and parse MW data
	 *
	 * @ai-instruction Smart client already parsed basic types, we add branding and parse flags
	 */
	protected postProcess(record: any): MoneyWorks${entity} {
		// Parse numeric fields
		// TODO: Add all numeric fields from the entity
		const numericFields = [
			"Hash",
			"Flags",
			"Colour",
			// Add more numeric fields...
		];

		const processed: any = { ...record };

		// Parse numeric fields
		for (const field of numericFields) {
			if (
				field in processed &&
				processed[field] !== null &&
				processed[field] !== ""
			) {
				processed[field] = Number(processed[field]);
			}
		}

		// Parse boolean field
		if ("Active" in processed) {
			processed.Active =
				processed.Active === "true" ||
				processed.Active === true ||
				processed.Active === "1" ||
				processed.Active === 1;
		}

		// TODO: Add branded types for account/code fields
		// Example:
		// if (processed.SomeAccountField) {
		//   processed.SomeAccountField = processed.SomeAccountField as AccountCode;
		// }

		return processed as MoneyWorks${entity};
	}

	/**
	 * Prepare data for MoneyWorks
	 *
	 * @ai-instruction Converts typed data to MW format
	 */
	protected prepare(
		data: MoneyWorks${entity}CreateInput | MoneyWorks${entity}UpdateInput
	): any {
		const prepared: any = {};

		// Always include primary key for identification
		if ("${primaryKey}" in data) {
			prepared.${primaryKey} = data.${primaryKey};
		}

		// TODO: Add field mappings for all updatable fields
		if ("Description" in data && data.Description !== undefined) {
			prepared.Description = data.Description;
		}

		return prepared;
	}

	// ============= SPECIALIZED QUERY METHODS =============

	/**
	 * Find ${entityLower} by ${primaryKey} (primary key lookup)
	 *
	 * @param code - The ${primaryKey} to search for
	 * @returns The ${entityLower} if found, null otherwise
	 *
	 * @example
	 * \`\`\`typescript
	 * const item = await repo.findBy${primaryKey}("ABC123");
	 * if (item) {
	 *   console.log(\`Found: \${item.Description}\`);
	 * }
	 * \`\`\`
	 *
	 * @ai-instruction Use this for single ${entityLower} lookups by ${primaryKey}
	 */
	async findBy${primaryKey}(code: string): Promise<MoneyWorks${entity} | null> {
		const records = await this.find(\`${primaryKey}="\${code}"\`);
		return records.length > 0 ? records[0] : null;
	}

	/**
	 * Find all active ${entityLower}s
	 *
	 * @returns Array of ${entityLower}s where Active is true
	 *
	 * @ai-instruction Use this to get only ${entityLower}s available for use
	 */
	async findActive(): Promise<MoneyWorks${entity}[]> {
		const all = await this.findAll();
		return all.filter((item) => {
			if (item.Active !== undefined) {
				return item.Active === true;
			}
			// Fall back to checking Flags for inactive bit
			if (item.Flags !== undefined) {
				return (item.Flags & 8) === 0; // Bit 8 = inactive
			}
			return true;
		});
	}

	// TODO: Add more domain-specific query methods
	// Categories to consider:
	// - Type filtering: findByType(type)
	// - Status filtering: findActive(), findInactive()
	// - Domain-specific: findByCategory(), findUnprocessed()
	// - Relationship-based: findByRelatedEntity(code)
}
`;

// =============================================================================
// Template: controller.ts
// =============================================================================
const controllerTemplate = `/**
 * ${entity} Controller
 * Handles ${entity} entity operations for the API
 *
 * @moneyworks-dsl PURE
 * @ai-instruction ${displayName} represent ${description}
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { ${entity}Repository } from "@moneyworks/data";
import { BaseTableController, type TableExportParams } from "./base-table";

export class ${entity}Controller extends BaseTableController {
	readonly tableName = "${table}";
	readonly displayName = "${displayName}";
	readonly description =
		"${description}";
	private repo: ${entity}Repository;

	constructor(client: SmartMoneyWorksClient) {
		super(client);
		this.repo = new ${entity}Repository(client);
	}

	/**
	 * Get primary key for ${entity} table
	 */
	protected getPrimaryKey(): string {
		return "${primaryKey}";
	}

	/**
	 * Additional validation specific to ${entity}
	 */
	protected validateTableSpecific(params: TableExportParams): void {
		// Validate orderBy field if provided
		if (params.orderBy) {
			// TODO: Add all valid sortable fields
			const validFields = [
				"${primaryKey}",
				"Description",
				// Add more valid fields...
			];
			const field = params.orderBy.split(" ")[0]; // Handle "field DESC"

			if (!validFields.includes(field)) {
				throw new Error(
					\`Invalid orderBy field: \${field}. Valid fields: \${validFields.join(", ")}\`
				);
			}
		}

		// Validate filter expressions
		if (params.filter) {
			// Basic validation - check for SQL injection patterns
			const dangerousPatterns = [";", "--", "/*", "*/"];
			for (const pattern of dangerousPatterns) {
				if (params.filter.includes(pattern)) {
					throw new Error("Invalid filter expression");
				}
			}
		}
	}
}
`;

// =============================================================================
// Write all files
// =============================================================================

const files = [
	{ path: join(canonicalDir, "enums.ts"), content: enumsTemplate },
	{ path: join(canonicalDir, "types.ts"), content: typesTemplate },
	{ path: join(canonicalDir, "index.ts"), content: indexTemplate },
	{
		path: join(dataRepoDir, `${entityLower}.repository.ts`),
		content: repositoryTemplate,
	},
	{
		path: join(apiControllerDir, `${entityLower}.ts`),
		content: controllerTemplate,
	},
];

let created = 0;
let skipped = 0;

for (const file of files) {
	if (existsSync(file.path)) {
		console.log(`⏭️  Skipped (exists): ${file.path}`);
		skipped++;
	} else {
		writeFileSync(file.path, file.content, "utf-8");
		console.log(`✅ Created: ${file.path}`);
		created++;
	}
}

console.log(`
📊 Summary:
   Created: ${created} files
   Skipped: ${skipped} files (already exist)

📝 Next Steps:
   1. Run update-exports.ts to update all export locations
   2. Customize enums.ts with actual MoneyWorks type values
   3. Fill in types.ts with all fields from MoneyWorks schema
   4. Add numeric/boolean field lists to repository postProcess()
   5. Add field mappings to repository prepare()
   6. Add specialized query methods to repository
   7. Run typecheck: bun tsc --project packages/canonical/tsconfig.json --noEmit

   Run exports update:
   bun .claude/skills/moneyworks-entity-implementation/scripts/update-exports.ts --entity="${entity}"
`);
