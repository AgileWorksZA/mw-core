import type { ThemePreferencesContext } from "./types";

export function ThemeScript({ context }: { context: ThemePreferencesContext }) {
  // Use a script that runs before React hydration to avoid mismatches
  const script = `
    (function() {
      const theme = '${context.resolvedTheme}';
      // Set the theme before React hydrates
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.add(theme);
    })();
  `;
  
  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />;
}