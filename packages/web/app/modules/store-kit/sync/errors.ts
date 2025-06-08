/**
 * Sync-specific error types and utilities
 */

export type SyncErrorType = 'network' | 'conflict' | 'validation' | 'storage' | 'unknown';

export interface SyncErrorDetails {
  type: SyncErrorType;
  message: string;
  retryable: boolean;
  retryAfter?: number; // milliseconds
  originalError?: Error;
  context?: {
    documentType?: string;
    documentId?: string;
    operation?: 'read' | 'write' | 'delete';
  };
}

export class SyncError extends Error {
  public readonly details: SyncErrorDetails;

  constructor(details: SyncErrorDetails) {
    super(details.message);
    this.name = 'SyncError';
    this.details = details;
  }

  static fromError(error: unknown, context?: SyncErrorDetails['context']): SyncError {
    if (error instanceof SyncError) {
      return error;
    }

    const details: SyncErrorDetails = {
      type: 'unknown',
      message: 'An unknown error occurred',
      retryable: false,
      context,
    };

    if (error instanceof Error) {
      details.message = error.message;
      details.originalError = error;

      // Analyze error to determine type and retryability
      if (error.message.includes('fetch') || error.message.includes('network')) {
        details.type = 'network';
        details.retryable = true;
      } else if (error.message.includes('conflict')) {
        details.type = 'conflict';
        details.retryable = false;
      } else if (error.message.includes('validation')) {
        details.type = 'validation';
        details.retryable = false;
      } else if (error.message.includes('storage')) {
        details.type = 'storage';
        details.retryable = true;
      }
    }

    return new SyncError(details);
  }

  isRetryable(): boolean {
    return this.details.retryable;
  }

  getRetryDelay(attemptNumber: number): number {
    if (this.details.retryAfter) {
      return this.details.retryAfter;
    }

    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, attemptNumber), maxDelay);
    const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
    
    return Math.floor(exponentialDelay + jitter);
  }
}