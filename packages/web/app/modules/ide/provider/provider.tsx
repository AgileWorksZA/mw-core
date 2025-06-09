import type { ReactNode } from "react";
import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router";
import { config } from "~/modules/ide/adapter/config";
import { emits } from "~/modules/ide/provider/store/emits";
import { on } from "~/modules/ide/provider/store/on";
import type {
	ProjectEmitPayloads,
	ProjectEventPayloads,
	ProjectStoreKit,
} from "~/modules/ide/provider/store/types";
import { ProjectStoreContext } from "~/modules/ide/provider/types";
import type { loader } from "~/modules/ide/routes/ide";
import type { Project } from "~/modules/ide/types";
import { getStoreVault } from "~/modules/ide/utils/store-vault";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { useCreateStoreKit } from "~/modules/store-kit/types";

export function Provider(props: { children?: ReactNode; id: string }) {
	const context: Project = useLoaderData<typeof loader>().data;
	const { cursor } = useLoaderData<typeof loader>();

	const store: ProjectStoreKit = useCreateStoreKit<
		Project,
		ProjectEventPayloads,
		ProjectEmitPayloads
	>({ context, on, emits });
	const syncDocument = useSyncDocument(
		config.type,
		config.type,
		store.sessionId,
	);
	useServerSync<Project, ProjectEventPayloads, ProjectEmitPayloads>({
		type: config.type,
		id: context.id,
		cursor,
		maxWait: 500,
		storageFn: async ({ context, delta, cursor }) => {
			return await syncDocument({
				context,
				delta,
				cursor,
			});
		},
		store,
	});

	// Initialize the store vault with project context
	useEffect(() => {
		const vault = getStoreVault();
		vault.initialize(
			() => store.getSnapshot().context,
			(updates) => {
				store.send({ type: "update", context: updates });
			},
		);
	}, [store]);

	return (
		<ProjectStoreContext.Provider value={{ store, cursor }}>
			{props.children ? props.children : <Outlet />}
		</ProjectStoreContext.Provider>
	);
}
