import * as React from "react";
import { marked } from "marked";
import { cn } from "~/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

// Configure marked options
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
});

// Custom styles for markdown elements
const markdownStyles = `
  .markdown-content h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
  .markdown-content h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
  .markdown-content h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
  .markdown-content h4 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
  .markdown-content p { margin-bottom: 0.5rem; line-height: 1.6; }
  .markdown-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 0.5rem; }
  .markdown-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 0.5rem; }
  .markdown-content li { margin-bottom: 0.25rem; }
  .markdown-content code { 
    background-color: hsl(var(--muted)); 
    padding: 0.125rem 0.25rem; 
    border-radius: 0.25rem; 
    font-size: 0.875rem;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  }
  .markdown-content pre { 
    background-color: hsl(var(--muted)); 
    padding: 1rem; 
    border-radius: 0.5rem; 
    overflow-x: auto; 
    margin-bottom: 0.5rem;
    border: 1px solid hsl(var(--border));
  }
  .markdown-content pre code { 
    background-color: transparent; 
    padding: 0; 
  }
  .markdown-content blockquote { 
    border-left: 4px solid hsl(var(--primary)); 
    padding-left: 1rem; 
    margin-left: 0; 
    margin-bottom: 0.5rem;
    background-color: hsl(var(--muted) / 0.5);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .markdown-content table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-bottom: 0.5rem;
    border: 1px solid hsl(var(--border));
  }
  .markdown-content th, .markdown-content td { 
    border: 1px solid hsl(var(--border)); 
    padding: 0.5rem;
    text-align: left;
  }
  .markdown-content th { 
    background-color: hsl(var(--muted));
    font-weight: 600;
  }
  .markdown-content strong { font-weight: 600; }
  .markdown-content em { font-style: italic; }
  .markdown-content a { 
    color: hsl(var(--primary)); 
    text-decoration: none;
  }
  .markdown-content a:hover { text-decoration: underline; }
  .markdown-content hr { 
    border: none; 
    border-top: 1px solid hsl(var(--border)); 
    margin: 1rem 0;
  }
`;

export function Markdown({ content, className }: MarkdownProps) {
  const htmlContent = React.useMemo(() => {
    try {
      return marked.parse(content) as string;
    } catch (error) {
      console.error("Markdown parsing error:", error);
      return content; // Fallback to plain text
    }
  }, [content]);

  React.useEffect(() => {
    // Add styles to head if not already present
    if (!document.getElementById('markdown-styles')) {
      const style = document.createElement('style');
      style.id = 'markdown-styles';
      style.textContent = markdownStyles;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
      className={cn(
        "markdown-content text-sm",
        className
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}