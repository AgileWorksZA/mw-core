import { AdapterCategories } from "~/modules/ide/adapter/categories";
import type { AdapterConfig } from "~/modules/ide/adapter/type";

export const config: AdapterConfig = {
	type: "api-get",
	metadata: {
		name: "API Get",
		description: "Configure GET endpoints from OpenAPI specifications",
		category: AdapterCategories.DATA_SOURCE,
		tags: ["api", "rest", "data", "fetch"],
	},
};
