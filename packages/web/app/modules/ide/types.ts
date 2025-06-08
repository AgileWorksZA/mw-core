import type { JSONSchemaType } from "ajv";
import type { JsonValue } from "type-fest";

interface Pointer {
  internal: "pointer"; // This indicates that the type is a pointer to another file
  type: string; // Type of the file
  id: string; // ID of the file
  path: string; // The json-path of file[@ID].output
}

interface Parameter<T> {
  internal: "parameter";
  id: string; // The unique identifier for the dependency
  name: string; // The name of the parameter
  schema: JSONSchemaType<T>;
}

/**
 * Represents a reference to the current file's internal data
 * The 'from-data' type allows exposing "protected" internal data from the current file only
 * Never references external files - use Pointer type instead if you need cross-file references
 */
interface FromData<T> {
  internal: "from-data";
  path: string; // The json-path to access the current file's internal data
  schema: JSONSchemaType<T>;
}

/**
 * Reference to a project-level variable (global or environment-specific)
 */
interface ProjectVariable {
  internal: "project-variable";
  key: string; // The variable name/key
  environmentId?: string; // Optional environment ID, if not provided uses active environment
}

/**
 * Reference to a project-level secret (global or environment-specific)
 */
interface ProjectSecret {
  internal: "project-secret";
  key: string; // The secret name/key
  environmentId?: string; // Optional environment ID, if not provided uses active environment
}

type InternalTypes<T> = Pointer | Parameter<T> | FromData<T> | ProjectVariable | ProjectSecret;

type RecordContainingInternals =
  | Record<string, JsonValue | InternalTypes<any>>
  | Array<JsonValue | InternalTypes<any> | RecordContainingInternals>;

type Variables<T> = JsonValue | InternalTypes<T> | RecordContainingInternals;

interface FileManifest<
  I extends Variables<any> = any,
  O extends NoOutput | typeof UseInputAsOutput | any = any,
> {
  id: string;
  path: string;
  type: string; // The type is used to select the adapters of this type
  mapping: PublicMapping<I, O>; // The mapping of the project file
  // The dependencies of the project file are stored in the input variables
  // Dependencies are just pointers. We need to register custom types in the JSON schema, via AJV
}

interface InputVariables<I extends NoInput | Variables<any>> {
  variables: Variables<I>; // The variables that are used in the project file
  schema?: JSONSchemaType<I>; // The schema of the variables
}

// Outputs could just be the input variables, but we need to keep track of the dependencies
interface OutputVariables<O extends NoOutput | typeof UseInputAsOutput | any> {
  variables: Variables<O>; // The variables that are used in the project file
  schema?: JSONSchemaType<O>; // The schema of the variables
}

type NoInput = false;
type NoOutput = false;
const UseInputAsOutput = true;

interface PublicMapping<
  I extends NoInput | Variables<any>,
  O extends NoOutput | typeof UseInputAsOutput | any,
> {
  input: InputVariables<I>;
  // if output is false, then there is no output,
  // if true, then we use the inputs as output,
  // otherwise we use the output variables
  // This helps use to avoid duplicates when the input is the output
  output: OutputVariables<O>;
  // Resources owned by this file (public paths that should be cleaned up on deletion)
  resources?: string[];
}

// T is the shape
interface FileContext<D = any> {
  data: D; // The data of the project file
}

/**
 * Environment configuration for the project
 */
interface Environment {
  id: string;
  name: string;
  description?: string;
  color?: string;
  variables: Record<string, string>; // environment-specific variables
  secrets: Record<string, { key: string; description?: string; createdAt: string; updatedAt: string }>; // secret references
  createdAt: string;
  updatedAt: string;
}

/**
 * Variable definition with metadata
 */
interface Variable {
  key: string;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Secret reference (actual value stored in vault)
 */
interface SecretReference {
  key: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  lastAccessed?: string;
}

/**
 * Project environment configuration
 */
interface ProjectEnvironmentConfig {
  activeEnvironment?: string;
  globals: {
    variables: Record<string, Variable>;
    secrets: Record<string, SecretReference>;
  };
  environments: Record<string, Environment>;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

type ID = string;
interface Project {
  id: string; // The unique identifier for the project
  name: string; // The name of the project
  fileOrder: ID[]; // The order of the files in the project, used in the UI
  expandedPaths: string[]; // The paths that are expanded in the file tree
  files: Record<ID, FileManifest<any, any>>;
  // Environment configuration for variables and secrets
  environmentConfig?: ProjectEnvironmentConfig;
  // Secret store - stores actual secret values encrypted in the project store
  secretStore?: Record<string, string>;
}

// Define ResolveResult type for better type checking
type ResolveResult = {
  path: string;
  pointer: Pointer;
  resolved: any | null;
  error: string | null;
  depth: number;
};

export type {
  FileManifest,
  Pointer,
  Parameter,
  FromData,
  ProjectVariable,
  ProjectSecret,
  InternalTypes,
  Variables,
  FileContext,
  Project,
  Environment,
  Variable,
  SecretReference,
  ProjectEnvironmentConfig,
  PublicMapping,
  NoOutput,
  UseInputAsOutput,
  InputVariables,
  OutputVariables,
  ID,
  ResolveResult,
};
