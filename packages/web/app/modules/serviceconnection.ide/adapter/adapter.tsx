import { registerAdapter } from "~/modules/ide/adapter/register";
import { config } from "~/modules/serviceconnection.ide/adapter/config";
import { Editor } from "~/modules/serviceconnection.ide/components/editor";
import { LinkIcon } from "lucide-react";
import { QuickView } from "~/modules/serviceconnection.ide/components/quick-view";
import type { ServiceConnectionContext } from "~/modules/serviceconnection.ide/types";
import { Provider } from "~/modules/serviceconnection.ide/provider/provider";
import type { FileContext } from "~/modules/ide/types";
import { useServiceConnectionDataSelector } from "~/modules/serviceconnection.ide/hooks/use-serviceconnection-selector";
import { serviceconnectionLogger } from "~/modules/serviceconnection.ide/utils/logger";
import { forwardRef } from "react";

// Create a colored wrapper for the LinkIcon
const ColoredLinkIcon = forwardRef<SVGSVGElement, any>((props, ref) => {
  return (
    <LinkIcon
      ref={ref}
      className="w-4 h-4 text-purple-600 dark:text-purple-500"
    />
  );
});
ColoredLinkIcon.displayName = "ColoredLinkIcon";

export const adapter = registerAdapter<ServiceConnectionContext, any, any>(
  config,
  {
    Icon: ColoredLinkIcon,
    Editor,
    QuickView,
    useSelector: useServiceConnectionDataSelector,
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
        serviceconnectionLogger.error("Invalid Service Connection file", error);
        throw new Error("Invalid Service Connection file");
      }
    },
    emptyContext: () => {
      return {
        data: {
          name: "New Service Connection",
          type: "rest",
          url: "",
          authentication: {
            type: "none"
          },
          headers: {},
          queryParams: {},
          metadata: {
            description: "",
            tags: []
          }
        },
      } as FileContext;
    },
    Provider,
  },
);