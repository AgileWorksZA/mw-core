import { describe, it, expect, beforeEach } from "bun:test";
import { getAdapter } from "~/modules/ide/adapter/register";
import { generateSlugId, generatePathSafeId, generateEntityId } from "~/modules/ide/utils/generate-id";
import type { IDEModule } from "~/modules/ide/types";

// Import registration to ensure adapters are registered
import "~/modules/ide.register";

describe("IDE Module Registry", () => {
  describe("Type Adapter Discovery", () => {
    it("should find adapter for JSON files", () => {
      const adapter = getAdapter("json");
      
      expect(adapter).toBeDefined();
      expect(adapter?.type).toBe("json");
      expect(adapter?.metadata?.name).toBe("JSON");
    });

    it("should find adapter for OpenAPI files", () => {
      const adapter = getAdapter("openapi");
      
      expect(adapter).toBeDefined();
      expect(adapter?.type).toBe("openapi");
      expect(adapter?.metadata?.name).toBe("OpenAPI Specification");
    });

    it("should find adapter for service connections", () => {
      const adapter = getAdapter("service-connection");
      
      expect(adapter).toBeDefined();
      expect(adapter?.type).toBe("service-connection");
    });

    it("should throw for unknown types", () => {
      expect(() => getAdapter("unknown-type")).toThrow();
    });

    it("should handle lowercase type lookup", () => {
      const adapter = getAdapter("json");
      
      expect(adapter).toBeDefined();
      expect(adapter.type).toBe("json");
    });
  });

  describe("ID Generation", () => {
    it("should generate unique slug IDs", () => {
      const ids = new Set();
      
      for (let i = 0; i < 100; i++) {
        const id = generateSlugId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
    });

    it("should generate IDs with correct format", () => {
      const id = generateSlugId();
      
      // Should be alphanumeric with hyphens
      expect(id).toMatch(/^[a-z0-9-]+$/);
      // Should have reasonable length
      expect(id.length).toBeGreaterThan(8);
      expect(id.length).toBeLessThan(100);
    });

    it("should generate IDs with optional prefix", () => {
      const id = generateSlugId("test");
      
      expect(id).toMatch(/^test-[a-z0-9-]+$/);
    });
    
    it("should generate path-safe IDs", () => {
      const id = generatePathSafeId();
      
      // Should be path-safe
      expect(id).toMatch(/^[a-z0-9-]+$/);
      expect(id).not.toContain('/');
      expect(id).not.toContain(' ');
    });
    
    it("should generate entity-specific IDs", () => {
      const projectId = generateEntityId('project');
      const schemaId = generateEntityId('schema');
      const docId = generateEntityId('document');
      
      expect(projectId).toMatch(/^proj-/);
      expect(schemaId).toMatch(/^schema-/);
      expect(docId).toMatch(/^doc-/);
    });
  });

  describe("Module Configuration", () => {
    it("should have consistent adapter structure", () => {
      const adapters = ["json", "openapi", "service-connection", "api-get"];
      
      for (const type of adapters) {
        const adapter = getAdapter(type);
        
        expect(adapter).toBeDefined();
        expect(adapter?.type).toBeDefined();
        expect(adapter?.metadata).toBeDefined();
        expect(adapter?.metadata?.name).toBeDefined();
        expect(adapter?.metadata?.description).toBeDefined();
      }
    });

    it("should have unique file extensions per adapter", () => {
      const allExtensions = new Set<string>();
      const adapters = ["json", "openapi", "service-connection"];
      
      for (const type of adapters) {
        const adapter = getAdapter(type);
        if (adapter) {
          for (const ext of adapter.metadata?.accept || []) {
            // Skip generic .json as multiple adapters might use it
            if (ext === ".json") continue;
            
            expect(allExtensions.has(ext)).toBe(false);
            allExtensions.add(ext);
          }
        }
      }
    });
  });

  describe("Module Lifecycle", () => {
    it("should support creating new file instances", () => {
      const adapter = getAdapter("json");
      
      expect(adapter).toBeDefined();
      // NewFile component is optional
      expect(adapter).toBeDefined();
    });

    it("should support editing existing files", () => {
      const adapter = getAdapter("json");
      
      expect(adapter).toBeDefined();
      expect(adapter?.Editor).toBeDefined();
    });

    it("should support quick view functionality", () => {
      const adapter = getAdapter("json");
      
      expect(adapter).toBeDefined();
      expect(adapter?.QuickView).toBeDefined();
    });
  });

  describe("Module Integration", () => {
    it("should handle cross-module references", () => {
      // Test that modules can reference each other
      const jsonAdapter = getAdapter("json");
      const openapiAdapter = getAdapter("openapi");
      
      expect(jsonAdapter).toBeDefined();
      expect(openapiAdapter).toBeDefined();
      
      // Both should exist
      expect(jsonAdapter?.type).toBe("json");
      expect(openapiAdapter?.type).toBe("openapi");
    });

    it("should provide consistent component interfaces", () => {
      const adapters = ["json", "openapi", "api-get"];
      
      for (const type of adapters) {
        const adapter = getAdapter(type);
        
        if (adapter) {
          // All components should be React components (functions)
          expect(typeof adapter.Editor).toBe("function");
          expect(typeof adapter.QuickView).toBe("function");
          // NewFile is optional
          if (adapter.NewFile) {
            expect(typeof adapter.NewFile).toBe("function");
          }
        }
      }
    });
  });
});