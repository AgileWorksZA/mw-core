import { test, expect, type Page } from "@playwright/test";

// Helper to wait for IDE to load
async function waitForIDE(page: Page) {
  await page.waitForSelector('[data-testid="ide-dashboard"]', { timeout: 10000 });
}

// Helper to navigate to variables section
async function navigateToVariables(page: Page) {
  await page.goto("http://localhost:5173/ide/variables");
  await waitForIDE(page);
}

test.describe("Variable Management E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("should add a global variable", async ({ page }) => {
    await navigateToVariables(page);
    
    // Click add variable button
    await page.click('[data-testid="add-variable-btn"]');
    
    // Fill in variable details
    await page.fill('[data-testid="variable-name-input"]', "test_base_url");
    await page.fill('[data-testid="variable-value-input"]', "https://api.example.com");
    await page.fill('[data-testid="variable-description-input"]', "Test API base URL");
    
    // Save variable
    await page.click('[data-testid="save-variable-btn"]');
    
    // Verify variable appears in list
    await expect(page.locator('text=test_base_url')).toBeVisible();
    await expect(page.locator('text=https://api.example.com')).toBeVisible();
  });

  test("should add environment-specific variable override", async ({ page }) => {
    await navigateToVariables(page);
    
    // First, ensure we have a global variable
    await page.click('[data-testid="add-variable-btn"]');
    await page.fill('[data-testid="variable-name-input"]', "api_endpoint");
    await page.fill('[data-testid="variable-value-input"]', "https://api.prod.com");
    await page.click('[data-testid="save-variable-btn"]');
    
    // Switch to development environment
    await page.click('[data-testid="environment-selector"]');
    await page.click('text=Development');
    
    // Override the variable
    await page.click('[data-testid="override-variable-api_endpoint"]');
    await page.fill('[data-testid="variable-override-input"]', "http://localhost:3000");
    await page.click('[data-testid="save-override-btn"]');
    
    // Verify override is shown
    await expect(page.locator('text=http://localhost:3000')).toBeVisible();
    await expect(page.locator('[data-testid="override-indicator"]')).toBeVisible();
  });

  test("should use variable picker in editor", async ({ page }) => {
    // Navigate to create new API configuration
    await page.goto("http://localhost:5173/ide/new/api-get");
    await waitForIDE(page);
    
    // Focus on URL input field
    await page.click('[data-testid="url-input"]');
    
    // Type variable syntax
    await page.type('[data-testid="url-input"]', "{{");
    
    // Wait for variable picker to appear
    await page.waitForSelector('[data-testid="variable-picker-dropdown"]');
    
    // Select a variable
    await page.click('[data-testid="variable-option-base_url"]');
    
    // Verify variable was inserted
    const urlValue = await page.inputValue('[data-testid="url-input"]');
    expect(urlValue).toBe("{{base_url}}");
  });

  test("should resolve variables in preview", async ({ page }) => {
    // Set up a variable first
    await navigateToVariables(page);
    await page.click('[data-testid="add-variable-btn"]');
    await page.fill('[data-testid="variable-name-input"]', "api_host");
    await page.fill('[data-testid="variable-value-input"]', "api.example.com");
    await page.click('[data-testid="save-variable-btn"]');
    
    // Navigate to API configuration
    await page.goto("http://localhost:5173/ide/new/api-get");
    await waitForIDE(page);
    
    // Enter URL with variable
    await page.fill('[data-testid="url-input"]', "https://{{api_host}}/users");
    
    // Click preview button
    await page.click('[data-testid="preview-btn"]');
    
    // Check resolved URL in preview
    await expect(page.locator('[data-testid="resolved-url"]')).toContainText("https://api.example.com/users");
  });

  test("should handle secrets securely", async ({ page }) => {
    await navigateToVariables(page);
    
    // Switch to secrets tab
    await page.click('[data-testid="secrets-tab"]');
    
    // Add a secret
    await page.click('[data-testid="add-secret-btn"]');
    await page.fill('[data-testid="secret-name-input"]', "api_key");
    await page.fill('[data-testid="secret-value-input"]', "sk-test-1234567890");
    await page.click('[data-testid="save-secret-btn"]');
    
    // Verify secret is masked
    await expect(page.locator('[data-testid="secret-value-api_key"]')).toContainText("••••••••");
    
    // Click reveal button
    await page.click('[data-testid="reveal-secret-api_key"]');
    
    // Verify secret is shown temporarily
    await expect(page.locator('[data-testid="secret-value-api_key"]')).toContainText("sk-test-1234567890");
    
    // Wait for auto-hide
    await page.waitForTimeout(3000);
    await expect(page.locator('[data-testid="secret-value-api_key"]')).toContainText("••••••••");
  });

  test("should validate circular references", async ({ page }) => {
    await navigateToVariables(page);
    
    // Create first variable
    await page.click('[data-testid="add-variable-btn"]');
    await page.fill('[data-testid="variable-name-input"]', "var_a");
    await page.fill('[data-testid="variable-value-input"]', "{{var_b}}");
    await page.click('[data-testid="save-variable-btn"]');
    
    // Create second variable with circular reference
    await page.click('[data-testid="add-variable-btn"]');
    await page.fill('[data-testid="variable-name-input"]', "var_b");
    await page.fill('[data-testid="variable-value-input"]', "{{var_a}}");
    await page.click('[data-testid="save-variable-btn"]');
    
    // Check for circular reference warning
    await expect(page.locator('[data-testid="circular-reference-warning"]')).toBeVisible();
    await expect(page.locator('text=Circular reference detected')).toBeVisible();
  });

  test("should export and import variables", async ({ page }) => {
    await navigateToVariables(page);
    
    // Add some variables
    await page.click('[data-testid="add-variable-btn"]');
    await page.fill('[data-testid="variable-name-input"]', "export_test");
    await page.fill('[data-testid="variable-value-input"]', "test_value");
    await page.click('[data-testid="save-variable-btn"]');
    
    // Export variables
    await page.click('[data-testid="export-variables-btn"]');
    
    // Wait for download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="confirm-export-btn"]')
    ]);
    
    // Verify download
    expect(download.suggestedFilename()).toContain("variables");
    expect(download.suggestedFilename()).toContain(".json");
  });

  test("should handle variable deletion with confirmation", async ({ page }) => {
    await navigateToVariables(page);
    
    // Add a variable
    await page.click('[data-testid="add-variable-btn"]');
    await page.fill('[data-testid="variable-name-input"]', "to_delete");
    await page.fill('[data-testid="variable-value-input"]', "delete_me");
    await page.click('[data-testid="save-variable-btn"]');
    
    // Delete the variable
    await page.click('[data-testid="delete-variable-to_delete"]');
    
    // Confirm deletion
    await expect(page.locator('text=Are you sure you want to delete')).toBeVisible();
    await page.click('[data-testid="confirm-delete-btn"]');
    
    // Verify variable is gone
    await expect(page.locator('text=to_delete')).not.toBeVisible();
  });

  test("should search and filter variables", async ({ page }) => {
    await navigateToVariables(page);
    
    // Add multiple variables
    const variables = [
      { name: "api_base_url", value: "https://api.example.com" },
      { name: "api_key", value: "test-key" },
      { name: "db_host", value: "localhost" },
      { name: "db_port", value: "5432" }
    ];
    
    for (const variable of variables) {
      await page.click('[data-testid="add-variable-btn"]');
      await page.fill('[data-testid="variable-name-input"]', variable.name);
      await page.fill('[data-testid="variable-value-input"]', variable.value);
      await page.click('[data-testid="save-variable-btn"]');
    }
    
    // Search for API variables
    await page.fill('[data-testid="variable-search-input"]', "api");
    
    // Verify filtered results
    await expect(page.locator('text=api_base_url')).toBeVisible();
    await expect(page.locator('text=api_key')).toBeVisible();
    await expect(page.locator('text=db_host')).not.toBeVisible();
    await expect(page.locator('text=db_port')).not.toBeVisible();
  });
});

test.describe("Variable Resolution in Different Contexts", () => {
  test("should resolve variables in OpenAPI spec", async ({ page }) => {
    // Set up base URL variable
    await navigateToVariables(page);
    await page.click('[data-testid="add-variable-btn"]');
    await page.fill('[data-testid="variable-name-input"]', "api_base");
    await page.fill('[data-testid="variable-value-input"]', "https://api.example.com");
    await page.click('[data-testid="save-variable-btn"]');
    
    // Navigate to OpenAPI editor
    await page.goto("http://localhost:5173/ide/new/openapi");
    await waitForIDE(page);
    
    // Enter OpenAPI spec with variable
    const spec = `{
      "openapi": "3.0.0",
      "servers": [{
        "url": "{{api_base}}/v1"
      }]
    }`;
    
    await page.fill('[data-testid="openapi-editor"]', spec);
    
    // Preview the spec
    await page.click('[data-testid="preview-openapi-btn"]');
    
    // Check resolved server URL
    await expect(page.locator('[data-testid="server-url"]')).toContainText("https://api.example.com/v1");
  });

  test("should handle environment switching with variable resolution", async ({ page }) => {
    await navigateToVariables(page);
    
    // Set up global variable
    await page.click('[data-testid="add-variable-btn"]');
    await page.fill('[data-testid="variable-name-input"]', "env_url");
    await page.fill('[data-testid="variable-value-input"]', "https://global.example.com");
    await page.click('[data-testid="save-variable-btn"]');
    
    // Create development environment
    await page.click('[data-testid="environment-selector"]');
    await page.click('[data-testid="create-environment-btn"]');
    await page.fill('[data-testid="environment-name-input"]', "Development");
    await page.click('[data-testid="save-environment-btn"]');
    
    // Override variable in development
    await page.click('[data-testid="override-variable-env_url"]');
    await page.fill('[data-testid="variable-override-input"]', "http://localhost:3000");
    await page.click('[data-testid="save-override-btn"]');
    
    // Test resolution in different environments
    await page.goto("http://localhost:5173/ide/new/api-get");
    await page.fill('[data-testid="url-input"]', "{{env_url}}/api");
    
    // Check development resolution
    await page.click('[data-testid="preview-btn"]');
    await expect(page.locator('[data-testid="resolved-url"]')).toContainText("http://localhost:3000/api");
    
    // Switch to global environment
    await page.click('[data-testid="environment-selector"]');
    await page.click('text=Global');
    
    // Check global resolution
    await page.click('[data-testid="preview-btn"]');
    await expect(page.locator('[data-testid="resolved-url"]')).toContainText("https://global.example.com/api");
  });
});