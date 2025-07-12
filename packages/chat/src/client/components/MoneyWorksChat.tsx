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
}

export function MoneyWorksChat({
  className,
  apiEndpoint,
  showQuickActions = true,
  showHeader = true,
  placeholder = "Ask about transactions, tax rates, or financial reports...",
  welcomeMessage,
  initialMessages = []
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
      "flex flex-col h-full bg-white rounded-lg shadow-sm border",
      className
    )}>
      {showHeader && (
        <ChatHeader 
          onClear={clearMessages}
          messagesCount={messages.length}
        />
      )}

      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <MessageList 
          messages={messages}
          isLoading={isLoading}
        />
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              Error: {error.message}
            </p>
          </div>
        )}
      </div>

      <div className="border-t px-4 py-4 space-y-3">
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