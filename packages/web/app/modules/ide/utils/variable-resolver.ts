/**
 * Variable resolution for ProjectVariable and ProjectSecret internal types
 */

import type { 
  Project, 
  ProjectVariable, 
  ProjectSecret, 
  Variable, 
  SecretReference
} from "../types";
import { getVault, getSecretVaultKey } from "./vault";

/**
 * Resolved variable result
 */
export interface ResolvedVariable {
  key: string;
  value: string;
  type: "variable" | "secret";
  source: "global" | "environment";
  environment?: string;
}

/**
 * Resolve a ProjectVariable internal type
 */
export async function resolveProjectVariable(
  projectVar: ProjectVariable,
  project: Project
): Promise<string | null> {
  const config = project.environmentConfig;
  if (!config) return null;

  const environmentId = projectVar.environmentId || config.activeEnvironment;
  
  // Check environment-specific variables first
  if (environmentId && config.environments[environmentId]) {
    const env = config.environments[environmentId];
    if (env.variables[projectVar.key] !== undefined) {
      return env.variables[projectVar.key];
    }
  }
  
  // Check global variables
  const globalVar = config.globals.variables[projectVar.key];
  if (globalVar) {
    return globalVar.value;
  }
  
  return null;
}

/**
 * Resolve a ProjectSecret internal type
 */
export async function resolveProjectSecret(
  projectSecret: ProjectSecret,
  project: Project
): Promise<string | null> {
  const config = project.environmentConfig;
  if (!config) return null;

  const environmentId = projectSecret.environmentId || config.activeEnvironment;
  const vault = getVault();
  
  // Check environment-specific secrets first
  if (environmentId && config.environments[environmentId]) {
    const env = config.environments[environmentId];
    if (env.secrets[projectSecret.key]) {
      const vaultKey = getSecretVaultKey(projectSecret.key, "environment", environmentId);
      return await vault.getSecret(vaultKey);
    }
  }
  
  // Check global secrets
  if (config.globals.secrets[projectSecret.key]) {
    const vaultKey = getSecretVaultKey(projectSecret.key, "global");
    return await vault.getSecret(vaultKey);
  }
  
  return null;
}

/**
 * Get all available variables for the active environment
 */
export async function getAllProjectVariables(
  project: Project,
  environmentId?: string
): Promise<ResolvedVariable[]> {
  const config = project.environmentConfig;
  if (!config) return [];

  const targetEnvironmentId = environmentId || config.activeEnvironment;
  const variables: ResolvedVariable[] = [];
  const seenKeys = new Set<string>();
  
  // Add environment-specific variables first (they override globals)
  if (targetEnvironmentId && config.environments[targetEnvironmentId]) {
    const env = config.environments[targetEnvironmentId];
    
    // Environment variables
    for (const [key, value] of Object.entries(env.variables)) {
      seenKeys.add(key);
      variables.push({
        key,
        value,
        type: "variable",
        source: "environment",
        environment: targetEnvironmentId
      });
    }
    
    // Environment secrets
    const vault = getVault();
    for (const key of Object.keys(env.secrets)) {
      seenKeys.add(key);
      const vaultKey = getSecretVaultKey(key, "environment", targetEnvironmentId);
      const value = await vault.getSecret(vaultKey);
      if (value !== null) {
        variables.push({
          key,
          value,
          type: "secret",
          source: "environment",
          environment: targetEnvironmentId
        });
      }
    }
  }
  
  // Add global variables (only if not overridden)
  for (const [key, variable] of Object.entries(config.globals.variables)) {
    if (!seenKeys.has(key)) {
      variables.push({
        key,
        value: variable.value,
        type: "variable",
        source: "global"
      });
    }
  }
  
  // Add global secrets (only if not overridden)
  const vault = getVault();
  for (const key of Object.keys(config.globals.secrets)) {
    if (!seenKeys.has(key)) {
      const vaultKey = getSecretVaultKey(key, "global");
      const value = await vault.getSecret(vaultKey);
      if (value !== null) {
        variables.push({
          key,
          value,
          type: "secret",
          source: "global"
        });
      }
    }
  }
  
  return variables;
}

/**
 * Check if a variable name is valid
 */
export function isValidVariableName(name: string): boolean {
  // Allow alphanumeric, underscore, dash, and dot
  // Must start with a letter or underscore
  return /^[a-zA-Z_][a-zA-Z0-9_\-.]*$/.test(name);
}