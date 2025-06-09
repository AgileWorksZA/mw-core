import type { ReactNode } from "react";
import { Outlet, useLoaderData } from "react-router";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import { config } from "~/modules/json.ide/adapter/config";
import { emits } from "~/modules/json.ide/provider/store/emits";
import { on } from "~/modules/json.ide/provider/store/on";
import type {
	JsonFileEmitPayloads,
	JsonFileEventPayloads,
	JsonStoreKit,
} from "~/modules/json.ide/provider/store/types";
import { JsonStoreContext } from "~/modules/json.ide/provider/types";
import type { JsonFileContext } from "~/modules/json.ide/types";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { useCreateStoreKit } from "~/modules/store-kit/types";

export function Provider(props: {
	children?: ReactNode;
	id: string;
}) {
	const context: JsonFileContext = useLoaderData<typeof loader>().data;
	const { cursor } = useLoaderData<typeof loader>();

	const store: JsonStoreKit = useCreateStoreKit<
		JsonFileContext,
		JsonFileEventPayloads,
		JsonFileEmitPayloads
	>({ context, on, emits });

	const storageFn = useSyncDocument(config.type, props.id, store.sessionId);

	useServerSync<JsonFileContext, JsonFileEventPayloads, JsonFileEmitPayloads>({
		type: config.type,
		id: props.id,
		cursor,
		maxWait: 1_000,
		storageFn,
		store,
	});

	return (
		<JsonStoreContext.Provider value={{ store, cursor }}>
			{props.children ? props.children : <Outlet />}
		</JsonStoreContext.Provider>
	);
}
