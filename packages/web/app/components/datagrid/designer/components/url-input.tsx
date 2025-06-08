import type React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface UrlInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onAction: () => void;
  actionLabel: string;
  actionIcon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  onCancel?: () => void;
}

export function UrlInput({
  className,
  value,
  onChange,
  onAction,
  actionLabel,
  actionIcon,
  placeholder = "Enter URL",
  disabled = false,
  onCancel = () => {},
}: UrlInputProps) {
  return (
    <div className={cn("relative flex w-full", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
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
      </div>
      <Input
        className="pl-10 h-9 text-sm rounded-tr-none rounded-br-none border-r-0 flex-1"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onAction();
          }
          if (e.key === "Escape") {
            onCancel();
          }
        }}
      />
      <Button
        variant="default"
        size="sm"
        className="h-9 flex items-center gap-1 whitespace-nowrap rounded-tl-none rounded-bl-none"
        onClick={onAction}
        disabled={disabled}
      >
        {actionIcon}
        {actionLabel}
      </Button>
    </div>
  );
}
