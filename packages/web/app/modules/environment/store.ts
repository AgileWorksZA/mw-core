/**
 * Environment store implementation using store-kit pattern
 */

import { create as mutativeCreate } from "mutative";
import { nanoid } from "nanoid";
import type { 
  EnvironmentStoreState, 
  EnvironmentStoreActions,
  IDEEnvironmentConfig,
  Environment,
  Variable,
  SecretReference
} from "./types";
import { getVault } from "./vault";
import { resolveVariable, resolveTemplate, getSecretVaultKey } from "./resolver";

const initialConfig: IDEEnvironmentConfig = {
  activeEnvironment: undefined,
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

export interface EnvironmentStore extends EnvironmentStoreState, EnvironmentStoreActions {}

// Export the store instance for direct access
export const environmentStore = (() => {
  let state: EnvironmentStore;
  
  const set = (updater: (state: EnvironmentStore) => EnvironmentStore) => {
    state = updater(state);
  };
  
  const get = () => state;
  
  // Initialize state
  state = {
    // Initial state
    config: initialConfig,
    isLoading: false,
    error: undefined,
    resolvedCache: new Map(),
    
    // Environment management
    setActiveEnvironment: (environmentId?: string) => {
      set(state => 
        mutativeCreate(state, draft => {
          draft.config.activeEnvironment = environmentId;
          draft.config.metadata.updatedAt = new Date().toISOString();
          // Clear resolved cache when environment changes
          draft.resolvedCache.clear();
        })
      );
    },
    
    createEnvironment: (environment) => {
      const id = nanoid();
      const now = new Date().toISOString();
      
      set(state => 
        mutativeCreate(state, draft => {
          draft.config.environments[id] = {
            ...environment,
            id,
            variables: {},
            secrets: {},
            createdAt: now,
            updatedAt: now
          };
          draft.config.metadata.updatedAt = now;
        })
      );
      
      return id;
    },
    
    updateEnvironment: (id, updates) => {
      set(state => 
        mutativeCreate(state, draft => {
          if (draft.config.environments[id]) {
            Object.assign(draft.config.environments[id], updates);
            draft.config.environments[id].updatedAt = new Date().toISOString();
            draft.config.metadata.updatedAt = new Date().toISOString();
          }
        })
      );
    },
    
    deleteEnvironment: (id) => {
      set(state => 
        mutativeCreate(state, draft => {
          delete draft.config.environments[id];
          if (draft.config.activeEnvironment === id) {
            draft.config.activeEnvironment = undefined;
          }
          draft.config.metadata.updatedAt = new Date().toISOString();
        })
      );
    },
    
    // Variable management
    setGlobalVariable: (key, value, description) => {
      const now = new Date().toISOString();
      
      set(state => 
        mutativeCreate(state, draft => {
          draft.config.globals.variables[key] = {
            key,
            value,
            type: "variable",
            description,
            createdAt: draft.config.globals.variables[key]?.createdAt || now,
            updatedAt: now
          };
          draft.config.metadata.updatedAt = now;
          // Clear cache for this variable
          draft.resolvedCache.delete(key);
        })
      );
    },
    
    setEnvironmentVariable: (environmentId, key, value) => {
      set(state => 
        mutativeCreate(state, draft => {
          if (draft.config.environments[environmentId]) {
            draft.config.environments[environmentId].variables[key] = value;
            draft.config.environments[environmentId].updatedAt = new Date().toISOString();
            draft.config.metadata.updatedAt = new Date().toISOString();
            // Clear cache for this variable
            draft.resolvedCache.delete(key);
          }
        })
      );
    },
    
    deleteGlobalVariable: (key) => {
      set(state => 
        mutativeCreate(state, draft => {
          delete draft.config.globals.variables[key];
          draft.config.metadata.updatedAt = new Date().toISOString();
          draft.resolvedCache.delete(key);
        })
      );
    },
    
    deleteEnvironmentVariable: (environmentId, key) => {
      set(state => 
        mutativeCreate(state, draft => {
          if (draft.config.environments[environmentId]) {
            delete draft.config.environments[environmentId].variables[key];
            draft.config.environments[environmentId].updatedAt = new Date().toISOString();
            draft.config.metadata.updatedAt = new Date().toISOString();
            draft.resolvedCache.delete(key);
          }
        })
      );
    },
    
    // Secret management
    setGlobalSecret: async (key, value, description) => {
      const now = new Date().toISOString();
      const vault = getVault();
      
      // Store in vault
      await vault.setSecret(getSecretVaultKey(key, "global"), value);
      
      set(state => 
        mutativeCreate(state, draft => {
          draft.config.globals.secrets[key] = {
            key,
            description,
            createdAt: draft.config.globals.secrets[key]?.createdAt || now,
            updatedAt: now
          };
          draft.config.metadata.updatedAt = now;
          draft.resolvedCache.delete(key);
        })
      );
    },
    
    setEnvironmentSecret: async (environmentId, key, value) => {
      const now = new Date().toISOString();
      const vault = getVault();
      
      // Store in vault
      await vault.setSecret(getSecretVaultKey(key, "environment", environmentId), value);
      
      set(state => 
        mutativeCreate(state, draft => {
          if (draft.config.environments[environmentId]) {
            draft.config.environments[environmentId].secrets[key] = {
              key,
              createdAt: draft.config.environments[environmentId].secrets[key]?.createdAt || now,
              updatedAt: now
            };
            draft.config.environments[environmentId].updatedAt = now;
            draft.config.metadata.updatedAt = now;
            draft.resolvedCache.delete(key);
          }
        })
      );
    },
    
    deleteGlobalSecret: async (key) => {
      const vault = getVault();
      await vault.deleteSecret(getSecretVaultKey(key, "global"));
      
      set(state => 
        mutativeCreate(state, draft => {
          delete draft.config.globals.secrets[key];
          draft.config.metadata.updatedAt = new Date().toISOString();
          draft.resolvedCache.delete(key);
        })
      );
    },
    
    deleteEnvironmentSecret: async (environmentId, key) => {
      const vault = getVault();
      await vault.deleteSecret(getSecretVaultKey(key, "environment", environmentId));
      
      set(state => 
        mutativeCreate(state, draft => {
          if (draft.config.environments[environmentId]) {
            delete draft.config.environments[environmentId].secrets[key];
            draft.config.environments[environmentId].updatedAt = new Date().toISOString();
            draft.config.metadata.updatedAt = new Date().toISOString();
            draft.resolvedCache.delete(key);
          }
        })
      );
    },
    
    // Resolution
    resolveVariable: async (key, environmentId) => {
      const cacheKey = `${environmentId || state.config.activeEnvironment || 'global'}:${key}`;
      
      // Check cache first
      if (state.resolvedCache.has(cacheKey)) {
        return state.resolvedCache.get(cacheKey) || null;
      }
      
      const resolved = await resolveVariable(key, state.config, environmentId);
      
      // Cache the result
      if (resolved) {
        set(state => 
          mutativeCreate(state, draft => {
            draft.resolvedCache.set(cacheKey, resolved);
          })
        );
      }
      
      return resolved;
    },
    
    resolveTemplate: async (template, environmentId) => {
      return resolveTemplate(template, state.config, environmentId);
    },
    
    // Import/Export
    exportEnvironment: (environmentId) => {
      const exportData = environmentId && state.config.environments[environmentId]
        ? {
            environment: state.config.environments[environmentId],
            metadata: {
              exportedAt: new Date().toISOString(),
              version: state.config.metadata.version
            }
          }
        : {
            config: state.config,
            metadata: {
              exportedAt: new Date().toISOString()
            }
          };
      
      return JSON.stringify(exportData, null, 2);
    },
    
    importEnvironment: (data) => {
      try {
        const parsed = JSON.parse(data);
        
        if (parsed.environment) {
          // Import single environment
          const id = nanoid();
          set(state => 
            mutativeCreate(state, draft => {
              draft.config.environments[id] = {
                ...parsed.environment,
                id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              draft.config.metadata.updatedAt = new Date().toISOString();
            })
          );
        } else if (parsed.config) {
          // Import full config
          set(state => 
            mutativeCreate(state, draft => {
              draft.config = {
                ...parsed.config,
                metadata: {
                  ...parsed.config.metadata,
                  updatedAt: new Date().toISOString()
                }
              };
            })
          );
        }
      } catch (error) {
        console.error("Failed to import environment:", error);
        throw new Error("Invalid environment data");
      }
    }
  };
  
  return state;
})();

// Hook to use the environment store
export function useEnvironmentStore() {
  // In a real implementation, this would use React state/context
  // For now, return the singleton store
  return environmentStore;
}