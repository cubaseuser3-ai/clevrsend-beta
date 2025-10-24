/**
 * Retry Manager
 * Handles automatic retries for failed operations with exponential backoff
 */

export interface RetryOptions {
  maxRetries: number;
  initialDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  onRetry?: (attempt: number, maxRetries: number, error: Error) => void;
  onSuccess?: () => void;
  onFinalFailure?: (error: Error) => void;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
};

/**
 * Execute a function with automatic retries and exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const result = await fn();
      if (opts.onSuccess) {
        opts.onSuccess();
      }
      return result;
    } catch (error) {
      lastError = error as Error;

      if (attempt < opts.maxRetries) {
        const delay = Math.min(
          opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
          opts.maxDelay
        );

        if (opts.onRetry) {
          opts.onRetry(attempt + 1, opts.maxRetries, lastError);
        }

        console.log(`⏳ Retry attempt ${attempt + 1}/${opts.maxRetries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  if (opts.onFinalFailure) {
    opts.onFinalFailure(lastError!);
  }

  throw lastError!;
}

/**
 * Retry manager for QR-Connect operations
 */
export class QRConnectionRetryManager {
  private retryCount = 0;
  private maxRetries = 2;

  reset() {
    this.retryCount = 0;
  }

  canRetry(): boolean {
    return this.retryCount < this.maxRetries;
  }

  incrementRetry(): number {
    return ++this.retryCount;
  }

  getCurrentAttempt(): number {
    return this.retryCount;
  }

  getMaxRetries(): number {
    return this.maxRetries;
  }
}

/**
 * Retry manager for File Transfer operations
 */
export class FileTransferRetryManager {
  private fileRetries = new Map<string, number>();
  private maxRetries = 2;

  reset(fileId?: string) {
    if (fileId) {
      this.fileRetries.delete(fileId);
    } else {
      this.fileRetries.clear();
    }
  }

  canRetry(fileId: string): boolean {
    const retries = this.fileRetries.get(fileId) || 0;
    return retries < this.maxRetries;
  }

  incrementRetry(fileId: string): number {
    const retries = (this.fileRetries.get(fileId) || 0) + 1;
    this.fileRetries.set(fileId, retries);
    return retries;
  }

  getCurrentAttempt(fileId: string): number {
    return this.fileRetries.get(fileId) || 0;
  }

  getMaxRetries(): number {
    return this.maxRetries;
  }
}
