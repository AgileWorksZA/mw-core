/**
 * Chrome DevTools attempts to fetch this file to discover debugging capabilities.
 * We return an empty JSON object to prevent 404 errors in the logs.
 * 
 * Route: /.well-known/appspecific/com.chrome.devtools.json
 */
export async function loader() {
  return new Response("{}", {
    headers: {
      "Content-Type": "application/json",
    },
  });
}