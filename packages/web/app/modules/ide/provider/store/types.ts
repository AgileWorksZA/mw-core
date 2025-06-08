import type { Project, Environment, Variable, SecretReference } from "~/modules/ide/types";
import type { StoreKit } from "~/modules/store-kit/types";

// Define your event payloads (without type)
export type ProjectEventPayloads = {
  update: { context: Partial<Project>; noEmit?: boolean };
  rename: { id: string; path: string };
  
  // Environment Management
  createEnvironment: { name: string; description?: string; color?: string };
  updateEnvironment: { id: string; updates: Partial<Environment> };
  deleteEnvironment: { id: string };
  setActiveEnvironment: { id: string | undefined };
  
  // Variable Management
  setVariable: { 
    key: string; 
    value: string; 
    description?: string; 
    environmentId?: string; // undefined = global
  };
  deleteVariable: { key: string; environmentId?: string };
  
  // Secret Management
  setSecret: { 
    key: string; 
    value: string; 
    description?: string; 
    environmentId?: string; // undefined = global
  };
  deleteSecret: { key: string; environmentId?: string };
};

// Define your emitted event payloads
export type ProjectEmitPayloads = {
  updated: undefined;
  environmentCreated: { environment: Environment };
  environmentUpdated: { environment: Environment };
  environmentDeleted: { id: string };
  activeEnvironmentChanged: { id: string | undefined };
  variableSet: { key: string; environmentId?: string };
  variableDeleted: { key: string; environmentId?: string };
  secretSet: { key: string; environmentId?: string };
  secretDeleted: { key: string; environmentId?: string };
};

export type ProjectStoreKit = StoreKit<
  Project,
  ProjectEventPayloads,
  ProjectEmitPayloads
>;
