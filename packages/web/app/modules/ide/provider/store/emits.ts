import type { EmitHandlers } from "~/modules/store-kit/types";
import type { ProjectEmitPayloads } from "~/modules/ide/provider/store/types";

export const emits: EmitHandlers<ProjectEmitPayloads> = {
  updated: () => {
    console.log("Project updated");
  },
};
