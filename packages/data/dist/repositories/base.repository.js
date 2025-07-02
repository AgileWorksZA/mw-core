/**
 * Base Repository Pattern for MoneyWorks Entities
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This is the base class for all MoneyWorks repositories
 * @ai-critical Use MoneyWorks terminology in all methods
 */
/**
 * Abstract base repository for MoneyWorks entities
 *
 * @ai-instruction Extend this class for each MoneyWorks entity
 * @ai-critical Uses smart field discovery - no manual parsing needed
 */
export class BaseMoneyWorksRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    /**
     * Post-process data after smart export (optional)
     * Override to add branded types or additional transformations
     *
     * @ai-instruction The smart client already handles field discovery and basic parsing
     */
    postProcess(record) {
        // Default implementation - just return as-is
        // Override in specific repositories to add branded types
        return record;
    }
    /**
     * Find records by MoneyWorks search expression
     *
     * @example
     * // Find all GST tax rates
     * await repo.find("TaxCode CONTAINS 'GST'");
     *
     * @ai-instruction Use MoneyWorks search syntax
     */
    async find(search, params = {}) {
        // Smart export handles field discovery automatically
        const data = await this.client.smartExport(this.tableName, {
            ...params,
            search
        });
        // Apply post-processing to add branded types if needed
        return data.map(record => this.postProcess(record));
    }
    /**
     * Find one record by primary key
     *
     * @ai-instruction MoneyWorks uses exact match on primary key
     */
    async findByKey(key) {
        // MoneyWorks search syntax: use double quotes for strings, no quotes for numbers
        const isNumeric = /^\d+$/.test(key);
        const search = isNumeric
            ? `${this.primaryKey}=${key}`
            : `${this.primaryKey}="${key}"`;
        const data = await this.client.smartExport(this.tableName, {
            search,
            limit: 1
        });
        if (data.length === 0) {
            return null;
        }
        return this.postProcess(data[0]);
    }
    /**
     * Find all records with optional pagination
     *
     * @ai-instruction Use for listing all records of an entity
     */
    async findAll(params = {}) {
        const data = await this.client.smartExport(this.tableName, params);
        return data.map(record => this.postProcess(record));
    }
    /**
     * Create new record in MoneyWorks
     *
     * @ai-instruction MoneyWorks validates all required fields
     */
    async create(data) {
        // TODO: Implement import endpoint for create
        throw new Error(`Create operation not yet implemented for ${this.tableName}`);
    }
    /**
     * Update existing record in MoneyWorks
     *
     * @ai-instruction MoneyWorks requires primary key for updates
     */
    async update(key, data) {
        // TODO: Implement import endpoint for update
        throw new Error(`Update operation not yet implemented for ${this.tableName}`);
    }
    /**
     * Delete record from MoneyWorks
     *
     * @ai-instruction MoneyWorks may prevent deletion if record is referenced
     */
    async delete(key) {
        // TODO: Implement delete endpoint
        throw new Error(`Delete operation not yet implemented for ${this.tableName}`);
    }
    /**
     * Check if record exists
     *
     * @ai-instruction Useful for validation before operations
     */
    async exists(key) {
        const record = await this.findByKey(key);
        return record !== null;
    }
    /**
     * Count records matching search
     *
     * @ai-instruction MoneyWorks doesn't have COUNT, so we fetch with limit
     */
    async count(search) {
        // MoneyWorks doesn't have a direct count endpoint
        // We could fetch all and count, but that's inefficient
        // For now, fetch with reasonable limit
        const data = await this.client.smartExport(this.tableName, {
            search,
            limit: 1000 // Reasonable limit
        });
        return data.length;
    }
    /**
     * Find records with related data
     *
     * @ai-instruction Override in specific repositories to handle relationships
     */
    async findWithRelated(search, params) {
        // Base implementation just returns regular find
        // Override in specific repositories to join related data
        return this.find(search, params);
    }
}
/**
 * Repository factory function
 *
 * @ai-instruction Use to create repository instances with shared client
 */
export function createRepository(RepositoryClass, client) {
    return new RepositoryClass(client);
}
