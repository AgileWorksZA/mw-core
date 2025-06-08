/**
 * Base template structure for all adapter types
 */

import type { AdapterCategory } from "../categories";

export interface AdapterTemplate {
  /**
   * Template identifier
   */
  id: string;
  
  /**
   * Human-readable name
   */
  name: string;
  
  /**
   * Description of what this template creates
   */
  description: string;
  
  /**
   * Category this template belongs to
   */
  category: AdapterCategory;
  
  /**
   * Files that will be generated
   */
  files: TemplateFile[];
  
  /**
   * Variables that can be customized when generating
   */
  variables: TemplateVariable[];
  
  /**
   * Dependencies that need to be installed
   */
  dependencies?: string[];
  
  /**
   * Post-generation instructions
   */
  postGenerateInstructions?: string[];
}

export interface TemplateFile {
  /**
   * Path relative to the module directory
   */
  path: string;
  
  /**
   * Template content with variable placeholders
   */
  content: string;
  
  /**
   * Whether this file is optional
   */
  optional?: boolean;
}

export interface TemplateVariable {
  /**
   * Variable name (used in templates as {{variableName}})
   */
  name: string;
  
  /**
   * Human-readable prompt
   */
  prompt: string;
  
  /**
   * Default value
   */
  defaultValue?: string;
  
  /**
   * Whether this variable is required
   */
  required: boolean;
  
  /**
   * Validation pattern
   */
  pattern?: RegExp;
  
  /**
   * Type of the variable
   */
  type: "string" | "boolean" | "select";
  
  /**
   * Options for select type
   */
  options?: string[];
}

/**
 * Common variables used across templates
 */
export const CommonVariables: Record<string, TemplateVariable> = {
  adapterType: {
    name: "adapterType",
    prompt: "Adapter type identifier (lowercase, no spaces)",
    required: true,
    pattern: /^[a-z][a-z0-9-]*$/,
    type: "string"
  },
  adapterName: {
    name: "adapterName",
    prompt: "Human-readable adapter name",
    required: true,
    type: "string"
  },
  adapterDescription: {
    name: "adapterDescription",
    prompt: "Brief description of the adapter",
    required: true,
    type: "string"
  },
  moduleNamespace: {
    name: "moduleNamespace",
    prompt: "Module namespace (e.g., 'json', 'openapi')",
    required: true,
    pattern: /^[a-z][a-z0-9]*$/,
    type: "string"
  },
  contextTypeName: {
    name: "contextTypeName",
    prompt: "Context type name (e.g., 'JsonFileContext')",
    defaultValue: "FileContext",
    required: true,
    pattern: /^[A-Z][a-zA-Z0-9]*Context$/,
    type: "string"
  },
  dataTypeName: {
    name: "dataTypeName",
    prompt: "Main data type name",
    required: true,
    pattern: /^[A-Z][a-zA-Z0-9]*$/,
    type: "string"
  },
  acceptedFileTypes: {
    name: "acceptedFileTypes",
    prompt: "Accepted file extensions (comma-separated)",
    defaultValue: ".json",
    required: true,
    type: "string"
  },
  tags: {
    name: "tags",
    prompt: "Tags for the adapter (comma-separated)",
    required: false,
    type: "string"
  },
  includeSchema: {
    name: "includeSchema",
    prompt: "Include schema validation support?",
    defaultValue: "true",
    required: false,
    type: "boolean"
  },
  includeQuickView: {
    name: "includeQuickView",
    prompt: "Include quick view component?",
    defaultValue: "true",
    required: false,
    type: "boolean"
  },
  includeNewFileDialog: {
    name: "includeNewFileDialog",
    prompt: "Include custom new file dialog?",
    defaultValue: "false",
    required: false,
    type: "boolean"
  }
};

/**
 * Replace variables in template content
 */
export function processTemplate(content: string, variables: Record<string, string>): string {
  let processed = content;
  
  // Replace all {{variableName}} patterns
  for (const [name, value] of Object.entries(variables)) {
    const pattern = new RegExp(`{{${name}}}`, "g");
    processed = processed.replace(pattern, value);
  }
  
  // Replace conditional blocks {{#if variableName}}...{{/if}}
  const conditionalPattern = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
  processed = processed.replace(conditionalPattern, (match, varName, content) => {
    const value = variables[varName];
    return value === "true" || value === "yes" || Boolean(value) ? content : "";
  });
  
  // Replace conditional blocks {{#unless variableName}}...{{/unless}}
  const unlessPattern = /{{#unless\s+(\w+)}}([\s\S]*?){{\/unless}}/g;
  processed = processed.replace(unlessPattern, (match, varName, content) => {
    const value = variables[varName];
    return !value || value === "false" || value === "no" ? content : "";
  });
  
  return processed;
}

/**
 * Validate variables against their constraints
 */
export function validateVariables(
  variables: Record<string, string>,
  template: AdapterTemplate
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const varDef of template.variables) {
    const value = variables[varDef.name];
    
    // Check required
    if (varDef.required && (!value || value.trim() === "")) {
      errors.push(`${varDef.name} is required`);
      continue;
    }
    
    // Check pattern
    if (value && varDef.pattern && !varDef.pattern.test(value)) {
      errors.push(`${varDef.name} does not match required pattern`);
    }
    
    // Check select options
    if (value && varDef.type === "select" && varDef.options) {
      if (!varDef.options.includes(value)) {
        errors.push(`${varDef.name} must be one of: ${varDef.options.join(", ")}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}