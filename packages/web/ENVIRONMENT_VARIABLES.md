# Environment Variables Feature

## Overview

The Environment Variables feature provides a comprehensive system for managing project-level variables and secrets within the IDE. This feature integrates seamlessly with the existing variable mapping system, allowing you to create global variables and environment-specific overrides while maintaining secure storage for sensitive data.

## Table of Contents

- [Core Concepts](#core-concepts)
- [Getting Started](#getting-started)
- [Environment Management](#environment-management)
- [Variable Types](#variable-types)
- [Using Variables in Mappings](#using-variables-in-mappings)
- [Variable Resolution](#variable-resolution)
- [Security](#security)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Core Concepts

### Variables vs Secrets

- **Variables**: Plain text configuration values (API endpoints, feature flags, etc.)
- **Secrets**: Sensitive data stored encrypted in a secure vault (API keys, tokens, passwords)

### Global vs Environment-Specific

- **Global**: Default values that apply to all environments
- **Environment-Specific**: Values that override globals for specific environments (dev, staging, prod)

### Variable Resolution Hierarchy

```
Environment-Specific Value → Global Value → null
```

Environment-specific values always take precedence over global values.

## Getting Started

### 1. Access Environment Manager

Right-click on the project name in the file tree and select **"Environment Variables"** from the context menu.

### 2. Create Your First Environment

1. Go to the **Environments** tab
2. Click **"Add Environment"**
3. Fill in:
   - **Name**: Development
   - **Description**: Development environment
   - **Color**: Choose a color for visual identification
4. Click **"Create"**

### 3. Add Global Variables

1. Go to the **Variables** tab
2. Select **"Global Variables"** from the dropdown
3. Click **"Add Variable"**
4. Fill in:
   - **Scope**: Global
   - **Key**: API_HOST
   - **Value**: https://api.example.com
   - **Description**: Base API endpoint
5. Click **"Add"**

### 4. Add Environment-Specific Override

1. Select your **"Development"** environment
2. Click **"Add Variable"**
3. Fill in:
   - **Scope**: Environment
   - **Key**: API_HOST
   - **Value**: https://dev-api.example.com
4. Click **"Add"**

## Environment Management

### Creating Environments

Environments represent different deployment contexts (development, staging, production).

```typescript
interface Environment {
  id: string;
  name: string;
  description?: string;
  color?: string;
  variables: Record<string, string>;
  secrets: Record<string, SecretReference>;
  createdAt: string;
  updatedAt: string;
}
```

### Active Environment

Set an active environment to:
- Use as the default context for variable resolution
- Provide context for the variable mapping UI
- Filter variables in dropdowns

### Environment Colors

Assign colors to environments for visual identification throughout the IDE.

## Variable Types

### 1. Project Variables

For non-sensitive configuration data:

```typescript
{
  internal: "project-variable",
  key: "API_HOST",
  environmentId?: "development" // Optional, uses active environment if not specified
}
```

### 2. Project Secrets

For sensitive data like API keys:

```typescript
{
  internal: "project-secret", 
  key: "API_TOKEN",
  environmentId?: "production"
}
```

### Variable Naming Rules

- Must start with a letter or underscore
- Can contain letters, numbers, underscores, dashes, and dots
- Examples: `API_HOST`, `feature_flags`, `oauth.client-id`

## Using Variables in Mappings

### In Variable Mapping Editor

1. Open any file's variable mapping
2. Add a new variable or edit existing
3. Select type: **"Project Variable"** or **"Project Secret"**
4. Choose/enter the variable key
5. Optionally select specific environment

### Example Mapping

```typescript
// Input variables for an API call
{
  baseUrl: {
    internal: "project-variable",
    key: "API_HOST"
  },
  authorization: {
    internal: "project-secret", 
    key: "API_TOKEN"
  },
  endpoint: "/users"
}

// Resolves to:
{
  baseUrl: "https://api.example.com",
  authorization: "Bearer sk-1234567890abcdef",
  endpoint: "/users"
}
```

### Autocomplete Support

The variable input provides autocomplete for:
- Existing variable keys
- Available environments
- Variable descriptions and metadata

## Variable Resolution

### Resolution Process

1. **Check Environment-Specific**: Look for value in specified/active environment
2. **Check Global**: Fall back to global value if environment value doesn't exist
3. **Return null**: If neither exists

### Resolution Examples

**Configuration:**
```typescript
Global Variables:
  API_HOST: "https://api.example.com"
  
Development Environment:
  API_HOST: "https://dev-api.example.com"
  DEBUG: "true"

Production Environment:
  API_HOST: "https://prod-api.example.com"
```

**Resolution Results:**
```typescript
// In Development environment:
API_HOST → "https://dev-api.example.com" (environment override)
DEBUG → "true" (environment only)
API_VERSION → "https://api.example.com" (falls back to global)

// In Production environment:
API_HOST → "https://prod-api.example.com" (environment override)
DEBUG → null (not defined anywhere)
```

### Using the Resolution Hooks

```typescript
import { useResolvedVariables, useProjectVariables } from "~/modules/ide/hooks";

function MyComponent() {
  // Get all resolved variables for active environment
  const variables = useResolvedVariables();
  
  // Get list of available project variables
  const availableVars = useProjectVariables();
  
  // Resolve specific variable
  const apiHost = useResolvedVariable("API_HOST");
  
  return (
    <div>
      API Host: {apiHost}
      Debug Mode: {variables.DEBUG || "false"}
    </div>
  );
}
```

## Security

### Secret Storage

- Secrets are **never stored in plain text**
- Values are encrypted before storage in the vault
- Vault keys are namespaced by scope and environment
- Local development uses encrypted localStorage
- Production can integrate with cloud vaults (AWS Secrets Manager, HashiCorp Vault)

### Vault Key Format

```typescript
// Global secrets
global:${secretKey}

// Environment secrets  
env:${environmentId}:${secretKey}
```

### Security Best Practices

1. **Use Secrets for Sensitive Data**: Never store API keys, tokens, or passwords as variables
2. **Separate Environments**: Use different secrets for different environments
3. **Rotate Regularly**: Update secret values periodically
4. **Principle of Least Privilege**: Only grant access to necessary secrets

## API Reference

### Core Types

```typescript
interface ProjectVariable {
  internal: "project-variable";
  key: string;
  environmentId?: string;
}

interface ProjectSecret {
  internal: "project-secret";
  key: string;
  environmentId?: string;
}

interface Variable {
  key: string;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface SecretReference {
  key: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  lastAccessed?: string;
}
```

### Resolution Functions

```typescript
// Resolve a project variable
async function resolveProjectVariable(
  projectVar: ProjectVariable,
  project: Project
): Promise<string | null>

// Resolve a project secret
async function resolveProjectSecret(
  projectSecret: ProjectSecret,
  project: Project
): Promise<string | null>

// Get all available variables
async function getAllProjectVariables(
  project: Project,
  environmentId?: string
): Promise<ResolvedVariable[]>
```

### React Hooks

```typescript
// Get all resolved variables
const variables = useResolvedVariables();

// Get specific resolved variable
const value = useResolvedVariable(key: string);

// Get available project variables for UI
const projectVars = useProjectVariables();

// Get raw variables (with internal types)
const rawVars = useVariableResolver();
```

### Vault Interface

```typescript
interface IVault {
  getSecret(key: string): Promise<string | null>;
  setSecret(key: string, value: string): Promise<void>;
  deleteSecret(key: string): Promise<void>;
  listSecrets(): Promise<string[]>;
}
```

## Examples

### Basic Setup

```typescript
// 1. Create environments
const environments = {
  development: {
    name: "Development",
    variables: {
      API_HOST: "http://localhost:3000",
      DEBUG: "true"
    },
    secrets: {
      API_TOKEN: { key: "API_TOKEN", createdAt: "2024-01-01" }
    }
  },
  production: {
    name: "Production", 
    variables: {
      API_HOST: "https://api.mycompany.com",
      DEBUG: "false"
    },
    secrets: {
      API_TOKEN: { key: "API_TOKEN", createdAt: "2024-01-01" }
    }
  }
};

// 2. Global fallbacks
const globals = {
  variables: {
    API_VERSION: "v1",
    TIMEOUT: "30000"
  },
  secrets: {
    ANALYTICS_KEY: { key: "ANALYTICS_KEY", createdAt: "2024-01-01" }
  }
};
```

### API Configuration

```typescript
// Service connection using environment variables
{
  baseURL: {
    internal: "project-variable",
    key: "API_HOST"
  },
  headers: {
    Authorization: {
      internal: "project-secret",
      key: "API_TOKEN" 
    },
    "X-API-Version": {
      internal: "project-variable",
      key: "API_VERSION"
    }
  },
  timeout: {
    internal: "project-variable", 
    key: "TIMEOUT"
  }
}
```

### Feature Flags

```typescript
// Development environment
{
  ENABLE_BETA_FEATURES: "true",
  ENABLE_DEBUG_TOOLS: "true",
  CACHE_DURATION: "0"
}

// Production environment  
{
  ENABLE_BETA_FEATURES: "false",
  ENABLE_DEBUG_TOOLS: "false", 
  CACHE_DURATION: "3600"
}

// Usage in components
const betaFeatures = useResolvedVariable("ENABLE_BETA_FEATURES") === "true";
```

### Multi-Region Setup

```typescript
// US Environment
{
  API_HOST: "https://us-api.example.com",
  CDN_HOST: "https://us-cdn.example.com",
  REGION: "us-east-1"
}

// EU Environment
{
  API_HOST: "https://eu-api.example.com", 
  CDN_HOST: "https://eu-cdn.example.com",
  REGION: "eu-west-1"
}
```

## Best Practices

### Variable Organization

1. **Use Descriptive Names**: `USER_SERVICE_HOST` instead of `HOST1`
2. **Group Related Variables**: Use prefixes like `AUTH_`, `DB_`, `CACHE_`
3. **Document Everything**: Add descriptions to explain variable purposes
4. **Use Consistent Naming**: Stick to UPPER_SNAKE_CASE for environment variables

### Environment Strategy

1. **Mirror Production**: Development environments should mirror production structure
2. **Minimize Differences**: Only override what's necessary per environment
3. **Document Dependencies**: Note which variables are required for each environment
4. **Test Configurations**: Verify all environments have required variables

### Security Guidelines

1. **Never Commit Secrets**: Use the vault, never put secrets in code
2. **Rotate Credentials**: Update API keys and tokens regularly
3. **Use Environment Separation**: Different credentials for different environments
4. **Monitor Access**: Track when secrets are accessed (lastAccessed field)

### Development Workflow

1. **Start with Globals**: Define common variables globally first
2. **Add Environment Overrides**: Override only what's different per environment
3. **Test Resolution**: Use the resolution demo to verify variable resolution
4. **Document Changes**: Update descriptions when modifying variables

### Performance Tips

1. **Cache Resolutions**: Variables are resolved at runtime, consider caching for frequently accessed values
2. **Minimize Vault Calls**: Secrets are retrieved from vault, batch operations when possible
3. **Use Global Defaults**: Reduces the need for environment-specific configurations

## Migration Guide

### From Hardcoded Values

```typescript
// Before: Hardcoded
const apiUrl = "https://api.example.com";

// After: Environment variable
const apiUrl = useResolvedVariable("API_HOST");
```

### From Config Files

```typescript
// Before: config.json
{
  "apiHost": "https://api.example.com",
  "apiKey": "secret-key"
}

// After: Environment variables
API_HOST → "https://api.example.com" (variable)
API_KEY → "secret-key" (secret in vault)
```

### From Environment Variables

```typescript
// Before: process.env
const apiHost = process.env.API_HOST;

// After: Project variables
const apiHost = useResolvedVariable("API_HOST");
```

## Troubleshooting

### Common Issues

1. **Variable Returns null**: 
   - Check if variable exists in current environment or globally
   - Verify variable key spelling
   - Ensure environment is properly selected

2. **Secret Access Fails**:
   - Verify secret exists in vault
   - Check environment scope
   - Ensure vault permissions

3. **Resolution Order Issues**:
   - Remember environment values override globals
   - Check which environment is active
   - Use resolution demo to debug

4. **Environment Selector Not Working**:
   - Fixed: Environment selector now properly uses the centralized IDE store
   - The selector was using a separate `environmentStore` which caused disconnection
   - Now uses `useIde()` and `useIdeTrigger()` hooks for proper state management

5. **"expandedPaths is not iterable" Error**:
   - Fixed: Added default values and null checks in file-tree component
   - This error occurred when expandedPaths was undefined
   - Now safely handles undefined or null expandedPaths

6. **IndexedDB Promise Cloning Error**:
   - Fixed: Store handlers no longer return values when mutating state
   - Added `cleanContext()` function to remove non-serializable values before persistence
   - Async handlers in mutative should not return any value
   - Synchronous handlers that mutate should also not return values

### Debug Tools

1. **Resolution Demo Component**: Test variable resolution in real-time
2. **Environment Manager**: View all variables and their scopes
3. **Browser DevTools**: Check vault contents (encrypted)
4. **Hook Debugging**: Use React DevTools to inspect hook values

## Future Enhancements

- **Cloud Vault Integration**: AWS Secrets Manager, Azure Key Vault
- **Variable Templates**: Predefined variable sets for common scenarios
- **Import/Export**: Backup and restore environment configurations
- **Variable Dependencies**: Declare relationships between variables
- **Validation Rules**: Ensure variable values meet requirements
- **Audit Logging**: Track all variable and secret modifications
- **Team Sharing**: Share environment configurations across team members

---

This environment variables system provides a robust foundation for managing configuration across different deployment contexts while maintaining security and ease of use.

## MoneyWorks MCP Bearer Token Configuration

### Overview

The MoneyWorks MCP client now supports bearer token authentication for secure API access. This allows the MCP server to authenticate with MoneyWorks APIs using a bearer token.

### Configuration

Add the following environment variable to your `.env` file:

```bash
# MoneyWorks Bearer Token (optional)
MW_BEARER_TOKEN=your-bearer-token-here
```

### How It Works

1. The bearer token is read from the `MW_BEARER_TOKEN` environment variable
2. When the MCP client connects to the MCP server, it passes the token via the `MW_BEARER_TOKEN` environment variable
3. The MCP server can then use this token to authenticate API requests to MoneyWorks

### Security Considerations

- **Never commit bearer tokens** to version control
- Use environment-specific tokens for different environments (dev, staging, prod)
- Rotate tokens regularly
- Consider using the project secrets feature for storing bearer tokens:

```typescript
// Instead of environment variable, use project secret
{
  bearerToken: {
    internal: "project-secret",
    key: "MW_BEARER_TOKEN",
    environmentId: "production"
  }
}
```

### Example Usage

The bearer token is automatically included when initializing the MCP client:

```typescript
const mcpClient = getMCPClient({
  command: "bun",
  args: ["run", "/path/to/mcp-server/src/index.ts"],
  env: {
    MW_CONFIG_PATH: mwConfigPath,
  },
  bearerToken: process.env.MW_BEARER_TOKEN, // Automatically passed to MCP server
});
```

The MCP server will receive the token via the `MW_BEARER_TOKEN` environment variable and can use it for API authentication.