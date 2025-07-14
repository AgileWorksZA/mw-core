import React from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface AgedReceivablesReport {
  reportType: 'aged_receivables' | 'aged_payables';
  generatedAt: Date;
  period: string;
  summary: {
    current: { count: number; total: number };
    days30: { count: number; total: number };
    days60: { count: number; total: number };
    days90: { count: number; total: number };
    over90: { count: number; total: number };
  };
  details?: any;
}

export interface ReportDisplayProps {
  data: AgedReceivablesReport | any;
  metadata?: any;
}

export function ReportDisplay({ data }: ReportDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (data.reportType === 'aged_receivables' || data.reportType === 'aged_payables') {
    const typedData = data as AgedReceivablesReport;
    const isReceivables = typedData.reportType === 'aged_receivables';
    const totalAmount = Object.values(typedData.summary).reduce(
      (sum: number, bucket: { count: number; total: number }) => sum + bucket.total, 
      0
    );
    const totalCount = Object.values(typedData.summary).reduce(
      (sum: number, bucket: { count: number; total: number }) => sum + bucket.count, 
      0
    );

    return (
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span className="font-medium">
                {isReceivables ? 'Aged Receivables' : 'Aged Payables'} Report
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Period: {typedData.period}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Total Outstanding</div>
              <div className="text-xl font-semibold">{formatCurrency(totalAmount)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Total Invoices</div>
              <div className="text-xl font-semibold">{totalCount}</div>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(typedData.summary).map(([key, bucket]: [string, { count: number; total: number }]) => {
              const percentage = totalAmount > 0 
                ? (bucket.total / totalAmount) * 100 
                : 0;
              
              const labels = {
                current: 'Current',
                days30: '1-30 Days',
                days60: '31-60 Days',
                days90: '61-90 Days',
                over90: 'Over 90 Days'
              };

              const colors = {
                current: 'bg-green-500',
                days30: 'bg-yellow-500',
                days60: 'bg-orange-500',
                days90: 'bg-red-500',
                over90: 'bg-red-700'
              };

              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {labels[key as keyof typeof labels]}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">
                        {bucket.count} invoice{bucket.count !== 1 ? 's' : ''}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(bucket.total)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all",
                        colors[key as keyof typeof colors]
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {data.summary.over90.total > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">
                {formatCurrency(data.summary.over90.total)} is over 90 days overdue
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Generic report display for other report types
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-gray-500" />
        <span className="font-medium">Report Generated</span>
      </div>
      <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}