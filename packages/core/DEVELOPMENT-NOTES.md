# Development Notes for @moneyworks/core

## Important Reminders

### Documentation Updates
**ALWAYS** update documentation when refactoring or adding features:
1. Update `/docs/moneyworks-export-import-design.md` for design changes
2. Update `README.md` for API changes
3. Update inline JSDoc comments
4. Update examples if API changes

### When Adding New Tables
1. Generate the interface: `/project:mw-generate-table-types table=<name>`
2. Add to `tableNames` array in `src/tables/index.ts`
3. Update `TableName` union type
4. Add to `TableMap` and `TableMapCamel`
5. Add primary key to `tablePrimaryKeys`
6. Import and export from index
7. Add converters to `field-converter.ts`
8. Regenerate JSON schemas: `bun run generate:schemas`

### Testing Checklist
- [ ] Type checking passes: `bun run typecheck`
- [ ] Examples run without errors
- [ ] JSON schemas generate successfully
- [ ] Import/export round trip works

### API Design Principles
1. **Type Safety First** - Everything should be strongly typed
2. **Builder Pattern** - Use fluent APIs for complex operations
3. **Progressive Disclosure** - Simple things simple, complex things possible
4. **Fail Fast** - Validate early, provide clear errors
5. **Documentation** - Every public API must be documented

### Common Issues

#### XML Parsing
- MoneyWorks uses YYYYMMDD date format
- Booleans are 0/1, not true/false
- Empty strings should be undefined
- High bit in some fields indicates special values

#### Authentication
- Two-level auth: folder + document
- Both use Basic Auth headers
- Credentials must be URL encoded in paths

#### Performance
- Use streaming for large datasets
- Batch imports for better performance
- Connection pooling is automatic
- Use no_linger for one-off operations

### Future Enhancements
- [ ] Add WebSocket support for real-time updates
- [ ] Add caching layer for frequently accessed data
- [ ] Add retry logic with exponential backoff
- [ ] Add request/response interceptors
- [ ] Add mock client for testing
- [ ] Add GraphQL layer on top of REST

### Dependencies to Watch
- `xml2js` - Consider moving to a faster parser
- `zod` - Keep updated for performance improvements
- `ajv` - Only loaded if validation is used

### Breaking Changes Log
Keep track of any breaking changes here:
- None yet - this is v0.1.0