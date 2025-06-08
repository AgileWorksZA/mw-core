import type { StoreKit } from "~/modules/store-kit";
import type { ApiGetConfig } from "../../types";
import type { FileContext } from "~/modules/ide/types";

export type ApiGetFileContext = FileContext<ApiGetConfig>;

export type ApiGetEventPayloads = {
  update: {
    context: Partial<ApiGetFileContext>;
    noEmit?: boolean;
  };
  "endpoint:selected": { endpoint: string };
  "test:start": { documentId: string };
  "test:complete": { 
    documentId: string;
    success: boolean;
    data?: any;
    error?: string;
  };
  "parameter:changed": {
    documentId: string;
    type: "path" | "query" | "headers";
    name: string;
    value: any;
  };
};

export type ApiGetEmitPayloads = {
  updated: undefined;
};

export type ApiGetStoreKit = StoreKit<
  ApiGetFileContext,
  ApiGetEventPayloads,
  ApiGetEmitPayloads
>;