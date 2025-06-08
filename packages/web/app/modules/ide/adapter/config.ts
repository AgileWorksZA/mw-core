import type {AdapterConfig} from "~/modules/ide/adapter/type";
import { AdapterCategories } from "~/modules/ide/adapter/categories";

export const config: AdapterConfig = {
  type: "ide",
  metadata: {
    name: "IDE",
    description: "IDE workspace and project management",
    category: AdapterCategories.WORKFLOW,
  },
};