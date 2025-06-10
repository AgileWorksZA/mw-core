import { describe, it, expect } from 'bun:test';
import type { Result, DeepPartial } from '../../src/types/common';

describe('Common Types', () => {
  describe('Result type', () => {
    it('should handle success result', () => {
      const result: Result<string> = {
        success: true,
        data: 'test'
      };
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test');
      }
    });

    it('should handle error result', () => {
      const result: Result<string> = {
        success: false,
        error: new Error('Test error')
      };
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Test error');
      }
    });
  });

  describe('DeepPartial type', () => {
    interface TestObject {
      name: string;
      nested: {
        value: number;
        deep: {
          flag: boolean;
        };
      };
    }

    it('should allow partial nested objects', () => {
      const partial: DeepPartial<TestObject> = {
        nested: {
          deep: {
            flag: true
          }
        }
      };

      expect(partial.nested?.deep?.flag).toBe(true);
    });
  });
});