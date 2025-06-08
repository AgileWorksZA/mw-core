import { registerAdapter } from "~/modules/ide/adapter/register";
import { config } from "~/modules/openapi.ide/adapter/config";
import { Editor } from "~/modules/openapi.ide/components/client-manager";
import { PackageOpenIcon } from "lucide-react";
import { QuickView } from "../components/quick-view";
import type { OpenAPIFileContext, OpenAPIData } from "../types";
import { Provider } from "~/modules/openapi.ide/provider/provider";
import type { FileContext } from "~/modules/ide/types";
import { useOpenAPISelector } from "../hooks/use-openapi-selector";
import type { OpenAPIV3 } from "openapi-types";
import NewFile from "../components/new-file";
import { forwardRef } from "react";
import type React from "react";

// Create a colored wrapper for the PackageOpenIcon
const ColoredPackageOpenIcon = forwardRef<SVGSVGElement, any>((props, ref) => {
  return (
    <PackageOpenIcon
      ref={ref}
      className="w-4 h-4 text-orange-500 dark:text-orange-400"
    />
  );
});
ColoredPackageOpenIcon.displayName = "ColoredPackageOpenIcon";

export const adapter = registerAdapter<OpenAPIFileContext, any, string | null>(
  config,
  {
    Icon: ColoredPackageOpenIcon,
    Editor,
    QuickView,
    NewFile,
    useSelector: useOpenAPISelector,
    calculateOutputs: ({ context }) => {
      return {
        variables: context.data.resourcePath ?? null,
      };
    },
    createFromFile: async ({ file }) => {
      const text = await file.text();
      try {
        let document: OpenAPIV3.Document;

        // Try to parse as JSON first
        try {
          document = JSON.parse(text);
        } catch {
          // If JSON parsing fails, try YAML (would need a YAML parser)
          throw new Error(
            "YAML parsing not implemented yet. Please use JSON format.",
          );
        }

        // Validate it's an OpenAPI document
        if (!document.openapi || !document.info) {
          throw new Error(
            "Invalid OpenAPI document. Missing 'openapi' or 'info' field.",
          );
        }

        return {
          data: {
            source: {
              type: "file",
              fileName: file.name,
              lastFetched: new Date().toISOString(),
            },
            document,
          },
        } as FileContext;
      } catch (error) {
        console.error("Invalid OpenAPI file", error);
        throw new Error(
          `Invalid OpenAPI file: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    emptyContext: () => {
      const emptyData: OpenAPIData = {
        source: {
          type: "paste",
          lastFetched: new Date().toISOString(),
        },
        document: {
          openapi: "3.0.0",
          info: {
            title: "New API",
            version: "1.0.0",
          },
          paths: {},
          components: {
            schemas: {},
          },
        },
      };

      return {
        data: emptyData,
      } as FileContext;
    },
    Provider,
  },
);
