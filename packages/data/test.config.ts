import type { TestConfig } from "bun:test";

export default {
	preload: ["./preload.ts"],
	timeout: 30000,
} satisfies TestConfig;
