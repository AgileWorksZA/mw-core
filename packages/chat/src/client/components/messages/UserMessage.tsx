import React, { useState } from 'react';
import { User, Copy, Check } from 'lucide-react';
import { MoneyWorksMessage } from '../../../shared/types';

export interface UserMessageProps {
  message: MoneyWorksMessage;
}

export function UserMessage({ message }: UserMessageProps) {
  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="flex justify-end">
      <div 
        className="flex items-center gap-3 max-w-[80%] relative"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="w-4 flex">
          {hovering && (
            <button
              onClick={handleCopy}
              className="p-1.5 bg-background border border-border hover:bg-muted rounded-md shadow-sm hover:shadow-md transition-all"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
        <div className="bg-primary text-primary-foreground px-4 py-4 rounded shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
      </div>
    </div>
  );
}