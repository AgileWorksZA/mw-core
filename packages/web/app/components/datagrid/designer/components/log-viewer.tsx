import React, { type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface LogViewerProps {
  logs: ReactNode[];
  onClearLogs: () => void;
}

export function LogViewer({ logs, onClearLogs }: LogViewerProps) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="py-2 px-4 flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-sm font-medium">Logs</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onClearLogs}
          title="Clear logs"
        >
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </Button>
      </CardHeader>
      <CardContent className="p-0 overflow-auto grow">
        <div className="border-t border-border max-h-full overflow-auto font-mono">
          {logs.length ? (
            <div className="px-4 py-2 space-y-1">
              {logs.map((log, index) => (
                <div key={`log-item-${index}`} className="flex items-center">
                  <span className="text-muted-foreground mr-2 text-xs">
                    {String(index).padStart(2, "0")}
                  </span>
                  {log}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No logs to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}