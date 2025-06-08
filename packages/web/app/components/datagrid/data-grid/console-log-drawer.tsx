import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import { logger } from "./logger";
import type { LogEntry } from "./logger";

export interface ConsoleLogDrawerProps {
  className?: string;
  limit?: number;
  triggerLabel?: string;
}

export function ConsoleLogDrawer({
  className,
  limit = 500,
  triggerLabel = "Console Logs",
}: ConsoleLogDrawerProps) {
  // Local state for UI
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [newLogs, setNewLogs] = useState(0);
  const lastLogCount = useRef(0);

  // Scroll reference for auto-scrolling
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Track if component is mounted
  const isMounted = useRef(false);

  // Function to test logging
  const handleTestLog = useCallback(() => {
    logger.generateTestLogs();
  }, []);

  // Subscribe to log updates
  useEffect(() => {
    isMounted.current = true;

    // Initial logs
    setLogs(logger.getAllLogs());
    lastLogCount.current = logger.getAllLogs().length;

    // Debug log to verify logger is working
    logger.info("ConsoleLogDrawer component mounted");

    // Subscribe to log updates
    const unsubscribe = logger.subscribe((updatedLogs) => {
      if (isMounted.current) {
        try {
          // Get only the most recent logs based on limit
          const limitedLogs = updatedLogs.slice(-limit);
          setLogs(limitedLogs);

          // Calculate new logs since last update
          const newLogCount = updatedLogs.length - lastLogCount.current;
          lastLogCount.current = updatedLogs.length;

          // Increment new logs counter if drawer is closed and we have new logs
          if (!open && newLogCount > 0) {
            setNewLogs((prev) => prev + newLogCount);
          }
        } catch (err) {
          console.error("[LogDrawer] Error updating logs:", err);
        }
      }
    });

    // Set maximum logs
    logger.setMaxLogs(limit);

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [limit, open]);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    console.debug("logs.length:", logs.length);

    if (open && scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      setTimeout(() => {
        if (scrollArea) {
          scrollArea.scrollTop = scrollArea.scrollHeight;
        }
      }, 100);
    }
  }, [open, logs.length]);

  // Reset new logs counter when drawer opens
  useEffect(() => {
    if (open) {
      setNewLogs(0);
    }
  }, [open]);

  // Format timestamp to be human readable
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour12: false });
  };

  // Clear logs function
  const clearLogs = () => {
    logger.clearLogs();
    setNewLogs(0);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          id="console-log-indicator"
          variant="outline"
          size="sm"
          className={cn(
            "relative",
            logs.length > 0 &&
              newLogs > 0 &&
              !open &&
              "animate-pulse ring-2 ring-red-400",
          )}
        >
          {triggerLabel}
          {logs.length > 0 && (
            <span className="ml-2 text-xs">
              ({logs.length})
              {newLogs > 0 && !open && (
                <span className="ml-1 text-xs font-bold text-red-500">
                  +{newLogs}
                </span>
              )}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        className={cn(
          "max-w-[600px] sm:max-w-[740px]",
          "console-log-sheet",
          className,
        )}
      >
        <SheetHeader>
          <SheetTitle>Console Logs</SheetTitle>
          <SheetDescription>
            View application logs without opening the developer console
          </SheetDescription>
        </SheetHeader>

        <ScrollArea
          ref={scrollAreaRef}
          className="flex-grow h-[calc(100vh-220px)] p-4 border rounded-md mx-4 bg-background/50"
        >
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
              <p>No logs to display</p>
              <p className="text-xs">
                Use <code>logger.info()</code>, <code>logger.warn()</code>, or{" "}
                <code>logger.error()</code> to log messages
              </p>
              <Button
                onClick={handleTestLog}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Generate Test Logs
              </Button>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-sm">
              {logs.map((log, idx) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={idx}
                  className={cn(
                    "p-3 rounded-md border shadow-sm",
                    log.level === "info" &&
                      "border-blue-200 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-900",
                    log.level === "warn" &&
                      "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/50 dark:border-yellow-900",
                    log.level === "error" &&
                      "border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-900",
                  )}
                >
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-start gap-1 min-w-[90px] shrink-0">
                      <span className="text-muted-foreground text-xs">
                        {formatTime(log.timestamp)}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-semibold uppercase",
                          log.level === "info" &&
                            "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                          log.level === "warn" &&
                            "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                          log.level === "error" &&
                            "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
                        )}
                      >
                        {log.level}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <pre className="whitespace-pre-wrap break-words leading-relaxed">
                        {log.message}
                      </pre>
                      {log.data && (
                        <div className="mt-2 text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-800">
                          <pre className="whitespace-pre-wrap break-words">
                            {log.data
                              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                              .map((item: any) => {
                                try {
                                  return typeof item === "object"
                                    ? JSON.stringify(item, null, 2)
                                    : String(item);
                                } catch (e) {
                                  return String(item);
                                }
                              })
                              .join("\n")}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {logs.length} {logs.length === 1 ? "entry" : "entries"} captured
            </span>
            {logs.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  if (scrollAreaRef.current) {
                    scrollAreaRef.current.scrollTop =
                      scrollAreaRef.current.scrollHeight;
                  }
                }}
              >
                Scroll to bottom
              </Button>
            )}
          </div>
          <ScrollArea className="max-h-20">
            <div className="flex gap-2 px-1 py-1">
              <Button
                onClick={handleTestLog}
                variant="outline"
                className="flex-1 whitespace-nowrap"
              >
                Test Logger
              </Button>
              <Button
                onClick={clearLogs}
                variant="outline"
                className="flex-1 whitespace-nowrap"
              >
                Clear Logs
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="flex-1 whitespace-nowrap">
                  Close
                </Button>
              </SheetClose>
            </div>
          </ScrollArea>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
