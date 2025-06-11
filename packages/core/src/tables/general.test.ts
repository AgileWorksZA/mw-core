/**
 * Test/Demo file for General table interface usage
 */

import type {
  AccountCategory,
  DepartmentClassification,
  General,
  GeneralCamel,
  Group,
} from "./general";
import {
  GeneralType,
  generalConverters,
  generalHelpers,
  generalTypeAssertions,
  generalTypeGuards,
} from "./general";

// Example 1: Creating different types of General entries
const accountCategory: General = {
  Code: "A_100",
  Description: "Current Assets",
  LastModifiedTime: "2025-06-11T10:00:00Z",
};

const deptClassification: General = {
  Code: "D_ADM",
  Description: "Administrative",
  LastModifiedTime: "2025-06-11T10:00:00Z",
};

const group: General = {
  Code: "G_001",
  Description: "Primary Group",
  LastModifiedTime: "2025-06-11T10:00:00Z",
};

// Example 2: Using type guards
console.log(
  "Is account category?",
  generalTypeGuards.isCategory(accountCategory),
); // true
console.log(
  "Is classification?",
  generalTypeGuards.isClassification(deptClassification),
); // true
console.log("Is group?", generalTypeGuards.isGroup(group)); // true

// Example 3: Converting to camelCase
const camelCategory = generalConverters.toCamelCase(accountCategory);
console.log("Camel case:", camelCategory);

// Example 4: Using helper functions
const newCategoryCode = generalHelpers.createCategoryCode("EXP");
console.log("New category code:", newCategoryCode); // A_EXP

const suffix = generalHelpers.getCodeSuffix("D_ADM");
console.log("Code suffix:", suffix); // ADM

// Example 5: Display labels
console.log("Display label:", generalHelpers.getDisplayLabel(accountCategory));
// Output: [Category] A_100 - Current Assets

// Example 6: Filtering arrays by type
const allGeneralEntries: General[] = [
  accountCategory,
  deptClassification,
  group,
];
const categories = generalHelpers.getCategories(allGeneralEntries);
const classifications = generalHelpers.getClassifications(allGeneralEntries);
const groups = generalHelpers.getGroups(allGeneralEntries);

console.log("Categories:", categories.length); // 1
console.log("Classifications:", classifications.length); // 1
console.log("Groups:", groups.length); // 1

// Example 7: Using type-specific interfaces
const typedCategory: AccountCategory = {
  Code: "A_200", // TypeScript ensures this starts with 'A_'
  Description: "Fixed Assets",
};

const typedClassification: DepartmentClassification = {
  Code: "D_SAL", // TypeScript ensures this starts with 'D_'
  Description: "Sales",
};

const typedGroup: Group = {
  Code: "G_002", // TypeScript ensures this starts with 'G_'
  Description: "Secondary Group",
};

// Example 8: Type assertions
try {
  generalTypeAssertions.assertCategory(accountCategory); // OK
  generalTypeAssertions.assertCategory(deptClassification); // Throws error
} catch (error) {
  console.error(
    "Assertion failed:",
    error instanceof Error ? error.message : String(error),
  );
}

// Example 9: Working with unknown data
function processGeneralEntry(entry: General) {
  const type = generalTypeGuards.getType(entry);

  switch (type) {
    case GeneralType.CATEGORY:
      console.log("Processing account category:", entry.Code);
      break;
    case GeneralType.CLASSIFICATION:
      console.log("Processing department classification:", entry.Code);
      break;
    case GeneralType.GROUP:
      console.log("Processing group:", entry.Code);
      break;
    default:
      console.log("Unknown general entry type");
  }
}

// Example 10: Batch operations
const newEntries: General[] = [
  { Code: generalHelpers.createCategoryCode("REV"), Description: "Revenue" },
  {
    Code: generalHelpers.createClassificationCode("FIN"),
    Description: "Finance",
  },
  {
    Code: generalHelpers.createGroupCode("003"),
    Description: "Tertiary Group",
  },
];

// Convert all to camelCase
const camelEntries = newEntries.map(generalConverters.toCamelCase);

// Get display labels for all
const labels = newEntries.map(generalHelpers.getDisplayLabel);
console.log("Labels:", labels);
