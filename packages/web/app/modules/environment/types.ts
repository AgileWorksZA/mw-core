/**
 * Environment and Variables System Types
 */

/**
 * Variable types that can be stored
 */
export type VariableType = "variable" | "secret";

/**
 * Source of a variable (global or environment-specific)
 */
export type VariableSource = "global" | "environment";

/**
 * A variable definition
 */
export interface Variable {
  key: string;
  value: string;
  type: VariableType;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Secret reference (actual value stored in vault)
 */
export interface SecretReference {
  key: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  lastAccessed?: string;
}

/**
 * Environment configuration
 */
export interface Environment {
  id: string;
  name: string;
  description?: string;
  color?: string; // For UI badges
  variables: Record<string, string>;
  secrets: Record<string, SecretReference>;
  createdAt: string;
  updatedAt: string;
}

/**
 * IDE-level environment configuration
 */
export interface IDEEnvironmentConfig {
  // Currently active environment
  activeEnvironment?: string;
  
  // Global variables (available in all environments)
  globals: {
    variables: Record<string, Variable>;
    secrets: Record<string, SecretReference>;
  };
  
  // Environment-specific configurations
  environments: Record<string, Environment>;
  
  // Metadata
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

/**
 * Internal type for project variable reference
 */
export interface ProjectVariable {
  type: "project-variable";
  key: string;
  source: VariableSource;
  environment?: string;
}

/**
 * Internal type for project secret reference
 */
export interface ProjectSecret {
  type: "project-secret";
  key: string;
  source: VariableSource;
  environment?: string;
}

/**
 * Variable resolution result
 */
export interface ResolvedVariable {
  key: string;
  value: string;
  type: VariableType;
  source: VariableSource;
  environment?: string;
}

/**
 * Variable usage tracking
 */
export interface VariableUsage {
  variableKey: string;
  usedIn: {
    type: string; // e.g., "serviceconnection", "openapi", etc.
    id: string;
    path: string; // JSON path where used
  }[];
}

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
 * Environment store state
 */
export interface EnvironmentStoreState {
  config: IDEEnvironmentConfig;
  isLoading: boolean;
  error?: string;
  // Cached resolved values
  resolvedCache: Map<string, ResolvedVariable>;
}

/**
 * Environment store actions
 */
export interface EnvironmentStoreActions {
  // Environment management
  setActiveEnvironment(environmentId?: string): void;
  createEnvironment(environment: Omit<Environment, "id" | "createdAt" | "updatedAt">): string;
  updateEnvironment(id: string, updates: Partial<Environment>): void;
  deleteEnvironment(id: string): void;
  
  // Variable management
  setGlobalVariable(key: string, value: string, description?: string): void;
  setEnvironmentVariable(environmentId: string, key: string, value: string): void;
  deleteGlobalVariable(key: string): void;
  deleteEnvironmentVariable(environmentId: string, key: string): void;
  
  // Secret management
  setGlobalSecret(key: string, value: string, description?: string): Promise<void>;
  setEnvironmentSecret(environmentId: string, key: string, value: string): Promise<void>;
  deleteGlobalSecret(key: string): Promise<void>;
  deleteEnvironmentSecret(environmentId: string, key: string): Promise<void>;
  
  // Resolution
  resolveVariable(key: string, environmentId?: string): Promise<ResolvedVariable | null>;
  resolveTemplate(template: string, environmentId?: string): Promise<string>;
  
  // Import/Export
  exportEnvironment(environmentId?: string): string;
  importEnvironment(data: string): void;
}

/**
 * Variable pattern for template resolution
 */
export const VARIABLE_PATTERN = /\{\{([^}]+)\}\}/g;

/**
 * Check if a string contains variables
 */
export function containsVariables(str: string): boolean {
  return VARIABLE_PATTERN.test(str);
}

/**
 * Extract variable names from a template string
 */
export function extractVariables(template: string): string[] {
  const matches = template.matchAll(VARIABLE_PATTERN);
  return Array.from(matches, m => m[1].trim());
}