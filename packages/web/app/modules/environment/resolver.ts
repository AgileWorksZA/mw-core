/**
 * Variable resolution service
 */

import type { 
  IDEEnvironmentConfig, 
  ResolvedVariable, 
  VariableType,
  VariableSource 
} from "./types";
import { VARIABLE_PATTERN, extractVariables } from "./types";
import { getVault } from "./vault";

/**
 * Resolve a single variable
 */
export async function resolveVariable(
  key: string,
  config: IDEEnvironmentConfig,
  environmentId?: string
): Promise<ResolvedVariable | null> {
  // Use active environment if not specified
  const targetEnvironmentId = environmentId || config.activeEnvironment;
  
  // Check environment-specific variables first
  if (targetEnvironmentId && config.environments[targetEnvironmentId]) {
    const env = config.environments[targetEnvironmentId];
    
    // Check environment variables
    if (env.variables[key] !== undefined) {
      return {
        key,
        value: env.variables[key],
        type: "variable",
        source: "environment",
        environment: targetEnvironmentId
      };
    }
    
    // Check environment secrets
    if (env.secrets[key]) {
      const vault = getVault();
      const value = await vault.getSecret(`env:${targetEnvironmentId}:${key}`);
      if (value !== null) {
        return {
          key,
          value,
          type: "secret",
          source: "environment",
          environment: targetEnvironmentId
        };
      }
    }
  }
  
  // Check global variables
  if (config.globals.variables[key]) {
    return {
      key,
      value: config.globals.variables[key].value,
      type: "variable",
      source: "global"
    };
  }
  
  // Check global secrets
  if (config.globals.secrets[key]) {
    const vault = getVault();
    const value = await vault.getSecret(`global:${key}`);
    if (value !== null) {
      return {
        key,
        value,
        type: "secret",
        source: "global"
      };
    }
  }
  
  return null;
}

/**
 * Resolve all variables in a template string
 */
export async function resolveTemplate(
  template: string,
  config: IDEEnvironmentConfig,
  environmentId?: string
): Promise<string> {
  const variables = extractVariables(template);
  let result = template;
  
  for (const varName of variables) {
    const resolved = await resolveVariable(varName, config, environmentId);
    if (resolved) {
      // Replace all occurrences of {{varName}} with the resolved value
      result = result.replace(
        new RegExp(`\\{\\{\\s*${escapeRegExp(varName)}\\s*\\}\\}`, 'g'),
        resolved.value
      );
    }
    // If not resolved, leave the placeholder as is
  }
  
  return result;
}

/**
 * Get all available variables for a given environment
 */
export async function getAllVariables(
  config: IDEEnvironmentConfig,
  environmentId?: string
): Promise<ResolvedVariable[]> {
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
    for (const key of Object.keys(env.secrets)) {
      seenKeys.add(key);
      const vault = getVault();
      const value = await vault.getSecret(`env:${targetEnvironmentId}:${key}`);
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
  for (const key of Object.keys(config.globals.secrets)) {
    if (!seenKeys.has(key)) {
      const vault = getVault();
      const value = await vault.getSecret(`global:${key}`);
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
 * Validate variable names
 */
export function isValidVariableName(name: string): boolean {
  // Allow alphanumeric, underscore, dash, and dot
  // Must start with a letter or underscore
  return /^[a-zA-Z_][a-zA-Z0-9_\-.]*$/.test(name);
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get the vault key for a secret
 */
export function getSecretVaultKey(key: string, source: VariableSource, environmentId?: string): string {
  if (source === "environment" && environmentId) {
    return `env:${environmentId}:${key}`;
  }
  return `global:${key}`;
}