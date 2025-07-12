/**
 * MoneyWorks NOW Client
 * 
 * Handles authentication and file listing for MoneyWorks NOW cloud service
 */

export interface MoneyWorksNOWConfig {
  username: string;
  password: string;
  baseUrl?: string; // Default to MoneyWorks NOW production URL
}

export interface MoneyWorksNOWFile {
  id: string;
  name: string;
  companyName: string;
  dataFile: string;
  host: string;
  port: number;
  lastModified?: string;
  size?: number;
  // Additional metadata from NOW
  metadata?: Record<string, any>;
}

export interface MoneyWorksNOWAuthResponse {
  token?: string;
  refreshToken?: string;
  files: MoneyWorksNOWFile[];
  expiresAt?: string;
}

// Internal types for API responses
interface NOWApiAuthResponse {
  token?: string;
  refreshToken?: string;
  files?: unknown[];
  databases?: unknown[];
  expiresAt?: string;
}

interface NOWApiFilesResponse {
  files?: unknown[];
  databases?: unknown[];
}

// Type guard functions
function isNOWApiAuthResponse(data: unknown): data is NOWApiAuthResponse {
  return typeof data === 'object' && data !== null;
}

function isNOWApiFilesResponse(data: unknown): data is NOWApiFilesResponse {
  return typeof data === 'object' && data !== null;
}

function isValidFileArray(arr: unknown): arr is any[] {
  return Array.isArray(arr);
}

export class MoneyWorksNOWClient {
  private config: MoneyWorksNOWConfig;
  private token?: string;
  private refreshToken?: string;

  constructor(config: MoneyWorksNOWConfig) {
    this.config = {
      baseUrl: 'https://moneyworksnow.com/api', // TODO: Update with actual NOW API URL
      ...config
    };
  }

  /**
   * Authenticate to MoneyWorks NOW and retrieve available files
   */
  async authenticate(): Promise<MoneyWorksNOWAuthResponse> {
    try {
      // TODO: Implement actual MoneyWorks NOW authentication
      // This is a placeholder implementation
      
      const response = await fetch(`${this.config.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.config.username,
          password: this.config.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data: unknown = await response.json();
      
      // Type guard and validate response
      if (!isNOWApiAuthResponse(data)) {
        throw new Error('Invalid authentication response format');
      }
      
      // Store tokens if provided
      this.token = data.token;
      this.refreshToken = data.refreshToken;

      // Get files array, defaulting to empty array if not present
      const filesArray = data.files || data.databases || [];
      if (!isValidFileArray(filesArray)) {
        throw new Error('Invalid files array in authentication response');
      }

      // Transform the response to our expected format
      return {
        token: data.token,
        refreshToken: data.refreshToken,
        files: this.transformFileList(filesArray),
        expiresAt: data.expiresAt,
      };
    } catch (error) {
      console.error('[MoneyWorksNOWClient] Authentication error:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshAuth(): Promise<MoneyWorksNOWAuthResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data: unknown = await response.json();
      
      // Type guard and validate response
      if (!isNOWApiAuthResponse(data)) {
        throw new Error('Invalid refresh token response format');
      }
      
      // Update tokens
      this.token = data.token;
      this.refreshToken = data.refreshToken;

      // Get files array, defaulting to empty array if not present
      const filesArray = data.files || data.databases || [];
      if (!isValidFileArray(filesArray)) {
        throw new Error('Invalid files array in refresh token response');
      }

      return {
        token: data.token,
        refreshToken: data.refreshToken,
        files: this.transformFileList(filesArray),
        expiresAt: data.expiresAt,
      };
    } catch (error) {
      console.error('[MoneyWorksNOWClient] Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get list of available files (requires authentication first)
   */
  async listFiles(): Promise<MoneyWorksNOWFile[]> {
    if (!this.token) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/files`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to list files: ${response.statusText}`);
      }

      const data: unknown = await response.json();
      
      // Type guard and validate response
      if (!isNOWApiFilesResponse(data)) {
        throw new Error('Invalid files list response format');
      }
      
      // Get files array, defaulting to empty array if not present
      const filesArray = data.files || data.databases || [];
      if (!isValidFileArray(filesArray)) {
        throw new Error('Invalid files array in list files response');
      }
      
      return this.transformFileList(filesArray);
    } catch (error) {
      console.error('[MoneyWorksNOWClient] List files error:', error);
      throw error;
    }
  }

  /**
   * Transform NOW file list to our standard format
   */
  private transformFileList(files: any[]): MoneyWorksNOWFile[] {
    return files.map(file => ({
      id: file.id || file.fileId || file.database_id,
      name: file.name || file.displayName || file.fileName,
      companyName: file.companyName || file.company || file.name,
      dataFile: file.dataFile || file.databasePath || file.path,
      host: file.host || file.server || file.hostname,
      port: file.port || 6710,
      lastModified: file.lastModified || file.modifiedDate,
      size: file.size,
      metadata: {
        ...file,
        // Remove fields we've already mapped
        id: undefined,
        name: undefined,
        companyName: undefined,
        dataFile: undefined,
        host: undefined,
        port: undefined,
        lastModified: undefined,
        size: undefined,
      },
    }));
  }

  /**
   * Get connection details for a specific file
   */
  async getFileConnectionDetails(fileId: string): Promise<MoneyWorksNOWFile | null> {
    const files = await this.listFiles();
    return files.find(f => f.id === fileId) || null;
  }
}