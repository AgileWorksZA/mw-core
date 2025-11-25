/**
 * @moneyworks/data - MoneyWorks Data Access Layer
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This package provides data access to MoneyWorks REST API
 * @ai-critical Use MoneyWorks terminology throughout
 */

import { createSmartClient } from "./client/moneyworks-smart-client";
import { AccountRepository } from "./repositories/account.repository";
import { CompanyInformationRepository } from "./repositories/company-information.repository";
import { ContactRepository } from "./repositories/contact.repository";
import { DetailRepository } from "./repositories/detail.repository";
import { NameRepository } from "./repositories/name.repository";
import { ProductRepository } from "./repositories/product.repository";
import { TaxRateRepository } from "./repositories/tax-rate.repository";
import { TransactionRepository } from "./repositories/transaction.repository";

// Export clients
export { MoneyWorksRESTClient } from "./client/moneyworks-rest-client";
export { createSmartClient } from "./client/moneyworks-smart-client";
export { MoneyWorksNOWClient } from "./moneyworks-now-client";
export type { ExportOptions } from "./client/moneyworks-rest-client";
export type {
	MoneyWorksNOWConfig,
	MoneyWorksNOWFile,
	MoneyWorksNOWAuthResponse,
} from "./moneyworks-now-client";
export type {
	ImportOptions,
	ImportResult,
	ImportMode,
	ImportErrorDetail,
	LegacyImportMode,
	GlobalOptions,
	ExportFormat,
	VersionInfo,
} from "./client/types";

// Export repositories
export {
	BaseMoneyWorksRepository,
	createRepository,
} from "./repositories/base.repository";

export type { IMoneyWorksRepository } from "./repositories/base.repository";

// Export parsers - directly from files to avoid circular deps
export {
	discoverTableStructure,
	clearFieldCache,
	getCachedStructure,
	buildTSVHeaders,
	type FieldInfo,
	type TableStructure,
} from "./parsers/field-discovery";

export {
	parseTSVWithStructure,
	validateTSVStructure,
} from "./parsers/smart-tsv-parser";

export {
	parseMWDate,
	parseMWTimestamp,
	formatMWDate,
} from "./parsers/date-parser";

export {
	parseMWNumber,
	formatMWNumber,
} from "./parsers/number-parser";

// Export configuration
export type {
	MoneyWorksConfig,
	MoneyWorksResponse,
	MoneyWorksQueryParams,
	MoneyWorksError,
} from "./config/types";
export { loadConfig } from "./config";

// Export converters
export {
	arrayToObject,
	objectToArray,
	addHeaders,
	enrichWithSchema,
	convertExportFormat,
} from "./converters";
export type { SchemaEnrichedExport } from "./client/types";

// Export validators
export {
	type FieldValidationError,
	type RecordValidationResult,
	type ValidationResult,
	type FieldValidator,
	ValidationError,
	validateStringLength,
	validateNumberRange,
	validateDateFormat,
	validateBoolean,
	validateRequired,
	validateFieldType,
	validateRecordForImport,
	validateRecordsForImport,
	createFieldValidator,
} from "./validators";

// Re-export types from client and repositories for convenience
export { SmartMoneyWorksClient } from "./client/moneyworks-smart-client";
export type { SmartMoneyWorksClient as SmartMoneyWorksClientType } from "./client/moneyworks-smart-client";
export { TaxRateRepository } from "./repositories/tax-rate.repository";
export {
	CompanyInformationRepository,
	type CompanyInformation,
	COMPANY_INFORMATION_FIELDS,
} from "./repositories/company-information.repository";
export { NameRepository } from "./repositories/name.repository";
export { ProductRepository } from "./repositories/product.repository";
export { AccountRepository } from "./repositories/account.repository";
export { ContactRepository } from "./repositories/contact.repository";
export { TransactionRepository } from "./repositories/transaction.repository";
export { DetailRepository } from "./repositories/detail.repository";

/**
 * Create a MoneyWorks client with repositories from a connection object
 *
 * @ai-instruction Use this to create clients and repositories from connection details
 */
export function createMoneyWorksClient(connection: {
	mw_host: string;
	mw_port: number;
	mw_data_file: string;
	mw_username: string;
	mw_password: string;
	mw_folder_name?: string;
	mw_folder_password?: string;
}) {
	const config: any = {
		host: connection.mw_host,
		port: connection.mw_port,
		dataFile: connection.mw_data_file,
		username: connection.mw_username,
		password: connection.mw_password,
		debug: false,
	};

	// Add folder auth if present
	if (connection.mw_folder_name && connection.mw_folder_password) {
		config.folderAuth = {
			folderName: connection.mw_folder_name,
			folderPassword: connection.mw_folder_password,
		};
	}

	const client = createSmartClient(config);

	return {
		client,
		repositories: {
			taxRate: new TaxRateRepository(client),
			companyInformation: new CompanyInformationRepository(client),
			name: new NameRepository(client),
			product: new ProductRepository(client),
			account: new AccountRepository(client),
			contact: new ContactRepository(client),
			transaction: new TransactionRepository(client),
			detail: new DetailRepository(client),
		},
	};
}

/**
 * Create a configured MoneyWorks client and repositories
 *
 * @ai-instruction This is the main entry point for using the data layer
 * @example
 * ```typescript
 * import { createDataLayer } from '@moneyworks/data';
 *
 * const { client, repositories } = await createDataLayer();
 * const taxRates = await repositories.taxRate.findAll();
 * ```
 *
 * @deprecated Use token-based authentication with the API instead
 */
export async function createDataLayer(configPath?: string) {
	const { loadConfig } = await import("./config");
	const config = await loadConfig(configPath);
	const client = createSmartClient(config);

	return {
		client,
		repositories: {
			taxRate: new TaxRateRepository(client),
			companyInformation: new CompanyInformationRepository(client),
			name: new NameRepository(client),
			product: new ProductRepository(client),
			account: new AccountRepository(client),
			contact: new ContactRepository(client),
			transaction: new TransactionRepository(client),
			detail: new DetailRepository(client),
		},
	};
}
