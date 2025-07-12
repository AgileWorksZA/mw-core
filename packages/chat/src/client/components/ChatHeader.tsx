import React, { useState } from 'react';
import { MessageSquare, Trash2, Copy, Check } from 'lucide-react';
import type { MoneyWorksMessage } from '../../shared/types';
import { formatConversationForCopy } from '../utils/conversation';

export interface ChatHeaderProps {
  onClear: () => void;
  messagesCount: number;
  messages?: MoneyWorksMessage[];
}

export function ChatHeader({ onClear, messagesCount, messages = [] }: ChatHeaderProps) {
  const [copiedConversation, setCopiedConversation] = useState(false);

  const handleCopyConversation = async () => {
    try {
      const conversationText = formatConversationForCopy(messages);
      await navigator.clipboard.writeText(conversationText);
      setCopiedConversation(true);
      setTimeout(() => setCopiedConversation(false), 2000);
    } catch (err) {
      console.error('Failed to copy conversation:', err);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">MoneyWorks Assistant</h2>
        {messagesCount > 1 && (
          <span className="text-sm text-gray-500">
            ({messagesCount} messages)
          </span>
        )}
      </div>
      
      {messagesCount > 1 && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyConversation}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Copy entire conversation"
          >
            {copiedConversation ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>Copy</span>
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      )}
    </div>
  );
}