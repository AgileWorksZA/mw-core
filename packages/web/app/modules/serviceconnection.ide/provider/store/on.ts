import type {
  ServiceConnectionDataEventPayloads,
  ServiceConnectionDataEmitPayloads,
} from "~/modules/serviceconnection.ide/provider/store/types";
import type { EventHandlers } from "~/modules/store-kit/types";
import type { ServiceConnectionContext } from "~/modules/serviceconnection.ide/types";
import { rawReturn } from "mutative";

export const on: EventHandlers<
  ServiceConnectionContext,
  ServiceConnectionDataEventPayloads,
  ServiceConnectionDataEmitPayloads
> = {
  update: (context, event, enqueue) => {
    if (!event.noEmit) {
      enqueue.emit.updated();
    }
    return rawReturn({
      ...context,
      ...event.context,
    });
  },
};