import Ajv from 'ajv';
import type { ErrorObject, JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

// Create and configure Ajv instance
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: false
});

// Add formats support (date, date-time, uri, etc.)
addFormats(ajv);

/**
 * Validates data against a JSON Schema
 * 
 * @param schema The JSON Schema to validate against
 * @param data The data to validate
 * @returns An object containing validation result and any errors
 */
export function validateSchema<T>(
  schema: JSONSchemaType<T> | Record<string, any>,
  data: unknown
): { 
  valid: boolean; 
  errors: ErrorObject[] | null;
  errorMessage: string | null;
} {
  try {
    // Compile the schema once
    const validate = ajv.compile(schema);
    
    // Validate the data
    const valid = validate(data);
    
    if (!valid && validate.errors) {
      // Format errors into a readable message
      const errorMessage = formatValidationErrors(validate.errors);
      return {
        valid: false,
        errors: validate.errors,
        errorMessage
      };
    }
    
    return { valid: true, errors: null, errorMessage: null };
  } catch (error) {
    // Handle schema compilation errors
    return { 
      valid: false, 
      errors: [{ 
        keyword: 'schema', 
        message: error instanceof Error ? error.message : 'Invalid schema',
        params: {},
        schemaPath: '',
        instancePath: ''
      }],
      errorMessage: error instanceof Error ? error.message : 'Invalid schema'
    };
  }
}

/**
 * Formats validation errors into a readable message
 * 
 * @param errors The validation errors from Ajv
 * @returns A formatted error message
 */
function formatValidationErrors(errors: ErrorObject[]): string {
  if (!errors || errors.length === 0) {
    return 'Unknown validation error';
  }
  
  return errors.map(error => {
    const path = error.instancePath ? `at ${error.instancePath}` : '';
    return `${path} ${error.message}`;
  }).join('\n');
}

/**
 * Validates data against a JSON Schema and returns typed data or throws
 * 
 * @param schema The JSON Schema to validate against
 * @param data The data to validate
 * @returns The validated data, typed according to the schema
 * @throws Error if validation fails
 */
export function validateOrThrow<T>(
  schema: JSONSchemaType<T> | Record<string, any>,
  data: unknown
): T {
  const result = validateSchema<T>(schema, data);
  
  if (!result.valid) {
    throw new Error(result.errorMessage || 'Validation failed');
  }
  
  return data as T;
}

/**
 * Creates a schema validator function for a specific schema
 * 
 * @param schema The JSON Schema to create a validator for
 * @returns A validator function that takes data and returns validation results
 */
export function createValidator<T>(
  schema: JSONSchemaType<T> | Record<string, any>
) {
  const validate = ajv.compile(schema);
  
  return (data: unknown): { 
    valid: boolean; 
    errors: ErrorObject[] | null;
    errorMessage: string | null;
    data: T | null;
  } => {
    const valid = validate(data);
    
    if (!valid) {
      const errorMessage = formatValidationErrors(validate.errors || []);
      return {
        valid: false,
        errors: validate.errors,
        errorMessage,
        data: null
      };
    }
    
    return { 
      valid: true, 
      errors: null, 
      errorMessage: null,
      data: data as T
    };
  };
}

/**
 * Check if a value is a valid JSON Schema
 * 
 * @param schema The potential JSON Schema to validate
 * @returns Whether the schema is a valid JSON Schema
 */
export function isValidSchema(schema: unknown): boolean {
  if (!schema || typeof schema !== 'object') {
    return false;
  }
  
  try {
    // Try to compile the schema
    ajv.compile(schema as Record<string, any>);
    return true;
  } catch (error) {
    return false;
  }
}