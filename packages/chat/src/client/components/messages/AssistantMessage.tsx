import React from 'react';
import { Bot } from 'lucide-react';
import { MoneyWorksMessage } from '../../../shared/types';
import { TransactionDisplay } from './renderers/TransactionDisplay';
import { ReportDisplay } from './renderers/ReportDisplay';
import { TaxRateDisplay } from './renderers/TaxRateDisplay';
import { ToolInvocation } from './ToolInvocation';
import { cn } from '../../utils/cn';

export interface AssistantMessageProps {
  message: MoneyWorksMessage;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  const hasContent = message.content.trim().length > 0;
  
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-gray-600" />
      </div>
      
      <div className="flex-1 max-w-[80%] space-y-2">
        {hasContent && (
          <div className={cn(
            "bg-gray-100 px-4 py-2 rounded-lg",
            message.streaming && "animate-pulse"
          )}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
        
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="space-y-2">
            {message.toolInvocations.map((invocation, index) => (
              <ToolInvocation key={index} invocation={invocation} />
            ))}
          </div>
        )}
        
        {message.mwData && (
          <div className="mt-2">
            {message.mwData.type === 'transaction' && (
              <TransactionDisplay data={message.mwData.data} metadata={message.mwData.metadata} />
            )}
            {message.mwData.type === 'report' && (
              <ReportDisplay data={message.mwData.data} metadata={message.mwData.metadata} />
            )}
            {message.mwData.type === 'taxRate' && (
              <TaxRateDisplay data={message.mwData.data} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}