import React, { useState } from 'react';
import { Bot, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
    <div 
      className="flex items-start gap-3"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-gray-600" />
      </div>
      
      <div className="flex-1 max-w-[80%] space-y-2">
        {hasContent && (
          <div 
            className={cn(
              "bg-gray-100 px-4 py-4 rounded-2xl shadow",
              message.streaming && "animate-pulse"
            )}
          >
            <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-gray-800 prose-pre:text-gray-100">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ node, ...props }) => (
                    <pre className="overflow-x-auto p-3 rounded-md bg-gray-800 text-gray-100" {...props} />
                  ),
                  code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const inline = !match;
                    return inline ? (
                      <code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
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
      
      <div className="w-4 flex flex-col items-center justify-center">
        {hovering && !message.streaming && hasContent && (
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded shadow-sm hover:shadow-md transition-all self-start"
            title="Copy raw markdown"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3 text-gray-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}