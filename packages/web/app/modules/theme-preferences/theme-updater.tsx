import { useEffect } from "react";
import { useResolvedTheme } from "./hooks";

export function ThemeUpdater() {
  const resolvedTheme = useResolvedTheme();

  useEffect(() => {
    // Update theme attribute and class
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return null;
}