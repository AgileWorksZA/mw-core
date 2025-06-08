import { z } from 'zod';
import type { JSONSchemaType } from 'ajv';

/**
 * Validates data using a zod schema
 * 
 * @param schema The zod schema to validate with
 * @param data The data to validate
 * @returns Validation result with errors or parsed data
 */
export function validateWithZod<T>(
  schema: z.ZodType<T>,
  data: unknown
): {
  valid: boolean;
  errors: z.ZodError | null;
  errorMessage: string | null;
  data: T | null;
} {
  try {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const errorMessage = formatZodErrors(result.error);
      return {
        valid: false,
        errors: result.error,
        errorMessage,
        data: null
      };
    }
    
    return {
      valid: true,
      errors: null,
      errorMessage: null,
      data: result.data
    };
  } catch (error) {
    return {
      valid: false,
      errors: error instanceof z.ZodError ? error : null,
      errorMessage: error instanceof Error ? error.message : 'Unknown validation error',
      data: null
    };
  }
}

/**
 * Format zod errors into a readable string
 * 
 * @param error The zod error object
 * @returns Formatted error message string
 */
function formatZodErrors(error: z.ZodError): string {
  return error.issues.map(e => {
    const path = e.path.length > 0 ? `at ${e.path.join('.')}` : '';
    return `${path} ${e.message}`;
  }).join('\n');
}

/**
 * Creates a JSON Schema from a Zod schema
 * Note: This is a partial implementation and may not cover all zod types
 * 
 * @param zodSchema The zod schema to convert
 * @returns A JSON Schema approximation
 */
export function zodToJsonSchema(zodSchema: z.ZodType<any>): Record<string, any> {
  // This is a simplified implementation
  // A full implementation would need to handle all zod types and their options
  
  if (zodSchema instanceof z.ZodString) {
    return { type: 'string' };
  }
  
  if (zodSchema instanceof z.ZodNumber) {
    return { type: 'number' };
  }
  
  if (zodSchema instanceof z.ZodBoolean) {
    return { type: 'boolean' };
  }
  
  if (zodSchema instanceof z.ZodNull) {
    return { type: 'null' };
  }
  
  if (zodSchema instanceof z.ZodArray) {
    // Try to get the element schema
    const elementSchema = zodToJsonSchema((zodSchema as any)._def.type);
    return {
      type: 'array',
      items: elementSchema
    };
  }
  
  if (zodSchema instanceof z.ZodObject) {
    const shape = (zodSchema as any)._def.shape();
    const properties: Record<string, any> = {};
    const required: string[] = [];
    
    for (const [key, schema] of Object.entries(shape)) {
      properties[key] = zodToJsonSchema(schema);
      
      // If not optional, add to required list
      if (!(schema instanceof z.ZodOptional)) {
        required.push(key);
      }
    }
    
    return {
      type: 'object',
      properties,
      ...(required.length > 0 ? { required } : {})
    };
  }
  
  if (zodSchema instanceof z.ZodEnum) {
    return {
      type: 'string',
      enum: (zodSchema as any)._def.values
    };
  }
  
  if (zodSchema instanceof z.ZodUnion) {
    const options = (zodSchema as any)._def.options.map(zodToJsonSchema);
    return {
      oneOf: options
    };
  }
  
  if (zodSchema instanceof z.ZodOptional) {
    return zodToJsonSchema((zodSchema as any)._def.innerType);
  }
  
  if (zodSchema instanceof z.ZodNullable) {
    const innerSchema = zodToJsonSchema((zodSchema as any)._def.innerType);
    return {
      oneOf: [
        innerSchema,
        { type: 'null' }
      ]
    };
  }
  
  // Default for unknown/unsupported types
  return {};
}

/**
 * Validates data using both JSONSchema and Zod
 * 
 * @param jsonSchema The JSONSchema to validate with
 * @param zodSchema The zod schema to validate with
 * @param data The data to validate
 * @returns Combined validation result
 */
export function validateWithBoth<T>(
  jsonSchema: JSONSchemaType<T> | Record<string, any>,
  zodSchema: z.ZodType<T>,
  data: unknown
): {
  valid: boolean;
  ajvErrors: any[] | null;
  zodErrors: z.ZodError | null;
  errorMessage: string | null;
  data: T | null;
} {
  const ajvResult = validateWithAjv(jsonSchema, data);
  
  // If JSONSchema validation fails, return that result
  if (!ajvResult.valid) {
    return {
      valid: false,
      ajvErrors: ajvResult.errors,
      zodErrors: null,
      errorMessage: ajvResult.errorMessage,
      data: null
    };
  }
  
  // Then validate with zod for additional type safety
  const zodResult = validateWithZod(zodSchema, data);
  
  if (!zodResult.valid) {
    return {
      valid: false,
      ajvErrors: null,
      zodErrors: zodResult.errors,
      errorMessage: zodResult.errorMessage,
      data: null
    };
  }
  
  // Both validations passed
  return {
    valid: true,
    ajvErrors: null,
    zodErrors: null,
    errorMessage: null,
    data: zodResult.data
  };
}

/**
 * This function is imported from './validation' but defined here to avoid circular imports
 */
function validateWithAjv<T>(
  schema: JSONSchemaType<T> | Record<string, any>,
  data: unknown
): {
  valid: boolean;
  errors: any[] | null;
  errorMessage: string | null;
} {
  // Import from validation.ts at runtime to avoid circular dependency
  const { validateSchema } = require('./validation');
  return validateSchema(schema, data);
}