import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';

export interface ChatHeaderProps {
  onClear: () => void;
  messagesCount: number;
}

export function ChatHeader({ onClear, messagesCount }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">MoneyWorks Assistant</h2>
        {messagesCount > 1 && (
          <span className="text-sm text-gray-500">
            ({messagesCount} messages)
          </span>
        )}
      </div>
      
      {messagesCount > 1 && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}