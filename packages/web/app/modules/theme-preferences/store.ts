import { createStoreWithProducer } from "@xstate/store";
import { create } from "mutative";
import type { Theme, ThemePreferencesContext } from "./types";

const DefaultContext: ThemePreferencesContext = {
  preferences: {
    theme: "system",
  },
  resolvedTheme: "light",
};

export const ThemePreferencesStore = createStoreWithProducer(create, {
  context: DefaultContext,
  on: {
    setTheme: (context, event: { theme: Theme }) => {
      context.preferences.theme = event.theme;

      // If not system, update resolved theme immediately
      if (event.theme !== "system") {
        context.resolvedTheme = event.theme;
      }
    },
    updateResolvedTheme: (
      context,
      event: { resolvedTheme: "light" | "dark" },
    ) => {
      context.resolvedTheme = event.resolvedTheme;
    },
  },
});
