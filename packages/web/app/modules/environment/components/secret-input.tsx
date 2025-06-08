/**
 * Secret input component with show/hide functionality
 */

import React, { useState, useRef, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { cn } from "~/lib/utils";

interface SecretInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange?: (value: string) => void;
  showCopyButton?: boolean;
}

export function SecretInput({ 
  value, 
  onValueChange, 
  showCopyButton = true,
  className,
  ...props 
}: SecretInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Show actual value when focused, hide when blurred
  useEffect(() => {
    if (!isFocused && !isVisible) {
      // Mask the value when not focused and not explicitly visible
      if (inputRef.current && value) {
        inputRef.current.type = "password";
      }
    } else {
      if (inputRef.current) {
        inputRef.current.type = "text";
      }
    }
  }, [isFocused, isVisible, value]);
  
  const handleCopy = async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const displayValue = !isFocused && !isVisible && value ? "••••" : value;
  
  return (
    <div className="relative flex items-center gap-2">
      <Input
        ref={inputRef}
        type={isVisible || isFocused ? "text" : "password"}
        value={displayValue}
        onChange={(e) => onValueChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn("pr-20", className)}
        {...props}
      />
      <div className="absolute right-2 flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
        {showCopyButton && value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}