import type {
  ProjectEmitPayloads,
  ProjectEventPayloads,
} from "~/modules/ide/provider/store/types";
import type { EventHandlers } from "~/modules/store-kit/types";
import type { Project, Environment, Variable, SecretReference } from "~/modules/ide/types";
import { getSecretVaultKey } from "~/modules/ide/utils/vault";

export const on: EventHandlers<
  Project,
  ProjectEventPayloads,
  ProjectEmitPayloads
> = {
  update: (context, event, enqueue) => {
    if (event.context.fileOrder) {
      if (
        event.context.fileOrder.length !==
        event.context.fileOrder?.filter(Boolean)?.length
      ) {
        throw "Invalid item";
      }
    }
    if (!event.noEmit) {
      enqueue.emit.updated();
    }
    // Mutate the context directly instead of returning a new object
    Object.assign(context, event.context);
  },
  
  rename: (context, event) => {
    const { id, path } = event;
    const file = context.files[id];
    if (file) {
      context.files[id] = { ...file, path };
    }
    // Don't return anything when mutating the draft
  },

  // Environment Management
  createEnvironment: (context, event, enqueue) => {
    // Initialize environment config if needed
    if (!context.environmentConfig) {
      context.environmentConfig = {
        activeEnvironment: undefined,
        globals: { variables: {}, secrets: {} },
        environments: {},
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: "1.0.0",
        },
      };
    }

    const newEnv: Environment = {
      id: `env_${Date.now()}`,
      name: event.name,
      description: event.description,
      color: event.color || "#3b82f6",
      variables: {},
      secrets: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    context.environmentConfig.environments[newEnv.id] = newEnv;
    context.environmentConfig.metadata.updatedAt = new Date().toISOString();

    enqueue.emit.environmentCreated({ environment: newEnv });
    enqueue.emit.updated();
    
    // Don't return anything when mutating the draft
  },

  updateEnvironment: (context, event, enqueue) => {
    if (!context.environmentConfig?.environments[event.id]) return;

    const env = context.environmentConfig.environments[event.id];
    Object.assign(env, event.updates, {
      updatedAt: new Date().toISOString(),
    });

    context.environmentConfig.metadata.updatedAt = new Date().toISOString();

    enqueue.emit.environmentUpdated({ environment: env });
    enqueue.emit.updated();
    
    // Don't return anything when mutating the draft
  },

  deleteEnvironment: (context, event, enqueue) => {
    if (!context.environmentConfig?.environments[event.id]) return;

    // Delete environment secrets from store
    const env = context.environmentConfig.environments[event.id];
    
    if (context.secretStore) {
      for (const key of Object.keys(env.secrets)) {
        const vaultKey = getSecretVaultKey(key, "environment", event.id);
        delete context.secretStore[vaultKey];
      }
    }

    delete context.environmentConfig.environments[event.id];

    // Clear active environment if it was deleted
    if (context.environmentConfig.activeEnvironment === event.id) {
      context.environmentConfig.activeEnvironment = undefined;
    }

    context.environmentConfig.metadata.updatedAt = new Date().toISOString();

    enqueue.emit.environmentDeleted({ id: event.id });
    enqueue.emit.updated();
    
    // Don't return anything when mutating the draft
  },

  setActiveEnvironment: (context, event, enqueue) => {
    if (!context.environmentConfig) return;

    context.environmentConfig.activeEnvironment = event.id;
    context.environmentConfig.metadata.updatedAt = new Date().toISOString();

    enqueue.emit.activeEnvironmentChanged({ id: event.id });
    enqueue.emit.updated();
    
    // Don't return anything when mutating the draft
  },

  // Variable Management
  setVariable: (context, event, enqueue) => {
    // Initialize environment config if needed
    if (!context.environmentConfig) {
      context.environmentConfig = {
        activeEnvironment: undefined,
        globals: { variables: {}, secrets: {} },
        environments: {},
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: "1.0.0",
        },
      };
    }

    const variable: Variable = {
      key: event.key,
      value: event.value,
      description: event.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (event.environmentId) {
      // Environment-specific variable
      const env = context.environmentConfig.environments[event.environmentId];
      if (env) {
        env.variables[event.key] = event.value;
        env.updatedAt = new Date().toISOString();
      }
    } else {
      // Global variable
      context.environmentConfig.globals.variables[event.key] = variable;
    }

    context.environmentConfig.metadata.updatedAt = new Date().toISOString();

    enqueue.emit.variableSet({ key: event.key, environmentId: event.environmentId });
    enqueue.emit.updated();
    
    // Don't return anything when mutating the draft
  },

  deleteVariable: (context, event, enqueue) => {
    if (!context.environmentConfig) return;

    if (event.environmentId) {
      // Environment-specific variable
      const env = context.environmentConfig.environments[event.environmentId];
      if (env) {
        delete env.variables[event.key];
        env.updatedAt = new Date().toISOString();
      }
    } else {
      // Global variable
      delete context.environmentConfig.globals.variables[event.key];
    }

    context.environmentConfig.metadata.updatedAt = new Date().toISOString();

    enqueue.emit.variableDeleted({ key: event.key, environmentId: event.environmentId });
    enqueue.emit.updated();
    
    // Don't return anything when mutating the draft
  },

  // Secret Management
  setSecret: (context, event, enqueue) => {
    // Initialize environment config if needed
    if (!context.environmentConfig) {
      context.environmentConfig = {
        activeEnvironment: undefined,
        globals: { variables: {}, secrets: {} },
        environments: {},
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: "1.0.0",
        },
      };
    }

    // Initialize secret store if needed
    if (!context.secretStore) {
      context.secretStore = {};
    }

    const secretRef: SecretReference = {
      key: event.key,
      description: event.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let vaultKey: string;

    if (event.environmentId) {
      // Environment-specific secret
      const env = context.environmentConfig.environments[event.environmentId];
      if (env) {
        env.secrets[event.key] = secretRef;
        env.updatedAt = new Date().toISOString();
        vaultKey = getSecretVaultKey(event.key, "environment", event.environmentId);
      } else {
        return;
      }
    } else {
      // Global secret
      context.environmentConfig.globals.secrets[event.key] = secretRef;
      vaultKey = getSecretVaultKey(event.key, "global");
    }

    // Store the secret value directly in the context
    context.secretStore[vaultKey] = event.value;

    context.environmentConfig.metadata.updatedAt = new Date().toISOString();

    enqueue.emit.secretSet({ key: event.key, environmentId: event.environmentId });
    enqueue.emit.updated();
  },

  deleteSecret: (context, event, enqueue) => {
    if (!context.environmentConfig || !context.secretStore) return;

    let vaultKey: string;

    if (event.environmentId) {
      // Environment-specific secret
      const env = context.environmentConfig.environments[event.environmentId];
      if (env) {
        delete env.secrets[event.key];
        env.updatedAt = new Date().toISOString();
        vaultKey = getSecretVaultKey(event.key, "environment", event.environmentId);
      } else {
        return;
      }
    } else {
      // Global secret
      delete context.environmentConfig.globals.secrets[event.key];
      vaultKey = getSecretVaultKey(event.key, "global");
    }

    // Delete from secret store
    delete context.secretStore[vaultKey];

    context.environmentConfig.metadata.updatedAt = new Date().toISOString();

    enqueue.emit.secretDeleted({ key: event.key, environmentId: event.environmentId });
    enqueue.emit.updated();
  },
};