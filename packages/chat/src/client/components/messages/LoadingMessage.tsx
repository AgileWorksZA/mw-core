import React from 'react';
import { Bot } from 'lucide-react';

export function LoadingMessage() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <div className="bg-muted px-4 py-2 rounded-lg">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}