#!/usr/bin/env bun

import { $ } from "bun";

// Change to core package directory
process.chdir("packages/core");

// Run the simple auth test
const result = await $`bun test src/rest/__tests__/auth-simple.test.ts`.text();
console.log(result);