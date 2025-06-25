# Test Fix Summary for packages/data

## Issues Fixed

1. **Config Path Resolution**
   - Copied `mw-config.json` to `packages/data/` directory
   - Tests were looking for `../../mw-config.json` relative to test files
   - Solution: Place config where tests expect it

2. **Import Path Issues**
   - Removed `.ts` extensions from imports in test files
   - Fixed `.ts` extensions in `@moneyworks/canonical/tax-rates/index.ts`
   - TypeScript/Bun handle extensions automatically

3. **Missing Type Import**
   - Added missing import for `MoneyWorksConfig` type in `config/index.ts`

## Current Test Status

```bash
bun test v1.2.16

✓ SmartMoneyWorksClient tests pass (3 tests)
✓ Simple config test passes (2 tests)
✗ TaxRateRepository test has import error

Total: 5 pass, 1 fail, 1 error
```

## Known Issues

1. **Field Mapping Issue in SmartClient**
   - The TSV field mapping appears to be misaligned
   - TaxCode shows date values, PaidAccount shows NaN
   - This suggests the XML field discovery might not be getting correct field order
   - Need to debug the field discovery process

2. **Import Error**
   - `MoneyWorksTaxRateCreateInput` export issue resolved by removing `.ts` extensions

## Next Steps

1. Debug the field discovery/XML parsing to fix field alignment
2. Ensure all MoneyWorks packages are built before running tests
3. Consider adding test fixtures instead of relying on live MoneyWorks connection

## Running Tests

From `packages/data` directory:
```bash
bun test
```

The tests are integration tests that connect to MoneyWorks using the config in `mw-config.json`.