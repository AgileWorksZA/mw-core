import { DatabaseIcon } from "lucide-react";
import { forwardRef } from "react";
import { registerAdapter } from "~/modules/ide/adapter/register";
import type { FileContext } from "~/modules/ide/types";
import { Editor } from "../components/editor";
import { NewFile } from "../components/new-file";
import { QuickView } from "../components/quick-view";
import { ApiGetProvider } from "../provider/provider";
import type { ApiGetConfig } from "../types";
import { config } from "./config";

// Create a colored wrapper for the DatabaseIcon
const ColoredDatabaseIcon = forwardRef<SVGSVGElement, any>((props, ref) => {
	return (
		<DatabaseIcon
			ref={ref}
			className="w-4 h-4 text-blue-600 dark:text-blue-500"
		/>
	);
});
ColoredDatabaseIcon.displayName = "ColoredDatabaseIcon";

export const apiGetAdapter = registerAdapter<ApiGetConfig, any, false>(config, {
	Icon: ColoredDatabaseIcon,
	Editor,
	QuickView,
	emptyContext: async () => {
		const now = new Date().toISOString();
		return {
			path: "",
			loading: false,
			data: {
				id: crypto.randomUUID(),
				name: "New API Get",
				description: "",
				version: "1.0.0",
				createdAt: now,
				updatedAt: now,
				sources: {
					openApiFile: "",
					serviceConnection: "",
				},
				endpoint: {
					path: "",
					method: "get" as const,
				},
				parameters: {},
				response: {},
				output: {
					data: "api_data",
				},
			},
		} as FileContext<ApiGetConfig>;
	},
	Provider: ApiGetProvider,
	calculateOutputs: ({ context }) => {
		const outputs: Record<string, any> = {};

		if (context.output.data) {
			outputs[context.output.data] = null;
		}
		if (context.output.error) {
			outputs[context.output.error] = null;
		}
		if (context.output.loading) {
			outputs[context.output.loading] = false;
		}
		if (context.output.metadata) {
			outputs[context.output.metadata] = null;
		}

		return {
			variables: outputs,
		};
	},
});
