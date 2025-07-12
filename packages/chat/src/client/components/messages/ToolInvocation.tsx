import React from 'react';
import { Loader2, CheckCircle, XCircle, Wrench } from 'lucide-react';
import { MoneyWorksToolInvocation } from '../../../shared/types';

export interface ToolInvocationProps {
  invocation: MoneyWorksToolInvocation;
}

export function ToolInvocation({ invocation }: ToolInvocationProps) {
  const getIcon = () => {
    switch (invocation.state) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return invocation.result?.success 
          ? <CheckCircle className="w-4 h-4 text-green-500" />
          : <XCircle className="w-4 h-4 text-red-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Wrench className="w-4 h-4 text-gray-500" />;
    }
  };

  const getToolDisplayName = (toolName: string): string => {
    const names: Record<string, string> = {
      getTransactions: 'Fetching transactions',
      getTaxRate: 'Looking up tax rate',
      listTaxRates: 'Fetching all tax rates',
      getAccount: 'Getting account details',
      searchNames: 'Searching contacts',
      runReport: 'Generating report',
      evaluateExpression: 'Calculating'
    };
    return names[toolName] || toolName;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-md text-sm">
      {getIcon()}
      <span className="text-gray-700">
        {getToolDisplayName(invocation.toolName)}
      </span>
      {invocation.state === 'completed' && invocation.result?.error && (
        <span className="text-red-600 text-xs ml-2">
          ({invocation.result.error})
        </span>
      )}
    </div>
  );
}