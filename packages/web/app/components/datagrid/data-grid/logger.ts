// Custom Logger for the application
// This is a singleton that provides logging functions and maintains a log history

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
}

// Type for log event handlers
type LogEventHandler = (logs: LogEntry[]) => void;

class Logger {
  private logs: LogEntry[] = [];
  private listeners: Set<LogEventHandler> = new Set();
  private maxLogs: number = 1000;

  // Log a message at info level
  public info(message: string, ...data: any[]): void {
    this.addLog('info', message, data);
    console.log(message, ...data);
  }

  // Log a message at warn level
  public warn(message: string, ...data: any[]): void {
    this.addLog('warn', message, data);
    console.warn(message, ...data);
  }

  // Log a message at error level
  public error(message: string, ...data: any[]): void {
    this.addLog('error', message, data);
    console.error(message, ...data);
  }

  // Add a log entry to the history
  private addLog(level: LogLevel, message: string, data: any[]): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data: data.length > 0 ? data : undefined
    };

    // Add to logs array
    this.logs.push(entry);

    // Trim if we exceed the maximum
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Notify listeners
    this.notifyListeners();
  }

  // Get all logs
  public getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Clear all logs
  public clearLogs(): void {
    this.logs = [];
    this.notifyListeners();
  }

  // Subscribe to log updates
  public subscribe(handler: LogEventHandler): () => void {
    this.listeners.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(handler);
    };
  }

  // Set maximum log history size
  public setMaxLogs(max: number): void {
    this.maxLogs = max;
    
    // Trim logs if we now exceed the new maximum
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
      this.notifyListeners();
    }
  }

  // Notify all listeners of log updates
  private notifyListeners(): void {
    const logsCopy = [...this.logs];
    for (const listener of this.listeners) {
      try {
        listener(logsCopy);
      } catch (error) {
        console.error('Error in log listener:', error);
      }
    }
  }

  // Generate test logs
  public generateTestLogs(): void {
    this.info('Test info message');
    this.warn('Test warning message');
    this.error('Test error message');
    this.info('Test with object data', { foo: 'bar', nested: { test: 123 } });
  }
}

// Export a singleton instance
export const logger = new Logger();

// For compatibility with existing code that uses console
export const appLog = {
  log: (...args: any[]) => logger.info(String(args[0]), ...args.slice(1)),
  info: (...args: any[]) => logger.info(String(args[0]), ...args.slice(1)),
  warn: (...args: any[]) => logger.warn(String(args[0]), ...args.slice(1)),
  error: (...args: any[]) => logger.error(String(args[0]), ...args.slice(1))
};