/**
 * MoneyWorks MCP Server Types
 *
 * @moneyworks-dsl PURE
 */

export interface MoneyWorksExportParams {
	table: string;
	exportFormat?: "compact" | "compact-headers" | "full" | "schema";
	filter?: string;
	limit?: number;
	offset?: number;
	orderBy?: string;
}

export interface MoneyWorksEvalParams {
	expression: string;
}

export interface MoneyWorksSchemaParams {
	table: string;
}

export interface MoneyWorksExportResult {
	data: unknown[] | unknown[][] | Record<string, unknown>;
	recordCount?: number;
	format: string;
	table: string;
}

export interface MoneyWorksEvalResult {
	expression: string;
	result: string;
}

export interface MoneyWorksSchemaResult {
	table: string;
	fields: Array<{
		name: string;
		position: number;
		dataType: string;
		canonicalType?: string;
	}>;
}

export interface MoneyWorksTablesResult {
	available: string[];
	vetted: string[];
	upcoming: string[];
}
