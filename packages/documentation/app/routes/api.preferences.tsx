import type { Route } from "./+types/api.preferences";
import { getPreferences, setPreferences, type Theme } from "~/lib/theme.server";
import { data } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const currentPreferences = await getPreferences(request);
  const formData = await request.formData();
  const theme = formData.get("theme") as Theme;
  
  if (theme && theme !== "light" && theme !== "dark" && theme !== "system") {
    return data({ error: "Invalid theme" }, { status: 400 });
  }
  
  const updatedPreferences = theme ? { theme } : {};
  
  return data(
    { success: true },
    {
      headers: {
        "Set-Cookie": await setPreferences(updatedPreferences, currentPreferences),
      },
    }
  );
}