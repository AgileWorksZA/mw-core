import { Outlet, useLoaderData } from "react-router";
import type { ReactNode } from "react";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import { useCreateStoreKit } from "~/modules/store-kit/types";
import type {
  OpenAPIEmitPayloads,
  OpenAPIEventPayloads,
  OpenAPIStoreKit,
} from "~/modules/openapi.ide/provider/store/types";
import { OpenAPIStoreContext } from "./types";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { on } from "./store/on";
import { emits } from "./store/emits";
import { useParams } from "react-router";
import type { OpenAPIFileContext } from "~/modules/openapi.ide/types";

export function Provider(props: {
  children?: ReactNode;
}) {
  const context: OpenAPIFileContext = useLoaderData<typeof loader>().data;
  const { cursor } = useLoaderData<typeof loader>();
  const params = useParams();

  const { id, type } = params;
  if (!id || !type) {
    throw new Error("ID and type are required");
  }

  const store: OpenAPIStoreKit = useCreateStoreKit<
    OpenAPIFileContext,
    OpenAPIEventPayloads,
    OpenAPIEmitPayloads
  >({ context, on, emits });

  const storageFn = useSyncDocument(type || "openapi", id || "temp");

  useServerSync<OpenAPIFileContext, OpenAPIEventPayloads, OpenAPIEmitPayloads>({
    type,
    id,
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
