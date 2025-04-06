/**
 * System Labels interface
 * Contains typings for the System Labels feature
 */

/**
 * Table labels - Record of field names to display labels
 */
export interface TableLabels {
  [fieldName: string]: string;
}

/**
 * Languages supported for table labels
 */
export enum SupportedLanguages {
  French = "fr",
  German = "de",
  Spanish = "es",
  Italian = "it",
  Portuguese = "pt",
  Dutch = "nl",
  Swedish = "sv",
  Danish = "da",
  Norwegian = "no",
  Finnish = "fi",
  Russian = "ru",
  Afrikaans = "af",
  Arabic = "ar",
}

/**
 * Response from the getTableLabels endpoint
 */
export interface TableLabelsResponse {
  tableName: string;
  language: string;
  labels: TableLabels;
}

/**
 * Response from the generateAllLabels endpoint
 */
export interface GenerateAllLabelsResponse {
  [tableName: string]: number;
}
