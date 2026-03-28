import type { RequestHandler } from "./$types";
export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify({ status: "ok" }), {
		headers: { "content-type": "application/json" }
	});
};
