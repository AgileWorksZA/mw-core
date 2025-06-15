/**
 * Tests for authentication
 */

import { describe, it, expect } from '@jest/globals';
import { 
  createBasicAuth, 
  createTwoLevelAuth, 
  validateConfig,
  maskPassword,
  AuthMode
} from '../auth';
import { fixtures } from '../../test-utils/fixtures';
import type { MoneyWorksConfig } from '../types';

describe('Authentication', () => {
  describe('validateConfig', () => {
    it('should validate correct config', () => {
      expect(() => validateConfig(fixtures.config.valid)).not.toThrow();
    });

    it('should validate config without password', () => {
      expect(() => validateConfig(fixtures.config.minimal)).not.toThrow();
    });

    it('should throw on missing host', () => {
      const config = { ...fixtures.config.valid };
      delete (config as any).host;
      
      expect(() => validateConfig(config))
        .toThrow('Missing required configuration field: host');
    });

    it('should throw on missing username', () => {
      const config = { ...fixtures.config.valid };
      delete (config as any).username;
      
      expect(() => validateConfig(config))
        .toThrow('Missing required configuration field: username');
    });

    it('should throw on invalid port', () => {
      const config = { ...fixtures.config.valid, port: 'invalid' as any };
      
      expect(() => validateConfig(config))
        .toThrow('Invalid port number');
    });

    it('should throw on port out of range', () => {
      expect(() => validateConfig({ ...fixtures.config.valid, port: 0 }))
        .toThrow('Invalid port number');
        
      expect(() => validateConfig({ ...fixtures.config.valid, port: 65536 }))
        .toThrow('Invalid port number');
    });

    it('should validate two-level auth config', () => {
      expect(() => validateConfig(fixtures.config.twoLevel)).not.toThrow();
    });

    it('should throw if folder password without folder', () => {
      const config = {
        ...fixtures.config.valid,
        folderPassword: 'test'
      };
      
      expect(() => validateConfig(config))
        .toThrow('Folder password provided without folder name');
    });
  });

  describe('createBasicAuth', () => {
    it('should create auth header with username and password', () => {
      const auth = createBasicAuth('user', 'pass');
      expect(auth).toBe('Basic ' + Buffer.from('user:pass').toString('base64'));
    });

    it('should handle empty password', () => {
      const auth = createBasicAuth('user', '');
      expect(auth).toBe('Basic ' + Buffer.from('user:').toString('base64'));
    });

    it('should handle undefined password', () => {
      const auth = createBasicAuth('user', undefined);
      expect(auth).toBe('Basic ' + Buffer.from('user:').toString('base64'));
    });

    it('should handle special characters', () => {
      const auth = createBasicAuth('user@domain', 'p@ss:word');
      const decoded = Buffer.from(auth.slice(6), 'base64').toString();
      expect(decoded).toBe('user@domain:p@ss:word');
    });

    it('should handle unicode characters', () => {
      const auth = createBasicAuth('用户', '密码');
      const decoded = Buffer.from(auth.slice(6), 'base64').toString();
      expect(decoded).toBe('用户:密码');
    });
  });

  describe('createTwoLevelAuth', () => {
    it('should create auth for folder and file', () => {
      const auth = createTwoLevelAuth('user', 'pass', 'folder', 'folderpass');
      
      // Should be Basic auth with "user[folder]:folderpass pass"
      const decoded = Buffer.from(auth.slice(6), 'base64').toString();
      expect(decoded).toBe('user[folder]:folderpass pass');
    });

    it('should handle empty passwords', () => {
      const auth = createTwoLevelAuth('user', '', 'folder', '');
      const decoded = Buffer.from(auth.slice(6), 'base64').toString();
      expect(decoded).toBe('user[folder]: ');
    });

    it('should handle special characters in folder name', () => {
      const auth = createTwoLevelAuth('user', 'pass', 'my[folder]', 'folderpass');
      const decoded = Buffer.from(auth.slice(6), 'base64').toString();
      expect(decoded).toBe('user[my[folder]]:folderpass pass');
    });
  });

  describe('maskPassword', () => {
    it('should mask password in basic auth', () => {
      const masked = maskPassword('Basic dXNlcjpwYXNzd29yZA==');
      expect(masked).toBe('Basic dXNlcjo='); // user:
    });

    it('should mask password in two-level auth', () => {
      const auth = createTwoLevelAuth('user', 'filepass', 'folder', 'folderpass');
      const masked = maskPassword(auth);
      
      const decoded = Buffer.from(masked.slice(6), 'base64').toString();
      expect(decoded).toMatch(/^user\[folder\]:/);
      expect(decoded).not.toContain('folderpass');
      expect(decoded).not.toContain('filepass');
    });

    it('should handle malformed auth headers', () => {
      expect(maskPassword('InvalidAuth')).toBe('InvalidAuth');
      expect(maskPassword('Basic invalid-base64')).toBe('Basic invalid-base64');
      expect(maskPassword('')).toBe('');
    });

    it('should handle auth without password', () => {
      const auth = 'Basic ' + Buffer.from('user').toString('base64');
      const masked = maskPassword(auth);
      expect(masked).toBe(auth); // No change if no colon
    });
  });

  describe('AuthMode detection', () => {
    it('should detect basic auth mode', () => {
      const config: MoneyWorksConfig = fixtures.config.valid;
      expect(config.dataFolder).toBeUndefined();
      expect(config.folderPassword).toBeUndefined();
    });

    it('should detect two-level auth mode', () => {
      const config: MoneyWorksConfig = fixtures.config.twoLevel;
      expect(config.dataFolder).toBeDefined();
      expect(config.folderPassword).toBeDefined();
    });

    it('should create appropriate auth header based on config', () => {
      // Basic auth
      const basicConfig = fixtures.config.valid;
      const basicAuth = createBasicAuth(basicConfig.username, basicConfig.password);
      expect(basicAuth).toContain('Basic');

      // Two-level auth
      const twoLevelConfig = fixtures.config.twoLevel;
      const twoLevelAuth = createTwoLevelAuth(
        twoLevelConfig.username,
        twoLevelConfig.password!,
        twoLevelConfig.dataFolder!,
        twoLevelConfig.folderPassword!
      );
      expect(twoLevelAuth).toContain('Basic');
      
      const decoded = Buffer.from(twoLevelAuth.slice(6), 'base64').toString();
      expect(decoded).toContain('[TestFolder]');
    });
  });
});