import type { LoaderFunctionArgs } from "react-router";
import { getAdapter } from "~/modules/ide/adapter/register";

export function getTypeAdapter(args: LoaderFunctionArgs) {
  const { params } = args;
  const { type } = params;

  if (!type) {
    throw new Response(
      JSON.stringify({
        error: true,
        message: "Type parameter is missing",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  const adapter = getAdapter(type);
  if (!adapter) {
    throw new Response(
      JSON.stringify({
        error: true,
        message: `Adapter for type ${type} not found`,
      }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    );
  }
  return adapter;
}
