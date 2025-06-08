# Environment Module

The Environment module provides a comprehensive system for managing global variables and environment-specific overrides in the IDE.

## Overview

This module allows you to:
- Define global variables accessible across all environments
- Create environment-specific overrides for variables
- Manage secrets securely with vault storage
- Use variables in other IDE modules via template interpolation
- Switch between environments easily

## Key Concepts

### Variables vs Secrets
- **Variables**: Plain text values stored in the configuration
- **Secrets**: Sensitive values stored encrypted in a vault, only fetched when needed

### Variable Resolution
Variables use the `{{variable_name}}` syntax and are resolved in this order:
1. Environment-specific value (if an environment is active)
2. Global value
3. Undefined (if not found)

### Environment Inheritance
Environment variables override global variables with the same name. This allows you to have different values for development, staging, and production.

## Usage

### In ServiceConnection
```typescript
// URL field
https://{{API_HOST}}/api/v1

// Headers
Authorization: Bearer {{API_TOKEN}}

// Any field that accepts strings
username: {{DB_USER}}
```

### Managing Variables

1. **Via UI**: Navigate to IDE → Environment Variables (or right-click in file tree)
2. **Global Variables**: Available in all environments
3. **Environment Variables**: Override globals when that environment is active

### API

```typescript
import { 
  useVariable, 
  useTemplate, 
  useActiveEnvironment,
  VariablePicker 
} from "~/modules/environment";

// Get a single variable
const { value, loading, error } = useVariable("API_KEY");

// Resolve a template string
const { resolved } = useTemplate("https://{{API_HOST}}/users/{{USER_ID}}");

// Get active environment
const { environment, isGlobal } = useActiveEnvironment();

// Variable picker component
<VariablePicker onSelect={(key) => console.log(key)} />
```

## Architecture

### Store (`store.ts`)
- Singleton store managing all environment state
- Handles variable CRUD operations
- Manages cache for resolved values

### Vault (`vault.ts`)
- Secure storage for secrets
- Currently uses encrypted localStorage
- Can be extended to use cloud vaults (AWS Secrets Manager, HashiCorp Vault)

### Resolver (`resolver.ts`)
- Handles variable resolution logic
- Template string interpolation
- Variable extraction from strings

### Components
- `EnvironmentManager`: Main UI for managing variables
- `EnvironmentSelector`: Dropdown for switching environments
- `VariablePicker`: UI for selecting variables
- `SecretInput`: Special input for secret values with masking

## Security Considerations

- Secrets are never logged or displayed in plain text
- Secrets are encrypted at rest
- Secret values are only shown when input has focus
- Access logging can be added for audit trails

## Future Enhancements

- Cloud vault integration
- Secret rotation
- Access control per variable
- Variable usage tracking
- Import/export with encryption
- Template validation