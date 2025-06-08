/**
 * Store-based vault implementation that stores secrets directly in the IDE store
 * This replaces the localStorage-based vault to avoid IndexedDB issues
 */

import type { IVault } from "./vault";
import type { Project } from "../types";

/**
 * Store-based vault that integrates with IDE's store-kit
 */
export class StoreVault implements IVault {
  private getProject: (() => Project) | null = null;
  private updateProject: ((updates: Partial<Project>) => void) | null = null;

  /**
   * Initialize the vault with the project store
   */
  initialize(getProject: () => Project, updateProject: (updates: Partial<Project>) => void) {
    this.getProject = getProject;
    this.updateProject = updateProject;
  }

  private getSecretStore(): Record<string, string> {
    if (!this.getProject) {
      console.warn("StoreVault not initialized");
      return {};
    }
    
    const project = this.getProject();
    // Store secrets in a dedicated secretStore within the project
    return project.secretStore || {};
  }

  private setSecretStore(secrets: Record<string, string>): void {
    if (!this.updateProject) {
      console.warn("StoreVault not initialized");
      return;
    }

    // Update the project with the new secret store
    this.updateProject({
      secretStore: secrets
    });
  }

  async getSecret(key: string): Promise<string | null> {
    const secrets = this.getSecretStore();
    return secrets[key] || null;
  }

  async setSecret(key: string, value: string): Promise<void> {
    const secrets = { ...this.getSecretStore() };
    secrets[key] = value;
    this.setSecretStore(secrets);
  }

  async deleteSecret(key: string): Promise<void> {
    const secrets = { ...this.getSecretStore() };
    delete secrets[key];
    this.setSecretStore(secrets);
  }

  async listSecrets(): Promise<string[]> {
    const secrets = this.getSecretStore();
    return Object.keys(secrets);
  }

  /**
   * Clear all secrets (useful for testing)
   */
  async clear(): Promise<void> {
    this.setSecretStore({});
  }
}

// Global store vault instance
let storeVaultInstance: StoreVault | null = null;

/**
 * Get the global store vault instance
 */
export function getStoreVault(): StoreVault {
  if (!storeVaultInstance) {
    storeVaultInstance = new StoreVault();
  }
  return storeVaultInstance;
}