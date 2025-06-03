import type { TObject, TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

/**
 * Service for introspecting Eden schemas and providing metadata about MoneyWorks tables
 */
export class SchemaService {
	private tableSchemas: Map<string, TObject> = new Map();

	constructor() {
		this.loadSchemas();
	}

	/**
	 * Load all available table schemas
	 */
	private async loadSchemas() {
		// Import all table schemas dynamically
		const tables = [
			"Account",
			"Asset",
			"AssetCat",
			"AssetLog",
			"AutoSplit",
			"BankRecs",
			"Build",
			"Contacts",
			"Department",
			"Detail",
			"Filter",
			"General",
			"Inventory",
			"Job",
			"JobSheet",
			"Ledger",
			"Link",
			"List",
			"Log",
			"Login",
			"Memo",
			"Message",
			"Name",
			"OffLedger",
			"Payments",
			"Product",
			"Stickies",
			"TaxRate",
			"Transaction",
			"User",
			"User2",
		];

		for (const table of tables) {
			try {
				const module = await import(
					`@moneyworks/api/src/types/eden/tables/${table}`
				);
				if (module[`${table}One`]) {
					this.tableSchemas.set(table.toLowerCase(), module[`${table}One`]);
				}
			} catch (error) {
				console.warn(`Failed to load schema for table ${table}:`, error);
			}
		}
	}

	/**
	 * Get the full Eden schema for a specific table
	 */
	async getTableSchema(tableName: string): Promise<{
		name: string;
		schema: TObject;
		fields: Array<{
			name: string;
			type: string;
			description?: string;
			required: boolean;
			nullable: boolean;
			maxLength?: number;
			minimum?: number;
			maximum?: number;
			enum?: string[];
		}>;
	}> {
		const normalizedName = tableName.toLowerCase();
		const schema = this.tableSchemas.get(normalizedName);

		if (!schema) {
			// Try to load it dynamically
			const pascalCase =
				tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase();
			try {
				const module = await import(
					`@moneyworks/api/src/types/eden/tables/${pascalCase}`
				);
				if (module[`${pascalCase}One`]) {
					this.tableSchemas.set(normalizedName, module[`${pascalCase}One`]);
					return this.getTableSchema(tableName);
				}
			} catch (error) {
				throw new Error(`Schema not found for table: ${tableName}`);
			}
		}

		const fields = this.extractFieldInfo(schema);

		return {
			name: tableName,
			schema: schema,
			fields: fields,
		};
	}

	/**
	 * Extract field information from a schema
	 */
	private extractFieldInfo(schema: TObject): Array<{
		name: string;
		type: string;
		description?: string;
		required: boolean;
		nullable: boolean;
		maxLength?: number;
		minimum?: number;
		maximum?: number;
		enum?: string[];
	}> {
		const fields: Array<{
			name: string;
			type: string;
			description?: string;
			required: boolean;
			nullable: boolean;
			maxLength?: number;
			minimum?: number;
			maximum?: number;
			enum?: string[];
		}> = [];

		const required = schema.required || [];

		for (const [fieldName, fieldSchema] of Object.entries(
			schema.properties || {},
		)) {
			const field = fieldSchema as TSchema & {
				description?: string;
				maxLength?: number;
				minimum?: number;
				maximum?: number;
				anyOf?: TSchema[];
				enum?: string[];
			};

			let fieldType = field.type || "unknown";
			let nullable = false;
			let actualField = field;

			// Handle nullable fields (wrapped in Nullable)
			if (field.anyOf && Array.isArray(field.anyOf)) {
				const nonNullType = field.anyOf.find((t: any) => t.type !== "null");
				if (nonNullType) {
					nullable = true;
					actualField = nonNullType as typeof field;
					fieldType = actualField.type || "unknown";
				}
			}

			// Extract enum values if present
			let enumValues: string[] | undefined;
			if (actualField.enum) {
				enumValues = actualField.enum as string[];
			}

			fields.push({
				name: fieldName,
				type: fieldType,
				description: field.description || actualField.description,
				required: required.includes(fieldName),
				nullable: nullable,
				maxLength: actualField.maxLength,
				minimum: actualField.minimum,
				maximum: actualField.maximum,
				enum: enumValues,
			});
		}

		return fields;
	}

	/**
	 * Get list of all available tables
	 */
	async getAvailableTables(): Promise<string[]> {
		// Ensure schemas are loaded
		if (this.tableSchemas.size === 0) {
			await this.loadSchemas();
		}

		return Array.from(this.tableSchemas.keys());
	}

	/**
	 * Get field relationships for a table
	 */
	async getTableRelationships(tableName: string): Promise<
		Array<{
			field: string;
			referencedTable: string;
			referencedField: string;
			type: "foreign_key" | "lookup";
		}>
	> {
		const relationships: Array<{
			field: string;
			referencedTable: string;
			referencedField: string;
			type: "foreign_key" | "lookup";
		}> = [];

		const tableSchema = await this.getTableSchema(tableName);

		// Analyze field descriptions for references
		for (const field of tableSchema.fields) {
			if (field.description) {
				// Look for "References the X table" pattern
				const refMatch = field.description.match(/References the (\w+) table/i);
				if (refMatch) {
					relationships.push({
						field: field.name,
						referencedTable: refMatch[1],
						referencedField: this.inferReferencedField(refMatch[1]),
						type: "foreign_key",
					});
				}

				// Look for control account references
				if (field.name === "System" && tableName.toLowerCase() === "account") {
					// System accounts reference various control accounts
					const systemTypes = [
						{ code: "A", table: "Name", description: "Accounts Receivable" },
						{ code: "L", table: "Name", description: "Accounts Payable" },
						{ code: "K", table: "Account", description: "Bank Account" },
					];

					for (const sysType of systemTypes) {
						relationships.push({
							field: `System_${sysType.code}`,
							referencedTable: sysType.table,
							referencedField: "Code",
							type: "lookup",
						});
					}
				}
			}
		}

		// Add common relationships based on field names
		const commonRelationships = [
			{ field: /^Account$/i, table: "Account", refField: "Code" },
			{ field: /^Name$/i, table: "Name", refField: "Code" },
			{ field: /^Product$/i, table: "Product", refField: "Code" },
			{ field: /^Job$/i, table: "Job", refField: "Code" },
			{ field: /^Department$/i, table: "Department", refField: "Code" },
			{ field: /^TaxCode$/i, table: "TaxRate", refField: "Code" },
			{ field: /^Category$/i, table: "General", refField: "Code" },
		];

		for (const field of tableSchema.fields) {
			for (const rel of commonRelationships) {
				if (
					rel.field.test(field.name) &&
					!relationships.some((r) => r.field === field.name)
				) {
					relationships.push({
						field: field.name,
						referencedTable: rel.table,
						referencedField: rel.refField,
						type: "foreign_key",
					});
				}
			}
		}

		return relationships;
	}

	/**
	 * Infer the referenced field based on table name
	 */
	private inferReferencedField(tableName: string): string {
		// Most tables use "Code" as primary key
		const codeBasedTables = [
			"Account",
			"Name",
			"Product",
			"Job",
			"Department",
			"TaxRate",
			"General",
			"Filter",
			"List",
		];

		if (codeBasedTables.includes(tableName)) {
			return "Code";
		}

		// Some tables use SequenceNumber
		return "SequenceNumber";
	}
}
