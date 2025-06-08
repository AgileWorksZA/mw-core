import { Outlet, useLoaderData } from "react-router";
import type { ReactNode } from "react";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import { useCreateStoreKit } from "~/modules/store-kit/types";
import type {
  ServiceConnectionDataEventPayloads,
  ServiceConnectionDataEmitPayloads,
  ServiceConnectionDataStoreKit,
} from "~/modules/serviceconnection.ide/provider/store/types";
import { ServiceConnectionDataStoreContext } from "~/modules/serviceconnection.ide/provider/types";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { on } from "~/modules/serviceconnection.ide/provider/store/on";
import { emits } from "~/modules/serviceconnection.ide/provider/store/emits";
import { useParams } from "react-router";
import type { ServiceConnectionContext } from "~/modules/serviceconnection.ide/types";

export function Provider(props: {
  children?: ReactNode;
}) {
  const context: ServiceConnectionContext = useLoaderData<typeof loader>().data;
  const { cursor } = useLoaderData<typeof loader>();
  const params = useParams();

  const { id, type } = params;
  if (!id || !type) {
    throw new Error("ID and type are required");
  }

  const store: ServiceConnectionDataStoreKit = useCreateStoreKit<
    ServiceConnectionContext,
    ServiceConnectionDataEventPayloads,
    ServiceConnectionDataEmitPayloads
  >({ context, on, emits });

  const storageFn = useSyncDocument(type || "service-connection", id || "temp");

  useServerSync<ServiceConnectionContext, ServiceConnectionDataEventPayloads, ServiceConnectionDataEmitPayloads>({
    type,
    id,
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