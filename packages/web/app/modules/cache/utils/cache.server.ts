import fs from "node:fs";

// replace all non-alphanumeric characters with underscore
function sanitize(str: string) {
  return str.replace(/[^a-zA-Z0-9]/g, "_");
}

/**
 * Downloads a JSON specification from a given URL and saves it to a local file.
 * The file is saved in the ./public/specs directory with a sanitized name.
 *
 * @param {string} url - The URL to fetch the JSON specification from.
 * @param force
 * @returns {Promise<Response>} - A promise that resolves to a Response object containing the fetched JSON.
 */
export async function cacheUrl(
  url: string,
  force?: boolean,
): Promise<Response> {
  fs.mkdirSync("./public/cache", { recursive: true });
  const path = `./public/cache/${sanitize(url)}.data`;

  if (!force && fs.existsSync(path)) {
    const { body, headers, status, statusText } = JSON.parse(
      fs.readFileSync(path, "utf8"),
    );
    return new Response(body, {
      status,
      statusText,
      headers: headers,
    });
  }

  const response = await fetch(url);
  const body = await response.text();
  const headers = Object.fromEntries(response.headers.entries());
  const status = response.status;
  const responseText = response.statusText;
  fs.mkdirSync("./public/specs", { recursive: true });

  fs.writeFileSync(
    path,
    JSON.stringify({
      body,
      headers,
      status,
      statusText: responseText,
    }),
    "utf8",
  );
  return new Response(body, {
    status,
    statusText: responseText,
    headers: headers,
  });
}
