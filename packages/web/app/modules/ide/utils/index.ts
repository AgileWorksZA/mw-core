export { 
  generateSlugId, 
  generatePathSafeId, 
  generateEntityId 
} from './generate-id';

export {
  detectCircularDependency,
  validatePointers
} from './detect-circular-dependencies';

export { extractInternals } from './extract-internals';
export { getTypeAdapter } from './get-type-adapter';
export { resourceManager } from './resource-manager';
export { 
  resolveProjectVariable, 
  resolveProjectSecret, 
  getAllProjectVariables,
  isValidVariableName 
} from './variable-resolver';
export { resolveInternalTypes } from './internal-resolver';