import { faker } from '@faker-js/faker';

/**
 * Generates a human-readable slug-based ID using faker
 * 
 * @param prefix Optional prefix for the generated ID
 * @returns A unique slug-based ID with optional prefix
 */
export function generateSlugId(prefix?: string): string {
  // Generate a readable word combination (2-3 words)
  const words = [
    faker.word.adjective(),
    faker.word.noun(),
  ];
  
  // Add a random verb sometimes for more uniqueness
  if (Math.random() > 0.5) {
    words.unshift(faker.word.verb());
  }
  
  // Create a slug from the words
  const slug = words
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, ''); // Remove any special characters
  
  // Add a short random suffix for uniqueness
  const randomSuffix = faker.string.alphanumeric(4).toLowerCase();
  
  // Combine with optional prefix
  return prefix ? `${prefix}-${slug}-${randomSuffix}` : `${slug}-${randomSuffix}`;
}

/**
 * Generates a path-safe slug-based ID
 * 
 * @param seed Optional seed string to influence the generated ID
 * @returns A path-safe unique slug-based ID
 */
export function generatePathSafeId(seed?: string): string {
  // Use the seed to influence the faker instance if provided
  if (seed) {
    faker.seed(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  }
  
  const category = faker.commerce.department().toLowerCase();
  const item = faker.commerce.productName().toLowerCase();
  
  // Create a path-friendly slug - without folder structure
  const slug = item
    .replace(/[^a-z0-9]/g, '-') // Replace special chars with hyphens
    .replace(/-+/g, '-')        // Replace multiple hyphens with single one
    .replace(/^-|-$/g, '');     // Remove leading/trailing hyphens
  
  return slug;
}

/**
 * Generates a unique ID for a specific entity type
 * 
 * @param type The type of entity (e.g., 'document', 'schema', 'project')
 * @returns A unique ID appropriate for the entity type
 */
export function generateEntityId(type: string): string {
  switch (type.toLowerCase()) {
    case 'project':
      return generateSlugId('proj');
    case 'schema':
      return generateSlugId('schema');
    case 'document':
      return generateSlugId('doc');
    case 'artifact':
      return generateSlugId('art');
    default:
      // Use the type as prefix if not one of the common types
      return generateSlugId(type.substring(0, 4).toLowerCase());
  }
}