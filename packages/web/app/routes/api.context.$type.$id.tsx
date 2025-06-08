import type { ActionFunctionArgs } from "react-router";
import { action as ideAction } from "~/modules/ide/routes/ide";
import { createPOSTAction, createDELETEAction } from "~/modules/storage/json-adapter/actions";
import { json_file_adapter } from "~/modules/storage/json-adapter/storage.server";
import type { StorageAdapter } from "~/modules/storage/types";

export async function action(args: ActionFunctionArgs) {
  const { type, id } = args.params;
  if (!type || !id) {
    throw new Error("Type and ID are required");
  }
  
  // Special handling for IDE project context
  if (type === "ide") {
    return ideAction(args);
  }
  
  // All other file types use the generic storage adapter
  const adapter = json_file_adapter as StorageAdapter<any>;
  
  // Handle different HTTP methods
  if (args.request.method.toLowerCase() === "delete") {
    const deleteAction = createDELETEAction(adapter);
    return deleteAction(args);
  }
  
  if (args.request.method.toLowerCase() === "post") {
    const postAction = createPOSTAction(adapter);
    return postAction(args);
  }
  
  throw new Response(
    JSON.stringify({
      error: true,
      message: "Unsupported method",
    }),
    { status: 400, headers: { "Content-Type": "application/json" } },
  );
}
