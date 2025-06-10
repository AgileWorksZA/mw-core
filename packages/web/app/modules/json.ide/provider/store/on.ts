import { rawReturn } from "mutative";
import type {
	JsonFileEmitPayloads,
	JsonFileEventPayloads,
} from "~/modules/json.ide/provider/store/types";
import type { JsonFileContext } from "~/modules/json.ide/types";
import type { EventHandlers } from "~/modules/store-kit/types";

export const on: EventHandlers<
	JsonFileContext,
	JsonFileEventPayloads,
	JsonFileEmitPayloads
> = {
	update: (context, event, enqueue) => {
		Object.assign(context, event.context);
	},
};
