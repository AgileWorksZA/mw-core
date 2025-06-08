import React, { useEffect, useState } from "react";
import { EndpointSelector } from "~/components/datagrid/designer/components/endpoint-selector";
import { UrlInput } from "~/components/datagrid/designer/components/url-input";
import type { GetMethod } from "~/components/datagrid/designer/types/openApiTypes";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type SourceInputProps = {
  url: string;
  onUrlChange: (url: string) => void;
  onLoad: () => void;
  onMethodSelect: (method: string) => void;
  methods?: GetMethod[];
  selectedMethod?: string;
  onLoadData?: () => void;
  onGenerateMockData?: () => void;
  mockCount?: number;
  onMockCountChange?: (count: number) => void;
  className?: string;
};

export function SourceInput({
  url,
  onUrlChange,
  onLoad,
  onMethodSelect,
  methods = [],
  selectedMethod = "",
  onLoadData,
  onGenerateMockData,
  mockCount = 10,
  onMockCountChange,
  className,
}: SourceInputProps) {
  const [urlSet, setUrlSet] = useState("");
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (url && !urlSet) {
      setUrlSet(url);
      onLoad();
    }
  }, [url, onLoad]);
  /* First row with URL input, method selector, and load button */
  return (
    <div
      className={cn(
        "flex items-center gap-2 mb-2 flex-col md:flex-row",
        className,
      )}
    >
      {/* URL Input with integrated load button */}
      {urlSet ? (
        <Button size="sm" onClick={() => setUrlSet("")}>
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
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
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </Button>
      ) : (
        <div className="w-full">
          <UrlInput
            onCancel={() => setUrlSet(url)}
            value={url}
            onChange={(e) => {
              onUrlChange(e);
              if (urlSet) {
                setUrlSet("");
              }
            }}
            onAction={() => {
              onLoad();
              setUrlSet(url);
            }}
            actionLabel="Load API"
            placeholder="Enter OpenAPI/Swagger URL"
            actionIcon={
              // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            }
          />
        </div>
      )}

      {/* Endpoint selector with integrated Load Data button */}
      {urlSet && (
        <div className="w-full">
          <EndpointSelector
            methods={methods}
            selectedMethod={selectedMethod}
            onMethodSelect={onMethodSelect}
            onLoadData={onLoadData}
            onGenerateMockData={onGenerateMockData}
            mockCount={mockCount}
            onMockCountChange={onMockCountChange}
          />
        </div>
      )}
    </div>
  );
}
