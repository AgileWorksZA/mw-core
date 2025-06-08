import type { AdapterConfig } from "~/modules/ide/adapter/type";

export const config: AdapterConfig = {
  type: "openapi",
  metadata: {
    name: "OpenAPI Specification",
    description: "OpenAPI/Swagger API documentation",
    accept: [".json", ".yaml", ".yml"],
    tags: ["api", "documentation"],
    category: "API"
  }
};