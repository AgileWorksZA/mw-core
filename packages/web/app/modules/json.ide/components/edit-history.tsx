import React from 'react';
import { getEditHistory } from '../utils/edit-events';
import type { JsonEditEvent } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { History } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

/**
 * Displays a history of JSON edits for the current session
 */
export function EditHistoryViewer() {
  // Get the edit history
  const history = getEditHistory();
  
  // Add timestamps to events for display
  const timestampedHistory: (JsonEditEvent & { timestamp?: Date })[] = history.map((event, index) => {
    // This is a mock, in real implementation we would store the timestamp with the event
    return {
      ...event,
      timestamp: new Date(Date.now() - index * 60000) // Mock timestamps, each 1 minute apart
    };
  });
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <History className="h-4 w-4" />
          <span>Edit History</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit History</DialogTitle>
          <DialogDescription>
            Recent edits to this JSON document
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 mt-4">
          {timestampedHistory.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No edit history available
            </div>
          ) : (
            timestampedHistory.map((event, index) => (
              <div 
                key={index} 
                className="border rounded-md p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium capitalize">
                    {event.type}
                  </span>
                  {event.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                    </span>
                  )}
                </div>
                
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-muted-foreground">Path:</span> 
                    <code className="ml-1 bg-muted-foreground/20 px-1 rounded">
                      {event.path || 'root'}
                    </code>
                  </div>
                  
                  {event.type === 'rename' && (
                    <div>
                      <span className="text-muted-foreground">Renamed:</span>
                      <code className="ml-1 bg-muted-foreground/20 px-1 rounded line-through">
                        {event.oldKey}
                      </code>
                      <span className="mx-1">→</span>
                      <code className="bg-muted-foreground/20 px-1 rounded">
                        {event.newKey}
                      </code>
                    </div>
                  )}
                  
                  {(event.type === 'update' || event.type === 'add') && event.value !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Value:</span>
                      <code className="ml-1 bg-muted-foreground/20 px-1 rounded">
                        {typeof event.value === 'object' && event.value !== null
                          ? JSON.stringify(event.value)
                          : String(event.value)
                        }
                      </code>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}