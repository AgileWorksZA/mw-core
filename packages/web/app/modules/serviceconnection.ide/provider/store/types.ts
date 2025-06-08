import type { StoreKit } from "~/modules/store-kit/types";
import type { ServiceConnectionContext } from "~/modules/serviceconnection.ide/types";

export type ServiceConnectionDataEventPayloads = {
  update: { context: Partial<ServiceConnectionContext>; noEmit?: boolean };
};

export type ServiceConnectionDataEmitPayloads = {
  updated: undefined;
};

export type ServiceConnectionDataStoreKit = StoreKit<
  ServiceConnectionContext,
  ServiceConnectionDataEventPayloads,
  ServiceConnectionDataEmitPayloads
>;