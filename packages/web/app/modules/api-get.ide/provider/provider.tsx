import type { ReactNode } from "react";
import { Outlet, useLoaderData } from "react-router";
import { config } from "~/modules/api-get.ide/adapter/config";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import type { FileContext } from "~/modules/ide/types";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { useCreateStoreKit } from "~/modules/store-kit/types";
import { ApiGetContext } from "../hooks/use-api-get-context";
import type { ApiGetConfig } from "../types";
import { emits } from "./store/emits";
import { on } from "./store/on";
import type {
	ApiGetEmitPayloads,
	ApiGetEventPayloads,
	ApiGetStoreKit,
} from "./store/types";

export type ApiGetFileContext = FileContext<ApiGetConfig>;

export function ApiGetProvider(props: { children?: ReactNode; id: string }) {
	const context: ApiGetFileContext = useLoaderData<typeof loader>().data;
	const { cursor } = useLoaderData<typeof loader>();

	const store: ApiGetStoreKit = useCreateStoreKit<
		ApiGetFileContext,
		ApiGetEventPayloads,
		ApiGetEmitPayloads
	>({ context, on, emits });

	const storageFn = useSyncDocument(config.type, props.id, store.sessionId);

	useServerSync<ApiGetFileContext, ApiGetEventPayloads, ApiGetEmitPayloads>({
		type: config.type,
		id: props.id,
		store,
		storageFn,
		cursor,
		maxWait: 1_000,
	});

	return (
		<ApiGetContext.Provider value={store}>
			{props.children || <Outlet />}
		</ApiGetContext.Provider>
	);
}
