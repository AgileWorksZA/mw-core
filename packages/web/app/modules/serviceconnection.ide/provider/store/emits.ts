import type { EmitHandlers } from "~/modules/store-kit/types";
import type { ServiceConnectionDataEmitPayloads } from "~/modules/serviceconnection.ide/provider/store/types";

export const emits: EmitHandlers<ServiceConnectionDataEmitPayloads> = {
  updated: () => {
    // Optional: Add any side effects when data is updated
  },
};