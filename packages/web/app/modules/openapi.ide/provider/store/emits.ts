import type { EmitHandlers } from "~/modules/store-kit/types";
import type { OpenAPIEmitPayloads } from "~/modules/openapi.ide/provider/store/types";

export const emits: EmitHandlers<OpenAPIEmitPayloads> = {
  updated: () => {
    console.log("OpenAPI document updated");
  },
};
