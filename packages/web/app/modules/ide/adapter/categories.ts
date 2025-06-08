/**
 * Strongly-typed adapter categories for IDE modules
 */

export const AdapterCategories = {
  DATA_SOURCE: "Data Sources",
  API: "API",
  CONFIGURATION: "Configuration",
  DOCUMENTATION: "Documentation",
  TESTING: "Testing",
  VISUALIZATION: "Visualization",
  WORKFLOW: "Workflow",
  CODE: "Code",
} as const;

export type AdapterCategory = (typeof AdapterCategories)[keyof typeof AdapterCategories];

/**
 * Template metadata for different adapter categories
 */
export interface CategoryTemplate {
  category: AdapterCategory;
  description: string;
  defaultTags: string[];
  defaultAcceptedFiles: string[];
  suggestedFeatures: string[];
  requiredCapabilities: string[];
}

export const CategoryTemplates: Record<AdapterCategory, CategoryTemplate> = {
  [AdapterCategories.DATA_SOURCE]: {
    category: AdapterCategories.DATA_SOURCE,
    description: "Adapters for handling various data file formats",
    defaultTags: ["data", "import", "export"],
    defaultAcceptedFiles: [".json", ".csv", ".xml", ".yaml"],
    suggestedFeatures: [
      "Schema validation",
      "Data transformation",
      "Import/Export capabilities",
      "Query support"
    ],
    requiredCapabilities: [
      "File parsing",
      "Data validation",
      "Error handling"
    ]
  },
  [AdapterCategories.API]: {
    category: AdapterCategories.API,
    description: "Adapters for API specifications and documentation",
    defaultTags: ["api", "documentation", "specification"],
    defaultAcceptedFiles: [".json", ".yaml", ".yml"],
    suggestedFeatures: [
      "API testing",
      "Mock server generation",
      "Client code generation",
      "Documentation generation"
    ],
    requiredCapabilities: [
      "Specification parsing",
      "Endpoint extraction",
      "Schema validation"
    ]
  },
  [AdapterCategories.CONFIGURATION]: {
    category: AdapterCategories.CONFIGURATION,
    description: "Adapters for configuration file formats",
    defaultTags: ["config", "settings", "environment"],
    defaultAcceptedFiles: [".env", ".ini", ".toml", ".properties"],
    suggestedFeatures: [
      "Environment variable support",
      "Schema validation",
      "Secret management",
      "Multi-environment support"
    ],
    requiredCapabilities: [
      "Configuration parsing",
      "Variable interpolation",
      "Validation"
    ]
  },
  [AdapterCategories.DOCUMENTATION]: {
    category: AdapterCategories.DOCUMENTATION,
    description: "Adapters for documentation formats",
    defaultTags: ["docs", "markdown", "documentation"],
    defaultAcceptedFiles: [".md", ".mdx", ".rst", ".adoc"],
    suggestedFeatures: [
      "Live preview",
      "Export to PDF/HTML",
      "Diagram support",
      "Link checking"
    ],
    requiredCapabilities: [
      "Markdown parsing",
      "Syntax highlighting",
      "Navigation generation"
    ]
  },
  [AdapterCategories.TESTING]: {
    category: AdapterCategories.TESTING,
    description: "Adapters for test specifications and results",
    defaultTags: ["testing", "qa", "automation"],
    defaultAcceptedFiles: [".test.json", ".spec.yaml", ".feature"],
    suggestedFeatures: [
      "Test execution",
      "Result visualization",
      "Coverage reports",
      "Test generation"
    ],
    requiredCapabilities: [
      "Test parsing",
      "Result aggregation",
      "Status tracking"
    ]
  },
  [AdapterCategories.VISUALIZATION]: {
    category: AdapterCategories.VISUALIZATION,
    description: "Adapters for data visualization and charting",
    defaultTags: ["charts", "graphs", "visualization"],
    defaultAcceptedFiles: [".vega", ".plotly", ".chart.json"],
    suggestedFeatures: [
      "Interactive charts",
      "Export capabilities",
      "Real-time updates",
      "Multiple chart types"
    ],
    requiredCapabilities: [
      "Data processing",
      "Chart rendering",
      "Interactivity handling"
    ]
  },
  [AdapterCategories.WORKFLOW]: {
    category: AdapterCategories.WORKFLOW,
    description: "Adapters for workflow and process definitions",
    defaultTags: ["workflow", "automation", "pipeline"],
    defaultAcceptedFiles: [".bpmn", ".workflow.json", ".pipeline.yaml"],
    suggestedFeatures: [
      "Visual workflow editor",
      "Execution monitoring",
      "Version control",
      "Validation"
    ],
    requiredCapabilities: [
      "Workflow parsing",
      "State management",
      "Execution tracking"
    ]
  },
  [AdapterCategories.CODE]: {
    category: AdapterCategories.CODE,
    description: "Adapters for code files and programming languages",
    defaultTags: ["code", "programming", "syntax"],
    defaultAcceptedFiles: [".js", ".ts", ".py", ".java"],
    suggestedFeatures: [
      "Syntax highlighting",
      "Code completion",
      "Linting",
      "Formatting"
    ],
    requiredCapabilities: [
      "Syntax parsing",
      "Language server integration",
      "Error detection"
    ]
  }
};

/**
 * Get template for a specific category
 */
export function getCategoryTemplate(category: AdapterCategory): CategoryTemplate {
  return CategoryTemplates[category];
}

/**
 * Validate if a category is valid
 */
export function isValidCategory(category: string): category is AdapterCategory {
  return Object.values(AdapterCategories).includes(category as AdapterCategory);
}