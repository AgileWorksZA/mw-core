import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "~/lib/utils";
import { highlightCode } from "~/lib/syntax-highlighter";
import { useTheme } from "~/contexts/theme-context";

interface CodeExampleProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
  highlightedHtml?: string; // Pre-highlighted HTML from server
}

export function CodeExample({
  code,
  language = "typescript",
  title,
  showLineNumbers = false,
  className,
  highlightedHtml,
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState(highlightedHtml || '');
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'light' ? 'light' : 'dark';

  useEffect(() => {
    // Only highlight on client if not pre-highlighted
    if (!highlightedHtml) {
      highlightCode(code, language, theme).then(setHtml);
    }
  }, [code, language, theme, highlightedHtml]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group relative", className)}>
      {title && (
        <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {language}
          </span>
        </div>
      )}
      <div className={cn(
        "relative overflow-hidden",
        title ? "[&>pre]:rounded-t-none" : "[&>pre]:rounded-lg"
      )}>
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          // Fallback while highlighting
          <pre className={cn(
            "overflow-x-auto bg-gray-900 p-4 text-sm rounded-lg",
            title && "rounded-t-none"
          )}>
            <code className="text-gray-100">
              {code}
            </code>
          </pre>
        )}
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 rounded-md bg-gray-800 p-2 text-gray-400 opacity-0 transition-opacity hover:bg-gray-700 hover:text-gray-300 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}