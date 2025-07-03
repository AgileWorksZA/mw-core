import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

export class CryptoService {
  private key: Buffer;
  
  constructor(masterKey: string, userId: string) {
    // Derive a user-specific key from master key and user ID
    const salt = Buffer.from(userId, 'utf8');
    this.key = scryptSync(masterKey, salt, KEY_LENGTH, { N: 16384, r: 8, p: 1 });
  }
  
  /**
   * Encrypt a string value
   * Returns base64 encoded string containing: IV + authTag + encrypted data
   */
  encrypt(plaintext: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    // Combine IV + authTag + encrypted data
    const combined = Buffer.concat([iv, authTag, encrypted]);
    
    return combined.toString('base64');
  }
  
  /**
   * Decrypt a string value
   * Expects base64 encoded string containing: IV + authTag + encrypted data
   */
  decrypt(encryptedData: string): string {
    const combined = Buffer.from(encryptedData, 'base64');
    
    // Extract components
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH + TAG_LENGTH);
    
    const decipher = createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  }
  
  /**
   * Encrypt an object (converts to JSON first)
   */
  encryptObject<T>(obj: T): string {
    return this.encrypt(JSON.stringify(obj));
  }
  
  /**
   * Decrypt an object (parses JSON after decryption)
   */
  decryptObject<T>(encryptedData: string): T {
    return JSON.parse(this.decrypt(encryptedData));
  }
}

/**
 * Create a crypto service instance for a specific user
 */
export function createCryptoService(userId: string): CryptoService {
  const masterKey = process.env.ENCRYPTION_KEY || process.env.CLERK_SECRET_KEY;
  
  if (!masterKey) {
    throw new Error("No encryption key found. Set ENCRYPTION_KEY or CLERK_SECRET_KEY");
  }
  
  return new CryptoService(masterKey, userId);
}