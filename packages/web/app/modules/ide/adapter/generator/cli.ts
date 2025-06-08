#!/usr/bin/env bun
/**
 * CLI tool for generating new IDE adapters from templates
 */

import { createReadStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { createInterface } from "readline";
import { 
  getTemplate, 
  listTemplates, 
  processTemplate, 
  validateVariables,
  type TemplateVariable 
} from "../templates";
import { AdapterCategories, isValidCategory } from "../categories";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question + " ", resolve);
  });
}

async function promptVariable(variable: TemplateVariable): Promise<string> {
  let promptText = `${variable.prompt}`;
  
  if (variable.defaultValue) {
    promptText += ` (default: ${variable.defaultValue})`;
  }
  
  if (variable.type === "select" && variable.options) {
    promptText += `\n  Options: ${variable.options.join(", ")}`;
  }
  
  if (variable.type === "boolean") {
    promptText += " (yes/no)";
  }
  
  promptText += ": ";
  
  const value = await prompt(promptText);
  
  // Use default if no value provided
  if (!value && variable.defaultValue) {
    return variable.defaultValue;
  }
  
  // Convert boolean strings
  if (variable.type === "boolean") {
    return value.toLowerCase() === "yes" || value.toLowerCase() === "true" ? "true" : "false";
  }
  
  return value;
}

async function selectTemplate(): Promise<string> {
  console.log("\n📦 Available Adapter Templates:\n");
  
  const templates = listTemplates();
  const categorizedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof templates>);
  
  let index = 1;
  const templateMap: Record<number, string> = {};
  
  for (const [category, categoryTemplates] of Object.entries(categorizedTemplates)) {
    console.log(`\n${category}:`);
    for (const template of categoryTemplates) {
      console.log(`  ${index}. ${template.name} - ${template.description}`);
      templateMap[index] = template.id;
      index++;
    }
  }
  
  const selection = await prompt("\nSelect a template (number)");
  const selectedIndex = parseInt(selection);
  
  if (!templateMap[selectedIndex]) {
    throw new Error("Invalid template selection");
  }
  
  return templateMap[selectedIndex];
}

async function generateAdapter() {
  console.log("🚀 IDE Adapter Generator\n");
  
  try {
    // Select template
    const templateId = await selectTemplate();
    const template = getTemplate(templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    console.log(`\n✅ Selected: ${template.name}\n`);
    
    // Collect variables
    console.log("📝 Please provide the following information:\n");
    const variables: Record<string, string> = {};
    
    for (const variable of template.variables) {
      let value: string;
      let isValid = false;
      
      while (!isValid) {
        value = await promptVariable(variable);
        
        // Validate required
        if (variable.required && !value) {
          console.log("❌ This field is required");
          continue;
        }
        
        // Validate pattern
        if (value && variable.pattern && !variable.pattern.test(value)) {
          console.log(`❌ Invalid format. Must match pattern: ${variable.pattern}`);
          continue;
        }
        
        // Validate select options
        if (value && variable.type === "select" && variable.options && !variable.options.includes(value)) {
          console.log(`❌ Must be one of: ${variable.options.join(", ")}`);
          continue;
        }
        
        isValid = true;
        variables[variable.name] = value;
      }
    }
    
    // Process array-like variables
    if (variables.acceptedFileTypes) {
      variables.acceptedFileTypes = variables.acceptedFileTypes
        .split(",")
        .map(ext => `"${ext.trim()}"`)
        .join(", ");
    }
    
    if (variables.tags) {
      variables.tags = variables.tags
        .split(",")
        .map(tag => `"${tag.trim()}"`)
        .join(", ");
    }
    
    // Validate all variables
    const validation = validateVariables(variables, template);
    if (!validation.valid) {
      console.log("\n❌ Validation errors:");
      validation.errors.forEach(error => console.log(`  - ${error}`));
      throw new Error("Validation failed");
    }
    
    // Determine output directory
    const moduleDir = join(
      process.cwd(),
      "app",
      "modules",
      `${variables.moduleNamespace}.ide`
    );
    
    console.log(`\n📁 Generating adapter in: ${moduleDir}\n`);
    
    // Generate files
    for (const file of template.files) {
      if (file.optional && variables[`include${file.path.split("/").pop()?.replace(".tsx", "")}`] === "false") {
        continue;
      }
      
      const filePath = join(moduleDir, file.path);
      const content = processTemplate(file.content, variables);
      
      // Create directory if it doesn't exist
      const dir = dirname(filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      
      // Write file
      writeFileSync(filePath, content);
      console.log(`  ✅ Created: ${file.path}`);
    }
    
    // Show post-generation instructions
    if (template.postGenerateInstructions && template.postGenerateInstructions.length > 0) {
      console.log("\n📋 Next Steps:\n");
      template.postGenerateInstructions.forEach(instruction => {
        console.log(`  ${instruction}`);
      });
    }
    
    // Show dependencies to install
    if (template.dependencies && template.dependencies.length > 0) {
      console.log("\n📦 Dependencies to install:\n");
      console.log(`  bun add ${template.dependencies.join(" ")}`);
    }
    
    console.log("\n✨ Adapter generated successfully!");
    console.log(`\n🎯 Don't forget to register your adapter by importing it in your app's initialization code.`);
    
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the generator
generateAdapter();