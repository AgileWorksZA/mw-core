# MCP Implementation Tasks

## Overview
This document tracks the implementation progress of MCP tools for all MoneyWorks endpoints exposed by the API.

## Task List

### High Priority (Core functionality)

- [ ] 1. Create MCP tool for Names (Customers/Suppliers) - searchNames, getName, listNameFields
- [ ] 2. Create MCP tool for Transactions - searchTransactions, getTransaction, listTransactionFields
- [ ] 3. Create MCP tool for Products - searchProducts, getProduct, listProductFields
- [ ] 31. Create MCP tool for System Labels - getSystemLabels (for a specific table and language)
- [ ] 32. Create MCP tool for Company Information - getCompanyInfo
- [ ] 35. Update MCP server index.ts to register all new tools
- [ ] 36. Create comprehensive tool documentation for AI assistant
- [ ] 38. Test all tools with sample queries
- [ ] 39. Create MCP tool for Table Schema - describeTableSchema (returns full Eden schema for a table)
- [ ] 40. Create MCP tool for API Endpoints - listEndpoints, describeEndpoint (returns available API endpoints and their schemas)
- [ ] 41. Create MCP tool for Field Metadata - getFieldMetadata (returns detailed info about fields including validation, relationships, etc.)
- [ ] 42. Create MCP tool for System Information - getSystemInfo (returns MoneyWorks version, API version, capabilities)

### Medium Priority (Important for workflows)

- [ ] 4. Create MCP tool for Jobs - searchJobs, getJob, listJobFields
- [ ] 5. Create MCP tool for Details - searchDetails, getDetail, listDetailFields
- [ ] 6. Create MCP tool for Departments - searchDepartments, getDepartment, listDepartmentFields
- [ ] 7. Create MCP tool for Tax Rates - searchTaxRates, getTaxRate, listTaxRateFields
- [ ] 17. Create MCP tool for Payments - searchPayments, getPayment, listPaymentFields
- [ ] 18. Create MCP tool for Bank Reconciliations - searchBankRecs, getBankRec, listBankRecFields
- [ ] 19. Create MCP tool for Ledger - searchLedger, getLedgerEntry, listLedgerFields
- [ ] 21. Create MCP tool for Job Sheets - searchJobSheets, getJobSheet, listJobSheetFields
- [ ] 29. Create MCP tool for Contacts - searchContacts, getContact, listContactFields
- [ ] 30. Create MCP tool for Inventory - searchInventory, getInventoryItem, listInventoryFields
- [ ] 33. Create MCP tool for Evaluate - evaluateExpression (for MWScript expressions)
- [ ] 34. Create MCP tool for Reports - runReport, listReports
- [ ] 37. Add error tracking integration to all tools
- [ ] 43. Create MCP tool for Relationship Mapping - getTableRelationships (returns foreign keys and relationships between tables)
- [ ] 44. Create MCP tool for Validation Rules - getValidationRules (returns validation rules for fields)
- [ ] 45. Create MCP tool for Enum Values - getEnumValues (returns possible values for enum fields)
- [ ] 46. Create MCP tool for Date Formats - getDateFormats (returns date format information for date fields)
- [ ] 47. Create MCP tool for Currency Information - getCurrencyInfo (returns currency codes and formatting)
- [ ] 48. Create MCP tool for Permission Info - getPermissionInfo (returns required permissions for operations)

### Low Priority (Less frequently used)

- [ ] 8. Create MCP tool for General Settings - searchGeneral, getGeneralSetting, listGeneralFields
- [ ] 9. Create MCP tool for Logins - searchLogins, getLogin, listLoginFields
- [ ] 10. Create MCP tool for Messages - searchMessages, getMessage, listMessageFields
- [ ] 11. Create MCP tool for Memos - searchMemos, getMemo, listMemoFields
- [ ] 12. Create MCP tool for Stickies - searchStickies, getStickie, listStickieFields
- [ ] 13. Create MCP tool for Filters - searchFilters, getFilter, listFilterFields
- [ ] 14. Create MCP tool for Lists - searchLists, getList, listListFields
- [ ] 15. Create MCP tool for Users - searchUsers, getUser, listUserFields
- [ ] 16. Create MCP tool for User2s - searchUser2s, getUser2, listUser2Fields
- [ ] 20. Create MCP tool for Off-Ledger - searchOffLedger, getOffLedgerEntry, listOffLedgerFields
- [ ] 22. Create MCP tool for Builds - searchBuilds, getBuild, listBuildFields
- [ ] 23. Create MCP tool for Auto Splits - searchAutoSplits, getAutoSplit, listAutoSplitFields
- [ ] 24. Create MCP tool for Links - searchLinks, getLink, listLinkFields
- [ ] 25. Create MCP tool for Logs - searchLogs, getLog, listLogFields
- [ ] 26. Create MCP tool for Assets - searchAssets, getAsset, listAssetFields
- [ ] 27. Create MCP tool for Asset Categories - searchAssetCats, getAssetCat, listAssetCatFields
- [ ] 28. Create MCP tool for Asset Logs - searchAssetLogs, getAssetLog, listAssetLogFields

## Implementation Pattern

Each tool should follow the pattern established in `account.ts`:

1. **Search Function**
   - Accept query filters relevant to the entity
   - Support pagination (limit/offset)
   - Return results with total count

2. **Get by ID/Code Function**
   - Retrieve single entity by primary identifier
   - Throw error if not found

3. **List Fields Function**
   - Return available fields for the entity
   - Import from the types/interface definitions

4. **Schema Description Function** (for metadata tools)
   - Return full Eden schema including types, validation, and documentation
   - Include field descriptions, constraints, and relationships
   - Provide examples where applicable

5. **Error Handling**
   - Integrate with SQLite ticketing system
   - Log failed requests for analysis

## Service Mapping

Each tool corresponds to an existing service in `packages/api/src/services/tables/`:
- AccountService → account.ts ✓
- NameService → name.service.ts
- TransactionService → transaction.service.ts
- ProductService → product.service.ts
- JobService → job.service.ts
- DetailService → detail.service.ts
- DepartmentService → department.service.ts
- TaxRateService → tax-rate.service.ts
- etc.

System services in `packages/api/src/services/system/`:
- SystemLabelsService → system-labels.service.ts
- CompanyInformationService → company-information.service.ts
- EvaluateService → evaluate.service.ts
- ReportService → report.service.ts

Metadata services to be created in `packages/mcp-server/src/services/`:
- SchemaService → schema.service.ts (for Eden schema introspection)
- MetadataService → metadata.service.ts (for field metadata and validation rules)
- EndpointService → endpoint.service.ts (for API endpoint discovery)

## Notes

- Total: 48 tasks (38 original + 10 new metadata/schema tools)
- Completed: 1 (account.ts already implemented)
- Remaining: 47

### New Tools Added (Tasks 39-48):
- **Schema Description Tools**: For introspecting Eden schemas and field metadata
- **API Discovery Tools**: For listing and describing available endpoints
- **Validation Tools**: For understanding field constraints and relationships
- **System Information Tools**: For understanding the MoneyWorks environment

These new tools will help the AI assistant better understand:
1. The structure and relationships of MoneyWorks data
2. Available API operations and their requirements
3. Field validation rules and constraints
4. System capabilities and configuration

Last updated: 2025-05-31