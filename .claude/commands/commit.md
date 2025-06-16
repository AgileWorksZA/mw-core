# Commit Message Guidelines for MoneyWorks Core

## Overview

This document outlines the commit message conventions and best practices for the MoneyWorks Core project. Following these guidelines ensures a clean, searchable, and meaningful git history.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type (Required)

The type must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope (Optional)

The scope should be the package or module affected:

- `core`: Core package functionality
- `rest`: REST API client
- `xml`: XML parsing/building
- `export`: Export functionality
- `import`: Import functionality
- `tables`: Table definitions and interfaces
- `auth`: Authentication
- `test-utils`: Test utilities and mocks
- `types`: TypeScript types and interfaces

Example: `fix(rest): correct authentication header encoding`

### Subject (Required)

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end
- Limit to 50 characters

### Body (Optional)

The body should include:

- **Motivation for the change**: Why is this change necessary?
- **What changed**: Detailed description of what was modified
- **Impact**: How does this affect users or other parts of the system?

Wrap the body at 72 characters. Use bullet points for multiple items:

```
- Fixed Name schema validation by making all fields optional except code and name
- Updated Transaction schema to prevent validation warnings on partial data
- Added proper field mapping for type vs typeCode discrepancies
```

### Footer (Optional)

The footer should contain:

- **Breaking changes**: Start with `BREAKING CHANGE:`
- **Issue references**: `Fixes #123` or `Closes #456`
- **Co-authors**: For pair programming or significant contributions

## Examples

### Simple Bug Fix
```
fix(xml): handle empty export responses correctly

The parser now properly handles empty table exports without throwing errors.

Fixes #234
```

### Feature with Details
```
feat(export): add streaming support for large datasets

Implemented async generator pattern for memory-efficient export of large tables.
The new exportStream method allows processing records in chunks with progress callbacks.

- Added StreamOptions interface with chunkSize and onProgress
- Implemented pagination logic with automatic batch fetching
- Added progress tracking with current/total/percentage
- Maintained backward compatibility with existing export method

BREAKING CHANGE: Minimum Node.js version is now 18.0.0 for async generator support
```

### Test Improvements
```
test(rest): comprehensive test suite fixes for MoneyWorks client

- Fixed Zod schemas to make non-required fields optional
- Updated mock server to simulate real MoneyWorks behavior
- Corrected XML format fixtures to match actual API responses
- Implemented complex filter parsing in mock server
- Fixed field name mappings (CustomerType vs Type)
- Added variety to mock data for better filter testing

These changes improve test reliability and coverage without affecting production code.
```

### Documentation Update
```
docs(core): add TypeScript usage examples for all table interfaces

Added comprehensive examples showing:
- How to import and use table interfaces
- Field validation with Zod schemas
- Type-safe filter building
- Conversion between PascalCase and camelCase
```

## Best Practices

### 1. Atomic Commits
Make commits atomic - each commit should represent one logical change. Don't mix unrelated changes.

**Good**:
- One commit for fixing authentication
- Another commit for updating tests

**Bad**:
- One commit with "fix auth and update tests and refactor XML parser"

### 2. Test Your Changes
Before committing:
```bash
# Run tests
bun test

# Run type checking
bun run typecheck

# Run linting if available
bun run lint
```

### 3. Review Before Committing
```bash
# Review what you're about to commit
git diff --staged

# If you need to unstage something
git reset HEAD <file>
```

### 4. Use Interactive Rebase for Cleanup
Before pushing, clean up your commit history:
```bash
# Rebase last 3 commits
git rebase -i HEAD~3
```

### 5. Amend When Appropriate
For small fixes to the previous commit:
```bash
git commit --amend
```

## MoneyWorks-Specific Guidelines

### 1. Table Changes
When modifying table interfaces or schemas:
```
feat(tables/account): add new EBITDA field to Account interface

Added EBITDA field to support enhanced financial reporting.
Field is optional to maintain backward compatibility.

- Added to Account interface
- Added to AccountCamel interface  
- Updated field converter functions
- Added field type definition to maintain string format
```

### 2. API Changes
When modifying REST API functionality:
```
fix(rest): correct TSV format handling in export

MoneyWorks returns TSV by default when no format specified.
Updated client logic to handle this correctly.

- Changed default format detection logic
- Fixed format parameter handling for TSV
- Updated tests to match actual API behavior
```

### 3. Field Mapping Changes
When fixing field name conversions:
```
fix(converters): map Transaction.Type correctly in camelCase conversion

The field was incorrectly mapped as typeCode instead of type.
This caused validation errors in client applications.

- Fixed field mapping in transactionConverters
- Updated related tests
- Added comment explaining MoneyWorks naming convention
```

## Commit Message Templates

### Bug Fix Template
```
fix(<scope>): <what was broken>

<how it was broken>
<what you did to fix it>
<impact of the fix>

Fixes #<issue>
```

### Feature Template
```
feat(<scope>): <what feature was added>

<why this feature is needed>
<how the feature works>
<usage example if applicable>

Closes #<issue>
```

### Breaking Change Template
```
<type>(<scope>): <change summary>

<detailed explanation of what changed>
<migration guide for users>

BREAKING CHANGE: <what breaks and how to fix it>
```

## Tools and Automation

### Commitizen
Consider using Commitizen for consistent commit messages:
```bash
npm install -g commitizen
npm install -g cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```

Then use `git cz` instead of `git commit`.

### Git Hooks
Use Husky to validate commit messages:
```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### VS Code Integration
Use the "Conventional Commits" extension for VS Code to help format messages.

## Quick Reference

### Do's ✅
- Write clear, concise commit messages
- Use conventional commit format
- Include issue numbers
- Explain the "why" not just the "what"
- Test before committing
- Keep commits atomic

### Don'ts ❌
- Don't use generic messages like "fix bug" or "update"
- Don't commit commented-out code
- Don't mix formatting changes with logic changes
- Don't commit sensitive information
- Don't use past tense in subject line
- Don't exceed 50 characters in subject line

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)