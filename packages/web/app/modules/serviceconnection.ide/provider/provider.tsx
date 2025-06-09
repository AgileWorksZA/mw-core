import type { ReactNode } from "react";
import { Outlet, useLoaderData } from "react-router";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import { config } from "~/modules/serviceconnection.ide/adapter/config";
import { emits } from "~/modules/serviceconnection.ide/provider/store/emits";
import { on } from "~/modules/serviceconnection.ide/provider/store/on";
import type {
	ServiceConnectionDataEmitPayloads,
	ServiceConnectionDataEventPayloads,
	ServiceConnectionDataStoreKit,
} from "~/modules/serviceconnection.ide/provider/store/types";
import { ServiceConnectionDataStoreContext } from "~/modules/serviceconnection.ide/provider/types";
import type { ServiceConnectionContext } from "~/modules/serviceconnection.ide/types";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { useCreateStoreKit } from "~/modules/store-kit/types";

export function Provider(props: {
	children?: ReactNode;
	id: string;
}) {
	const context: ServiceConnectionContext = useLoaderData<typeof loader>().data;
	const { cursor } = useLoaderData<typeof loader>();

	const store: ServiceConnectionDataStoreKit = useCreateStoreKit<
		ServiceConnectionContext,
		ServiceConnectionDataEventPayloads,
		ServiceConnectionDataEmitPayloads
	>({ context, on, emits });

	const storageFn = useSyncDocument(config.type, props.id, store.sessionId);

	useServerSync<
		ServiceConnectionContext,
		ServiceConnectionDataEventPayloads,
		ServiceConnectionDataEmitPayloads
	>({
		type: config.type,
		id: props.id,
		cursor,
		maxWait: 1_000,
		storageFn,
		store,
	});

	return (
		<ServiceConnectionDataStoreContext.Provider value={{ store, cursor }}>
			{props.children ? props.children : <Outlet />}
		</ServiceConnectionDataStoreContext.Provider>
	);
}
