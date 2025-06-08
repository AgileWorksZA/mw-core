import React from "react";

interface EmptyStateProps {
  loading?: boolean;
  error?: string | null;
  message?: string;
}

export function EmptyState({ loading, error, message }: EmptyStateProps) {
  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4 text-muted-foreground">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <div className="text-center">
          <p className="text-lg font-medium">Loading API Specification</p>
          <p className="text-sm">Please wait...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4 text-red-600">
        <div className="w-16 h-16 rounded-full bg-red-100/50 flex items-center justify-center">
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">Error Loading Specification</p>
          <p className="text-sm max-w-md mx-auto">{error}</p>
        </div>
      </div>
    );
  }
  
  // Show empty state or custom message
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4 text-muted-foreground">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium">
          {message || "No API method selected"}
        </p>
        <p className="text-sm">
          Load an OpenAPI specification to get started
        </p>
      </div>
    </div>
  );
}