import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// INCORRECT: Using z.object() - This creates a ZodObject
const incorrectSchema = z.object({
  operation: z.string().describe("Operation to perform"),
  value: z.number().optional().describe("Optional value"),
});

// CORRECT: Using raw shape object - This is what MCP SDK expects
const correctSchema = {
  operation: z.string().describe("Operation to perform"),
  value: z.number().optional().describe("Optional value"),
};

// Example of how tools should be registered
export function registerToolCorrectly(server: McpServer) {
  // This is the CORRECT way - passing the raw shape
  server.tool(
    "example_tool",
    "Example tool showing correct registration",
    correctSchema, // Pass the raw shape, not z.object()
    async (params) => {
      // params will be typed correctly as { operation: string; value?: number }
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ success: true, params }, null, 2)
        }]
      };
    }
  );
}

// This is what's currently being done (INCORRECT)
export function registerToolIncorrectly(server: McpServer) {
  // @ts-expect-error - This will cause a TypeScript error
  server.tool(
    "example_tool_wrong",
    "Example tool showing incorrect registration",
    incorrectSchema, // This is wrong - passing ZodObject instead of raw shape
    async (params) => {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ success: true, params }, null, 2)
        }]
      };
    }
  );
}

// Alternative: If you want to use z.object() for validation elsewhere
const schemaObject = z.object({
  operation: z.string().describe("Operation to perform"),
  value: z.number().optional().describe("Optional value"),
});

// You can extract the shape from it
type SchemaShape = z.infer<typeof schemaObject>;
const extractedShape = schemaObject.shape; // This gets the raw shape

export function registerToolWithExtractedShape(server: McpServer) {
  server.tool(
    "example_tool_extracted",
    "Example using extracted shape",
    extractedShape, // Use .shape property to get raw shape
    async (params) => {
      // You can still use the original schema for parsing if needed
      const validated = schemaObject.parse(params);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ success: true, validated }, null, 2)
        }]
      };
    }
  );
}