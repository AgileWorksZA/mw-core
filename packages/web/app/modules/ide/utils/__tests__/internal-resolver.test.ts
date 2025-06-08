/**
 * Tests for the internal type resolution system
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { 
  resolveInternalType, 
  resolveInternalTypes, 
  createResolutionContext 
} from "../internal-resolver";
import { setVault, getVault, MemoryVault } from "../vault";
import type { 
  Project, 
  ProjectVariable, 
  ProjectSecret, 
  Pointer, 
  Parameter, 
  FromData 
} from "../../types";

describe("Internal Type Resolution", () => {
  let testProject: Project;
  let vault: MemoryVault;
  let originalVault: any;

  beforeEach(() => {
    // Save the original vault to restore later
    originalVault = getVault();
    
    // Set up test vault
    vault = new MemoryVault();
    setVault(vault);

    // Set up test project with environment config
    testProject = {
      id: "test-project",
      name: "Test Project",
      fileOrder: ["file1", "file2"],
      expandedPaths: [],
      files: {
        file1: {
          id: "file1",
          path: "file1.json",
          type: "json",
          mapping: {
            input: {
              variables: {
                inputVar: "test input"
              }
            },
            output: {
              variables: {
                outputVar: "test output"
              }
            }
          }
        },
        file2: {
          id: "file2", 
          path: "file2.json",
          type: "json",
          mapping: {
            input: {
              variables: {}
            },
            output: {
              variables: true // Use input as output
            }
          }
        }
      },
      environmentConfig: {
        activeEnvironment: "dev",
        globals: {
          variables: {
            "GLOBAL_VAR": {
              key: "GLOBAL_VAR",
              value: "global-value",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z"
            }
          },
          secrets: {
            "GLOBAL_SECRET": {
              key: "GLOBAL_SECRET",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z"
            }
          }
        },
        environments: {
          dev: {
            id: "dev",
            name: "Development",
            variables: {
              "DEV_VAR": "dev-value"
            },
            secrets: {
              "DEV_SECRET": {
                key: "DEV_SECRET",
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

    // Set up test secrets in vault
    vault.setSecret("global:GLOBAL_SECRET", "global-secret-value");
    vault.setSecret("env:dev:DEV_SECRET", "dev-secret-value");
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

  describe("ProjectVariable Resolution", () => {
    it("should resolve global project variable", async () => {
      const projectVar: ProjectVariable = {
        internal: "project-variable",
        key: "GLOBAL_VAR"
      };

      const context = createResolutionContext(testProject, "file1");
      const result = await resolveInternalType(projectVar, context);

      expect(result.value).toBe("global-value");
      expect(result.type).toBe("project-variable");
      expect(result.error).toBeUndefined();
    });

    it("should resolve environment-specific project variable", async () => {
      const projectVar: ProjectVariable = {
        internal: "project-variable",
        key: "DEV_VAR",
        environmentId: "dev"
      };

      const context = createResolutionContext(testProject, "file1");
      const result = await resolveInternalType(projectVar, context);

      expect(result.value).toBe("dev-value");
      expect(result.type).toBe("project-variable");
      expect(result.error).toBeUndefined();
    });

    it("should return error for non-existent variable", async () => {
      const projectVar: ProjectVariable = {
        internal: "project-variable",
        key: "NON_EXISTENT"
      };

      const context = createResolutionContext(testProject, "file1");
      const result = await resolveInternalType(projectVar, context);

      expect(result.value).toBeUndefined();
      expect(result.type).toBe("project-variable");
      expect(result.error).toContain("not found");
    });
  });

  describe("ProjectSecret Resolution", () => {
    it("should resolve global project secret", async () => {
      const projectSecret: ProjectSecret = {
        internal: "project-secret",
        key: "GLOBAL_SECRET"
      };

      const context = createResolutionContext(testProject, "file1");
      const result = await resolveInternalType(projectSecret, context);

      expect(result.value).toBe("global-secret-value");
      expect(result.type).toBe("project-secret");
      expect(result.error).toBeUndefined();
    });

    it("should resolve environment-specific project secret", async () => {
      const projectSecret: ProjectSecret = {
        internal: "project-secret",
        key: "DEV_SECRET",
        environmentId: "dev"
      };

      const context = createResolutionContext(testProject, "file1");
      const result = await resolveInternalType(projectSecret, context);

      expect(result.value).toBe("dev-secret-value");
      expect(result.type).toBe("project-secret");
      expect(result.error).toBeUndefined();
    });
  });

  describe("Pointer Resolution", () => {
    it("should resolve pointer to another file's output", async () => {
      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "file1",
        path: "outputVar"
      };

      const context = createResolutionContext(testProject, "file2");
      const result = await resolveInternalType(pointer, context);

      expect(result.value).toBe("test output");
      expect(result.type).toBe("pointer");
      expect(result.error).toBeUndefined();
    });

    it("should detect circular references", async () => {
      // Add a circular reference to the test project
      testProject.files.file1.mapping.output.variables = {
        circularRef: {
          internal: "pointer",
          type: "json", 
          id: "file2",
          path: "circularRef"
        }
      };

      testProject.files.file2.mapping.output.variables = {
        circularRef: {
          internal: "pointer",
          type: "json",
          id: "file1", 
          path: "circularRef"
        }
      };

      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "file1",
        path: "circularRef"
      };

      const context = createResolutionContext(testProject, "file2");
      const result = await resolveInternalType(pointer, context);

      expect(result.error).toContain("Circular reference");
    });
  });

  describe("Complex Variable Resolution", () => {
    it("should resolve nested structure with multiple internal types", async () => {
      const complexVariables = {
        config: {
          apiHost: {
            internal: "project-variable",
            key: "GLOBAL_VAR"
          } as ProjectVariable,
          apiToken: {
            internal: "project-secret", 
            key: "DEV_SECRET",
            environmentId: "dev"
          } as ProjectSecret,
          reference: {
            internal: "pointer",
            type: "json",
            id: "file1",
            path: "outputVar"
          } as Pointer
        },
        metadata: {
          source: "test"
        }
      };

      const context = createResolutionContext(testProject, "file2");
      const resolved = await resolveInternalTypes(complexVariables, context);

      expect(resolved.config.apiHost).toBe("global-value");
      expect(resolved.config.apiToken).toBe("dev-secret-value");
      expect(resolved.config.reference).toBe("test output");
      expect(resolved.metadata.source).toBe("test");
    });
  });

  describe("Parameter and FromData types", () => {
    it("should handle parameter type", async () => {
      const parameter: Parameter<string> = {
        internal: "parameter",
        id: "param1",
        name: "testParam",
        schema: { type: "string" }
      };

      const context = createResolutionContext(testProject, "file1");
      const result = await resolveInternalType(parameter, context);

      expect(result.value).toBe("{{parameter:testParam}}");
      expect(result.type).toBe("parameter");
    });

    it("should handle from-data type", async () => {
      const fromData: FromData<any> = {
        internal: "from-data",
        path: "config/setting",
        schema: { type: "string" }
      };

      const fileData = {
        config: {
          setting: "test-value"
        }
      };

      const context = createResolutionContext(testProject, "file1", fileData);
      const result = await resolveInternalType(fromData, context);

      expect(result.value).toBe("test-value");
      expect(result.type).toBe("from-data");
    });
  });
});