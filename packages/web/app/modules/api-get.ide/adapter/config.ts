import type { AdapterConfig } from "~/modules/ide/adapter/type";
import { AdapterCategories } from "~/modules/ide/adapter/categories";

export const apiGetConfig: AdapterConfig = {
  type: "api-get",
  metadata: {
    name: "API Get",
    description: "Configure GET endpoints from OpenAPI specifications",
    category: AdapterCategories.DATA_SOURCE,
    tags: ["api", "rest", "data", "fetch"],
  },
};