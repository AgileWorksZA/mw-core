#!/usr/bin/env bun

// Simple test to verify our test setup works

import { describe, it, expect } from 'bun:test';

describe('Basic Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
  
  it('should work with async', async () => {
    const result = await Promise.resolve('hello');
    expect(result).toBe('hello');
  });
});