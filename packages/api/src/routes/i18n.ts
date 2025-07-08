/**
 * Internationalization Routes
 * Endpoints for language support and translations
 * 
 * @moneyworks-dsl PURE
 */

import { Elysia, t } from 'elysia';
import type { SmartMoneyWorksClient } from '@moneyworks/data';
import type { CacheService } from '@moneyworks/api/services/cache';
import { LabelsController } from '@moneyworks/api/controllers/labels';
import { 
  SUPPORTED_LANGUAGES, 
  LANGUAGE_NAMES,
  type SupportedLanguage 
} from '@moneyworks/api/middleware/i18n';
import { ErrorSchema, SuccessResponse } from '@moneyworks/api/schemas/common';

/**
 * UI translations for frontend applications
 * These are not MoneyWorks field labels, but general UI text
 */
const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.refresh': 'Refresh',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Table operations
    'table.noData': 'No data available',
    'table.showing': 'Showing {start} to {end} of {total} entries',
    'table.rowsPerPage': 'Rows per page',
    'table.actions': 'Actions',
    
    // Forms
    'form.required': 'This field is required',
    'form.invalid': 'Invalid value',
    'form.submit': 'Submit',
    'form.reset': 'Reset',
    
    // Messages
    'message.saveSuccess': 'Successfully saved',
    'message.deleteSuccess': 'Successfully deleted',
    'message.deleteConfirm': 'Are you sure you want to delete this item?',
    'message.unsavedChanges': 'You have unsaved changes. Do you want to continue?',
    
    // MoneyWorks specific
    'mw.tables': 'Tables',
    'mw.taxRate': 'Tax Rate',
    'mw.company': 'Company Information',
    'mw.evaluate': 'Evaluate Expression',
    'mw.fieldLabels': 'Field Labels'
  },
  
  af: {
    // Common
    'common.loading': 'Laai...',
    'common.error': 'Fout',
    'common.success': 'Sukses',
    'common.save': 'Stoor',
    'common.cancel': 'Kanselleer',
    'common.delete': 'Verwyder',
    'common.edit': 'Wysig',
    'common.create': 'Skep',
    'common.search': 'Soek',
    'common.filter': 'Filter',
    'common.export': 'Uitvoer',
    'common.import': 'Invoer',
    'common.refresh': 'Verfris',
    'common.yes': 'Ja',
    'common.no': 'Nee',
    
    // Table operations
    'table.noData': 'Geen data beskikbaar nie',
    'table.showing': 'Wys {start} tot {end} van {total} inskrywings',
    'table.rowsPerPage': 'Rye per bladsy',
    'table.actions': 'Aksies',
    
    // Forms
    'form.required': 'Hierdie veld is verplig',
    'form.invalid': 'Ongeldige waarde',
    'form.submit': 'Indien',
    'form.reset': 'Herstel',
    
    // Messages
    'message.saveSuccess': 'Suksesvol gestoor',
    'message.deleteSuccess': 'Suksesvol verwyder',
    'message.deleteConfirm': 'Is jy seker jy wil hierdie item verwyder?',
    'message.unsavedChanges': 'Jy het ongestoorde veranderinge. Wil jy voortgaan?',
    
    // MoneyWorks specific
    'mw.tables': 'Tabelle',
    'mw.taxRate': 'Belastingkoers',
    'mw.company': 'Maatskappy Inligting',
    'mw.evaluate': 'Evalueer Uitdrukking',
    'mw.fieldLabels': 'Veld Etikette'
  },
  
  fr: {
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.create': 'Créer',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.export': 'Exporter',
    'common.import': 'Importer',
    'common.refresh': 'Actualiser',
    'common.yes': 'Oui',
    'common.no': 'Non',
    
    // Table operations
    'table.noData': 'Aucune donnée disponible',
    'table.showing': 'Affichage de {start} à {end} sur {total} entrées',
    'table.rowsPerPage': 'Lignes par page',
    'table.actions': 'Actions',
    
    // Forms
    'form.required': 'Ce champ est obligatoire',
    'form.invalid': 'Valeur invalide',
    'form.submit': 'Soumettre',
    'form.reset': 'Réinitialiser',
    
    // Messages
    'message.saveSuccess': 'Enregistré avec succès',
    'message.deleteSuccess': 'Supprimé avec succès',
    'message.deleteConfirm': 'Êtes-vous sûr de vouloir supprimer cet élément?',
    'message.unsavedChanges': 'Vous avez des modifications non enregistrées. Voulez-vous continuer?',
    
    // MoneyWorks specific
    'mw.tables': 'Tableaux',
    'mw.taxRate': 'Taux de taxe',
    'mw.company': 'Informations sur la société',
    'mw.evaluate': 'Évaluer l\'expression',
    'mw.fieldLabels': 'Étiquettes de champ'
  }
};

/**
 * Create i18n routes
 */
export function createI18nRoutes(
  client?: SmartMoneyWorksClient,
  cache?: CacheService
) {
  const labelsController = client && cache ? 
    new LabelsController(client, cache) : null;

  return new Elysia({ prefix: '/i18n' })
    // Get supported languages
    .get('/languages', ({ headers }) => {
      const requestId = headers['x-request-id'] || 'unknown';

      return {
        data: {
          languages: SUPPORTED_LANGUAGES.map(code => ({
            code,
            name: LANGUAGE_NAMES[code],
            nativeName: getNativeName(code)
          })),
          default: 'en'
        },
        metadata: {
          timestamp: new Date().toISOString(),
          requestId
        }
      };
    }, {
      detail: {
        summary: 'Get supported languages',
        description: 'List all languages supported by the API',
        tags: ['I18n']
      }
    })
    
    // Get UI translations
    .get('/translations/:lang', ({ params: { lang }, set, headers }) => {
      const requestId = headers['x-request-id'] || 'unknown';

      if (!SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
        set.status = 404;
        throw new Error(`NOT_FOUND: Language '${lang}' is not supported`);
      }

      const language = lang as SupportedLanguage;
      
      // Set cache headers
      set.headers['cache-control'] = 'public, max-age=86400'; // 24 hours
      set.headers['content-language'] = language;

      return {
        data: {
          language,
          translations: UI_TRANSLATIONS[language]
        },
        metadata: {
          timestamp: new Date().toISOString(),
          requestId,
          keyCount: Object.keys(UI_TRANSLATIONS[language]).length,
          count: Object.keys(UI_TRANSLATIONS[language]).length
        }
      };
    }, {
      params: t.Object({
        lang: t.String({ description: 'Language code (en, af, fr)' })
      }),
      detail: {
        summary: 'Get UI translations',
        description: `Get translations for UI elements in the specified language.

These are general UI translations for frontend applications, 
not MoneyWorks field labels. For field labels, use the 
/tables/:table/labels endpoint.

Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`,
        tags: ['I18n']
      },
      response: {
        200: SuccessResponse(t.Object({
          language: t.String(),
          translations: t.Record(t.String(), t.String())
        })),
        404: ErrorSchema
      }
    })
    
    // Get all field labels for all tables
    .get('/labels/:lang', async ({ params: { lang }, set, headers }) => {
      if (!labelsController) {
        set.status = 501;
        throw new Error('NOT_IMPLEMENTED: Labels endpoint requires client and cache configuration');
      }

      const requestId = headers['x-request-id'] || 'unknown';

      if (!SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
        set.status = 404;
        throw new Error(`NOT_FOUND: Language '${lang}' is not supported`);
      }

      const language = lang as SupportedLanguage;

      try {
        const allLabels = await labelsController.getAllTableLabels(language);

        // Set cache headers
        set.headers['cache-control'] = 'public, max-age=3600'; // 1 hour
        set.headers['content-language'] = language;

        return {
          data: allLabels,
          metadata: {
            timestamp: new Date().toISOString(),
            requestId,
            language,
            tableCount: Object.keys(allLabels).length,
            count: Object.keys(allLabels).length
          }
        };
      } catch (error: any) {
        throw error;
      }
    }, {
      params: t.Object({
        lang: t.String({ description: 'Language code (en, af, fr)' })
      }),
      detail: {
        summary: 'Get all field labels',
        description: `Get field labels for all available tables in the specified language.

This is useful for pre-loading all labels at application startup.
Results are cached for 1 hour.

For labels of a specific table, use /tables/:table/labels instead.`,
        tags: ['I18n']
      },
      response: {
        200: SuccessResponse(t.Record(
          t.String(),
          t.Object({
            language: t.String(),
            table: t.String(),
            labels: t.Record(t.String(), t.String()),
            enumerated: t.Optional(t.Record(
              t.String(), 
              t.Record(t.String(), t.String())
            ))
          })
        )),
        404: ErrorSchema,
        501: ErrorSchema,
        500: ErrorSchema
      }
    });
}

/**
 * Get native name for a language
 */
function getNativeName(code: SupportedLanguage): string {
  const nativeNames: Record<SupportedLanguage, string> = {
    en: 'English',
    af: 'Afrikaans',
    fr: 'Français'
  };
  return nativeNames[code];
}