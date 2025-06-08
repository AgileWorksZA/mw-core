import type { EmitHandlers } from "~/modules/store-kit/types";
import type { JsonFileEmitPayloads } from "~/modules/json.ide/provider/store/types";

export const emits: EmitHandlers<JsonFileEmitPayloads> = {
  updated: () => {
    console.log("JSON FILE updated");
  },
};
