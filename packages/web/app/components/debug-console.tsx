import { useEffect, useState, useRef } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "log" | "error" | "warn" | "info";
  message: string;
  data?: any;
}

export function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);
  const logIdRef = useRef(0);

  useEffect(() => {
    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    // Helper to add log entry
    const addLog = (level: LogEntry["level"], args: any[]) => {
      const entry: LogEntry = {
        id: `log-${logIdRef.current++}`,
        timestamp: new Date().toLocaleTimeString(),
        level,
        message: args
          .map((arg) => {
            if (typeof arg === "object") {
              try {
                // Check if it's a DOM element
                if (arg instanceof Element) {
                  return `<${arg.tagName.toLowerCase()}${arg.id ? ` id="${arg.id}"` : ""}${arg.className ? ` class="${arg.className}"` : ""}>`;
                }
                // Check if it's an Error
                if (arg instanceof Error) {
                  return `${arg.name}: ${arg.message}`;
                }
                // Try to stringify with a replacer that handles circular refs
                return JSON.stringify(
                  arg,
                  (key, value) => {
                    // Skip DOM nodes and other non-serializable objects
                    if (value instanceof Element || value instanceof Node) {
                      return `[${value.constructor.name}]`;
                    }
                    if (typeof value === "function") {
                      return "[Function]";
                    }
                    return value;
                  },
                  2,
                );
              } catch (e) {
                // If all else fails, use toString
                return arg.toString();
              }
            }
            return String(arg);
          })
          .join(" "),
        data: args,
      };

      setLogs((prev) => [...prev, entry].slice(-100)); // Keep last 100 logs
    };

    // Override console methods
    console.log = (...args) => {
      originalLog(...args);
      addLog("log", args);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog("error", args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog("warn", args);
    };

    console.info = (...args) => {
      originalInfo(...args);
      addLog("info", args);
    };

    // Cleanup
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    };
  }, []);

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "text-red-500";
      case "warn":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-gray-300";
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsMinimized(false)}>
          Debug Console ({logs.length})
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 z-50">
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">Debug Console</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setLogs([])}
            className="h-6 px-2 text-xs"
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMinimized(true)}
            className="h-6 px-2 text-xs"
          >
            Minimize
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-3rem)] p-2">
        <div className="space-y-1">
          {logs.map((log) => (
            <div key={log.id} className="text-xs font-mono">
              <span className="text-gray-500">[{log.timestamp}]</span>
              <span className={`ml-1 ${getLevelColor(log.level)}`}>
                [{log.level.toUpperCase()}]
              </span>
              <span className="ml-1 text-gray-300 break-all">
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
