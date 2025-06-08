/**
 * Template registry for adapter generation
 */

import type { AdapterTemplate } from "./base-template";
import { DataSourceTemplate } from "./data-source-template";
import { ApiTemplate } from "./api-template";
import type { AdapterCategory } from "../categories";
import { AdapterCategories } from "../categories";

/**
 * Registry of all available templates
 */
export const TemplateRegistry: Record<string, AdapterTemplate> = {
  "data-source": DataSourceTemplate,
  "api": ApiTemplate,
  // TODO: Add more templates as they are created
  // "configuration": ConfigurationTemplate,
  // "documentation": DocumentationTemplate,
  // "testing": TestingTemplate,
  // "visualization": VisualizationTemplate,
  // "workflow": WorkflowTemplate,
  // "code": CodeTemplate,
};

/**
 * Get all templates for a specific category
 */
export function getTemplatesByCategory(category: AdapterCategory): AdapterTemplate[] {
  return Object.values(TemplateRegistry).filter(
    template => template.category === category
  );
}

/**
 * Get a specific template by ID
 */
export function getTemplate(id: string): AdapterTemplate | undefined {
  return TemplateRegistry[id];
}

/**
 * List all available templates
 */
export function listTemplates(): Array<{
  id: string;
  name: string;
  description: string;
  category: AdapterCategory;
}> {
  return Object.entries(TemplateRegistry).map(([id, template]) => ({
    id,
    name: template.name,
    description: template.description,
    category: template.category,
  }));
}

/**
 * Get template suggestions based on file extensions
 */
export function suggestTemplatesForFileType(extension: string): AdapterTemplate[] {
  const suggestions: AdapterTemplate[] = [];
  
  // Map common extensions to template categories
  const extensionMap: Record<string, AdapterCategory> = {
    ".json": AdapterCategories.DATA_SOURCE,
    ".csv": AdapterCategories.DATA_SOURCE,
    ".xml": AdapterCategories.DATA_SOURCE,
    ".yaml": AdapterCategories.API,
    ".yml": AdapterCategories.API,
    ".env": AdapterCategories.CONFIGURATION,
    ".ini": AdapterCategories.CONFIGURATION,
    ".toml": AdapterCategories.CONFIGURATION,
    ".md": AdapterCategories.DOCUMENTATION,
    ".mdx": AdapterCategories.DOCUMENTATION,
    ".test.json": AdapterCategories.TESTING,
    ".spec.yaml": AdapterCategories.TESTING,
  };
  
  const category = extensionMap[extension.toLowerCase()];
  if (category) {
    suggestions.push(...getTemplatesByCategory(category));
  }
  
  return suggestions;
}

export * from "./base-template";