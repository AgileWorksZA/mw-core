---
name: create-canonical-entity
description: Create a new MoneyWorks canonical entity with full AI DSL enforcement
---

# Create MoneyWorks Canonical Entity

This command creates a complete canonical entity structure in the `@moneyworks/canonical` package with all required files and AI DSL enforcement.

## Usage

```
/create-canonical-entity <entity-name>
```

Example:
```
/create-canonical-entity accounts
/create-canonical-entity transactions
/create-canonical-entity names
```

## What it creates:

1. **Entity folder structure** at `packages/canonical/src/entities/<entity-name>/`
2. **All required files**:
   - `types.ts` - MoneyWorks type definitions
   - `enums.ts` - Fixed vocabulary enums
   - `fields.ts` - Field metadata from manual
   - `terms.ts` - Canonical terminology mapping
   - `validators.ts` - Validation functions
   - `calculators.ts` - Business logic (if applicable)
   - `rules.ts` - Business rules interface
   - `index.ts` - Public exports
   - `.ai-schema.json` - AI vocabulary enforcement
   - `README-AI.md` - Comprehensive AI language guide

## Steps:

1. **Prepare the canonical ontology** - Have the staging file ready (like `moneyworks-<entity>-canonical-ontology.ts`)
2. **Run the command** - It will create all the scaffolding
3. **Customize the content** - Adapt the templates to the specific entity
4. **Update the main index** - Add export to `packages/canonical/src/index.ts`

## Template Structure

The command uses the tax-rates implementation as a template, ensuring:
- Pure MoneyWorks DSL terminology
- Comprehensive AI instructions
- TypeScript enums for all fixed vocabularies
- Integration with branded types from utilities
- Consistent validation patterns

## Post-Creation Checklist

After running the command:
- [ ] Review and update field definitions from the manual
- [ ] Add entity-specific enums
- [ ] Implement entity-specific validators
- [ ] Add calculators if the entity has business logic
- [ ] Update AI schema with entity-specific forbidden terms
- [ ] Customize README-AI.md examples
- [ ] Export from main canonical index
- [ ] Run type checking to ensure everything compiles

This ensures consistent structure and AI DSL enforcement across all MoneyWorks entities!