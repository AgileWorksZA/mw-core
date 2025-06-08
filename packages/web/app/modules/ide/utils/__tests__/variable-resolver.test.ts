/**
 * Unit tests for the IDE variable resolver
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { 
  resolveProjectVariable, 
  resolveProjectSecret, 
  getAllProjectVariables,
  isValidVariableName
} from "../variable-resolver";
import { setVault, getVault, MemoryVault } from "../vault";
import type { Project } from "../../types";

describe("IDE Variable Resolver", () => {
  let testProject: Project;
  let vault: MemoryVault;
  let originalVault: any;

  beforeEach(async () => {
    // Save the original vault to restore later
    originalVault = getVault();
    
    // Set up test vault
    vault = new MemoryVault();
    setVault(vault);

    // Set up test project
    testProject = {
      id: "test-project",
      name: "Test Project",
      fileOrder: [],
      expandedPaths: [],
      files: {},
      environmentConfig: {
        activeEnvironment: "development",
        globals: {
          variables: {
            "BASE_URL": {
              key: "BASE_URL",
              value: "https://api.example.com",
              type: "variable",
              description: "Base API URL",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z"
            },
            "LOG_LEVEL": {
              key: "LOG_LEVEL",
              value: "info",
              type: "variable",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z"
            }
          },
          secrets: {
            "MASTER_KEY": {
              key: "MASTER_KEY",
              description: "Master API key",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z"
            }
          }
        },
        environments: {
          development: {
            id: "development",
            name: "Development",
            description: "Development environment",
            color: "#00ff00",
            variables: {
              "BASE_URL": "http://localhost:3000",
              "FEATURE_FLAG": "enabled"
            },
            secrets: {
              "DB_CONN": {
                key: "DB_CONN",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z"
              }
            },
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z"
          },
          staging: {
            id: "staging",
            name: "Staging",
            variables: {
              "BASE_URL": "https://staging.api.example.com",
              "FEATURE_FLAG": "disabled"
            },
            secrets: {
              "DB_CONN": {
                key: "DB_CONN",
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
      }
    };

    // Set up test secrets
    await vault.setSecret("global:MASTER_KEY", "master-secret-key");
    await vault.setSecret("env:development:DB_CONN", "dev-db-connection");
    await vault.setSecret("env:staging:DB_CONN", "staging-db-connection");
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

  describe("resolveProjectVariable", () => {
    it("should resolve environment variable over global", async () => {
      const projectVar = {
        internal: "project-variable" as const,
        key: "BASE_URL"
      };
      
      const result = await resolveProjectVariable(projectVar, testProject);
      expect(result).toBe("http://localhost:3000");
    });

    it("should resolve global variable when not in environment", async () => {
      const projectVar = {
        internal: "project-variable" as const,
        key: "LOG_LEVEL"
      };
      
      const result = await resolveProjectVariable(projectVar, testProject);
      expect(result).toBe("info");
    });

    it("should resolve from specific environment", async () => {
      const projectVar = {
        internal: "project-variable" as const,
        key: "BASE_URL",
        environmentId: "staging"
      };
      
      const result = await resolveProjectVariable(projectVar, testProject);
      expect(result).toBe("https://staging.api.example.com");
    });

    it("should return null for non-existent variable", async () => {
      const projectVar = {
        internal: "project-variable" as const,
        key: "NON_EXISTENT"
      };
      
      const result = await resolveProjectVariable(projectVar, testProject);
      expect(result).toBeNull();
    });

    it("should handle missing environment config", async () => {
      const projectWithoutConfig = { ...testProject, environmentConfig: undefined };
      const projectVar = {
        internal: "project-variable" as const,
        key: "BASE_URL"
      };
      
      const result = await resolveProjectVariable(projectVar, projectWithoutConfig);
      expect(result).toBeNull();
    });
  });

  describe("resolveProjectSecret", () => {
    it("should resolve environment secret over global", async () => {
      const projectSecret = {
        internal: "project-secret" as const,
        key: "DB_CONN"
      };
      
      const result = await resolveProjectSecret(projectSecret, testProject);
      expect(result).toBe("dev-db-connection");
    });

    it("should resolve global secret", async () => {
      const projectSecret = {
        internal: "project-secret" as const,
        key: "MASTER_KEY"
      };
      
      const result = await resolveProjectSecret(projectSecret, testProject);
      expect(result).toBe("master-secret-key");
    });

    it("should resolve from specific environment", async () => {
      const projectSecret = {
        internal: "project-secret" as const,
        key: "DB_CONN",
        environmentId: "staging"
      };
      
      const result = await resolveProjectSecret(projectSecret, testProject);
      expect(result).toBe("staging-db-connection");
    });

    it("should return null for non-existent secret", async () => {
      const projectSecret = {
        internal: "project-secret" as const,
        key: "NON_EXISTENT"
      };
      
      const result = await resolveProjectSecret(projectSecret, testProject);
      expect(result).toBeNull();
    });

    it("should return null if secret not in vault", async () => {
      // Add a secret reference but don't store it in vault
      testProject.environmentConfig!.globals.secrets["MISSING_SECRET"] = {
        key: "MISSING_SECRET",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      };
      
      const projectSecret = {
        internal: "project-secret" as const,
        key: "MISSING_SECRET"
      };
      
      const result = await resolveProjectSecret(projectSecret, testProject);
      expect(result).toBeNull();
    });
  });

  describe("getAllProjectVariables", () => {
    it("should return all variables for active environment", async () => {
      const variables = await getAllProjectVariables(testProject);
      
      // Should include environment-specific and non-overridden globals
      const variableMap = new Map(variables.map(v => [v.key, v]));
      
      expect(variableMap.size).toBe(5); // BASE_URL, FEATURE_FLAG, LOG_LEVEL, DB_CONN, MASTER_KEY
      
      // Check environment overrides
      expect(variableMap.get("BASE_URL")!.value).toBe("http://localhost:3000");
      expect(variableMap.get("BASE_URL")!.source).toBe("environment");
      
      // Check environment-specific
      expect(variableMap.get("FEATURE_FLAG")!.value).toBe("enabled");
      expect(variableMap.get("FEATURE_FLAG")!.source).toBe("environment");
      
      // Check global
      expect(variableMap.get("LOG_LEVEL")!.value).toBe("info");
      expect(variableMap.get("LOG_LEVEL")!.source).toBe("global");
      
      // Check secrets
      expect(variableMap.get("DB_CONN")!.value).toBe("dev-db-connection");
      expect(variableMap.get("DB_CONN")!.type).toBe("secret");
      expect(variableMap.get("MASTER_KEY")!.value).toBe("master-secret-key");
      expect(variableMap.get("MASTER_KEY")!.type).toBe("secret");
    });

    it("should return variables for specific environment", async () => {
      const variables = await getAllProjectVariables(testProject, "staging");
      
      const variableMap = new Map(variables.map(v => [v.key, v]));
      
      // Check staging-specific values
      expect(variableMap.get("BASE_URL")!.value).toBe("https://staging.api.example.com");
      expect(variableMap.get("FEATURE_FLAG")!.value).toBe("disabled");
      expect(variableMap.get("DB_CONN")!.value).toBe("staging-db-connection");
    });

    it("should handle missing environment config", async () => {
      const projectWithoutConfig = { ...testProject, environmentConfig: undefined };
      const variables = await getAllProjectVariables(projectWithoutConfig);
      
      expect(variables).toEqual([]);
    });

    it("should handle non-existent environment", async () => {
      const variables = await getAllProjectVariables(testProject, "non-existent");
      
      // Should only return globals
      expect(variables.every(v => v.source === "global")).toBe(true);
      expect(variables.map(v => v.key)).toContain("LOG_LEVEL");
      expect(variables.map(v => v.key)).toContain("MASTER_KEY");
    });

    it("should not duplicate overridden variables", async () => {
      const variables = await getAllProjectVariables(testProject);
      
      // BASE_URL should appear only once
      const baseUrlCount = variables.filter(v => v.key === "BASE_URL").length;
      expect(baseUrlCount).toBe(1);
    });
  });

  describe("isValidVariableName", () => {
    it("should accept valid variable names", () => {
      const validNames = [
        "API_KEY",
        "_privateVar",
        "variable123",
        "my-variable",
        "config.value",
        "APP_CONFIG_VALUE",
        "a",
        "_",
        "camelCase",
        "PascalCase",
        "snake_case",
        "kebab-case",
        "dot.notation"
      ];
      
      for (const name of validNames) {
        expect(isValidVariableName(name)).toBe(true);
      }
    });

    it("should reject invalid variable names", () => {
      const invalidNames = [
        "123variable",    // starts with number
        "my variable",    // contains space
        "var!able",       // contains special char
        "",               // empty
        "-variable",      // starts with dash
        ".variable",      // starts with dot
        "var@iable",      // contains @
        "var#iable",      // contains #
        "var$iable",      // contains $
        "var%iable",      // contains %
        "var&iable",      // contains &
        "var*iable",      // contains *
        "var(iable",      // contains (
        "var)iable",      // contains )
        "var[iable",      // contains [
        "var]iable",      // contains ]
        "var{iable",      // contains {
        "var}iable",      // contains }
        "var|iable",      // contains |
        "var\\iable",     // contains \
        "var/iable",      // contains /
        "var?iable",      // contains ?
        "var=iable",      // contains =
        "var+iable",      // contains +
      ];
      
      for (const name of invalidNames) {
        expect(isValidVariableName(name)).toBe(false);
      }
    });
  });

  describe("Edge cases and complex scenarios", () => {
    it("should handle project with no environments", async () => {
      testProject.environmentConfig!.environments = {};
      testProject.environmentConfig!.activeEnvironment = undefined;
      
      const variables = await getAllProjectVariables(testProject);
      
      // Should only return globals
      expect(variables.every(v => v.source === "global")).toBe(true);
      expect(variables.length).toBe(3); // LOG_LEVEL, BASE_URL, MASTER_KEY
    });

    it("should handle empty variable values", async () => {
      testProject.environmentConfig!.globals.variables["EMPTY_VAR"] = {
        key: "EMPTY_VAR",
        value: "",
        type: "variable",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      };
      
      const projectVar = {
        internal: "project-variable" as const,
        key: "EMPTY_VAR"
      };
      
      const result = await resolveProjectVariable(projectVar, testProject);
      expect(result).toBe("");
    });

    it("should handle very long variable values", async () => {
      const longValue = "a".repeat(10000);
      testProject.environmentConfig!.globals.variables["LONG_VAR"] = {
        key: "LONG_VAR",
        value: longValue,
        type: "variable",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      };
      
      const projectVar = {
        internal: "project-variable" as const,
        key: "LONG_VAR"
      };
      
      const result = await resolveProjectVariable(projectVar, testProject);
      expect(result).toBe(longValue);
    });

    it("should handle special characters in variable values", async () => {
      const specialValue = '{"key": "value", "special": "chars!@#$%^&*()"}';
      testProject.environmentConfig!.globals.variables["SPECIAL_VAR"] = {
        key: "SPECIAL_VAR",
        value: specialValue,
        type: "variable",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      };
      
      const projectVar = {
        internal: "project-variable" as const,
        key: "SPECIAL_VAR"
      };
      
      const result = await resolveProjectVariable(projectVar, testProject);
      expect(result).toBe(specialValue);
    });
  });
});