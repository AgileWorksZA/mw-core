import React from 'react';
import { MoneyWorksMessage } from '../../shared/types';
import { UserMessage } from './messages/UserMessage';
import { AssistantMessage } from './messages/AssistantMessage';
import { LoadingMessage } from './messages/LoadingMessage';

export interface MessageListProps {
  messages: MoneyWorksMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        if (message.role === 'user') {
          return <UserMessage key={message.id} message={message} />;
        }
        
        if (message.role === 'assistant') {
          return <AssistantMessage key={message.id} message={message} />;
        }
        
        return null;
      })}
      
      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <LoadingMessage />
      )}
    </div>
  );
}