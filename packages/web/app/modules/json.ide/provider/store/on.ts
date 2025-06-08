import type {
  JsonFileEventPayloads,
  JsonFileEmitPayloads,
} from "~/modules/json.ide/provider/store/types";
import type { EventHandlers } from "~/modules/store-kit/types";
import type { JsonFileContext } from "~/modules/json.ide/types";
import { rawReturn } from "mutative";

export const on: EventHandlers<
  JsonFileContext,
  JsonFileEventPayloads,
  JsonFileEmitPayloads
> = {
  update: (context, event, enqueue) => {
    return rawReturn({
      ...context,
      ...event.context,
    });
  },
};
