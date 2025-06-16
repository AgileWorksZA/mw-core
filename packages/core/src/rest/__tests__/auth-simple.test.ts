/**
 * Simple auth test to verify imports work
 */

import { describe, it, expect } from 'bun:test';
import { createBasicAuth } from '../auth';

describe('Auth - Simple Test', () => {
  it('should create basic auth header', () => {
    const auth = createBasicAuth('user', 'pass');
    expect(auth).toStartWith('Basic ');
    expect(auth).toBe('Basic ' + Buffer.from('user:pass').toString('base64'));
  });
});