import { test, expect, type Page } from "@playwright/test";

// Helper to create test files
async function createTestFile(
  page: Page,
  type: string,
  id: string,
  content: Record<string, any>
) {
  await page.goto(`http://localhost:5173/ide/new/${type}`);
  await page.waitForSelector('[data-testid="file-editor"]');
  
  // Set file ID
  await page.fill('[data-testid="file-id-input"]', id);
  
  // Set file content
  const contentString = JSON.stringify(content, null, 2);
  await page.fill('[data-testid="file-content-editor"]', contentString);
  
  // Save file
  await page.click('[data-testid="save-file-btn"]');
  await page.waitForSelector('[data-testid="save-success-indicator"]');
}

test.describe("Internal Types - Pointer Resolution E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("should resolve simple pointer in UI", async ({ page }) => {
    // Create source file with data
    await createTestFile(page, "json", "config-source", {
      apiUrl: "https://api.example.com",
      timeout: 5000,
      features: {
        cache: true,
        retry: false,
      },
    });

    // Create file that references the source
    await page.goto("http://localhost:5173/ide/new/api-get");
    await page.fill('[data-testid="file-id-input"]', "api-consumer");
    
    // Use pointer picker
    await page.click('[data-testid="url-input"]');
    await page.click('[data-testid="insert-pointer-btn"]');
    
    // Select source file
    await page.click('[data-testid="pointer-file-select"]');
    await page.click('[data-testid="file-option-config-source"]');
    
    // Select path
    await page.click('[data-testid="pointer-path-input"]');
    await page.type('[data-testid="pointer-path-input"]', "apiUrl");
    
    // Insert pointer
    await page.click('[data-testid="insert-pointer-confirm"]');
    
    // Preview should show resolved value
    await page.click('[data-testid="preview-btn"]');
    await expect(page.locator('[data-testid="resolved-url"]')).toContainText(
      "https://api.example.com"
    );
  });

  test("should resolve chained pointers", async ({ page }) => {
    // Create chain: file1 -> file2 -> file3
    await createTestFile(page, "json", "level3", {
      finalValue: "Success from level 3!",
      metadata: {
        version: "1.0.0",
      },
    });

    await createTestFile(page, "json", "level2", {
      nextLevel: {
        internal: "pointer",
        type: "json",
        id: "level3",
        path: "finalValue",
      },
    });

    await createTestFile(page, "json", "level1", {
      chainedValue: {
        internal: "pointer",
        type: "json",
        id: "level2",
        path: "nextLevel",
      },
    });

    // Create consumer that uses the chain
    await page.goto("http://localhost:5173/ide/new/json");
    await page.fill('[data-testid="file-id-input"]', "chain-consumer");
    
    const content = {
      result: {
        internal: "pointer",
        type: "json",
        id: "level1",
        path: "chainedValue",
      },
    };
    
    await page.fill(
      '[data-testid="file-content-editor"]',
      JSON.stringify(content, null, 2)
    );
    
    // Preview resolution
    await page.click('[data-testid="preview-btn"]');
    await page.waitForSelector('[data-testid="resolved-preview"]');
    
    // Should show the final resolved value
    await expect(page.locator('[data-testid="resolved-value-result"]')).toContainText(
      "Success from level 3!"
    );
  });

  test("should handle circular references gracefully", async ({ page }) => {
    // Create circular reference: A -> B -> A
    await createTestFile(page, "json", "circular-a", {
      value: {
        internal: "pointer",
        type: "json",
        id: "circular-b",
        path: "value",
      },
    });

    await createTestFile(page, "json", "circular-b", {
      value: {
        internal: "pointer",
        type: "json",
        id: "circular-a",
        path: "value",
      },
    });

    // Try to use the circular reference
    await page.goto("http://localhost:5173/ide/json/circular-a");
    
    // Should show circular reference warning
    await expect(page.locator('[data-testid="circular-reference-warning"]')).toBeVisible();
    await expect(page.locator('[data-testid="circular-reference-path"]')).toContainText(
      "circular-a → circular-b → circular-a"
    );
  });

  test("should resolve from-data references", async ({ page }) => {
    await page.goto("http://localhost:5173/ide/new/api-get");
    await page.fill('[data-testid="file-id-input"]', "from-data-test");
    
    // Set input variables
    await page.click('[data-testid="input-variables-tab"]');
    await page.fill('[data-testid="input-var-baseUrl"]', "https://api.test.com");
    await page.fill('[data-testid="input-var-apiKey"]', "test-key-123");
    
    // Set output to reference input
    await page.click('[data-testid="output-variables-tab"]');
    await page.click('[data-testid="add-output-var-btn"]');
    await page.fill('[data-testid="output-var-name"]', "configuredUrl");
    
    // Insert from-data reference
    await page.click('[data-testid="output-var-value"]');
    await page.click('[data-testid="insert-from-data-btn"]');
    await page.fill('[data-testid="from-data-path"]', "input.variables.baseUrl");
    await page.click('[data-testid="insert-from-data-confirm"]');
    
    // Save and preview
    await page.click('[data-testid="save-file-btn"]');
    await page.click('[data-testid="preview-btn"]');
    
    // Should show resolved from-data value
    await expect(page.locator('[data-testid="output-configuredUrl"]')).toContainText(
      "https://api.test.com"
    );
  });

  test("should use project variables and secrets", async ({ page }) => {
    // First set up project variables
    await page.goto("http://localhost:5173/ide/variables");
    
    // Add variable
    await page.click('[data-testid="add-variable-btn"]');
    await page.fill('[data-testid="variable-name-input"]', "API_VERSION");
    await page.fill('[data-testid="variable-value-input"]', "v2");
    await page.click('[data-testid="save-variable-btn"]');
    
    // Add secret
    await page.click('[data-testid="secrets-tab"]');
    await page.click('[data-testid="add-secret-btn"]');
    await page.fill('[data-testid="secret-name-input"]', "API_KEY");
    await page.fill('[data-testid="secret-value-input"]', "sk-secret-key-123");
    await page.click('[data-testid="save-secret-btn"]');
    
    // Create file using project variables
    await page.goto("http://localhost:5173/ide/new/api-get");
    await page.fill('[data-testid="file-id-input"]', "project-vars-test");
    
    // Use project variable picker
    await page.click('[data-testid="url-input"]');
    await page.type('[data-testid="url-input"]', "https://api.example.com/");
    await page.click('[data-testid="insert-project-var-btn"]');
    await page.click('[data-testid="project-var-API_VERSION"]');
    
    // Add header with secret
    await page.click('[data-testid="add-header-btn"]');
    await page.fill('[data-testid="header-name-0"]', "Authorization");
    await page.click('[data-testid="header-value-0"]');
    await page.type('[data-testid="header-value-0"]', "Bearer ");
    await page.click('[data-testid="insert-project-secret-btn"]');
    await page.click('[data-testid="project-secret-API_KEY"]');
    
    // Preview
    await page.click('[data-testid="preview-btn"]');
    
    // Check resolved values
    await expect(page.locator('[data-testid="resolved-url"]')).toContainText(
      "https://api.example.com/v2"
    );
    await expect(page.locator('[data-testid="resolved-header-Authorization"]')).toContainText(
      "Bearer sk-secret-key-123"
    );
  });

  test("should handle parameter placeholders", async ({ page }) => {
    await page.goto("http://localhost:5173/ide/new/api-get");
    await page.fill('[data-testid="file-id-input"]', "parameter-test");
    
    // Add URL with parameter
    await page.click('[data-testid="url-input"]');
    await page.type('[data-testid="url-input"]', "https://api.example.com/users/");
    
    // Insert parameter
    await page.click('[data-testid="insert-parameter-btn"]');
    await page.fill('[data-testid="parameter-name"]', "userId");
    await page.select('[data-testid="parameter-type"]', "string");
    await page.click('[data-testid="insert-parameter-confirm"]');
    
    // Add query parameter
    await page.click('[data-testid="add-query-param-btn"]');
    await page.fill('[data-testid="query-param-name-0"]', "includeDetails");
    await page.click('[data-testid="query-param-value-0"]');
    await page.click('[data-testid="insert-parameter-btn"]');
    await page.fill('[data-testid="parameter-name"]', "includeDetails");
    await page.select('[data-testid="parameter-type"]', "boolean");
    await page.click('[data-testid="insert-parameter-confirm"]');
    
    // Save
    await page.click('[data-testid="save-file-btn"]');
    
    // Preview should show parameter placeholders
    await page.click('[data-testid="preview-btn"]');
    await expect(page.locator('[data-testid="resolved-url"]')).toContainText(
      "https://api.example.com/users/{{parameter:userId}}"
    );
    await expect(page.locator('[data-testid="resolved-query-includeDetails"]')).toContainText(
      "{{parameter:includeDetails}}"
    );
    
    // Parameter input panel should appear
    await expect(page.locator('[data-testid="parameter-input-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="param-input-userId"]')).toBeVisible();
    await expect(page.locator('[data-testid="param-input-includeDetails"]')).toBeVisible();
  });

  test("should handle different output configurations", async ({ page }) => {
    // Test output: false
    await createTestFile(page, "json", "no-output", {
      internal: "This has no output",
    });
    
    await page.goto("http://localhost:5173/ide/json/no-output");
    await page.click('[data-testid="output-config-tab"]');
    await page.click('[data-testid="output-type-none"]');
    await page.click('[data-testid="save-file-btn"]');
    
    // Verify no output warning
    await expect(page.locator('[data-testid="no-output-warning"]')).toBeVisible();
    
    // Test output: true (input as output)
    await createTestFile(page, "json", "passthrough", {
      userName: "Alice",
      userId: 123,
    });
    
    await page.goto("http://localhost:5173/ide/json/passthrough");
    await page.click('[data-testid="output-config-tab"]');
    await page.click('[data-testid="output-type-passthrough"]');
    await page.click('[data-testid="save-file-btn"]');
    
    // Preview should show input as output
    await page.click('[data-testid="preview-btn"]');
    await expect(page.locator('[data-testid="output-preview"]')).toContainText("Alice");
    await expect(page.locator('[data-testid="output-preview"]')).toContainText("123");
  });

  test("should validate and show errors for invalid references", async ({ page }) => {
    await page.goto("http://localhost:5173/ide/new/json");
    await page.fill('[data-testid="file-id-input"]', "invalid-refs");
    
    // Try to reference non-existent file
    const content = {
      missingFile: {
        internal: "pointer",
        type: "json",
        id: "does-not-exist",
        path: "value",
      },
    };
    
    await page.fill(
      '[data-testid="file-content-editor"]',
      JSON.stringify(content, null, 2)
    );
    
    await page.click('[data-testid="validate-btn"]');
    
    // Should show validation error
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="validation-error"]')).toContainText(
      "File not found: does-not-exist"
    );
    
    // Try invalid path
    await createTestFile(page, "json", "valid-file", {
      data: { value: 123 },
    });
    
    const invalidPath = {
      invalidPath: {
        internal: "pointer",
        type: "json",
        id: "valid-file",
        path: "nonexistent.path.to.value",
      },
    };
    
    await page.fill(
      '[data-testid="file-content-editor"]',
      JSON.stringify(invalidPath, null, 2)
    );
    
    await page.click('[data-testid="validate-btn"]');
    
    // Should show path error
    await expect(page.locator('[data-testid="validation-error"]')).toContainText(
      "Path not found: nonexistent.path.to.value"
    );
  });
});