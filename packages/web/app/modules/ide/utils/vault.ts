/**
 * Vault implementation for secure secret storage within IDE
 */

/**
 * Vault interface for secret storage
 */
export interface IVault {
  getSecret(key: string): Promise<string | null>;
  setSecret(key: string, value: string): Promise<void>;
  deleteSecret(key: string): Promise<void>;
  listSecrets(): Promise<string[]>;
}

/**
 * Local encrypted vault implementation
 * In production, this would integrate with AWS Secrets Manager, HashiCorp Vault, etc.
 */
export class LocalVault implements IVault {
  private storageKey = "ide-vault-secrets";
  
  // Simple encryption for local storage (in production, use proper encryption)
  private encrypt(value: string): string {
    // This is a placeholder - in production, use proper encryption
    return btoa(encodeURIComponent(value));
  }
  
  private decrypt(value: string): string {
    // This is a placeholder - in production, use proper encryption
    return decodeURIComponent(atob(value));
  }
  
  private getStorage(): Record<string, string> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }
  
  private setStorage(data: Record<string, string>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
  
  async getSecret(key: string): Promise<string | null> {
    const storage = this.getStorage();
    const encrypted = storage[key];
    if (!encrypted) return null;
    
    try {
      return this.decrypt(encrypted);
    } catch {
      console.error(`Failed to decrypt secret: ${key}`);
      return null;
    }
  }
  
  async setSecret(key: string, value: string): Promise<void> {
    const storage = this.getStorage();
    storage[key] = this.encrypt(value);
    this.setStorage(storage);
  }
  
  async deleteSecret(key: string): Promise<void> {
    const storage = this.getStorage();
    delete storage[key];
    this.setStorage(storage);
  }
  
  async listSecrets(): Promise<string[]> {
    const storage = this.getStorage();
    return Object.keys(storage);
  }
}

/**
 * In-memory vault for testing
 */
export class MemoryVault implements IVault {
  private secrets = new Map<string, string>();
  
  async getSecret(key: string): Promise<string | null> {
    return this.secrets.get(key) || null;
  }
  
  async setSecret(key: string, value: string): Promise<void> {
    this.secrets.set(key, value);
  }
  
  async deleteSecret(key: string): Promise<void> {
    this.secrets.delete(key);
  }
  
  async listSecrets(): Promise<string[]> {
    return Array.from(this.secrets.keys());
  }
  
  /**
   * Clear all secrets (useful for testing)
   */
  async clear(): Promise<void> {
    this.secrets.clear();
  }
}

/**
 * Vault factory
 */
export function createVault(type: "local" | "memory" = "local"): IVault {
  switch (type) {
    case "memory":
      return new MemoryVault();
    case "local":
    default:
      return new LocalVault();
  }
}

// Import the store vault
import { getStoreVault } from "./store-vault";

// Global vault instance
let vaultInstance: IVault | null = null;

/**
 * Get the global vault instance
 */
export function getVault(): IVault {
  if (!vaultInstance) {
    // Use StoreVault by default
    vaultInstance = getStoreVault();
  }
  return vaultInstance;
}

/**
 * Set a custom vault implementation
 */
export function setVault(vault: IVault): void {
  vaultInstance = vault;
}

/**
 * Get the vault key for a secret
 */
export function getSecretVaultKey(
  key: string, 
  source: "global" | "environment", 
  environmentId?: string
): string {
  if (source === "environment" && environmentId) {
    return `env:${environmentId}:${key}`;
  }
  return `global:${key}`;
}