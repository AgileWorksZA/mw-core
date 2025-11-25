/**
 * MoneyWorks Repository Exports
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Export all repository classes and interfaces
 *
 * NOTE: This file should NOT re-export from the same package to avoid circular dependencies.
 * Instead, consumers should import directly from the specific repository files.
 */

// Base Repository
export { BaseMoneyWorksRepository } from "./base.repository";
export type { IMoneyWorksRepository } from "./base.repository";

// Name Repository
export { NameRepository } from "./name.repository";

// Tax Rate Repository
export { TaxRateRepository } from "./tax-rate.repository";

// Product Repository
export { ProductRepository } from "./product.repository";

// Account Repository
export { AccountRepository } from "./account.repository";

// Contact Repository
export { ContactRepository } from "./contact.repository";

// Canonical type re-exports for convenience
export type { MoneyWorksName } from "@moneyworks/canonical/names";
export type { MoneyWorksTaxRate } from "@moneyworks/canonical/tax-rates";
export type { MoneyWorksProduct } from "@moneyworks/canonical/products";
export type { MoneyWorksAccount } from "@moneyworks/canonical/entities/accounts";
export type { MoneyWorksContact } from "@moneyworks/canonical/entities/contacts";
