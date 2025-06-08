import type { AdapterConfig } from "~/modules/ide/adapter/type";
import { AdapterCategories } from "~/modules/ide/adapter/categories";

export const config: AdapterConfig = {
  type: "service-connection",
  metadata: {
    name: "Service Connection",
    description: "Service connection configuration for external services",
    accept: [".connection.json", ".svc.json"],
    tags: ["connection", "service", "auth", "api"],
    category: AdapterCategories.CONFIGURATION,
  },
};