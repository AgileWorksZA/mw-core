import { describe, it, expect, beforeEach } from "bun:test";
import { resolveTemplate } from "~/modules/environment/resolver";
import { setVault, MemoryVault } from "~/modules/environment/vault";
import { testVariables, testSecrets } from "../../fixtures/test-data";
import type { IDEEnvironmentConfig } from "~/modules/environment/types";

describe("Variable Resolution", () => {
  let testConfig: IDEEnvironmentConfig;
  let vault: MemoryVault;

  beforeEach(async () => {
    // Set up test vault
    vault = new MemoryVault();
    setVault(vault);

    // Set up base test configuration
    testConfig = {
      activeEnvironment: "global",
      globals: {
        variables: {},
        secrets: {}
      },
      environments: {},
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: "1.0.0"
      }
    };
  });

  describe("Basic Variable Resolution", () => {
    it("should resolve simple variables", async () => {
      testConfig.globals.variables["base_url"] = {
        key: "base_url",
        value: testVariables.simple.base_url,
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await resolveTemplate("{{base_url}}/api", testConfig);
      expect(result).toBe("https://api.example.com/api");
    });

    it("should resolve multiple variables in a template", async () => {
      testConfig.globals.variables["protocol"] = {
        key: "protocol",
        value: "https",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      testConfig.globals.variables["host"] = {
        key: "host",
        value: "api.example.com",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      testConfig.globals.variables["version"] = {
        key: "version",
        value: "v1",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await resolveTemplate(
        "{{protocol}}://{{host}}/{{version}}/users",
        testConfig
      );
      expect(result).toBe("https://api.example.com/v1/users");
    });

    it("should handle undefined variables", async () => {
      const result = await resolveTemplate("{{undefined_var}}", testConfig);
      expect(result).toBe("{{undefined_var}}");
    });

    it("should handle empty template", async () => {
      const result = await resolveTemplate("", testConfig);
      expect(result).toBe("");
    });

    it("should handle template without variables", async () => {
      const result = await resolveTemplate("https://api.example.com", testConfig);
      expect(result).toBe("https://api.example.com");
    });
  });

  describe("Environment Variable Overrides", () => {
    beforeEach(() => {
      // Add dev environment
      testConfig.environments["dev"] = {
        id: "dev",
        name: "Development",
        variables: {},
        secrets: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    it("should prioritize environment variables over global", async () => {
      testConfig.globals.variables["base_url"] = {
        key: "base_url",
        value: "https://global.api.com",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      testConfig.environments["dev"].variables["base_url"] = "http://localhost:3000";
      
      const result = await resolveTemplate("{{base_url}}", testConfig, "dev");
      expect(result).toBe("http://localhost:3000");
    });

    it("should fall back to global when environment variable not found", async () => {
      testConfig.globals.variables["base_url"] = {
        key: "base_url",
        value: "https://global.api.com",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await resolveTemplate("{{base_url}}", testConfig, "dev");
      expect(result).toBe("https://global.api.com");
    });

    it("should handle mixed global and environment variables", async () => {
      testConfig.globals.variables["protocol"] = {
        key: "protocol",
        value: "https",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      testConfig.environments["dev"].variables["host"] = "localhost:3000";
      testConfig.globals.variables["version"] = {
        key: "version",
        value: "v1",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await resolveTemplate(
        "{{protocol}}://{{host}}/{{version}}",
        testConfig,
        "dev"
      );
      expect(result).toBe("https://localhost:3000/v1");
    });
  });

  describe("Secret Resolution", () => {
    beforeEach(async () => {
      // Add prod environment
      testConfig.environments["prod"] = {
        id: "prod",
        name: "Production",
        variables: {},
        secrets: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    it("should resolve secrets", async () => {
      testConfig.globals.secrets["api_key"] = {
        key: "api_key",
        description: "API Key",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await vault.setSecret("global:api_key", testSecrets.api_key);
      
      const result = await resolveTemplate("{{api_key}}", testConfig);
      expect(result).toBe(testSecrets.api_key);
    });

    it("should resolve environment-specific secrets", async () => {
      testConfig.globals.secrets["api_key"] = {
        key: "api_key",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      testConfig.environments["prod"].secrets["api_key"] = {
        key: "api_key",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await vault.setSecret("global:api_key", "global-key");
      await vault.setSecret("env:prod:api_key", "prod-key");
      
      const result = await resolveTemplate("{{api_key}}", testConfig, "prod");
      expect(result).toBe("prod-key");
    });

    it("should handle authorization headers with secrets", async () => {
      testConfig.environments["prod"].secrets["token"] = {
        key: "token",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await vault.setSecret("env:prod:token", testSecrets.token);
      
      const result = await resolveTemplate("{{token}}", testConfig, "prod");
      expect(result).toBe(testSecrets.token);
    });
  });

  describe("Special Characters and Edge Cases", () => {
    it("should handle variables with underscores", async () => {
      testConfig.globals.variables["api_base_url"] = {
        key: "api_base_url",
        value: "https://api.example.com",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await resolveTemplate("{{api_base_url}}", testConfig);
      expect(result).toBe("https://api.example.com");
    });

    it("should handle variables with numbers", async () => {
      testConfig.globals.variables["api_v2"] = {
        key: "api_v2",
        value: "https://api.v2.example.com",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await resolveTemplate("{{api_v2}}", testConfig);
      expect(result).toBe("https://api.v2.example.com");
    });

    it("should handle malformed variable syntax", async () => {
      const result = await resolveTemplate("{{incomplete", testConfig);
      expect(result).toBe("{{incomplete");
    });

    it("should handle spaces around variable names", async () => {
      testConfig.globals.variables["test"] = {
        key: "test",
        value: "value",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await resolveTemplate("{{ test }}", testConfig);
      // Should resolve with spaces
      expect(result).toBe("value");
    });

    it("should handle empty variable names", async () => {
      const result = await resolveTemplate("{{}}", testConfig);
      expect(result).toBe("{{}}");
    });
  });

  describe("Complex Real-World Scenarios", () => {
    beforeEach(() => {
      // Add prod environment
      testConfig.environments["prod"] = {
        id: "prod",
        name: "Production",
        variables: {},
        secrets: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    it("should resolve OpenAPI server URL with variables", async () => {
      testConfig.globals.variables["protocol"] = {
        key: "protocol",
        value: "https",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      testConfig.globals.variables["host"] = {
        key: "host",
        value: "api.example.com",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      testConfig.environments["prod"].variables["api_version"] = "v2";
      
      const template = "{{protocol}}://{{host}}/{{api_version}}";
      const result = await resolveTemplate(template, testConfig, "prod");
      expect(result).toBe("https://api.example.com/v2");
    });

    it("should resolve service connection config", async () => {
      testConfig.globals.variables["base_url"] = {
        key: "base_url",
        value: "https://api.example.com",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      testConfig.environments["dev"] = {
        id: "dev",
        name: "Development",
        variables: {},
        secrets: {
          "api_key": {
            key: "api_key",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      testConfig.globals.variables["timeout"] = {
        key: "timeout",
        value: "30000",
        type: "variable",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await vault.setSecret("env:dev:api_key", "dev-key-123");
      
      const config = {
        url: "{{base_url}}/users",
        headers: {
          Authorization: "Bearer {{api_key}}",
        },
        timeout: "{{timeout}}",
      };
      
      const resolvedUrl = await resolveTemplate(config.url, testConfig, "dev");
      const resolvedAuth = await resolveTemplate(config.headers.Authorization, testConfig, "dev");
      const resolvedTimeout = await resolveTemplate(config.timeout, testConfig, "dev");
      
      expect(resolvedUrl).toBe("https://api.example.com/users");
      expect(resolvedAuth).toBe("Bearer dev-key-123");
      expect(resolvedTimeout).toBe("30000");
    });
  });
});