/**
 * Environment module exports
 */

// Types
export * from "./types";

// Store
export { useEnvironmentStore } from "./store";

// Hooks
export * from "./hooks";

// Components
export { EnvironmentManager } from "./components/environment-manager";
export { EnvironmentSelector } from "./components/environment-selector";
export { VariablePicker } from "./components/variable-picker";
export { SecretInput } from "./components/secret-input";

// Utilities
export { 
  resolveVariable, 
  resolveTemplate, 
  getAllVariables,
  isValidVariableName,
  getSecretVaultKey
} from "./resolver";

// Vault
export { getVault, setVault, createVault } from "./vault";