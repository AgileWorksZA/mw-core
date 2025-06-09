import type { ReactNode } from "react";
import { Outlet, useLoaderData } from "react-router";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import { config } from "~/modules/openapi.ide/adapter/config";
import type {
	OpenAPIEmitPayloads,
	OpenAPIEventPayloads,
	OpenAPIStoreKit,
} from "~/modules/openapi.ide/provider/store/types";
import type { OpenAPIFileContext } from "~/modules/openapi.ide/types";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { useCreateStoreKit } from "~/modules/store-kit/types";
import { emits } from "./store/emits";
import { on } from "./store/on";
import { OpenAPIStoreContext } from "./types";

export function Provider(props: {
	children?: ReactNode;
	id: string;
}) {
	const context: OpenAPIFileContext = useLoaderData<typeof loader>().data;
	const { cursor } = useLoaderData<typeof loader>();

	const store: OpenAPIStoreKit = useCreateStoreKit<
		OpenAPIFileContext,
		OpenAPIEventPayloads,
		OpenAPIEmitPayloads
	>({ context, on, emits });

	const storageFn = useSyncDocument(config.type, props.id, store.sessionId);

	useServerSync<OpenAPIFileContext, OpenAPIEventPayloads, OpenAPIEmitPayloads>({
		type: config.type,
		id: props.id,
		cursor,
		maxWait: 1_000,
		storageFn,
		store,
	});

	return (
		<OpenAPIStoreContext.Provider value={{ store, cursor }}>
			{props.children ? props.children : <Outlet />}
		</OpenAPIStoreContext.Provider>
	);
}
