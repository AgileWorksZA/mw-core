import { Outlet, useLoaderData } from "react-router";
import type { ReactNode } from "react";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import { useCreateStoreKit } from "~/modules/store-kit/types";
import type {
  JsonFileEventPayloads,
  JsonFileEmitPayloads,
  JsonStoreKit,
} from "~/modules/json.ide/provider/store/types";
import { JsonStoreContext } from "~/modules/json.ide/provider/types";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { on } from "~/modules/json.ide/provider/store/on";
import { emits } from "~/modules/json.ide/provider/store/emits";
import { useParams } from "react-router";
import type { JsonFileContext } from "~/modules/json.ide/types";

export function Provider(props: {
  children?: ReactNode;
}) {
  const context: JsonFileContext = useLoaderData<typeof loader>().data;
  const { cursor } = useLoaderData<typeof loader>();
  const params = useParams();

  const { id, type } = params;
  if (!id || !type) {
    throw new Error("ID and type are required");
  }

  const store: JsonStoreKit = useCreateStoreKit<
    JsonFileContext,
    JsonFileEventPayloads,
    JsonFileEmitPayloads
  >({ context, on, emits });

  const storageFn = useSyncDocument(type || "json", id || "temp");

  useServerSync<JsonFileContext, JsonFileEventPayloads, JsonFileEmitPayloads>({
    type,
    id,
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
