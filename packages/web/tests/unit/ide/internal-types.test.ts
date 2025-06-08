import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  resolveInternalType,
  createResolutionContext,
  resolveInternalTypes,
  type ResolutionContext,
  type InternalResolutionResult,
} from "~/modules/ide/utils/internal-resolver";
import { extractInternals } from "~/modules/ide/utils/extract-internals";
import { detectCircularDependency } from "~/modules/ide/utils/detect-circular-dependencies";
import type {
  InternalTypes,
  Pointer,
  Parameter,
  FromData,
  ProjectVariable,
  ProjectSecret,
  Project,
} from "~/modules/ide/types";
import { createMockIDEConfig } from "../../helpers/test-utils";
import { MemoryVault, setVault, getVault } from "~/modules/ide/utils/vault";
import { aggressiveCleanup, createIsolatedTestEnvironment, deepClone } from "../../helpers/test-isolation";

// Create a fresh memory vault for each test
let mockVault: MemoryVault;

describe("Internal Types System", () => {
  let mockContext: ResolutionContext;
  let mockProject: Project;
  let originalVault: any;

  beforeEach(async () => {
    // Save the original vault to restore later
    originalVault = getVault();
    
    // Create a fresh isolated environment for each test
    const testEnv = createIsolatedTestEnvironment();
    
    // Create a fresh memory vault
    mockVault = new MemoryVault();
    
    // Create a mock project with test data (deep cloned for isolation)
    mockProject = deepClone({
      id: "test-project",
      name: "Test Project",
      type: "project",
      version: "1.0.0",
      files: {
        "config-file": {
          type: "json",
          id: "config-file",
          name: "Config File",
          mapping: {
            input: { variables: {} },
            output: {
              variables: {
                baseUrl: "https://api.example.com",
                timeout: 5000,
                features: {
                  enableCache: true,
                  enableRetry: false,
                },
              },
            },
          },
        },
        "user-api": {
          type: "api-get",
          id: "user-api",
          name: "User API",
          mapping: {
            input: { variables: {} },
            output: {
              variables: {
                users: [
                  { id: 1, name: "Alice" },
                  { id: 2, name: "Bob" },
                ],
                totalCount: 2,
              },
            },
          },
        },
      },
      environmentConfig: createMockIDEConfig({
        globals: {
          variables: {
            environment: {
              key: "environment",
              value: "production",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            region: {
              key: "region",
              value: "us-west-2",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
          secrets: {},
        },
        environments: {
          "dev": {
            id: "dev",
            name: "Development",
            variables: {
              environment: "development",
              debugMode: "true",
            },
            secrets: {
              api_key: "dev-key-123",
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          "prod": {
            id: "prod",
            name: "Production",
            variables: {
              environment: "production",
              debugMode: "false",
            },
            secrets: {
              api_key: "prod-key-456",
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        activeEnvironment: "prod",
      }),
    });

    // Create the resolution context
    mockContext = createResolutionContext(mockProject, "current-file");

    // Set up the mock vault
    setVault(mockVault);
    
    // Set up secrets in the mock vault
    await mockVault.setSecret("env:dev:api_key", "dev-key-123");
    await mockVault.setSecret("env:prod:api_key", "prod-key-456");
  });
  
  afterEach(async () => {
    // Aggressive cleanup after each test
    await aggressiveCleanup();
    
    // Clear the vault
    if (mockVault) {
      await mockVault.clear();
    }
    
    // Restore the original vault
    if (originalVault) {
      setVault(originalVault);
    }
  });

  describe("Basic Internal Type Resolution", () => {
    it("should identify internal types correctly", () => {
      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "config-file",
        path: "baseUrl",
      };

      const parameter: Parameter<string> = {
        internal: "parameter",
        id: "param1",
        name: "userName",
        schema: { type: "string" },
      };

      const notInternal = { some: "object", without: "internal" };

      // Check if objects have internal property
      expect(pointer.internal).toBe("pointer");
      expect(parameter.internal).toBe("parameter");
      expect("internal" in notInternal).toBe(false);
    });

    it("should resolve simple pointer", async () => {
      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "config-file",
        path: "baseUrl",
      };

      const result = await resolveInternalType(pointer, mockContext);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe("https://api.example.com");
      expect(result.type).toBe("pointer");
    });

    it("should resolve nested pointer path", async () => {
      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "config-file",
        path: "features/enableCache",
      };

      const result = await resolveInternalType(pointer, mockContext);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe(true);
      expect(result.type).toBe("pointer");
    });

    it("should resolve parameter as placeholder", async () => {
      const parameter: Parameter<string> = {
        internal: "parameter",
        id: "param1",
        name: "userName",
        schema: { type: "string" },
      };

      const result = await resolveInternalType(parameter, mockContext);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe("{{parameter:userName}}");
      expect(result.type).toBe("parameter");
    });

    it("should resolve from-data type", async () => {
      const fromData: FromData<string> = {
        internal: "from-data",
        path: "baseUrl",
        schema: { type: "string" },
      };

      // Need to provide currentFileData for from-data resolution
      const contextWithData = {
        ...mockContext,
        currentFileData: {
          baseUrl: "https://api.example.com",
        },
      };

      const result = await resolveInternalType(fromData, contextWithData);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe("https://api.example.com");
      expect(result.type).toBe("from-data");
    });

    it("should resolve project variable", async () => {
      const projectVar: ProjectVariable = {
        internal: "project-variable",
        key: "environment",
      };

      const result = await resolveInternalType(projectVar, mockContext);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe("production"); // Active environment value
      expect(result.type).toBe("project-variable");
    });

    it("should resolve project variable with specific environment", async () => {
      const projectVar: ProjectVariable = {
        internal: "project-variable",
        key: "debugMode",
        environmentId: "dev",
      };

      const result = await resolveInternalType(projectVar, mockContext);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe("true");
      expect(result.type).toBe("project-variable");
    });

    it("should resolve project secret", async () => {
      const projectSecret: ProjectSecret = {
        internal: "project-secret",
        key: "api_key",
      };

      const result = await resolveInternalType(projectSecret, mockContext);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe("prod-key-456"); // Active environment secret
      expect(result.type).toBe("project-secret");
    });
  });

  describe("Chained Pointer Resolution", () => {
    it("should resolve pointer to pointer", async () => {
      // Create a chain: pointer1 -> file1 -> pointer2 -> file2
      const chainedProject: Project = {
        ...mockProject,
        files: {
          ...mockProject.files,
          "config-proxy": {
            type: "json",
            id: "config-proxy",
            name: "Config Proxy",
            mapping: {
              input: { variables: {} },
              output: {
                variables: {
                  actualConfig: {
                    internal: "pointer",
                    type: "json",
                    id: "config-file",
                    path: "features",
                  } as Pointer,
                },
              },
            },
          },
        },
      };
      const chainedContext = createResolutionContext(chainedProject, "config-proxy");

      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "config-proxy",
        path: "actualConfig",
      };

      const result = await resolveInternalType(pointer, chainedContext);

      // The result should be the resolved features object
      expect(result.error).toBeUndefined();
      expect(result.value).toEqual({
        enableCache: true,
        enableRetry: false,
      });
      expect(result.type).toBe("pointer");
    });

    it("should handle triple-chained pointers", async () => {
      const tripleChainProject: Project = {
        ...mockProject,
        files: {
          "level1": {
            type: "json",
            id: "level1",
            name: "Level 1",
            mapping: {
              input: { variables: {} },
              output: {
                variables: {
                  next: {
                    internal: "pointer",
                    type: "json",
                    id: "level2",
                    path: "data",
                  } as Pointer,
                },
              },
            },
          },
          "level2": {
            type: "json",
            id: "level2",
            name: "Level 2",
            mapping: {
              input: { variables: {} },
              output: {
                variables: {
                  data: {
                    internal: "pointer",
                    type: "json",
                    id: "level3",
                    path: "finalValue",
                  } as Pointer,
                },
              },
            },
          },
          "level3": {
            type: "json",
            id: "level3",
            name: "Level 3",
            mapping: {
              input: { variables: {} },
              output: {
                variables: {
                  finalValue: "Success!",
                },
              },
            },
          },
        },
      };
      const tripleChainContext = createResolutionContext(tripleChainProject, "level1");

      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "level1",
        path: "next",
      };

      const result = await resolveInternalType(pointer, tripleChainContext);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe("Success!");
      expect(result.type).toBe("pointer");
    });

    it("should respect max depth limit", async () => {
      const deepPointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "config-file",
        path: "baseUrl",
      };

      // Create context with maxDepth of 1 - this allows the initial resolution but prevents chained resolutions
      const limitedContext = createResolutionContext(mockProject, "current-file", undefined, { maxDepth: 1 });
      
      // Create a chained pointer that would require depth > 1 to fully resolve
      const chainedProject: Project = {
        ...mockProject,
        files: {
          ...mockProject.files,
          "chain1": {
            type: "json",
            id: "chain1",
            name: "Chain 1",
            mapping: {
              input: { variables: {} },
              output: {
                variables: {
                  next: {
                    internal: "pointer",
                    type: "json",
                    id: "config-file",
                    path: "baseUrl",
                  } as Pointer,
                },
              },
            },
          },
        },
      };
      const chainContext = createResolutionContext(chainedProject, "current-file", undefined, { maxDepth: 1 });
      
      const chainedPointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "chain1",
        path: "next",
      };
      
      const result = await resolveInternalType(chainedPointer, chainContext);

      // With maxDepth of 1, it can resolve the first pointer but not the nested one
      expect(result.error).toBeDefined();
      expect(result.error).toContain("Maximum resolution depth (1) exceeded");
      expect(result.value).toHaveProperty("internal", "pointer");
      expect(result.type).toBe("pointer");
    });
  });

  describe("Error Handling", () => {
    it("should handle missing file", async () => {
      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "non-existent",
        path: "value",
      };

      const result = await resolveInternalType(pointer, mockContext);

      expect(result.error).toBeDefined();
      expect(result.error).toContain("Target file not found");
      expect(result.value).toBeUndefined();
    });

    it("should handle invalid path in pointer", async () => {
      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "config-file",
        path: "non/existent/path",
      };

      const result = await resolveInternalType(pointer, mockContext);

      expect(result.error).toBeDefined();
      expect(result.error).toContain("Path not found");
      expect(result.value).toBeUndefined();
    });

    it("should handle missing variable", async () => {
      const projectVar: ProjectVariable = {
        internal: "project-variable",
        key: "nonExistentVar",
      };

      const result = await resolveInternalType(projectVar, mockContext);

      expect(result.error).toBeDefined();
      expect(result.error).toContain("Project variable not found");
      expect(result.value).toBeUndefined();
    });

    it("should handle invalid from-data path", async () => {
      const fromData: FromData<any> = {
        internal: "from-data",
        path: "invalid/path/to/data",
        schema: { type: "string" },
      };

      const result = await resolveInternalType(fromData, mockContext);

      expect(result.error).toBeDefined();
      expect(result.error).toContain("Current file data not available");
      expect(result.value).toBeUndefined();
    });
  });

  describe("Circular Reference Detection", () => {
    it("should detect simple circular reference", async () => {
      const circularProject: Project = {
        ...mockProject,
        files: {
          "file-a": {
            type: "json",
            id: "file-a",
            name: "File A",
            mapping: {
              input: { variables: {} },
              output: {
                variables: {
                  value: {
                    internal: "pointer",
                    type: "json",
                    id: "file-b",
                    path: "value",
                  } as Pointer,
                },
              },
            },
          },
          "file-b": {
            type: "json",
            id: "file-b",
            name: "File B",
            mapping: {
              input: { variables: {} },
              output: {
                variables: {
                  value: {
                    internal: "pointer",
                    type: "json",
                    id: "file-a",
                    path: "value",
                  } as Pointer,
                },
              },
            },
          },
        },
      };
      const circularContext = createResolutionContext(circularProject, "file-a");

      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "file-a",
        path: "value",
      };

      const result = await resolveInternalType(pointer, circularContext);

      // Should detect circular reference
      expect(result.error).toBeDefined();
      expect(result.error).toContain("Circular reference detected");
      expect(result.value).toEqual(pointer);
    });

    it("should use detectCircularDependency utility", () => {
      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "file-b",
        path: "value",
      };

      const files = {
        "file-a": {
          mapping: {
            output: {
              variables: {
                value: {
                  internal: "pointer",
                  type: "json",
                  id: "file-b",
                  path: "value",
                } as Pointer,
              },
            },
          },
        },
        "file-b": {
          mapping: {
            output: {
              variables: {
                value: {
                  internal: "pointer",
                  type: "json",
                  id: "file-a",
                  path: "value",
                } as Pointer,
              },
            },
          },
        },
      };

      const result = detectCircularDependency(pointer, "file-a", files);

      expect(result.hasCircular).toBe(true);
      expect(result.path).toContain("file-a");
      expect(result.path).toContain("file-b");
    });
  });

  describe("Complex Type Combinations", () => {
    it("should resolve nested internal types in objects", async () => {
      const complexObject = {
        config: {
          baseUrl: {
            internal: "pointer",
            type: "json",
            id: "config-file",
            path: "baseUrl",
          } as Pointer,
          apiKey: {
            internal: "project-secret",
            key: "api_key",
          } as ProjectSecret,
          timeout: 5000,
          users: {
            internal: "pointer",
            type: "api-get",
            id: "user-api",
            path: "users",
          } as Pointer,
        },
        metadata: {
          environment: {
            internal: "project-variable",
            key: "environment",
          } as ProjectVariable,
          timestamp: new Date().toISOString(),
        },
      };

      const resolved = await resolveInternalTypes(complexObject, mockContext);

      expect(resolved.config.baseUrl).toBe("https://api.example.com");
      expect(resolved.config.apiKey).toBe("prod-key-456");
      expect(resolved.config.timeout).toBe(5000);
      expect(resolved.config.users).toEqual([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);
      expect(resolved.metadata.environment).toBe("production");
      expect(resolved.metadata.timestamp).toBeDefined();
    });

    it("should resolve arrays with internal types", async () => {
      const arrayWithInternals = [
        "static-value",
        {
          internal: "pointer",
          type: "api-get",
          id: "user-api",
          path: "totalCount",
        } as Pointer,
        {
          internal: "parameter",
          id: "param1",
          name: "limit",
          schema: { type: "number" },
        } as Parameter<number>,
        {
          nested: {
            internal: "project-variable",
            key: "region",
          } as ProjectVariable,
        },
      ];

      const resolved = await resolveInternalTypes(arrayWithInternals, mockContext);

      expect(resolved[0]).toBe("static-value");
      expect(resolved[1]).toBe(2); // totalCount
      expect(resolved[2]).toBe("{{parameter:limit}}");
      expect(resolved[3].nested).toBe("us-west-2");
    });

    it("should handle mixed pointer and from-data references", async () => {
      const currentFileData = {
        input: {
          variables: {
            baseConfig: {
              enableCache: true,
              enableRetry: false,
            },
            customTimeout: 10000,
          },
        },
        output: {
          variables: {
            result: {
              config: {
                enableCache: true,
                enableRetry: false,
              },
              overrideTimeout: 10000,
            },
          },
        },
      };

      const mixedContext = {
        ...mockContext,
        currentFileData,
      };

      const outputVar = {
        internal: "from-data",
        path: "output/variables/result",
        schema: { type: "object" },
      } as FromData<any>;

      const result = await resolveInternalType(outputVar, mixedContext);

      expect(result.error).toBeUndefined();
      expect(result.value.config).toEqual({
        enableCache: true,
        enableRetry: false,
      });
      expect(result.value.overrideTimeout).toBe(10000);
    });
  });

  describe("Extract Internals Utility", () => {
    it("should extract all internal types from nested structure", () => {
      const structure = {
        level1: {
          pointer: {
            internal: "pointer",
            type: "json",
            id: "file1",
            path: "value",
          } as Pointer,
          normal: "value",
          level2: {
            parameter: {
              internal: "parameter",
              id: "p1",
              name: "param1",
              schema: { type: "string" },
            } as Parameter<string>,
            array: [
              {
                internal: "project-variable",
                key: "var1",
              } as ProjectVariable,
              "static",
            ],
          },
        },
      };

      const pointers = extractInternals(structure, "pointer");
      const parameters = extractInternals(structure, "parameter");
      const projectVars = extractInternals(structure, "project-variable");

      expect(pointers).toHaveLength(1);
      expect(parameters).toHaveLength(1);
      expect(projectVars).toHaveLength(1);
      expect(pointers[0].pointer.id).toBe("file1");
      expect((parameters[0].pointer as any).name).toBe("param1");
      expect((projectVars[0].pointer as any).key).toBe("var1");
    });

    it("should handle empty and null values", () => {
      expect(extractInternals({}, "pointer")).toEqual([]);
      expect(extractInternals([], "pointer")).toEqual([]);
      expect(extractInternals(null, "pointer")).toEqual([]);
      expect(extractInternals(undefined, "pointer")).toEqual([]);
      expect(extractInternals("string", "pointer")).toEqual([]);
    });
  });

  describe("Input/Output Type Configurations", () => {
    it("should handle output: false configuration", async () => {
      const projectWithNoOutput: Project = {
        ...mockProject,
        files: {
          "no-output": {
            type: "json",
            id: "no-output",
            name: "No Output",
            mapping: {
              input: { variables: { data: "test" } },
              output: { variables: false },
            },
          },
        },
      };
      const contextWithNoOutput = createResolutionContext(projectWithNoOutput, "current-file");

      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "no-output",
        path: "data",
      };

      const result = await resolveInternalType(pointer, contextWithNoOutput);

      expect(result.error).toBeDefined();
      expect(result.error).toContain("Target file has no output");
    });

    it("should handle output: true (use input as output)", async () => {
      const projectWithInputAsOutput: Project = {
        ...mockProject,
        files: {
          "input-as-output": {
            type: "json",
            id: "input-as-output",
            name: "Input As Output",
            mapping: {
              input: {
                variables: {
                  userName: "Alice",
                  userId: 123,
                },
              },
              output: { variables: true }, // Use input as output
            },
          },
        },
      };
      const contextWithInputAsOutput = createResolutionContext(projectWithInputAsOutput, "current-file");

      const pointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: "input-as-output",
        path: "userName",
      };

      const result = await resolveInternalType(pointer, contextWithInputAsOutput);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe("Alice");
    });

    it("should handle complex output configurations", async () => {
      const projectWithComplexOutput: Project = {
        ...mockProject,
        files: {
          ...mockProject.files,
          "complex-output": {
            type: "api-get",
            id: "complex-output",
            name: "Complex Output",
            mapping: {
              input: {
                variables: {
                  endpoint: "https://api.example.com",
                },
              },
              output: {
                variables: {
                  // Mix of static values and internal types
                  status: "success",
                  data: {
                    internal: "pointer",
                    type: "api-get",
                    id: "user-api",
                    path: "users/0",
                  } as Pointer,
                  metadata: {
                    env: {
                      internal: "project-variable",
                      key: "environment",
                    } as ProjectVariable,
                    timestamp: new Date().toISOString(),
                  },
                },
              },
            },
          },
        },
      };
      const contextWithComplexOutput = createResolutionContext(projectWithComplexOutput, "complex-output");

      const pointer: Pointer = {
        internal: "pointer",
        type: "api-get",
        id: "complex-output",
        path: "metadata/env",
      };

      const result = await resolveInternalType(pointer, contextWithComplexOutput);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe("production");
    });
  });
});