/**
 * Test key converter functions
 */

import { describe, expect, test } from "bun:test";
import {
  camelToPascalCase,
  fromCamelCase,
  pascalToCamelCase,
  toCamelCase,
} from "./key-converter";

describe("Key Converter", () => {
  test("toCamelCase converts PascalCase to camelCase", () => {
    expect(toCamelCase("CustomerName")).toBe("customerName");
    expect(toCamelCase("Code")).toBe("code");
    expect(toCamelCase("")).toBe("");
  });

  test("fromCamelCase converts camelCase to PascalCase", () => {
    expect(fromCamelCase("customerName")).toBe("CustomerName");
    expect(fromCamelCase("code")).toBe("Code");
    expect(fromCamelCase("")).toBe("");
  });
});
