import { useEffect } from "react";
import { useFetcher } from "react-router";
import { ThemePreferencesStore } from "./store";
import type { ThemePreferencesContext } from "./types";

interface ThemePreferencesProviderProps {
  children: React.ReactNode;
  initialContext: ThemePreferencesContext;
}

export function ThemePreferencesProvider({ 
  children, 
  initialContext 
}: ThemePreferencesProviderProps) {
  const fetcher = useFetcher();

  // Initialize store with server data
  useEffect(() => {
    ThemePreferencesStore.send({ type: "setTheme", theme: initialContext.preferences.theme });
    ThemePreferencesStore.send({ type: "updateResolvedTheme", resolvedTheme: initialContext.resolvedTheme });
  }, []);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const currentTheme = ThemePreferencesStore.getSnapshot().context.preferences.theme;
      if (currentTheme === 'system') {
        ThemePreferencesStore.send({ 
          type: "updateResolvedTheme", 
          resolvedTheme: e.matches ? 'dark' : 'light' 
        });
      }
    };

    // Set initial resolved theme for system preference
    if (initialContext.preferences.theme === 'system') {
      ThemePreferencesStore.send({ 
        type: "updateResolvedTheme", 
        resolvedTheme: mediaQuery.matches ? 'dark' : 'light' 
      });
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [initialContext.preferences.theme]);

  // Subscribe to theme changes and persist to server
  useEffect(() => {
    let prevTheme = ThemePreferencesStore.getSnapshot().context.preferences.theme;
    
    const unsubscribe = ThemePreferencesStore.subscribe(() => {
      const currentTheme = ThemePreferencesStore.getSnapshot().context.preferences.theme;
      if (currentTheme !== prevTheme) {
        prevTheme = currentTheme;
        // Send update to server
        fetcher.submit(
          { theme: currentTheme },
          { method: "POST", action: "/api/theme-preferences" }
        );
      }
    });

    // xstate/store subscribe returns a function directly
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [fetcher]);

  return <>{children}</>;
}