import React from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import type { GetMethod } from "../types/openApiTypes";

interface EndpointSelectorProps {
  className?: string;
  methods: GetMethod[];
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
  onLoadData: (() => void) | undefined;
  onGenerateMockData: (() => void) | undefined;
  mockCount?: number;
  onMockCountChange?: (count: number) => void;
  disabled?: boolean;
}

export function EndpointSelector({
  className,
  methods = [],
  selectedMethod = "",
  onMethodSelect,
  onLoadData,
  onGenerateMockData,
  mockCount = 10,
  onMockCountChange,
  disabled = false,
}: EndpointSelectorProps) {
  return (
    <div className={cn("flex w-full", className)}>
      <Select
        value={selectedMethod}
        onValueChange={onMethodSelect}
        disabled={methods.length === 0 || disabled}
      >
        <SelectTrigger className="w-full h-9 text-sm flex-grow rounded-tr-none rounded-br-none border-r-0">
          <SelectValue
            placeholder={
              methods.length > 0
                ? "Select an API endpoint"
                : "No endpoints available"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {methods.map((method) => (
            <SelectItem
              key={method.fullPath}
              value={method.fullPath}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                <div className="font-medium">{method.fullPath}</div>
                <div className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded">
                  {method.modelName}
                </div>
                {method.deprecated && (
                  <div className="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-0.5 rounded">
                    Deprecated
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex h-9">
        <Button
          onClick={onLoadData}
          variant="default"
          size="sm"
          disabled={!selectedMethod || !onLoadData || disabled}
          className="h-9 rounded-tl-none rounded-bl-none flex items-center gap-1 rounded-tr-none rounded-br-none border-r-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m2 12 5 5" />
            <path d="m2 12 5-5" />
            <path d="M12 2v10" />
            <path d="m12 12 5 5" />
          </svg>
          Load Data
        </Button>
        
        <div className="flex items-center">
          {/* Generate Mock Data button */}
          <Button
            onClick={onGenerateMockData}
            variant="outline"
            size="sm"
            disabled={!selectedMethod || !onGenerateMockData || disabled}
            className="h-9 rounded-tl-none rounded-bl-none rounded-tr-none rounded-br-none border-r-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Mock
          </Button>
          
          {/* Mock count selector */}
          <select
            className="h-9 rounded-md border border-input px-3 text-sm bg-background rounded-tl-none rounded-bl-none"
            value={mockCount}
            onChange={(e) => onMockCountChange?.(Number(e.target.value))}
            disabled={!onGenerateMockData || disabled}
            title="Number of mock records to generate"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
}