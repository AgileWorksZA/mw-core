export type Theme = 'light' | 'dark' | 'system';

export interface ThemePreferences {
  theme: Theme;
}

export interface ThemePreferencesContext {
  preferences: ThemePreferences;
  resolvedTheme: 'light' | 'dark'; // The actual theme being used (resolved from 'system')
}