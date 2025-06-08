/**
 * Unit tests for the vault implementation
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { 
  LocalVault, 
  MemoryVault, 
  createVault, 
  getVault, 
  setVault 
} from "../vault";

describe("Vault Implementations", () => {
  describe("MemoryVault", () => {
    let vault: MemoryVault;

    beforeEach(() => {
      vault = new MemoryVault();
    });

    it("should store and retrieve secrets", async () => {
      await vault.setSecret("test-key", "test-value");
      const value = await vault.getSecret("test-key");
      
      expect(value).toBe("test-value");
    });

    it("should return null for non-existent key", async () => {
      const value = await vault.getSecret("non-existent");
      expect(value).toBeNull();
    });

    it("should update existing secret", async () => {
      await vault.setSecret("test-key", "initial-value");
      await vault.setSecret("test-key", "updated-value");
      
      const value = await vault.getSecret("test-key");
      expect(value).toBe("updated-value");
    });

    it("should delete secrets", async () => {
      await vault.setSecret("test-key", "test-value");
      await vault.deleteSecret("test-key");
      
      const value = await vault.getSecret("test-key");
      expect(value).toBeNull();
    });

    it("should list all secret keys", async () => {
      await vault.setSecret("key1", "value1");
      await vault.setSecret("key2", "value2");
      await vault.setSecret("key3", "value3");
      
      const keys = await vault.listSecrets();
      expect(keys).toHaveLength(3);
      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
      expect(keys).toContain("key3");
    });

    it("should handle empty vault", async () => {
      const keys = await vault.listSecrets();
      expect(keys).toHaveLength(0);
    });

    it("should handle special characters in keys and values", async () => {
      const specialKey = "env:dev:DB_PASSWORD";
      const specialValue = "p@ssw0rd!with$pecial#chars";
      
      await vault.setSecret(specialKey, specialValue);
      const value = await vault.getSecret(specialKey);
      
      expect(value).toBe(specialValue);
    });
  });

  describe("LocalVault", () => {
    let vault: LocalVault;
    let mockLocalStorage: any;

    beforeEach(() => {
      // Create mock localStorage
      mockLocalStorage = {
        storage: {},
        getItem: mock((key: string) => mockLocalStorage.storage[key] || null),
        setItem: mock((key: string, value: string) => {
          mockLocalStorage.storage[key] = value;
        }),
        removeItem: mock((key: string) => {
          delete mockLocalStorage.storage[key];
        }),
        clear: mock(() => {
          mockLocalStorage.storage = {};
        }),
        get length() {
          return Object.keys(mockLocalStorage.storage).length;
        },
        key: mock((index: number) => {
          const keys = Object.keys(mockLocalStorage.storage);
          return keys[index] || null;
        })
      };
      
      // Override global localStorage
      global.localStorage = mockLocalStorage as Storage;
      
      vault = new LocalVault();
    });

    it("should encrypt and store secrets", async () => {
      await vault.setSecret("test-key", "test-value");
      
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      expect(mockLocalStorage.storage["ide-vault-secrets"]).toBeDefined();
      
      const storedData = JSON.parse(mockLocalStorage.storage["ide-vault-secrets"]);
      expect(Object.keys(storedData)).toContain("test-key");
      // Value should be encrypted (base64 encoded)
      expect(storedData["test-key"]).toMatch(/^[A-Za-z0-9+/=]+$/);
    });

    it("should decrypt and retrieve secrets", async () => {
      // Pre-encrypted value for "test-value"
      const encryptedValue = btoa(encodeURIComponent("test-value"));
      const mockStorage = { "test-key": encryptedValue };
      mockLocalStorage.storage["ide-vault-secrets"] = JSON.stringify(mockStorage);
      
      const value = await vault.getSecret("test-key");
      expect(value).toBe("test-value");
    });

    it("should handle localStorage errors gracefully", async () => {
      // Mock getItem to throw error
      mockLocalStorage.getItem = mock(() => {
        throw new Error("Storage error");
      });
      
      const value = await vault.getSecret("test-key");
      expect(value).toBeNull();
    });

    it("should handle decryption errors", async () => {
      const mockStorage = { "test-key": "invalid-base64-@#$" };
      mockLocalStorage.storage["ide-vault-secrets"] = JSON.stringify(mockStorage);
      
      const value = await vault.getSecret("test-key");
      expect(value).toBeNull();
    });

    it("should list all secret keys from localStorage", async () => {
      const mockStorage = {
        "key1": "encrypted1",
        "key2": "encrypted2",
        "key3": "encrypted3"
      };
      mockLocalStorage.storage["ide-vault-secrets"] = JSON.stringify(mockStorage);
      
      const keys = await vault.listSecrets();
      expect(keys).toHaveLength(3);
      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
      expect(keys).toContain("key3");
    });

    it("should delete secrets", async () => {
      // Set a secret first
      await vault.setSecret("test-key", "test-value");
      expect(await vault.getSecret("test-key")).toBe("test-value");
      
      // Delete it
      await vault.deleteSecret("test-key");
      
      // Verify it's gone
      expect(await vault.getSecret("test-key")).toBeNull();
    });

    it("should handle empty localStorage", async () => {
      const keys = await vault.listSecrets();
      expect(keys).toHaveLength(0);
    });
  });

  describe("Vault Factory", () => {
    it("should create MemoryVault", () => {
      const vault = createVault("memory");
      expect(vault).toBeInstanceOf(MemoryVault);
    });

    it("should create LocalVault by default", () => {
      const vault = createVault();
      expect(vault).toBeInstanceOf(LocalVault);
    });

    it("should create LocalVault when type is local", () => {
      const vault = createVault("local");
      expect(vault).toBeInstanceOf(LocalVault);
    });
  });

  describe("Global Vault Instance", () => {
    it("should return same instance on multiple calls", () => {
      // Save original vault
      const originalVault = getVault();
      
      try {
        // Reset global instance
        setVault(null as any);
        
        const vault1 = getVault();
        const vault2 = getVault();
        
        expect(vault1).toBe(vault2);
      } finally {
        // Restore original vault
        if (originalVault) {
          setVault(originalVault);
        }
      }
    });

    it("should allow setting custom vault implementation", () => {
      const originalVault = getVault();
      
      try {
        const customVault = new MemoryVault();
        setVault(customVault);
        
        const vault = getVault();
        expect(vault).toBe(customVault);
      } finally {
        // Restore original vault
        if (originalVault) {
          setVault(originalVault);
        }
      }
    });
  });

  describe("Integration scenarios", () => {
    it("should handle environment and global secrets", async () => {
      const vault = new MemoryVault();
      
      // Set up secrets as they would be in real usage
      await vault.setSecret("global:API_KEY", "global-api-key");
      await vault.setSecret("env:dev:DB_PASSWORD", "dev-password");
      await vault.setSecret("env:prod:DB_PASSWORD", "prod-password");
      
      // Verify retrieval
      expect(await vault.getSecret("global:API_KEY")).toBe("global-api-key");
      expect(await vault.getSecret("env:dev:DB_PASSWORD")).toBe("dev-password");
      expect(await vault.getSecret("env:prod:DB_PASSWORD")).toBe("prod-password");
      
      // List should show all keys
      const keys = await vault.listSecrets();
      expect(keys).toHaveLength(3);
    });

    it("should handle secret lifecycle", async () => {
      const vault = new MemoryVault();
      
      // Create
      await vault.setSecret("lifecycle-test", "initial");
      expect(await vault.getSecret("lifecycle-test")).toBe("initial");
      
      // Update
      await vault.setSecret("lifecycle-test", "updated");
      expect(await vault.getSecret("lifecycle-test")).toBe("updated");
      
      // Delete
      await vault.deleteSecret("lifecycle-test");
      expect(await vault.getSecret("lifecycle-test")).toBeNull();
      
      // Verify it's not in the list
      const keys = await vault.listSecrets();
      expect(keys).not.toContain("lifecycle-test");
    });
  });
});