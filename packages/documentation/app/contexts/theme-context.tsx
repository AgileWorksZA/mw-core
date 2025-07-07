import * as React from "react";
import { useFetcher } from "react-router";
import type { Theme } from "~/lib/theme.server";

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  theme: initialTheme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
  const [theme, setThemeState] = React.useState<Theme>(initialTheme);
  const fetcher = useFetcher();
  
  // Resolve system theme
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(() => {
    if (theme !== "system") return theme;
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  
  // Listen for system theme changes
  React.useEffect(() => {
    if (theme !== "system") {
      setResolvedTheme(theme);
      return;
    }
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setResolvedTheme(mediaQuery.matches ? "dark" : "light");
    };
    
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);
  
  // Apply theme to document
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);
  
  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Add transition class
    document.documentElement.classList.add("transitioning");
    
    fetcher.submit(
      { theme: newTheme },
      { method: "POST", action: "/api/preferences" }
    );
    
    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove("transitioning");
    }, 300);
  }, [fetcher]);
  
  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}