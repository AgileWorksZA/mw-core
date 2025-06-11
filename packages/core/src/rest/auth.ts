/**
 * MoneyWorks Authentication Handler
 * 
 * Handles single and two-level authentication for MoneyWorks REST API.
 */

import type { MoneyWorksConfig, AuthHeaders } from './types';

/**
 * Build authentication headers for MoneyWorks REST API
 */
export function buildAuthHeaders(config: MoneyWorksConfig): AuthHeaders {
  const headers: AuthHeaders = {
    'Authorization': buildBasicAuth(config.username, config.password)
  };
  
  // Add folder-level authentication if provided
  if (config.folderName && config.folderPassword) {
    headers['Authorization-Folder'] = buildBasicAuth(
      config.folderName, 
      config.folderPassword
    );
  }
  
  return headers;
}

/**
 * Build Basic Authentication header value
 */
export function buildBasicAuth(username: string, password: string): string {
  const credentials = `${username}:${password}`;
  const encoded = btoa(credentials);
  return `Basic ${encoded}`;
}

/**
 * Build URL-encoded authentication for inline auth
 * Used in URL like: http://user:pass@server/REST/...
 */
export function buildInlineAuth(config: MoneyWorksConfig): string {
  const { username, password, folderName, folderPassword } = config;
  
  if (folderName && folderPassword) {
    // Two-level auth: folderUser:folderPass@server/REST/docUser:docPass@document
    return `${encodeURIComponent(folderName)}:${encodeURIComponent(folderPassword)}@`;
  }
  
  return '';
}

/**
 * Build document path with authentication
 */
export function buildDocumentPath(config: MoneyWorksConfig): string {
  const { username, password, dataFile } = config;
  
  // Format: username:password@document.moneyworks
  return `${encodeURIComponent(username)}:${encodeURIComponent(password)}@${dataFile}`;
}

/**
 * Build complete REST URL
 */
export function buildRESTUrl(
  config: MoneyWorksConfig,
  endpoint: string,
  params?: URLSearchParams
): string {
  const protocol = config.useSSL ? 'https' : 'http';
  const { host, port } = config;
  
  // Build base URL
  let url = `${protocol}://${host}:${port}/REST`;
  
  // Add document path
  url += `/${buildDocumentPath(config)}`;
  
  // Add endpoint
  url += endpoint;
  
  // Add query parameters
  if (params && params.toString()) {
    url += `?${params.toString()}`;
  }
  
  return url;
}

/**
 * Validate configuration
 */
export function validateConfig(config: MoneyWorksConfig): void {
  const required: (keyof MoneyWorksConfig)[] = [
    'host', 'port', 'dataFile', 'username', 'password'
  ];
  
  for (const field of required) {
    if (!config[field]) {
      throw new Error(`Missing required configuration field: ${field}`);
    }
  }
  
  // Validate port number
  if (config.port < 1 || config.port > 65535) {
    throw new Error(`Invalid port number: ${config.port}`);
  }
  
  // Validate data file extension
  if (!config.dataFile.endsWith('.moneyworks') && 
      !config.dataFile.endsWith('.mwd6') &&
      !config.dataFile.endsWith('.mwd7') &&
      !config.dataFile.endsWith('.mwd8') &&
      !config.dataFile.endsWith('.mwd9')) {
    throw new Error(`Invalid data file extension: ${config.dataFile}`);
  }
  
  // Validate folder auth completeness
  if ((config.folderName && !config.folderPassword) || 
      (!config.folderName && config.folderPassword)) {
    throw new Error('Both folderName and folderPassword must be provided for folder authentication');
  }
}

/**
 * Mask sensitive information in config for logging
 */
export function maskConfig(config: MoneyWorksConfig): Record<string, unknown> {
  return {
    host: config.host,
    port: config.port,
    dataFile: config.dataFile,
    username: config.username,
    password: '***',
    folderName: config.folderName,
    folderPassword: config.folderPassword ? '***' : undefined,
    useSSL: config.useSSL,
    timeout: config.timeout,
    debug: config.debug
  };
}

/**
 * Parse authentication error response
 */
export function parseAuthError(response: Response): string {
  const status = response.status;
  
  switch (status) {
    case 401:
      return 'Authentication failed - check username and password';
    case 403:
      return 'Access forbidden - check user permissions';
    case 404:
      return 'Document not found - check data file name';
    default:
      return `Authentication error: ${status} ${response.statusText}`;
  }
}