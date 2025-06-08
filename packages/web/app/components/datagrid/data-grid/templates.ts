import type { VisibilityState } from "@tanstack/react-table";

// --- Local Storage Functions ---
export type StoredColumnState = {
  visibility: VisibilityState;
  order: string[];
  lastUsed?: number; // Timestamp when this template was last used
};
// Extended storage for column templates
export type StoredTemplates = {
  [templateName: string]: StoredColumnState;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  activeTemplate?: string;
};

// Save current column state
export function saveColumnState(id: string, state: StoredColumnState): void {
  try {
    localStorage.setItem(`dataGrid-${id}`, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save column state to localStorage:", error);
  }
}

// Load current column state
export function loadColumnState(id: string): StoredColumnState | null {
  try {
    // First check if there's an active template
    const templates = getColumnTemplates(id);
    const activeTemplate = templates.activeTemplate;

    // If there's an active template, use that
    if (activeTemplate && templates[activeTemplate]) {
      return templates[activeTemplate];
    }

    // Otherwise use the default state
    const stored = localStorage.getItem(`dataGrid-${id}`);
    if (stored) {
      return JSON.parse(stored) as StoredColumnState;
    }
  } catch (error) {
    console.error("Failed to load column state from localStorage:", error);
  }
  return null;
}

// Save column template
export function saveColumnTemplate(
  id: string,
  templateName: string,
  state: StoredColumnState,
): void {
  try {
    const templates = getColumnTemplates(id);

    // Add or update the template with current timestamp
    templates[templateName] = {
      ...state,
      lastUsed: Date.now(),
    };

    localStorage.setItem(`dataGrid-${id}-templates`, JSON.stringify(templates));
  } catch (error) {
    console.error("Failed to save column template to localStorage:", error);
  }
}

// Load column templates
export function getColumnTemplates(id: string): StoredTemplates {
  try {
    const stored = localStorage.getItem(`dataGrid-${id}-templates`);
    if (stored) {
      return JSON.parse(stored) as StoredTemplates;
    }
  } catch (error) {
    console.error("Failed to load column templates from localStorage:", error);
  }
  return {};
}

// Delete a column template
export function deleteColumnTemplate(id: string, templateName: string): void {
  try {
    const templates = getColumnTemplates(id);

    // Delete the template
    if (templates[templateName]) {
      delete templates[templateName];
    }

    // If active template was deleted, clear it
    if (templates.activeTemplate === templateName) {
      templates.activeTemplate = undefined;
    }

    localStorage.setItem(`dataGrid-${id}-templates`, JSON.stringify(templates));
  } catch (error) {
    console.error("Failed to delete column template from localStorage:", error);
  }
}
