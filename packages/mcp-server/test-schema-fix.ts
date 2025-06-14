#!/usr/bin/env bun

/**
 * Test script to verify the schema registration issue
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Test server
const server = new McpServer({
  name: "test-server",
  version: "1.0.0",
});

// Test 1: Incorrect way (current)
try {
  const incorrectSchema = z.object({
    test: z.string().describe("Test parameter"),
  });
  
  // @ts-expect-error - This should cause a TypeScript error
  server.tool("test_incorrect", "Test with z.object", incorrectSchema, async () => {
    return { content: [{ type: "text", text: "test" }] };
  });
  
  console.log("❌ Test 1 (incorrect): TypeScript should have caught this error!");
} catch (error) {
  console.log("✅ Test 1 (incorrect): Failed as expected:", error.message);
}

// Test 2: Correct way (raw shape)
try {
  const correctShape = {
    test: z.string().describe("Test parameter"),
  };
  
  server.tool("test_correct", "Test with raw shape", correctShape, async (params) => {
    return { content: [{ type: "text", text: JSON.stringify(params) }] };
  });
  
  console.log("✅ Test 2 (correct): Tool registered successfully with raw shape");
} catch (error) {
  console.log("❌ Test 2 (correct): Unexpected error:", error.message);
}

// Test 3: Using .shape property
try {
  const schema = z.object({
    test: z.string().describe("Test parameter"),
  });
  
  server.tool("test_shape", "Test with .shape", schema.shape, async (params) => {
    return { content: [{ type: "text", text: JSON.stringify(params) }] };
  });
  
  console.log("✅ Test 3 (.shape): Tool registered successfully with .shape property");
} catch (error) {
  console.log("❌ Test 3 (.shape): Unexpected error:", error.message);
}

// Check registered tools
console.log("\nRegistered tools:", server["_registeredTools"]);

// Type checking demonstration
type ToolSchema = Parameters<typeof server.tool>[2];
const testShape = { test: z.string() };
const testObject = z.object({ test: z.string() });

// This should work
const validSchema: ToolSchema = testShape;
console.log("✅ Raw shape is valid ToolSchema");

// This should not work (TypeScript error)
// @ts-expect-error
const invalidSchema: ToolSchema = testObject;
console.log("❌ z.object() result is not valid ToolSchema (TypeScript error expected)");