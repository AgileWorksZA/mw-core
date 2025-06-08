import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

// Custom debounce hook that properly resets the timer on each call
function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const callbackRef = React.useRef(callback);

  // Keep callback ref up to date
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = React.useCallback(
    (...args: Parameters<T>) => {
      // Cancel any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T;

  return debouncedCallback;
}

export interface VariableInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  variables?: Record<string, any>;
  onChange?: (value: string) => void;
  onVariableClick?: (variable: string) => void;
  preview?: boolean; // Show actual values instead of variable names
  debounceMs?: number; // Optional debounce delay in milliseconds
}

interface ParsedSegment {
  type: "text" | "variable";
  value: string;
  exists?: boolean;
  start: number;
  end: number;
}

function parseVariables(
  value: string,
  variables?: Record<string, any>,
): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const regex = /\{\{([^}]+)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((match = regex.exec(value)) !== null) {
    // Add text before the variable
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        value: value.slice(lastIndex, match.index),
        start: lastIndex,
        end: match.index,
      });
    }

    // Add the variable
    const variableName = match[1].trim();
    segments.push({
      type: "variable",
      value: match[0],
      exists: variables ? variableName in variables : undefined,
      start: match.index,
      end: match.index + match[0].length,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < value.length) {
    segments.push({
      type: "text",
      value: value.slice(lastIndex),
      start: lastIndex,
      end: value.length,
    });
  }

  return segments;
}

const VariableInput = React.forwardRef<HTMLInputElement, VariableInputProps>(
  (
    {
      className,
      variables,
      onChange,
      onVariableClick,
      preview = false,
      ...props
    },
    ref,
  ) => {
    // Local state is the source of truth for display
    const [localValue, setLocalValue] = React.useState(
      props.value || props.defaultValue || "",
    );
    const [scrollLeft, setScrollLeft] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Parse the value to find variables - use local value for immediate feedback
    const segments = React.useMemo(
      () => parseVariables(String(localValue), variables),
      [localValue, variables],
    );

    // Debounced onChange with our custom debounce that properly resets
    const debouncedOnChange = useDebounce((value: string) => {
      onChange?.(value);
    }, 800); // 800ms delay, resets on each keystroke

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      debouncedOnChange(newValue);
    };

    // Sync with external value only on mount or when explicitly changed
    React.useEffect(() => {
      if (props.value !== undefined) {
        setLocalValue(String(props.value));
      }
    }, [props.value]);

    // Sync scroll between input and overlay
    React.useEffect(() => {
      const input = inputRef.current;
      const overlay = overlayRef.current;
      if (!input || !overlay) return;

      const handleScroll = () => {
        setScrollLeft(input.scrollLeft);
      };

      const handleInputResize = () => {
        // Only set width if the input has a positive width (not hidden in accordion)
        const inputWidth = input.clientWidth;
        if (inputWidth > 0) {
          overlay.style.width = `${inputWidth}px`;
        }
        setScrollLeft(input.scrollLeft);
      };

      // Copy computed styles from input to overlay for perfect alignment
      const inputStyles = window.getComputedStyle(input);
      overlay.style.fontFamily = inputStyles.fontFamily;
      overlay.style.fontSize = inputStyles.fontSize;
      overlay.style.fontWeight = inputStyles.fontWeight;
      overlay.style.lineHeight = inputStyles.lineHeight;
      overlay.style.letterSpacing = inputStyles.letterSpacing;
      overlay.style.textTransform = inputStyles.textTransform;
      overlay.style.fontFeatureSettings = inputStyles.fontFeatureSettings;

      // Initial sizing
      handleInputResize();

      // Setup event listeners
      input.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleInputResize);

      // ResizeObserver to handle accordion open/close
      const resizeObserver = new ResizeObserver(() => {
        handleInputResize();
      });
      resizeObserver.observe(input);

      return () => {
        input.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleInputResize);
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <TooltipProvider>
        <div className="relative">
          {/* Actual input with transparent text */}
          <input
            ref={inputRef}
            type="text"
            className={cn(
              "flex h-10 w-full rounded-md border border-input px-3 py-2 text-md ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "bg-transparent z-10 caret-black dark:caret-white", // Transparent bg, visible cursor
              "ml-[-1px] mt-[-1px]", // Adjust for overlay
              className,
            )}
            style={{
              color: "transparent", // Make text invisible but keep cursor
            }}
            onChange={handleChange}
            autoComplete="off"
            spellCheck={false}
            {...props}
            value={localValue}
          />

          {/* Overlay for syntax highlighting */}
          <div
            ref={overlayRef}
            className="pointer-events-none absolute left-0 top-0 px-3 py-2 text-md h-10 flex items-center whitespace-nowrap overflow-hidden"
            style={{
              // These will be overridden by computed styles
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              lineHeight: "inherit",
              letterSpacing: "inherit",
            }}
          >
            <div
              className="relative"
              style={{
                transform: `translateX(-${scrollLeft}px)`,
                transition: "none",
              }}
            >
              {segments.map((segment, index) => {
                if (segment.type === "text") {
                  return (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      className="pointer-events-none  text-foreground"
                    >
                      {segment.value}
                    </span>
                  );
                }

                // Variable segment
                const varName = segment.value.slice(2, -2).trim();
                const varValue = variables?.[varName];
                const isSecret =
                  varName.toLowerCase().includes("secret") ||
                  varName.toLowerCase().includes("token") ||
                  varName.toLowerCase().includes("key") ||
                  varName.toLowerCase().includes("password");

                const displayValue =
                  preview && segment.exists
                    ? isSecret
                      ? "***"
                      : String(varValue)
                    : segment.value;

                const color =
                  segment.exists === undefined
                    ? "text-blue-600 dark:text-blue-400" // No variables provided
                    : segment.exists
                      ? "text-green-600 dark:text-green-400" // Variable exists
                      : "text-red-600 dark:text-red-400"; // Variable doesn't exist

                const variableSpan = (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                  <span
                    className={cn(
                      color,
                      // Enable pointer events if we have tooltips OR click handler
                      variables && "pointer-events-auto",
                      onVariableClick && "cursor-pointer hover:underline",
                      preview &&
                        segment.exists &&
                        "bg-opacity-10 px-0.5 rounded-sm",
                    )}
                    onClick={() => {
                      if (onVariableClick && segment.type === "variable") {
                        onVariableClick(varName);
                      }
                    }}
                  >
                    {displayValue}
                  </span>
                );

                // If we have variables context, wrap in tooltip
                if (variables) {
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>{variableSpan}</TooltipTrigger>
                      <TooltipContent side="bottom">
                        {segment.exists ? (
                          preview ? (
                            // In preview mode, show the variable name since we're displaying the value
                            <div>
                              <div className="font-semibold">
                                {"Variable: {{varName}}"}
                              </div>
                              <div className="text-xs">
                                Type: {isSecret ? "Secret" : typeof varValue}
                              </div>
                            </div>
                          ) : (
                            // In normal mode, show the value since we're displaying the variable name
                            <div>
                              <div className="font-semibold">{varName}</div>
                              <div className="text-xs">
                                Value: {isSecret ? "***" : String(varValue)}
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="text-red-500">
                            Variable not found: {varName}
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <React.Fragment key={index}>{variableSpan}</React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  },
);

VariableInput.displayName = "VariableInput";

export { VariableInput };
