/**
 * Internationalization Middleware
 * Handles Accept-Language header parsing and language negotiation
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia } from 'elysia';

export type SupportedLanguage = 'en' | 'af' | 'fr';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'af', 'fr'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * Language names for display
 */
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  af: 'Afrikaans', 
  fr: 'Français'
};

/**
 * Parse Accept-Language header
 * Returns ordered list of languages by preference
 */
function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];

  return header
    .split(',')
    .map(lang => {
      const [locale, q = '1'] = lang.trim().split(';q=');
      const quality = parseFloat(q.replace('q=', ''));
      return { locale: locale.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality)
    .map(item => item.locale.split('-')[0]); // Get language without region
}

/**
 * Get best matching language from preferences
 */
function getBestLanguage(
  preferences: string[], 
  supported: SupportedLanguage[] = SUPPORTED_LANGUAGES
): SupportedLanguage {
  for (const pref of preferences) {
    if (supported.includes(pref as SupportedLanguage)) {
      return pref as SupportedLanguage;
    }
  }
  return DEFAULT_LANGUAGE;
}

/**
 * I18n plugin for Elysia
 */
export const i18n = new Elysia({ name: 'i18n' })
  .derive(({ request, query }) => {
    // Check query parameter first (explicit override)
    const queryLang = query?.lang || query?.language;
    if (queryLang && SUPPORTED_LANGUAGES.includes(queryLang as SupportedLanguage)) {
      return { 
        language: queryLang as SupportedLanguage,
        languageSource: 'query' as const
      };
    }

    // Then check Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    const preferences = parseAcceptLanguage(acceptLanguage);
    const language = getBestLanguage(preferences);

    return { 
      language,
      languageSource: acceptLanguage ? 'header' as const : 'default' as const,
      acceptedLanguages: preferences
    };
  })
  // Add language to response headers
  .onAfterHandle(({ language, set }) => {
    set.headers['content-language'] = language;
  });

/**
 * Helper to format language for MoneyWorks
 * MoneyWorks uses full language names in some contexts
 */
export function getMoneyWorksLanguage(lang: SupportedLanguage): string {
  const mapping: Record<SupportedLanguage, string> = {
    en: 'English',
    af: 'Afrikaans',
    fr: 'French'
  };
  return mapping[lang] || 'English';
}