import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { VariableInput } from "~/components/ui/variable-input";
import React from "react";

describe("VariableInput Component", () => {
  const mockVariables = {
    base_url: "https://api.example.com",
    api_key: "secret-123",
    version: "v1",
  };

  describe("Variable Parsing", () => {
    it("should render plain text without highlighting", () => {
      const { container } = render(
        <VariableInput defaultValue="Plain text without variables" />
      );
      
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("Plain text without variables");
    });

    it("should identify and highlight variables with {{notation}}", () => {
      const { container } = render(
        <VariableInput 
          defaultValue="URL: {{base_url}}/api/{{version}}" 
          variables={mockVariables}
        />
      );
      
      // Check that the overlay contains highlighted spans
      const overlay = container.querySelector('[class*="pointer-events-none"]');
      expect(overlay).toBeTruthy();
      
      // Should have spans for variables
      const spans = overlay?.querySelectorAll('span');
      expect(spans?.length).toBeGreaterThan(0);
    });

    it("should show existing variables in green", () => {
      const { container } = render(
        <VariableInput 
          defaultValue="{{base_url}}" 
          variables={mockVariables}
        />
      );
      
      const variableSpan = container.querySelector('[class*="text-green"]');
      expect(variableSpan).toBeTruthy();
      expect(variableSpan?.textContent).toBe("{{base_url}}");
    });

    it("should show non-existing variables in red", () => {
      const { container } = render(
        <VariableInput 
          defaultValue="{{missing_variable}}" 
          variables={mockVariables}
        />
      );
      
      const variableSpan = container.querySelector('[class*="text-red"]');
      expect(variableSpan).toBeTruthy();
      expect(variableSpan?.textContent).toBe("{{missing_variable}}");
    });

    it("should show variables in blue when no variable context provided", () => {
      const { container } = render(
        <VariableInput defaultValue="{{any_variable}}" />
      );
      
      const variableSpan = container.querySelector('[class*="text-blue"]');
      expect(variableSpan).toBeTruthy();
      expect(variableSpan?.textContent).toBe("{{any_variable}}");
    });
  });

  describe("User Interaction", () => {
    it("should update value on input change", () => {
      let value = "";
      const handleChange = (newValue: string) => {
        value = newValue;
      };

      render(
        <VariableInput 
          value="" 
          onChange={handleChange}
          variables={mockVariables}
        />
      );
      
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "New {{base_url}}" } });
      
      expect(value).toBe("New {{base_url}}");
    });

    it("should handle variable clicks when onVariableClick is provided", () => {
      let clickedVar = "";
      const handleVariableClick = (variable: string) => {
        clickedVar = variable;
      };

      const { container } = render(
        <VariableInput 
          defaultValue="Click {{base_url}}" 
          variables={mockVariables}
          onVariableClick={handleVariableClick}
        />
      );
      
      const variableSpan = container.querySelector('[class*="text-green"]');
      expect(variableSpan).toBeTruthy();
      
      // Variable should be clickable
      expect(variableSpan?.className).toContain("cursor-pointer");
      
      fireEvent.click(variableSpan!);
      expect(clickedVar).toBe("base_url");
    });

    it("should handle multiple variables in one input", () => {
      const { container } = render(
        <VariableInput 
          defaultValue="Start {{base_url}}/{{version}}/{{missing}}/end" 
          variables={mockVariables}
        />
      );
      
      const greenSpans = container.querySelectorAll('[class*="text-green"]');
      const redSpans = container.querySelectorAll('[class*="text-red"]');
      
      expect(greenSpans.length).toBe(2); // base_url and version exist
      expect(redSpans.length).toBe(1); // missing doesn't exist
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty input", () => {
      const { container } = render(
        <VariableInput value="" variables={mockVariables} />
      );
      
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });

    it("should handle variables with spaces", () => {
      const { container } = render(
        <VariableInput 
          defaultValue="{{ base_url }}" 
          variables={mockVariables}
        />
      );
      
      const variableSpan = container.querySelector('[class*="text-green"]');
      expect(variableSpan).toBeTruthy();
      expect(variableSpan?.textContent).toBe("{{ base_url }}");
    });

    it("should handle incomplete variable syntax", () => {
      const { container } = render(
        <VariableInput 
          defaultValue="Incomplete {{variable and complete {{base_url}}" 
          variables={mockVariables}
        />
      );
      
      // Should only highlight the complete variable
      const greenSpans = container.querySelectorAll('[class*="text-green"]');
      expect(greenSpans.length).toBe(1);
      expect(greenSpans[0]?.textContent).toBe("{{base_url}}");
    });

    it("should handle nested braces correctly", () => {
      const { container } = render(
        <VariableInput 
          defaultValue="Nested {{{base_url}}} braces" 
          variables={mockVariables}
        />
      );
      
      // Should match the inner {{base_url}}
      const variableSpan = container.querySelector('[class*="text-green"]');
      expect(variableSpan?.textContent).toBe("{{base_url}}");
    });
  });

  describe("Scrolling Behavior", () => {
    it("should maintain overlay position during scroll", () => {
      const longText = "This is a very long text with {{base_url}} that will cause scrolling when the input is narrow enough to trigger horizontal scroll";
      
      const { container } = render(
        <VariableInput 
          defaultValue={longText}
          variables={mockVariables}
          style={{ width: "200px" }}
        />
      );
      
      const input = container.querySelector('input') as HTMLInputElement;
      const overlay = container.querySelector('[class*="pointer-events-none"]') as HTMLDivElement;
      
      expect(input).toBeTruthy();
      expect(overlay).toBeTruthy();
      
      // Initial scroll positions should match
      expect(input.scrollLeft).toBe(0);
      expect(overlay.scrollLeft).toBe(0);
    });
  });
});