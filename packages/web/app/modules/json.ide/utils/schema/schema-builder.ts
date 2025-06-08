import type { JSONSchemaType } from 'ajv';
import {
  stringSchema,
  numberSchema,
  booleanSchema,
  nullSchema,
  anyArraySchema,
  anyObjectSchema,
  createUnionSchema
} from './common-schemas';

/**
 * SchemaBuilder provides a fluent API for building JSON Schema definitions
 */
export class SchemaBuilder<T = any> {
  private schema: Record<string, any> = {};

  /**
   * Create a new schema builder
   * 
   * @returns A new SchemaBuilder instance
   */
  static create(): SchemaBuilder {
    return new SchemaBuilder();
  }

  /**
   * Set the schema to be a string type
   * 
   * @param options Optional configuration for the string schema
   * @returns The builder instance
   */
  string(options?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
    enum?: string[];
  }): SchemaBuilder<string> {
    this.schema = { ...stringSchema };
    
    if (options) {
      if (options.minLength !== undefined) this.schema.minLength = options.minLength;
      if (options.maxLength !== undefined) this.schema.maxLength = options.maxLength;
      if (options.pattern !== undefined) this.schema.pattern = options.pattern;
      if (options.format !== undefined) this.schema.format = options.format;
      if (options.enum !== undefined) this.schema.enum = options.enum;
    }
    
    return this as unknown as SchemaBuilder<string>;
  }

  /**
   * Set the schema to be a number type
   * 
   * @param options Optional configuration for the number schema
   * @returns The builder instance
   */
  number(options?: {
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: number;
  }): SchemaBuilder<number> {
    this.schema = { ...numberSchema };
    
    if (options) {
      if (options.minimum !== undefined) this.schema.minimum = options.minimum;
      if (options.maximum !== undefined) this.schema.maximum = options.maximum;
      if (options.exclusiveMinimum !== undefined) this.schema.exclusiveMinimum = options.exclusiveMinimum;
      if (options.exclusiveMaximum !== undefined) this.schema.exclusiveMaximum = options.exclusiveMaximum;
      if (options.multipleOf !== undefined) this.schema.multipleOf = options.multipleOf;
    }
    
    return this as unknown as SchemaBuilder<number>;
  }

  /**
   * Set the schema to be a boolean type
   * 
   * @returns The builder instance
   */
  boolean(): SchemaBuilder<boolean> {
    this.schema = { ...booleanSchema };
    return this as unknown as SchemaBuilder<boolean>;
  }

  /**
   * Set the schema to be a null type
   * 
   * @returns The builder instance
   */
  null(): SchemaBuilder<null> {
    this.schema = { ...nullSchema };
    return this as unknown as SchemaBuilder<null>;
  }

  /**
   * Set the schema to be an array type
   * 
   * @param itemsSchema Schema for array items (optional)
   * @param options Optional configuration for the array schema
   * @returns The builder instance
   */
  array<I = any>(
    itemsSchema?: Record<string, any> | SchemaBuilder<I>,
    options?: {
      minItems?: number;
      maxItems?: number;
      uniqueItems?: boolean;
    }
  ): SchemaBuilder<I[]> {
    this.schema = {
      type: 'array',
      items: itemsSchema instanceof SchemaBuilder 
        ? itemsSchema.build() 
        : (itemsSchema || {})
    };
    
    if (options) {
      if (options.minItems !== undefined) this.schema.minItems = options.minItems;
      if (options.maxItems !== undefined) this.schema.maxItems = options.maxItems;
      if (options.uniqueItems !== undefined) this.schema.uniqueItems = options.uniqueItems;
    }
    
    return this as unknown as SchemaBuilder<I[]>;
  }

  /**
   * Set the schema to be an object type
   * 
   * @param properties Object mapping property names to schemas
   * @param options Optional configuration for the object schema
   * @returns The builder instance
   */
  object<P extends Record<string, any> = Record<string, any>>(
    properties?: Record<keyof P, Record<string, any> | SchemaBuilder<any>>,
    options?: {
      required?: Array<keyof P>;
      additionalProperties?: boolean | Record<string, any> | SchemaBuilder<any>;
      minProperties?: number;
      maxProperties?: number;
    }
  ): SchemaBuilder<P> {
    this.schema = {
      type: 'object'
    };
    
    if (properties) {
      const processedProperties: Record<string, any> = {};
      
      for (const [key, schema] of Object.entries(properties)) {
        processedProperties[key] = schema instanceof SchemaBuilder 
          ? schema.build() 
          : schema;
      }
      
      this.schema.properties = processedProperties;
    }
    
    if (options) {
      if (options.required !== undefined) {
        this.schema.required = options.required as string[];
      }
      
      if (options.additionalProperties !== undefined) {
        this.schema.additionalProperties = options.additionalProperties instanceof SchemaBuilder
          ? options.additionalProperties.build()
          : options.additionalProperties;
      }
      
      if (options.minProperties !== undefined) {
        this.schema.minProperties = options.minProperties;
      }
      
      if (options.maxProperties !== undefined) {
        this.schema.maxProperties = options.maxProperties;
      }
    }
    
    return this as unknown as SchemaBuilder<P>;
  }

  /**
   * Set the schema to be a union type (oneOf)
   * 
   * @param schemas Array of schemas to include in the union
   * @returns The builder instance
   */
  oneOf(schemas: (Record<string, any> | SchemaBuilder)[]): SchemaBuilder {
    this.schema = {
      oneOf: schemas.map(schema => 
        schema instanceof SchemaBuilder ? schema.build() : schema
      )
    };
    
    return this;
  }

  /**
   * Set the schema to allow any JSON value
   * 
   * @returns The builder instance
   */
  any(): SchemaBuilder {
    this.schema = createUnionSchema([
      stringSchema,
      numberSchema,
      booleanSchema,
      nullSchema,
      anyArraySchema,
      anyObjectSchema
    ]);
    
    return this;
  }

  /**
   * Add a title to the schema
   * 
   * @param title The schema title
   * @returns The builder instance
   */
  title(title: string): SchemaBuilder<T> {
    this.schema.title = title;
    return this;
  }

  /**
   * Add a description to the schema
   * 
   * @param description The schema description
   * @returns The builder instance
   */
  description(description: string): SchemaBuilder<T> {
    this.schema.description = description;
    return this;
  }

  /**
   * Add a default value to the schema
   * 
   * @param defaultValue The default value
   * @returns The builder instance
   */
  default(defaultValue: T): SchemaBuilder<T> {
    this.schema.default = defaultValue;
    return this;
  }

  /**
   * Add examples to the schema
   * 
   * @param examples Array of example values
   * @returns The builder instance
   */
  examples(examples: T[]): SchemaBuilder<T> {
    this.schema.examples = examples;
    return this;
  }

  /**
   * Build the final schema
   * 
   * @returns The complete JSON Schema
   */
  build(): Record<string, any> {
    return { ...this.schema };
  }
}