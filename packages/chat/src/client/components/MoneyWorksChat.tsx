import React, { useState, useRef, useEffect } from 'react';
import { Thread } from '@assistant-ui/react';
import { useMoneyWorksChat } from '../hooks/useMoneyWorksChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { QuickActions } from './QuickActions';
import { ChatHeader } from './ChatHeader';
import { cn } from '../utils/cn';
import type { MoneyWorksMessage } from '../../shared/types';

export interface MoneyWorksChatProps {
  className?: string;
  apiEndpoint?: string;
  showQuickActions?: boolean;
  showHeader?: boolean;
  placeholder?: string;
  welcomeMessage?: string;
  initialMessages?: MoneyWorksMessage[];
  onMessagesChange?: (messages: MoneyWorksMessage[]) => void;
}

export function MoneyWorksChat({
  className,
  apiEndpoint,
  showQuickActions = true,
  showHeader = true,
  placeholder = "Ask about transactions, tax rates, or financial reports...",
  welcomeMessage,
  initialMessages = [],
  onMessagesChange
}: MoneyWorksChatProps) {
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    clearMessages,
    cancelStream
  } = useMoneyWorksChat({
    apiEndpoint,
    initialMessages: [
      ...initialMessages,
      ...(welcomeMessage && !initialMessages.length ? [{
        id: 'welcome',
        role: 'assistant' as const,
        content: welcomeMessage,
        timestamp: new Date()
      }] : [])
    ]
  });

  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Notify parent of messages changes
  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background dark:bg-background",
      className
    )}>
      {showHeader && (
        <ChatHeader 
          onClear={clearMessages}
          messagesCount={messages.length}
          messages={messages}
        />
      )}

      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto px-6 py-8 bg-gradient-to-b from-muted/30 to-background dark:from-muted/20 dark:to-background"
      >
        <MessageList 
          messages={messages}
          isLoading={isLoading}
        />
        
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md dark:bg-destructive/20 dark:border-destructive/30">
            <p className="text-sm text-destructive dark:text-destructive-foreground">
              Error: {error.message}
            </p>
          </div>
        )}
      </div>

      <div className="border-t px-6 p-6 space-y-4 bg-muted/50 dark:bg-muted/20">
        {showQuickActions && messages.length === 1 && (
          <QuickActions onAction={handleQuickAction} />
        )}
        
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder={placeholder}
          disabled={isLoading}
          onCancel={isLoading ? cancelStream : undefined}
        />
      </div>
    </div>
  );
}