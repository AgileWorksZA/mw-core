/**
 * Base Repository Pattern for MoneyWorks Entities
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This is the base class for all MoneyWorks repositories
 * @ai-critical Use MoneyWorks terminology in all methods
 */
import type { SmartMoneyWorksClient } from '../client/moneyworks-smart-client';
import type { MoneyWorksQueryParams } from '../config/types';
/**
 * Base repository interface for MoneyWorks entities
 *
 * @ai-instruction All repositories must implement these methods
 */
export interface IMoneyWorksRepository<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
    /**
     * Find records by MoneyWorks search expression
     * @ai-term Say "find", NEVER "query" or "select"
     */
    find(search?: string, params?: MoneyWorksQueryParams): Promise<T[]>;
    /**
     * Find one record by key
     * @ai-term Say "findByKey", NEVER "findById" or "get"
     */
    findByKey(key: string): Promise<T | null>;
    /**
     * Find all records
     * @ai-term Say "findAll", NEVER "getAll" or "list"
     */
    findAll(params?: MoneyWorksQueryParams): Promise<T[]>;
    /**
     * Create new record
     * @ai-term Say "create", NEVER "insert" or "add"
     */
    create(data: TCreate): Promise<T>;
    /**
     * Update existing record
     * @ai-term Say "update", NEVER "patch" or "modify"
     */
    update(key: string, data: TUpdate): Promise<T>;
    /**
     * Delete record
     * @ai-term Say "delete", NEVER "remove" or "destroy"
     */
    delete(key: string): Promise<void>;
}
/**
 * Abstract base repository for MoneyWorks entities
 *
 * @ai-instruction Extend this class for each MoneyWorks entity
 * @ai-critical Uses smart field discovery - no manual parsing needed
 */
export declare abstract class BaseMoneyWorksRepository<T, TCreate = Partial<T>, TUpdate = Partial<T>> implements IMoneyWorksRepository<T, TCreate, TUpdate> {
    protected readonly client: SmartMoneyWorksClient;
    /**
     * MoneyWorks table name
     * @ai-term Use exact MoneyWorks table name (e.g., "TaxRate", "Account")
     */
    protected abstract readonly tableName: string;
    /**
     * Primary key field name
     * @ai-term Use exact MoneyWorks field name (e.g., "TaxCode", "Code")
     */
    protected abstract readonly primaryKey: string;
    constructor(client: SmartMoneyWorksClient);
    /**
     * Post-process data after smart export (optional)
     * Override to add branded types or additional transformations
     *
     * @ai-instruction The smart client already handles field discovery and basic parsing
     */
    protected postProcess(record: any): T;
    /**
     * Prepare data for MoneyWorks
     *
     * @ai-instruction Override this to convert typed data to MW format
     * @ai-critical Must handle date formatting, enum values, etc.
     */
    protected abstract prepare(data: TCreate | TUpdate): any;
    /**
     * Find records by MoneyWorks search expression
     *
     * @example
     * // Find all GST tax rates
     * await repo.find("TaxCode CONTAINS 'GST'");
     *
     * @ai-instruction Use MoneyWorks search syntax
     */
    find(search?: string, params?: MoneyWorksQueryParams): Promise<T[]>;
    /**
     * Find one record by primary key
     *
     * @ai-instruction MoneyWorks uses exact match on primary key
     */
    findByKey(key: string): Promise<T | null>;
    /**
     * Find all records with optional pagination
     *
     * @ai-instruction Use for listing all records of an entity
     */
    findAll(params?: MoneyWorksQueryParams): Promise<T[]>;
    /**
     * Create new record in MoneyWorks
     *
     * @ai-instruction MoneyWorks validates all required fields
     */
    create(data: TCreate): Promise<T>;
    /**
     * Update existing record in MoneyWorks
     *
     * @ai-instruction MoneyWorks requires primary key for updates
     */
    update(key: string, data: TUpdate): Promise<T>;
    /**
     * Delete record from MoneyWorks
     *
     * @ai-instruction MoneyWorks may prevent deletion if record is referenced
     */
    delete(key: string): Promise<void>;
    /**
     * Check if record exists
     *
     * @ai-instruction Useful for validation before operations
     */
    exists(key: string): Promise<boolean>;
    /**
     * Count records matching search
     *
     * @ai-instruction MoneyWorks doesn't have COUNT, so we fetch with limit
     */
    count(search?: string): Promise<number>;
    /**
     * Find records with related data
     *
     * @ai-instruction Override in specific repositories to handle relationships
     */
    findWithRelated(search?: string, params?: MoneyWorksQueryParams): Promise<T[]>;
}
/**
 * Repository factory function
 *
 * @ai-instruction Use to create repository instances with shared client
 */
export declare function createRepository<T extends BaseMoneyWorksRepository<any, any, any>>(RepositoryClass: new (client: SmartMoneyWorksClient) => T, client: SmartMoneyWorksClient): T;
//# sourceMappingURL=base.repository.d.ts.map