/**
 * Test helper utilities
 */

import { MoneyWorksRESTClient } from '../rest/client';
import { MockMoneyWorksServer } from './mock-server';
import type { MoneyWorksConfig } from '../rest/types';

/**
 * Create a test client with mock server
 */
export async function createTestClient(
  config?: Partial<MoneyWorksConfig>,
  setupServer?: (server: MockMoneyWorksServer) => void
): Promise<{
  client: MoneyWorksRESTClient;
  server: MockMoneyWorksServer;
  cleanup: () => Promise<void>;
}> {
  const port = 9595 + Math.floor(Math.random() * 1000); // Random port to avoid conflicts
  const server = new MockMoneyWorksServer(port);
  
  // Allow custom server setup
  if (setupServer) {
    setupServer(server);
  }
  
  await server.start();
  
  const testConfig: MoneyWorksConfig = {
    host: 'localhost',
    port,
    username: 'test',
    password: 'test123',
    dataFile: 'TestFile.mwd7',
    ...config,
  };
  
  const client = new MoneyWorksRESTClient(testConfig);
  
  const cleanup = async () => {
    await server.stop();
  };
  
  return { client, server, cleanup };
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}

/**
 * Create a spy function that tracks calls
 */
export function createSpy<T extends (...args: any[]) => any>(
  implementation?: T
): T & {
  calls: Array<{ args: Parameters<T>; result: ReturnType<T> }>;
  calledWith: (...args: Parameters<T>) => boolean;
  reset: () => void;
} {
  const calls: Array<{ args: Parameters<T>; result: ReturnType<T> }> = [];
  
  const spy = ((...args: Parameters<T>) => {
    const result = implementation ? implementation(...args) : undefined;
    calls.push({ args, result });
    return result;
  }) as any;
  
  spy.calls = calls;
  spy.calledWith = (...args: Parameters<T>) => {
    return calls.some(call => 
      JSON.stringify(call.args) === JSON.stringify(args)
    );
  };
  spy.reset = () => {
    calls.length = 0;
  };
  
  return spy;
}

/**
 * Compare objects ignoring specific fields
 */
export function compareObjects<T extends Record<string, any>>(
  actual: T,
  expected: T,
  ignoreFields: string[] = []
): boolean {
  const actualCopy = { ...actual };
  const expectedCopy = { ...expected };
  
  for (const field of ignoreFields) {
    delete actualCopy[field];
    delete expectedCopy[field];
  }
  
  return JSON.stringify(actualCopy) === JSON.stringify(expectedCopy);
}

/**
 * Generate random test data
 */
export const random = {
  /**
   * Random string
   */
  string(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Random number
   */
  number(min: number = 0, max: number = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Random decimal
   */
  decimal(min: number = 0, max: number = 1000, decimals: number = 2): number {
    const value = Math.random() * (max - min) + min;
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  /**
   * Random boolean
   */
  boolean(): boolean {
    return Math.random() < 0.5;
  },

  /**
   * Random date in MoneyWorks format
   */
  date(year: number = 2024): string {
    const month = random.number(1, 12);
    const day = random.number(1, 28); // Safe for all months
    return `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  },

  /**
   * Random item from array
   */
  pick<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    return array[Math.floor(Math.random() * array.length)]!;
  }
};

/**
 * Assertion helpers
 */
export const assert = {
  /**
   * Assert that a promise rejects with specific error
   */
  async rejects(
    promise: Promise<any>,
    expectedError?: string | RegExp | Error
  ): Promise<void> {
    let thrown = false;
    let actualError: any;
    
    try {
      await promise;
    } catch (error) {
      thrown = true;
      actualError = error;
    }
    
    if (!thrown) {
      throw new Error('Expected promise to reject, but it resolved');
    }
    
    if (expectedError) {
      const errorMessage = actualError?.message || String(actualError);
      
      if (typeof expectedError === 'string') {
        if (!errorMessage.includes(expectedError)) {
          throw new Error(`Expected error to contain "${expectedError}" but got "${errorMessage}"`);
        }
      } else if (expectedError instanceof RegExp) {
        if (!expectedError.test(errorMessage)) {
          throw new Error(`Expected error to match ${expectedError} but got "${errorMessage}"`);
        }
      } else if (expectedError instanceof Error) {
        if (errorMessage !== expectedError.message) {
          throw new Error(`Expected error message "${expectedError.message}" but got "${errorMessage}"`);
        }
      }
    }
  },

  /**
   * Assert that a value matches a schema shape
   */
  matchesShape<T>(actual: any, shape: T): void {
    for (const key in shape) {
      if (!(key in actual)) {
        throw new Error(`Expected property "${key}" to exist`);
      }
      if (typeof shape[key] === 'object' && shape[key] !== null) {
        assert.matchesShape(actual[key], shape[key]);
      }
    }
  },

  /**
   * Assert array contains items matching predicate
   */
  arrayContains<T>(
    array: T[],
    predicate: (item: T) => boolean,
    count?: number
  ): void {
    const matches = array.filter(predicate);
    if (count !== undefined) {
      if (matches.length !== count) {
        throw new Error(`Expected ${count} matches but found ${matches.length}`);
      }
    } else {
      if (matches.length === 0) {
        throw new Error('Expected at least one match but found none');
      }
    }
  }
};

/**
 * Performance testing helpers
 */
export const performance = {
  /**
   * Measure execution time
   */
  async measure<T>(
    fn: () => T | Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return { result, duration };
  },

  /**
   * Run function multiple times and get stats
   */
  async benchmark<T>(
    fn: () => T | Promise<T>,
    iterations: number = 100
  ): Promise<{
    min: number;
    max: number;
    avg: number;
    median: number;
    results: T[];
  }> {
    const durations: number[] = [];
    const results: T[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const { result, duration } = await performance.measure(fn);
      durations.push(duration);
      results.push(result);
    }
    
    durations.sort((a, b) => a - b);
    
    return {
      min: durations[0] ?? 0,
      max: durations[durations.length - 1] ?? 0,
      avg: durations.length > 0 ? durations.reduce((a, b) => a + b) / durations.length : 0,
      median: durations[Math.floor(durations.length / 2)] ?? 0,
      results,
    };
  }
};