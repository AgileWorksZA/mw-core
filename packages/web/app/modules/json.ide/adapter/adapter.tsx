import { FileJsonIcon } from "lucide-react";
import { forwardRef } from "react";
import type { JsonValue } from "type-fest";
import { registerAdapter } from "~/modules/ide/adapter/register";
import type { FileContext } from "~/modules/ide/types";
import { config } from "~/modules/json.ide/adapter/config";
import { Editor } from "~/modules/json.ide/components/editor";
import { QuickView } from "~/modules/json.ide/components/quick-view";
import { useJsonFileSelector } from "~/modules/json.ide/hooks/use-json-file-selector";
import { Provider } from "~/modules/json.ide/provider/provider";
import type { JsonFileContext } from "~/modules/json.ide/types";
import { jsonArtifactLogger } from "~/modules/json.ide/utils/logger";

// Create a colored wrapper for the FileJsonIcon
const ColoredFileJsonIcon = forwardRef<
	SVGSVGElement,
	React.SVGAttributes<SVGSVGElement>
>((props, ref) => {
	return (
		<FileJsonIcon
			ref={ref}
			className="w-4 h-4 text-green-600 dark:text-green-500"
			{...props}
		/>
	);
});
ColoredFileJsonIcon.displayName = "ColoredFileJsonIcon";

export const adapter = registerAdapter<JsonFileContext, JsonValue, true>(
	config,
	{
		Icon: ColoredFileJsonIcon,
		Editor,
		QuickView,
		useSelector: useJsonFileSelector,
		calculateOutputs: ({ input }) => {
			return {
				variables: input.variables,
			};
		},
		createFromFile: async ({ file }) => {
			const text = await file.text();
			try {
				const data = JSON.parse(text);
				return {
					data,
				} as FileContext;
			} catch (error) {
				jsonArtifactLogger.error("Invalid JSON file", error);
				throw new Error("Invalid JSON file");
			}
		},
		emptyContext: () => {
			return {
				data: {},
			} as FileContext;
		},
		Provider,
	},
);
