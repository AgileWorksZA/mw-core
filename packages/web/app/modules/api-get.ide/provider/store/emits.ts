import type { EmitHandlers } from "~/modules/store-kit";
import type { ApiGetEmitPayloads } from "./types";

export const emits: EmitHandlers<ApiGetEmitPayloads> = {
  updated: () => {
    console.log("API Get context updated");
  },
};