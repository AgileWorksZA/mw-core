import type { OpenAPIContext, OpenAPIDocument } from "../../types";
import type { StoreKit } from "~/modules/store-kit/types";

export type OpenAPIEventPayloads = {
  update: { context: Partial<OpenAPIContext>; noEmit?: boolean };
  fetchFromUrl: { url: string };
  saveToPublic: { content: string };
};
export type OpenAPIEmitPayloads = {
  updated: undefined;
  fetched: { document: OpenAPIDocument };
  saved: { resourcePath: string };
};

export type OpenAPIStoreKit = StoreKit<
  OpenAPIContext,
  OpenAPIEventPayloads,
  OpenAPIEmitPayloads
>;
