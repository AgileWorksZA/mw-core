import { useSelector } from "@xstate/store/react";
import { ThemePreferencesStore } from "./store";
import type { Theme } from "./types";

export function useTheme() {
  const theme = useSelector(ThemePreferencesStore, (state) => state.context.preferences.theme);
  const resolvedTheme = useSelector(ThemePreferencesStore, (state) => state.context.resolvedTheme);

  const setTheme = (newTheme: Theme) => {
    ThemePreferencesStore.send({ type: "setTheme", theme: newTheme });
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
  };
}

export function useResolvedTheme() {
  return useSelector(ThemePreferencesStore, (state) => state.context.resolvedTheme);
}