import { createCookie } from "react-router";
import type { Theme, ThemePreferences } from "./types";

const COOKIE_NAME = "theme-preferences";

export const themePreferencesCookie = createCookie(COOKIE_NAME, {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  path: "/",
});

export async function getThemePreferences(request: Request): Promise<ThemePreferences> {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await themePreferencesCookie.parse(cookieHeader);
  
  return {
    theme: cookie?.theme || 'system',
  };
}

export async function setThemePreferences(preferences: ThemePreferences) {
  return await themePreferencesCookie.serialize(preferences);
}

export function getResolvedTheme(theme: Theme, userAgent?: string | null): 'light' | 'dark' {
  if (theme !== 'system') {
    return theme;
  }
  
  // For system theme, we default to light on server-side
  // The client will update this based on actual system preferences
  return 'light';
}