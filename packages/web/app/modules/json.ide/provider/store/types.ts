import type { StoreKit } from "~/modules/store-kit/types";
import type { JsonFileContext } from "~/modules/json.ide/types";

export type JsonFileEventPayloads = {
  update: { context: Partial<JsonFileContext>; noEmit?: boolean };
};

export type JsonFileEmitPayloads = {
  updated: undefined;
};

export type JsonStoreKit = StoreKit<
  JsonFileContext,
  JsonFileEventPayloads,
  JsonFileEmitPayloads
>;
