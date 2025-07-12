import React from 'react';
import { User } from 'lucide-react';
import { MoneyWorksMessage } from '../../../shared/types';

export interface UserMessageProps {
  message: MoneyWorksMessage;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="flex items-start gap-3 max-w-[80%]">
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          <p className="text-sm">{message.content}</p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600" />
        </div>
      </div>
    </div>
  );
}