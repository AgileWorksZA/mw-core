/**
 * MoneyWorks Repository Exports
 * 
 * @moneyworks-dsl PURE
 * @ai-instruction Export all repository classes and interfaces
 */

export { 
  BaseMoneyWorksRepository, 
  IMoneyWorksRepository,
  createRepository 
} from './base.repository';

export { TaxRateRepository } from './tax-rate.repository';

// Future repositories will be added here:
// export { AccountRepository } from './account.repository';
// export { TransactionRepository } from './transaction.repository';
// export { NameRepository } from './name.repository';
// etc.