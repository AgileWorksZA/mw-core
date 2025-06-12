#!/usr/bin/env bun

// Test if schemas import correctly
import { 
  accountOperationSchema,
  ACCOUNT_OPERATION_EXAMPLES 
} from "@moneyworks/core/schemas";

console.log("Testing schema imports...");

// Test parsing a simple operation
const testOp = {
  operation: "list",
  limit: 10
};

try {
  const parsed = accountOperationSchema.parse(testOp);
  console.log("✓ Schema parsed successfully:", parsed);
} catch (error) {
  console.error("✗ Schema parsing failed:", error);
}

// Show examples
console.log("\nAvailable examples:");
console.log(Object.keys(ACCOUNT_OPERATION_EXAMPLES));