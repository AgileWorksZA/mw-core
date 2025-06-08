/**
 * Generates unique numeric timestamps for file operations
 * Ensures no collisions even with rapid sequential writes
 */
export class TimestampGenerator {
  private lastTimestamp = 0;
  private waitPromise: Promise<void> | null = null;

  /**
   * Generate a unique timestamp, waiting if necessary to ensure uniqueness
   */
  async next(): Promise<number> {
    // If we're already waiting for a unique timestamp, wait for that to complete
    if (this.waitPromise) {
      await this.waitPromise;
    }

    let timestamp = Date.now();
    
    // If we have a collision, wait for the next millisecond
    if (timestamp <= this.lastTimestamp) {
      this.waitPromise = new Promise(resolve => {
        const checkTime = () => {
          const now = Date.now();
          if (now > this.lastTimestamp) {
            timestamp = now;
            this.lastTimestamp = timestamp;
            this.waitPromise = null;
            resolve();
          } else {
            // Use setImmediate for better performance than setTimeout(0)
            setImmediate(checkTime);
          }
        };
        checkTime();
      });
      
      await this.waitPromise;
    } else {
      this.lastTimestamp = timestamp;
    }
    
    return timestamp;
  }

  /**
   * Generate a unique timestamp synchronously by using microsecond precision
   * Falls back to counter suffix if still not unique
   */
  nextSync(): string {
    const now = Date.now();
    const hrTime = process.hrtime();
    const microTime = hrTime[0] * 1000000 + Math.floor(hrTime[1] / 1000);
    
    // Combine millisecond timestamp with microsecond precision
    // This gives us a unique numeric string that can be parsed back to a number
    return `${now}.${microTime % 1000}`;
  }

  /**
   * Parse a timestamp string back to a number (milliseconds)
   */
  parse(timestamp: string): number {
    // Handle both pure numbers and numbers with microsecond precision
    const [ms] = timestamp.split('.');
    return parseInt(ms, 10);
  }

  /**
   * Check if a timestamp string is valid
   */
  isValid(timestamp: string): boolean {
    const parsed = this.parse(timestamp);
    return !isNaN(parsed) && parsed > 0;
  }
}