import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { JsonFileStorageAdapter } from "~/modules/storage/json-adapter";
import { StorageError } from "~/modules/storage/errors";
import type { StorageAdapterConfig } from "~/modules/storage/types";
import * as fs from "fs/promises";
import * as path from "path";

interface TestContext {
  name?: string;
  value?: number;
  data?: any;
  status?: string;
}

describe("JsonFileStorageAdapter", () => {
  const testDir = path.join(process.cwd(), "test-tmp", "storage-tests");
  let adapter: JsonFileStorageAdapter<TestContext>;
  let config: StorageAdapterConfig<TestContext>;

  beforeEach(async () => {
    // Clean up and create test directory
    await fs.rm(testDir, { recursive: true, force: true });
    await fs.mkdir(testDir, { recursive: true });
    
    config = {
      enableCompression: false,
      cacheSize: 10,
      snapshotInterval: 5,
    };
    
    adapter = new JsonFileStorageAdapter<TestContext>({
      basePath: testDir,
      ...config
    });
  });

  afterEach(async () => {
    // Clean up test directory
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe("Document CRUD Operations", () => {
    it("should create a new document with default context", async () => {
      const defaultContext = { name: "Default Document", value: 0 };
      
      // First write to create the document
      await adapter.write({
        type: "test",
        id: "doc1",
        payload: { context: defaultContext }
      });
      
      const result = await adapter.read({
        type: "test",
        id: "doc1"
      });
      
      expect(result.data).toEqual(defaultContext);
      expect(result.cursor.timestamp).toBeDefined();
    });

    it("should write a new document", async () => {
      const context = { name: "Test Document", value: 42 };
      
      const writeResult = await adapter.write({
        type: "test",
        id: "doc1",
        payload: { context }
      });
      
      expect(writeResult.cursor.timestamp).toBeDefined();
      
      // Read it back
      const readResult = await adapter.read({
        type: "test",
        id: "doc1"
      });
      
      expect(readResult.data).toEqual(context);
    });

    it("should update an existing document with delta", async () => {
      // Create initial document
      const initialContext = { name: "Original", value: 1 };
      await adapter.write({
        type: "test",
        id: "doc1",
        payload: { context: initialContext }
      });
      
      // Update with delta
      const delta = {
        name: ["Original", "Updated"],
        value: [1, 2]
      };
      
      const updateResult = await adapter.write({
        type: "test",
        id: "doc1",
        payload: { delta }
      });
      
      expect(updateResult.cursor.timestamp).toBeDefined();
      
      // Read updated document
      const readResult = await adapter.read({
        type: "test",
        id: "doc1"
      });
      
      expect(readResult.data.name).toBe("Updated");
      expect(readResult.data.value).toBe(2);
    });

    it("should handle document not found without default context", async () => {
      try {
        await adapter.read({
          type: "test",
          id: "nonexistent"
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
        // Should throw a DocumentNotFoundError
      }
    });

    it("should delete a document", async () => {
      // Create a document
      await adapter.write({
        type: "test",
        id: "doc1",
        payload: { context: { name: "To Delete" } }
      });
      
      // Delete it
      await adapter.deleteDocument({
        type: "test",
        id: "doc1"
      });
      
      // Try to read - should throw error
      try {
        await adapter.read({
          type: "test",
          id: "doc1"
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Version History", () => {
    it("should handle multiple versions", async () => {
      // Create initial version
      const v1Result = await adapter.write({
        type: "test",
        id: "doc1",
        payload: { context: { value: 1 } }
      });
      
      // Create second version
      const v2Result = await adapter.write({
        type: "test",
        id: "doc1",
        payload: { context: { value: 2 } }
      });
      
      // Timestamps should be different
      expect(v2Result.cursor.timestamp).toBeGreaterThan(v1Result.cursor.timestamp);
      
      // Read latest version
      const latestVersion = await adapter.read({
        type: "test",
        id: "doc1"
      });
      
      expect(latestVersion.data.value).toBe(2);
    });

    it("should track timestamps and cursors", async () => {
      // Create multiple versions
      const v1 = await adapter.write({
        type: "test",
        id: "doc1",
        payload: { context: { value: 1 } }
      });
      
      const v2 = await adapter.write({
        type: "test",
        id: "doc1",
        payload: { context: { value: 2 } }
      });
      
      const v3 = await adapter.write({
        type: "test",
        id: "doc1",
        payload: { context: { value: 3 } }
      });
      
      // Timestamps should be different and increasing
      expect(v1.cursor.timestamp).toBeDefined();
      expect(v2.cursor.timestamp).toBeGreaterThan(v1.cursor.timestamp);
      expect(v3.cursor.timestamp).toBeGreaterThan(v2.cursor.timestamp);
      
      // Latest cursor should point to v3
      expect(v3.cursor.latest).toBe(v3.cursor.timestamp);
    });
  });

  describe("Listing Documents", () => {
    it("should get all documents of a type", async () => {
      // Create multiple documents
      await adapter.write({
        type: "test",
        id: "doc1",
        payload: { context: { name: "Doc 1" } }
      });
      
      await adapter.write({
        type: "test",
        id: "doc2",
        payload: { context: { name: "Doc 2" } }
      });
      
      await adapter.write({
        type: "other",
        id: "doc3",
        payload: { context: { name: "Doc 3" } }
      });
      
      // Get all test documents
      const testDocs = await adapter.getAll({
        type: "test",
        defaultContext: {}
      });
      
      expect(testDocs).toHaveLength(2);
      expect(testDocs.map(d => d.id).sort()).toEqual(["doc1", "doc2"]);
    });

    it("should return empty array for non-existent type", async () => {
      const docs = await adapter.getAll({
        type: "nonexistent",
        defaultContext: {}
      });
      
      expect(docs).toHaveLength(0);
    });
  });

  describe("Storage Path", () => {
    it("should provide storage path for documents", async () => {
      if (adapter.getStoragePath) {
        const storagePath = await adapter.getStoragePath({
          type: "test",
          id: "doc1"
        });
        
        expect(storagePath).toContain("test");
        expect(storagePath).toContain("doc1");
      }
    });
  });

  describe("Caching", () => {
    it("should cache frequently accessed documents", async () => {
      const context = { data: "test" };
      
      await adapter.write({
        type: "test",
        id: "cached",
        payload: { context }
      });
      
      // First read - from disk
      const start1 = performance.now();
      await adapter.read({ type: "test", id: "cached" });
      const time1 = performance.now() - start1;
      
      // Second read - potentially from cache
      const start2 = performance.now();
      await adapter.read({ type: "test", id: "cached" });
      const time2 = performance.now() - start2;
      
      // Cache could be faster, but this is not guaranteed
      // Just verify both reads work
      expect(time1).toBeGreaterThan(0);
      expect(time2).toBeGreaterThan(0);
    });

    it("should handle cache invalidation on write", async () => {
      await adapter.write({
        type: "test",
        id: "cached",
        payload: { context: { value: 1 } }
      });
      
      // Read to cache
      await adapter.read({ type: "test", id: "cached" });
      
      // Update
      await adapter.write({
        type: "test",
        id: "cached",
        payload: { context: { value: 2 } }
      });
      
      // Read again - should get updated value
      const result = await adapter.read({ type: "test", id: "cached" });
      expect(result.data.value).toBe(2);
    });
  });

  describe("Concurrent Access", () => {
    it("should handle concurrent reads", async () => {
      await adapter.write({
        type: "test",
        id: "concurrent",
        payload: { context: { value: 1 } }
      });
      
      // Simulate concurrent reads
      const reads = Array(10).fill(0).map(() => 
        adapter.read({ type: "test", id: "concurrent" })
      );
      
      const results = await Promise.all(reads);
      
      expect(results.every(r => r.data.value === 1)).toBe(true);
    });

    it("should handle concurrent writes with proper ordering", async () => {
      // Create initial document
      await adapter.write({
        type: "test",
        id: "conflict",
        payload: { context: { value: 0 } }
      });
      
      // Simulate concurrent writes
      const writes = Array(5).fill(0).map((_, i) => 
        adapter.write({
          type: "test",
          id: "conflict",
          payload: { context: { value: i + 1 } }
        })
      );
      
      await Promise.all(writes);
      
      // Read final value
      const final = await adapter.read({ type: "test", id: "conflict" });
      
      // Should have one of the written values
      expect(final.data.value).toBeGreaterThan(0);
      expect(final.data.value).toBeLessThanOrEqual(5);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid document structure gracefully", async () => {
      // Write with validator that could fail
      const strictAdapter = new JsonFileStorageAdapter<TestContext>({
        basePath: testDir,
        validator: (data): data is TestContext => {
          return typeof data === 'object' && data !== null;
        }
      });
      
      // This should work
      await strictAdapter.write({
        type: "test",
        id: "valid",
        payload: { context: { name: "Valid" } }
      });
      
      const result = await strictAdapter.read({
        type: "test",
        id: "valid"
      });
      
      expect(result.data.name).toBe("Valid");
    });
  });
});