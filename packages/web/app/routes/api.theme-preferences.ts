import type { ActionFunctionArgs } from "react-router";
import { setThemePreferences } from "~/modules/theme-preferences/theme.server";
import type { Theme } from "~/modules/theme-preferences/types";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const theme = formData.get("theme") as Theme;

  if (
    !theme ||
    !["light", "dark", "system"].includes(theme)
  ) {
    return new Response(JSON.stringify({ error: "Invalid theme" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cookie = await setThemePreferences({ theme });

  return new Response(JSON.stringify({ success: true, theme }), {
    headers: {
      "Set-Cookie": cookie,
      "Content-Type": "application/json",
    },
  });
}
