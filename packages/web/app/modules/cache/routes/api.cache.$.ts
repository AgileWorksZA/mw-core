import type { LoaderFunctionArgs } from "react-router";
import {cacheUrl} from "~/modules/cache/utils/cache.server";

export async function loader(args: LoaderFunctionArgs) {
  const force = args.params.force === "true";
  try {
    return cacheUrl(args.params["*"] as string, force);
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 400,
      statusText: String(e),
    });
  }
}
