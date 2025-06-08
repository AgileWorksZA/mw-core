import { Outlet, useLoaderData, useParams } from "react-router";
import type { ReactNode } from "react";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import { useCreateStoreKit } from "~/modules/store-kit/types";
import type {
  ApiGetEventPayloads,
  ApiGetEmitPayloads,
  ApiGetStoreKit,
} from "./store/types";
import { ApiGetContext } from "../hooks/use-api-get-context";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { on } from "./store/on";
import { emits } from "./store/emits";
import type { ApiGetConfig } from "../types";
import type { FileContext } from "~/modules/ide/types";

export type ApiGetFileContext = FileContext<ApiGetConfig>;

export function ApiGetProvider(props: { children?: ReactNode }) {
  const context: ApiGetFileContext = useLoaderData<typeof loader>().data;
  const { cursor } = useLoaderData<typeof loader>();
  const params = useParams();

  const { id, type } = params;
  if (!id || !type) {
    throw new Error("ID and type are required");
  }

  const store: ApiGetStoreKit = useCreateStoreKit<
    ApiGetFileContext,
    ApiGetEventPayloads,
    ApiGetEmitPayloads
  >({ context, on, emits });

  const storageFn = useSyncDocument(type || "api-get", id || "temp");

  useServerSync<ApiGetFileContext, ApiGetEventPayloads, ApiGetEmitPayloads>({
    type,
    id,
    store,
    onServerEmit: storageFn,
    versionOrCursor: cursor,
  });

  return (
    <ApiGetContext.Provider value={store}>
      {props.children || <Outlet />}
    </ApiGetContext.Provider>
  );
}