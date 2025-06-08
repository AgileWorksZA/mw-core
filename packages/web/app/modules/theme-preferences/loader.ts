import { getThemePreferences, getResolvedTheme } from "./theme.server";
import type { ThemePreferencesContext } from "./types";

export async function loadThemePreferences(request: Request): Promise<ThemePreferencesContext> {
  const preferences = await getThemePreferences(request);
  const userAgent = request.headers.get("User-Agent");
  const resolvedTheme = getResolvedTheme(preferences.theme, userAgent);

  return {
    preferences,
    resolvedTheme,
  };
}