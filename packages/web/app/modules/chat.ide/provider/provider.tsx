import { Outlet, useLoaderData } from "react-router";
import type { ReactNode } from "react";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import { ChatStoreProvider } from "~/modules/chat/provider";
import type { ChatContext } from "~/modules/chat/types";
import { useParams } from "react-router";

export function Provider(props: { children?: ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();
  const { cursor } = loaderData;
  const fileContext = loaderData.data;
  const params = useParams();

  const { id, type } = params;
  if (!id || !type) {
    throw new Error("ID and type are required");
  }

  // Extract the ChatContext from the FileContext
  const chatContext: ChatContext = fileContext.data;

  return (
    <ChatStoreProvider
      documentContext={chatContext}
      cursor={cursor}
      type={type}
      id={id}
    >
      {props.children ? props.children : <Outlet />}
    </ChatStoreProvider>
  );
}