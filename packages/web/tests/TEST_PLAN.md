# IDE Comprehensive Test Plan

## Overview
This document outlines the comprehensive testing strategy for the IDE system, covering unit tests, integration tests, and end-to-end UI tests to ensure all features work as documented.

## Test Categories

### 1. Unit Tests (Bun Test)

#### A. Variable/Secret Resolution Tests
- **Test ID**: UNIT-VAR-001
  - **Scenario**: Basic variable resolution with {{variable_name}} syntax
  - **Input**: String with variables, environment context
  - **Expected**: Resolved string with variable values

- **Test ID**: UNIT-VAR-002
  - **Scenario**: Nested variable resolution {{var1{{var2}}}}
  - **Input**: Nested variable references
  - **Expected**: Fully resolved nested values

- **Test ID**: UNIT-VAR-003
  - **Scenario**: Environment-specific variable overrides
  - **Input**: Variable defined in global and environment
  - **Expected**: Environment value takes precedence

- **Test ID**: UNIT-VAR-004
  - **Scenario**: Secret resolution and masking
  - **Input**: {{secret:api_key}} reference
  - **Expected**: Resolved value, masked in logs

- **Test ID**: UNIT-VAR-005
  - **Scenario**: Undefined variable handling
  - **Input**: {{undefined_var}}
  - **Expected**: Original string or error based on config

- **Test ID**: UNIT-VAR-006
  - **Scenario**: Circular reference detection
  - **Input**: A->B->A variable chain
  - **Expected**: Error with circular reference details

#### B. Storage Module Tests
- **Test ID**: UNIT-STOR-001
  - **Scenario**: Document creation and retrieval
  - **Expected**: Document saved with version history

- **Test ID**: UNIT-STOR-002
  - **Scenario**: Version history tracking
  - **Expected**: All changes tracked with timestamps

- **Test ID**: UNIT-STOR-003
  - **Scenario**: Soft delete and restoration
  - **Expected**: Document moved to trash, restorable

- **Test ID**: UNIT-STOR-004
  - **Scenario**: Concurrent access handling
  - **Expected**: File locking prevents conflicts

- **Test ID**: UNIT-STOR-005
  - **Scenario**: Cache performance
  - **Expected**: LRU cache improves read performance

#### C. IDE Module Tests
- **Test ID**: UNIT-IDE-001
  - **Scenario**: Module registration and discovery
  - **Expected**: All IDE types properly registered

- **Test ID**: UNIT-IDE-002
  - **Scenario**: Type adapter configuration
  - **Expected**: Correct adapter loaded for file type

- **Test ID**: UNIT-IDE-003
  - **Scenario**: Store state management
  - **Expected**: State changes propagate correctly

- **Test ID**: UNIT-IDE-004
  - **Scenario**: Hook functionality
  - **Expected**: Hooks return correct state slices

#### D. Environment Manager Tests
- **Test ID**: UNIT-ENV-001
  - **Scenario**: Environment creation and switching
  - **Expected**: Active environment changes correctly

- **Test ID**: UNIT-ENV-002
  - **Scenario**: Variable inheritance
  - **Expected**: Environment inherits global variables

- **Test ID**: UNIT-ENV-003
  - **Scenario**: Secret encryption/decryption
  - **Expected**: Secrets stored encrypted, retrieved decrypted

### 2. Integration Tests

#### A. IDE Workflow Tests
- **Test ID**: INT-FLOW-001
  - **Scenario**: Create -> Edit -> Save workflow
  - **Components**: Storage, IDE module, UI
  - **Expected**: Complete workflow executes successfully

- **Test ID**: INT-FLOW-002
  - **Scenario**: Multi-file dependency resolution
  - **Components**: Multiple IDE modules
  - **Expected**: Dependencies resolved across files

- **Test ID**: INT-FLOW-003
  - **Scenario**: Environment variable usage in API calls
  - **Components**: Environment manager, API module
  - **Expected**: Variables resolved in API requests

#### B. State Synchronization Tests
- **Test ID**: INT-SYNC-001
  - **Scenario**: Client-server state sync
  - **Expected**: State consistent across client/server

- **Test ID**: INT-SYNC-002
  - **Scenario**: Offline queue processing
  - **Expected**: Queued changes sync when online

- **Test ID**: INT-SYNC-003
  - **Scenario**: Conflict resolution
  - **Expected**: Conflicts resolved per strategy

### 3. End-to-End UI Tests (Playwright)

#### A. IDE Core Functionality
- **Test ID**: E2E-IDE-001
  - **Scenario**: Create new file via UI
  - **Steps**: Navigate -> Click New -> Select type -> Save
  - **Expected**: File created and appears in file tree

- **Test ID**: E2E-IDE-002
  - **Scenario**: Edit and save file
  - **Steps**: Open file -> Make changes -> Save
  - **Expected**: Changes persisted, version updated

- **Test ID**: E2E-IDE-003
  - **Scenario**: File tree navigation
  - **Steps**: Expand folders -> Click files
  - **Expected**: Correct files open in editor

#### B. Variable Management UI
- **Test ID**: E2E-VAR-001
  - **Scenario**: Add global variable
  - **Steps**: Open variables -> Add -> Enter details -> Save
  - **Expected**: Variable available in picker

- **Test ID**: E2E-VAR-002
  - **Scenario**: Use variable picker in editor
  - **Steps**: Type {{ -> Select from picker
  - **Expected**: Variable inserted correctly

- **Test ID**: E2E-VAR-003
  - **Scenario**: Environment-specific variable override
  - **Steps**: Switch env -> Override variable -> Test usage
  - **Expected**: Environment value used

#### C. OpenAPI Module Tests
- **Test ID**: E2E-API-001
  - **Scenario**: Import OpenAPI spec
  - **Steps**: New -> OpenAPI -> Import -> Select file
  - **Expected**: Spec parsed and displayed

- **Test ID**: E2E-API-002
  - **Scenario**: Generate API client
  - **Steps**: Open spec -> Configure -> Generate
  - **Expected**: Client code generated

#### D. Service Connection Tests
- **Test ID**: E2E-SVC-001
  - **Scenario**: Create service connection
  - **Steps**: New -> Service -> Configure endpoint
  - **Expected**: Connection established

- **Test ID**: E2E-SVC-002
  - **Scenario**: Test connection with variables
  - **Steps**: Use {{base_url}} in config -> Test
  - **Expected**: Variable resolved, connection works

## Test Data Requirements

### Environment Configurations
```json
{
  "environments": [
    {
      "name": "development",
      "variables": {
        "base_url": "http://localhost:3000",
        "api_version": "v1"
      }
    },
    {
      "name": "production",
      "variables": {
        "base_url": "https://api.example.com",
        "api_version": "v2"
      }
    }
  ]
}
```

### Sample Files
- OpenAPI spec: `petstore.openapi.json`
- JSON data: `test-data.json`
- Service config: `test-service.json`

## Success Criteria
- All unit tests pass with 100% of critical paths covered
- Integration tests demonstrate proper component interaction
- E2E tests complete without errors or timeouts
- Variable resolution works consistently across all contexts
- No regression in existing functionality

## Test Execution Strategy
1. Run unit tests on every commit
2. Run integration tests before merging
3. Run E2E tests nightly and before releases
4. Performance benchmarks tracked over time