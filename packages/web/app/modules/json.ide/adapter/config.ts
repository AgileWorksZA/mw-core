// Module customization

import type { AdapterConfig } from "~/modules/ide/adapter/type";

export const config: AdapterConfig = {
  type: "json",
  metadata: {
    name: "JSON",
    description: "JSON file",
    accept: [".json"],
    tags: ["configuration", "data", "json"],
    category: "Data Sources",
  },
};
