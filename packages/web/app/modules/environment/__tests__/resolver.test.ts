/**
 * Unit tests for the environment variable resolution system
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { 
  resolveVariable, 
  resolveTemplate, 
  getAllVariables,
  isValidVariableName,
  getSecretVaultKey
} from "../resolver";
import { setVault, getVault, MemoryVault } from "../vault";
import type { IDEEnvironmentConfig } from "../types";

describe("Environment Variable Resolution", () => {
  let testConfig: IDEEnvironmentConfig;
  let vault: MemoryVault;
  let originalVault: any;

  beforeEach(async () => {
    // Save the original vault to restore later
    originalVault = getVault();
    
    // Set up test vault
    vault = new MemoryVault();
    setVault(vault);

    // Set up test configuration
    testConfig = {
      activeEnvironment: "dev",
      globals: {
        variables: {
          "API_URL": {
            key: "API_URL",
            value: "https://api.example.com",
            type: "variable",
            description: "Base API URL",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
          },
          "TIMEOUT": {
            key: "TIMEOUT",
            value: "30000",
            type: "variable",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
          }
        },
        secrets: {
          "API_KEY": {
            key: "API_KEY",
            description: "API authentication key",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
          }
        }
      },
      environments: {
        dev: {
          id: "dev",
          name: "Development",
          description: "Development environment",
          color: "#00ff00",
          variables: {
            "API_URL": "https://dev.api.example.com",
            "DEBUG": "true"
          },
          secrets: {
            "DB_PASSWORD": {
              key: "DB_PASSWORD",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z"
            }
          },
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        },
        prod: {
          id: "prod",
          name: "Production",
          description: "Production environment",
          color: "#ff0000",
          variables: {
            "API_URL": "https://prod.api.example.com",
            "DEBUG": "false"
          },
          secrets: {
            "DB_PASSWORD": {
              key: "DB_PASSWORD",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z"
            }
          },
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        }
      },
      metadata: {
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        version: "1.0.0"
      }
    };

    // Set up test secrets in vault
    await vault.setSecret("global:API_KEY", "test-api-key");
    await vault.setSecret("env:dev:DB_PASSWORD", "dev-db-password");
    await vault.setSecret("env:prod:DB_PASSWORD", "prod-db-password");
  });

  afterEach(async () => {
    // Clear the test vault if it has a clear method
    if (vault && typeof (vault as any).clear === 'function') {
      await (vault as any).clear();
    }
    
    // Restore the original vault
    if (originalVault) {
      setVault(originalVault);
    }
  });

  describe("resolveVariable", () => {
    it("should resolve environment-specific variable over global", async () => {
      const result = await resolveVariable("API_URL", testConfig, "dev");
      
      expect(result).toBeDefined();
      expect(result!.key).toBe("API_URL");
      expect(result!.value).toBe("https://dev.api.example.com");
      expect(result!.type).toBe("variable");
      expect(result!.source).toBe("environment");
      expect(result!.environment).toBe("dev");
    });

    it("should resolve global variable when not in environment", async () => {
      const result = await resolveVariable("TIMEOUT", testConfig, "dev");
      
      expect(result).toBeDefined();
      expect(result!.key).toBe("TIMEOUT");
      expect(result!.value).toBe("30000");
      expect(result!.type).toBe("variable");
      expect(result!.source).toBe("global");
      expect(result!.environment).toBeUndefined();
    });

    it("should resolve environment-specific secret", async () => {
      const result = await resolveVariable("DB_PASSWORD", testConfig, "dev");
      
      expect(result).toBeDefined();
      expect(result!.key).toBe("DB_PASSWORD");
      expect(result!.value).toBe("dev-db-password");
      expect(result!.type).toBe("secret");
      expect(result!.source).toBe("environment");
      expect(result!.environment).toBe("dev");
    });

    it("should resolve global secret", async () => {
      const result = await resolveVariable("API_KEY", testConfig, "dev");
      
      expect(result).toBeDefined();
      expect(result!.key).toBe("API_KEY");
      expect(result!.value).toBe("test-api-key");
      expect(result!.type).toBe("secret");
      expect(result!.source).toBe("global");
    });

    it("should use active environment when none specified", async () => {
      const result = await resolveVariable("API_URL", testConfig);
      
      expect(result).toBeDefined();
      expect(result!.value).toBe("https://dev.api.example.com");
      expect(result!.environment).toBe("dev");
    });

    it("should return null for non-existent variable", async () => {
      const result = await resolveVariable("NON_EXISTENT", testConfig);
      expect(result).toBeNull();
    });

    it("should handle different environments correctly", async () => {
      const devResult = await resolveVariable("DEBUG", testConfig, "dev");
      const prodResult = await resolveVariable("DEBUG", testConfig, "prod");
      
      expect(devResult!.value).toBe("true");
      expect(prodResult!.value).toBe("false");
    });
  });

  describe("resolveTemplate", () => {
    it("should resolve single variable in template", async () => {
      const template = "API endpoint: {{API_URL}}";
      const result = await resolveTemplate(template, testConfig, "dev");
      
      expect(result).toBe("API endpoint: https://dev.api.example.com");
    });

    it("should resolve multiple variables in template", async () => {
      const template = "{{API_URL}}/data?debug={{DEBUG}}";
      const result = await resolveTemplate(template, testConfig, "dev");
      
      expect(result).toBe("https://dev.api.example.com/data?debug=true");
    });

    it("should resolve variables with spaces in template", async () => {
      const template = "URL: {{ API_URL }} Debug: {{ DEBUG }}";
      const result = await resolveTemplate(template, testConfig, "dev");
      
      expect(result).toBe("URL: https://dev.api.example.com Debug: true");
    });

    it("should resolve secrets in template", async () => {
      const template = "Connection: {{DB_PASSWORD}}@localhost";
      const result = await resolveTemplate(template, testConfig, "dev");
      
      expect(result).toBe("Connection: dev-db-password@localhost");
    });

    it("should handle mixed variables and secrets", async () => {
      const template = "{{API_URL}} with key {{API_KEY}}";
      const result = await resolveTemplate(template, testConfig, "dev");
      
      expect(result).toBe("https://dev.api.example.com with key test-api-key");
    });

    it("should leave unresolved variables as placeholders", async () => {
      const template = "{{API_URL}} and {{UNKNOWN_VAR}}";
      const result = await resolveTemplate(template, testConfig, "dev");
      
      expect(result).toBe("https://dev.api.example.com and {{UNKNOWN_VAR}}");
    });

    it("should handle empty template", async () => {
      const result = await resolveTemplate("", testConfig);
      expect(result).toBe("");
    });

    it("should handle template with no variables", async () => {
      const template = "This is a plain string";
      const result = await resolveTemplate(template, testConfig);
      
      expect(result).toBe("This is a plain string");
    });

    it("should handle nested brackets correctly", async () => {
      // The regex pattern /\{\{([^}]+)\}\}/g won't match triple brackets properly
      // {{{API_URL}}} won't be matched because the pattern stops at the first }
      const template = "Value: {{{API_URL}}}";
      const result = await resolveTemplate(template, testConfig, "dev");
      
      // The pattern doesn't match triple brackets, so it remains unchanged
      expect(result).toBe("Value: {{{API_URL}}}");
    });
  });

  describe("getAllVariables", () => {
    it("should return all variables for an environment", async () => {
      const variables = await getAllVariables(testConfig, "dev");
      
      // Should have environment-specific variables and non-overridden globals
      const variableKeys = variables.map(v => v.key);
      expect(variableKeys).toContain("API_URL"); // environment-specific
      expect(variableKeys).toContain("DEBUG"); // environment-specific
      expect(variableKeys).toContain("TIMEOUT"); // global
      expect(variableKeys).toContain("DB_PASSWORD"); // environment secret
      expect(variableKeys).toContain("API_KEY"); // global secret
      
      // Check environment-specific override
      const apiUrl = variables.find(v => v.key === "API_URL");
      expect(apiUrl!.value).toBe("https://dev.api.example.com");
      expect(apiUrl!.source).toBe("environment");
    });

    it("should not duplicate overridden variables", async () => {
      const variables = await getAllVariables(testConfig, "dev");
      
      // API_URL should appear only once (environment version)
      const apiUrlVars = variables.filter(v => v.key === "API_URL");
      expect(apiUrlVars.length).toBe(1);
      expect(apiUrlVars[0].source).toBe("environment");
    });

    it("should handle environment with no variables", async () => {
      testConfig.environments.empty = {
        id: "empty",
        name: "Empty",
        variables: {},
        secrets: {},
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      };
      
      const variables = await getAllVariables(testConfig, "empty");
      
      // Should only have global variables
      expect(variables.length).toBeGreaterThan(0);
      expect(variables.every(v => v.source === "global")).toBe(true);
    });

    it("should use active environment when none specified", async () => {
      const variables = await getAllVariables(testConfig);
      
      // Should use dev environment
      const apiUrl = variables.find(v => v.key === "API_URL");
      expect(apiUrl!.value).toBe("https://dev.api.example.com");
    });
  });

  describe("isValidVariableName", () => {
    it("should accept valid variable names", () => {
      expect(isValidVariableName("API_KEY")).toBe(true);
      expect(isValidVariableName("_private")).toBe(true);
      expect(isValidVariableName("var123")).toBe(true);
      expect(isValidVariableName("my-var")).toBe(true);
      expect(isValidVariableName("config.value")).toBe(true);
      expect(isValidVariableName("APP_CONFIG_VALUE")).toBe(true);
    });

    it("should reject invalid variable names", () => {
      expect(isValidVariableName("123var")).toBe(false);
      expect(isValidVariableName("my var")).toBe(false);
      expect(isValidVariableName("var!able")).toBe(false);
      expect(isValidVariableName("")).toBe(false);
      expect(isValidVariableName("-var")).toBe(false);
      expect(isValidVariableName(".var")).toBe(false);
    });
  });

  describe("getSecretVaultKey", () => {
    it("should generate correct vault key for global secret", () => {
      const key = getSecretVaultKey("API_KEY", "global");
      expect(key).toBe("global:API_KEY");
    });

    it("should generate correct vault key for environment secret", () => {
      const key = getSecretVaultKey("DB_PASSWORD", "environment", "dev");
      expect(key).toBe("env:dev:DB_PASSWORD");
    });

    it("should handle missing environment ID for environment source", () => {
      const key = getSecretVaultKey("SECRET", "environment");
      expect(key).toBe("global:SECRET");
    });
  });

  describe("Complex scenarios", () => {
    it("should handle circular references gracefully", async () => {
      // Create a template that references itself indirectly
      testConfig.globals.variables["SELF_REF"] = {
        key: "SELF_REF",
        value: "{{SELF_REF}}",
        type: "variable",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      };
      
      const template = "Value: {{SELF_REF}}";
      const result = await resolveTemplate(template, testConfig);
      
      // Should not infinitely recurse
      expect(result).toBe("Value: {{SELF_REF}}");
    });

    it("should handle special characters in variable values", async () => {
      testConfig.globals.variables["SPECIAL"] = {
        key: "SPECIAL",
        value: "value with $pecial ch@rs & symbols",
        type: "variable",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      };
      
      const template = "Special: {{SPECIAL}}";
      const result = await resolveTemplate(template, testConfig);
      
      expect(result).toBe("Special: value with $pecial ch@rs & symbols");
    });

    it("should handle JSON strings in variables", async () => {
      testConfig.globals.variables["JSON_VAR"] = {
        key: "JSON_VAR",
        value: '{"key": "value", "nested": {"data": true}}',
        type: "variable",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      };
      
      const template = "Config: {{JSON_VAR}}";
      const result = await resolveTemplate(template, testConfig);
      
      expect(result).toBe('Config: {"key": "value", "nested": {"data": true}}');
    });
  });
});