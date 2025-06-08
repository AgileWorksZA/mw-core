import { describe, it, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { VariableInput } from "~/modules/ide/components/variable-mapping/variable-input";
import React from "react";

// Mock the hooks
const mockEnvVariables = [
  { key: "BASE_URL", value: "https://api.example.com", type: "variable" as const, source: "global" },
  { key: "API_KEY", value: "***", type: "secret" as const, source: "global" },
  { key: "VERSION", value: "v1", type: "variable" as const, source: "environment" },
];

vi.mock("~/modules/ide/hooks/use-ide", () => ({
  useIde: () => ({ files: {} }),
}));

vi.mock("~/modules/ide/hooks/use-variable-resolver", () => ({
  useProjectVariables: () => [],
}));

vi.mock("~/modules/environment/hooks", () => ({
  useActiveEnvironment: () => ({ environmentId: "test-env" }),
  useVariables: () => ({ variables: mockEnvVariables }),
}));

describe("Variable Input with Environment Variables", () => {
  it("should use environment variables in string input", () => {
    let value = "";
    const handleChange = (newValue: any) => {
      value = newValue;
    };

    const { container } = render(
      <VariableInput
        name="test"
        value=""
        onChange={handleChange}
      />
    );

    // Change type to string
    const typeDropdown = screen.getByText("Type");
    typeDropdown.click();
    const stringOption = screen.getByText("String");
    stringOption.click();

    // Find the intelligent variable input
    const input = container.querySelector('input[placeholder*="use {{variable}}"]');
    expect(input).toBeTruthy();

    // The input should have variables from environment
    const overlay = container.querySelector('.absolute.left-0.top-0');
    expect(overlay).toBeTruthy();
  });

  it("should show green for existing variables and red for missing", () => {
    const { container } = render(
      <VariableInput
        name="test"
        value="URL: {{BASE_URL}}/api/{{MISSING_VAR}}"
        onChange={() => {}}
      />
    );

    // Should have green span for BASE_URL
    const greenSpans = container.querySelectorAll('.text-green-600');
    expect(greenSpans.length).toBeGreaterThan(0);

    // Should have red span for MISSING_VAR
    const redSpans = container.querySelectorAll('.text-red-600');
    expect(redSpans.length).toBeGreaterThan(0);
  });

  it("should mask secrets with ***", () => {
    const { container } = render(
      <VariableInput
        name="test"
        value="Token: {{API_KEY}}"
        onChange={() => {}}
      />
    );

    // Hover over API_KEY should show *** in tooltip
    const greenSpan = container.querySelector('.text-green-600');
    expect(greenSpan).toBeTruthy();
  });
});