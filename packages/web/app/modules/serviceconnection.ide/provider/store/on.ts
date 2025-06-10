import { rawReturn } from "mutative";
import type {
	ServiceConnectionDataEmitPayloads,
	ServiceConnectionDataEventPayloads,
} from "~/modules/serviceconnection.ide/provider/store/types";
import type { ServiceConnectionContext } from "~/modules/serviceconnection.ide/types";
import type { EventHandlers } from "~/modules/store-kit/types";

export const on: EventHandlers<
	ServiceConnectionContext,
	ServiceConnectionDataEventPayloads,
	ServiceConnectionDataEmitPayloads
> = {
	update: (context, event, enqueue) => {
		if (!event.noEmit) {
			enqueue.emit.updated();
		}
		Object.assign(context, event.context);
	},
};
