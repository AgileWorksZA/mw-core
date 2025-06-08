/**
 * Programmatic API for generating IDE adapters
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { 
  getTemplate, 
  processTemplate, 
  validateVariables,
  type AdapterTemplate 
} from "../templates";

export interface GeneratorOptions {
  /**
   * Template ID to use
   */
  templateId: string;
  
  /**
   * Variables for template processing
   */
  variables: Record<string, string>;
  
  /**
   * Output directory (defaults to app/modules/{moduleNamespace}.ide)
   */
  outputDir?: string;
  
  /**
   * Whether to overwrite existing files
   */
  overwrite?: boolean;
  
  /**
   * Dry run - don't actually write files
   */
  dryRun?: boolean;
  
  /**
   * Logger function
   */
  log?: (message: string) => void;
}

export interface GeneratorResult {
  success: boolean;
  files: string[];
  errors: string[];
  warnings: string[];
}

/**
 * Generate an adapter from a template
 */
export async function generateAdapter(options: GeneratorOptions): Promise<GeneratorResult> {
  const log = options.log || console.log;
  const result: GeneratorResult = {
    success: true,
    files: [],
    errors: [],
    warnings: [],
  };
  
  try {
    // Get template
    const template = getTemplate(options.templateId);
    if (!template) {
      result.errors.push(`Template '${options.templateId}' not found`);
      result.success = false;
      return result;
    }
    
    // Process array-like variables
    const processedVariables = { ...options.variables };
    if (processedVariables.acceptedFileTypes && !processedVariables.acceptedFileTypes.includes('"')) {
      processedVariables.acceptedFileTypes = processedVariables.acceptedFileTypes
        .split(",")
        .map(ext => `"${ext.trim()}"`)
        .join(", ");
    }
    
    if (processedVariables.tags && !processedVariables.tags.includes('"')) {
      processedVariables.tags = processedVariables.tags
        .split(",")
        .map(tag => `"${tag.trim()}"`)
        .join(", ");
    }
    
    // Validate variables
    const validation = validateVariables(processedVariables, template);
    if (!validation.valid) {
      result.errors.push(...validation.errors);
      result.success = false;
      return result;
    }
    
    // Determine output directory
    const outputDir = options.outputDir || join(
      process.cwd(),
      "app",
      "modules",
      `${processedVariables.moduleNamespace}.ide`
    );
    
    // Generate files
    for (const file of template.files) {
      // Skip optional files if not included
      if (file.optional) {
        const includeVarName = `include${file.path.split("/").pop()?.replace(".tsx", "").replace(".ts", "")}`;
        if (processedVariables[includeVarName] === "false") {
          continue;
        }
      }
      
      const filePath = join(outputDir, file.path);
      
      // Check if file exists
      if (existsSync(filePath) && !options.overwrite) {
        result.warnings.push(`File already exists: ${file.path}`);
        continue;
      }
      
      // Process template content
      const content = processTemplate(file.content, processedVariables);
      
      if (!options.dryRun) {
        // Create directory if it doesn't exist
        const dir = dirname(filePath);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        
        // Write file
        writeFileSync(filePath, content);
      }
      
      result.files.push(file.path);
      log(`Generated: ${file.path}`);
    }
    
    // Add post-generation instructions as warnings
    if (template.postGenerateInstructions) {
      result.warnings.push(...template.postGenerateInstructions);
    }
    
    // Build conditional dependencies list
    const dependencies: string[] = [];
    if (processedVariables.includeClientGeneration === "true") {
      dependencies.push("openapi-typescript");
    }
    if (processedVariables.includeMockServer === "true") {
      dependencies.push("@stoplight/prism-cli");
    }
    
    // Add dependencies as warnings
    if (dependencies.length > 0) {
      result.warnings.push(`Dependencies to install: bun add ${dependencies.join(" ")}`);
    }
    
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
    result.success = false;
  }
  
  return result;
}

/**
 * Preview what files would be generated without actually creating them
 */
export async function previewAdapter(
  templateId: string,
  variables: Record<string, string>
): Promise<{ files: Array<{ path: string; content: string }>; errors: string[] }> {
  const template = getTemplate(templateId);
  if (!template) {
    return { files: [], errors: [`Template '${templateId}' not found`] };
  }
  
  // Process variables
  const processedVariables = { ...variables };
  if (processedVariables.acceptedFileTypes && !processedVariables.acceptedFileTypes.includes('"')) {
    processedVariables.acceptedFileTypes = processedVariables.acceptedFileTypes
      .split(",")
      .map(ext => `"${ext.trim()}"`)
      .join(", ");
  }
  
  if (processedVariables.tags && !processedVariables.tags.includes('"')) {
    processedVariables.tags = processedVariables.tags
      .split(",")
      .map(tag => `"${tag.trim()}"`)
      .join(", ");
  }
  
  // Validate
  const validation = validateVariables(processedVariables, template);
  if (!validation.valid) {
    return { files: [], errors: validation.errors };
  }
  
  // Generate preview
  const files: Array<{ path: string; content: string }> = [];
  
  for (const file of template.files) {
    // Skip optional files if not included
    if (file.optional) {
      const includeVarName = `include${file.path.split("/").pop()?.replace(".tsx", "").replace(".ts", "")}`;
      if (processedVariables[includeVarName] === "false") {
        continue;
      }
    }
    
    const content = processTemplate(file.content, processedVariables);
    files.push({ path: file.path, content });
  }
  
  return { files, errors: [] };
}

/**
 * Get required variables for a template
 */
export function getTemplateVariables(templateId: string) {
  const template = getTemplate(templateId);
  if (!template) {
    return null;
  }
  
  return template.variables.map(v => ({
    name: v.name,
    prompt: v.prompt,
    required: v.required,
    defaultValue: v.defaultValue,
    type: v.type,
    options: v.options,
  }));
}