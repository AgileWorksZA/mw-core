import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

/**
 * Extracts the method, document ID and type from the action or loader function arguments.
 * @param args
 * @param config
 */
export function getRequestConfig<TContext>(
  args: ActionFunctionArgs | LoaderFunctionArgs,
  config?: {
    defaultContext?: TContext; // Used by adapter if creating a new doc from delta
    type?: string; // Override the document type this action is for. If not passed we'll pick it up from the URL
    id?: string; // Override the document id this action is for. If not passed we'll pick it up from the URL
  },
) {
  const id =
    config?.id ||
    (args.params.id as string)?.split("?")[0].split("&")[0].split("#")[0];
  if (!id) {
    throw new Response(
      JSON.stringify({ error: true, message: "ID parameter is missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  const type = config?.type || (args.params.type as string);
  if (!type) {
    throw new Response(
      JSON.stringify({ error: true, message: "Type parameter is missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  const method =
    args.request.method.toLowerCase() ?? ("get" as "get" | "post" | "delete");
  return { id, type, method };
}
