/**
 * Retry manager for handling failed sync operations
 */

import { SyncError } from "./errors";

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  onRetry?: (error: SyncError, attemptNumber: number) => void;
  shouldRetry?: (error: SyncError, attemptNumber: number) => boolean;
}

export class RetryManager {
  private readonly options: Required<RetryOptions>;

  constructor(options: RetryOptions = {}) {
    this.options = {
      maxRetries: options.maxRetries ?? 3,
      initialDelay: options.initialDelay ?? 1000,
      maxDelay: options.maxDelay ?? 30000,
      onRetry: options.onRetry ?? (() => {}),
      shouldRetry: options.shouldRetry ?? ((error, attempt) => 
        error.isRetryable() && attempt < this.options.maxRetries
      ),
    };
  }

  async execute<T>(
    operation: () => Promise<T>,
    context?: { documentType?: string; documentId?: string }
  ): Promise<T> {
    let lastError: SyncError | null = null;
    
    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = SyncError.fromError(error, context);
        
        if (!this.options.shouldRetry(lastError, attempt)) {
          throw lastError;
        }

        if (attempt < this.options.maxRetries) {
          this.options.onRetry(lastError, attempt);
          const delay = lastError.getRetryDelay(attempt);
          await this.delay(Math.min(delay, this.options.maxDelay));
        }
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}