import type { Environment, IDEEnvironmentConfig } from "~/modules/environment/types";
import { deepClone } from "./test-isolation";

/**
 * Test utilities for IDE testing with proper isolation
 */

export function createMockEnvironment(overrides?: Partial<Environment>): Environment {
  const baseEnvironment: Environment = {
    id: `test-env-${Math.random().toString(36).substring(2)}`,
    name: "Test Environment",
    variables: {},
    secrets: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return deepClone({
    ...baseEnvironment,
    ...overrides,
  });
}

export function createMockIDEConfig(overrides?: Partial<IDEEnvironmentConfig>): IDEEnvironmentConfig {
  return deepClone({
    activeEnvironment: undefined,
    globals: {
      variables: {},
      secrets: {}
    },
    environments: {},
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0.0"
    },
    ...overrides,
  });
}

export function createVariableContext(
  globals: Record<string, string> = {},
  envVars: Record<string, string> = {},
  secrets: Record<string, string> = {}
) {
  return deepClone({
    global: {
      variables: globals,
      secrets: {},
    },
    environment: {
      variables: envVars,
      secrets: secrets,
    },
  });
}

export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}

export function mockFetch(responses: Record<string, any>) {
  const originalFetch = global.fetch;
  
  const mockImplementation = async (url: string | URL, init?: RequestInit) => {
    const urlString = url.toString();
    const response = deepClone(responses[urlString]);
    
    if (!response) {
      throw new Error(`No mock response for ${urlString}`);
    }
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  
  global.fetch = mockImplementation;
  
  return () => {
    global.fetch = originalFetch;
  };
}