/**
 * Test isolation utilities for aggressive cleanup between tests
 */

import * as fs from "fs/promises";
import * as path from "path";

/**
 * Global test state that needs to be cleaned up
 */
interface GlobalTestState {
  tempDirs: Set<string>;
  mockFunctions: Map<string, any>;
  globalProperties: Map<string, any>;
  timers: Set<NodeJS.Timeout>;
  intervals: Set<NodeJS.Timeout>;
}

const globalTestState: GlobalTestState = {
  tempDirs: new Set(),
  mockFunctions: new Map(),
  globalProperties: new Map(),
  timers: new Set(),
  intervals: new Set(),
};

/**
 * Register a temporary directory for cleanup
 */
export function registerTempDir(dir: string) {
  globalTestState.tempDirs.add(dir);
}

/**
 * Register a timer for cleanup
 */
export function registerTimer(timer: NodeJS.Timeout) {
  globalTestState.timers.add(timer);
}

/**
 * Register an interval for cleanup
 */
export function registerInterval(interval: NodeJS.Timeout) {
  globalTestState.intervals.add(interval);
}

/**
 * Mock a global function and register for restoration
 */
export function mockGlobalFunction(name: string, mockImplementation: any) {
  if (!globalTestState.mockFunctions.has(name)) {
    globalTestState.mockFunctions.set(name, (global as any)[name]);
  }
  (global as any)[name] = mockImplementation;
}

/**
 * Set a global property and register for restoration
 */
export function setGlobalProperty(name: string, value: any) {
  if (!globalTestState.globalProperties.has(name)) {
    globalTestState.globalProperties.set(name, (global as any)[name]);
  }
  (global as any)[name] = value;
}

/**
 * Aggressive cleanup of all test state
 */
export async function aggressiveCleanup() {
  // Clean up temporary directories
  for (const dir of globalTestState.tempDirs) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch (error) {
      // Ignore errors - directory might not exist
    }
  }
  globalTestState.tempDirs.clear();

  // Clear all timers
  for (const timer of globalTestState.timers) {
    clearTimeout(timer);
  }
  globalTestState.timers.clear();

  // Clear all intervals
  for (const interval of globalTestState.intervals) {
    clearInterval(interval);
  }
  globalTestState.intervals.clear();

  // Restore global functions
  for (const [name, originalValue] of globalTestState.mockFunctions) {
    if (originalValue !== undefined) {
      (global as any)[name] = originalValue;
    } else {
      delete (global as any)[name];
    }
  }
  globalTestState.mockFunctions.clear();

  // Restore global properties
  for (const [name, originalValue] of globalTestState.globalProperties) {
    if (originalValue !== undefined) {
      (global as any)[name] = originalValue;
    } else {
      delete (global as any)[name];
    }
  }
  globalTestState.globalProperties.clear();

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  // Clear require cache for modules we might have modified
  const modulePatterns = [
    /\/modules\/ide\//,
    /\/modules\/environment\//,
    /\/modules\/storage\//,
    /test-utils/,
    /fixtures/,
  ];

  const keysToDelete = Object.keys(require.cache).filter(key =>
    modulePatterns.some(pattern => pattern.test(key))
  );

  for (const key of keysToDelete) {
    delete require.cache[key];
  }

  // Wait a tick to ensure all async operations complete
  await new Promise(resolve => setImmediate(resolve));
}

/**
 * Create a completely isolated test environment
 */
export function createIsolatedTestEnvironment() {
  // Create unique temp directory for this test
  const testId = Math.random().toString(36).substring(2, 15);
  const tempDir = path.join(process.cwd(), "test-tmp", `isolated-${testId}`);
  registerTempDir(tempDir);

  return {
    tempDir,
    testId,
    cleanup: aggressiveCleanup,
  };
}

/**
 * Deep clone object to prevent shared references
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (obj instanceof Set) {
    return new Set([...obj].map(item => deepClone(item))) as T;
  }

  if (obj instanceof Map) {
    return new Map([...obj].map(([key, value]) => [deepClone(key), deepClone(value)])) as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

/**
 * Safe setTimeout that registers for cleanup
 */
export function safeSetTimeout(callback: () => void, delay: number): NodeJS.Timeout {
  const timer = setTimeout(callback, delay);
  registerTimer(timer);
  return timer;
}

/**
 * Safe setInterval that registers for cleanup
 */
export function safeSetInterval(callback: () => void, delay: number): NodeJS.Timeout {
  const interval = setInterval(callback, delay);
  registerInterval(interval);
  return interval;
}

/**
 * Memory usage diagnostics
 */
export function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    rss: Math.round(usage.rss / 1024 / 1024), // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
    external: Math.round(usage.external / 1024 / 1024), // MB
  };
}

/**
 * Reset all module singletons and caches
 */
export function resetModuleSingletons() {
  // Clear any module-level caches or singletons
  // This is module-specific and would need to be customized
  
  // Example: Reset IDE module registry if it exists
  try {
    const ideModule = require("~/modules/ide/adapter/register");
    if (ideModule && ideModule.resetRegistry) {
      ideModule.resetRegistry();
    }
  } catch {
    // Module might not exist or have reset function
  }

  // Clear environment state
  try {
    const envModule = require("~/modules/environment/store");
    if (envModule && envModule.resetStore) {
      envModule.resetStore();
    }
  } catch {
    // Module might not exist or have reset function
  }
}