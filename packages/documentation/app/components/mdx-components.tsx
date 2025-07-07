import { CodeExample } from "./code-example";
import { cn } from "~/lib/utils";
import { highlightCode, parseCodeBlockMeta } from "~/lib/syntax-highlighter";

// Define MDX component types locally since we're not using actual MDX
type MDXComponents = Record<string, React.ComponentType<any>>;

// Custom components for MDX
export const mdxComponents: MDXComponents = {
  // Headers with anchor links
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  
  // Paragraphs and text
  p: ({ className, ...props }) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  
  // Lists
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  
  // Code blocks
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black p-4",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm dark:bg-slate-800",
        className
      )}
      {...props}
    />
  ),
  
  // Tables
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  
  // Blockquotes
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic [&>*]:text-slate-600",
        className
      )}
      {...props}
    />
  ),
  
  // Horizontal rule
  hr: ({ className, ...props }) => (
    <hr className={cn("my-8", className)} {...props} />
  ),
  
  // Links
  a: ({ className, href, ...props }) => (
    <a
      className={cn(
        "font-medium underline underline-offset-4 hover:text-primary",
        className
      )}
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  
  // Custom components
  CodeExample,
  
  // Package info component
  PackageInfo: ({ npm, github, version }: { npm: string; github: string; version: string }) => (
    <div className="my-6 flex flex-wrap gap-4">
      <a
        href={`https://www.npmjs.com/package/${npm}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800"
      >
        <span className="font-semibold">npm</span>
        <span>{npm}</span>
      </a>
      <a
        href={`https://github.com/${github}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800"
      >
        <span className="font-semibold">GitHub</span>
        <span>{github}</span>
      </a>
      <span className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">
        <span className="font-semibold">Version</span>
        <span>{version}</span>
      </span>
    </div>
  ),
  
  // Tabs component
  Tabs: ({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) => {
    const { TabsList, TabsTrigger, TabsContent } = extractTabComponents(children);
    return (
      <div className="my-6">
        <div className="flex gap-2 border-b">
          {TabsList}
        </div>
        <div className="mt-4">
          {TabsContent}
        </div>
      </div>
    );
  },
};

// Helper to extract tab components from children
function extractTabComponents(children: React.ReactNode) {
  // This is a simplified version - in production you'd use a proper tabs library
  return {
    TabsList: null,
    TabsTrigger: null,
    TabsContent: null,
  };
}

// Process markdown content with syntax highlighting
export async function processMarkdownContent(content: string, theme: 'light' | 'dark' = 'dark'): Promise<string> {
  // Enhanced markdown to HTML conversion
  let processedContent = content;
  
  // Handle front matter (remove it)
  processedContent = processedContent.replace(/^---\n[\s\S]*?\n---\n/m, '');
  
  // Process in specific order to avoid conflicts
  
  // Code blocks first (to protect their content)
  const codeBlocks: { placeholder: string; promise: Promise<string> }[] = [];
  processedContent = processedContent.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, infoString, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    const meta = parseCodeBlockMeta(infoString || '');
    
    const highlightPromise = highlightCode(code.trim(), meta.language, theme)
      .then(html => {
        // Wrap with our own container if title is present
        if (meta.title) {
          return `
            <div class="group relative my-4">
              <div class="flex items-center justify-between rounded-t-lg border border-b-0 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${meta.title}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">${meta.language}</span>
              </div>
              <div class="[&>pre]:rounded-t-none [&>pre]:mt-0">${html}</div>
            </div>
          `;
        }
        return `<div class="my-4">${html}</div>`;
      });
    
    codeBlocks.push({ placeholder, promise: highlightPromise });
    return placeholder;
  });
  
  // Lists
  processedContent = processedContent.replace(/^- (.+)$/gm, '<li>$1</li>');
  processedContent = processedContent.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return `<ul class="list-disc pl-6 space-y-2">${match}</ul>`;
  });
  
  // Headers with IDs for anchor links
  processedContent = processedContent.replace(/^#### (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h4 id="${id}" class="text-lg font-semibold mt-4 mb-2 scroll-mt-20">${text}</h4>`;
  });
  processedContent = processedContent.replace(/^#### (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h4 id="${id}" class="text-lg font-semibold mt-4 mb-2 scroll-mt-20">${text}</h4>`;
  });
  processedContent = processedContent.replace(/^### (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h3 id="${id}" class="text-xl font-semibold mt-6 mb-3 scroll-mt-20">${text}</h3>`;
  });
  processedContent = processedContent.replace(/^## (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h2 id="${id}" class="text-2xl font-semibold mt-8 mb-4 scroll-mt-20">${text}</h2>`;
  });
  processedContent = processedContent.replace(/^# (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h1 id="${id}" class="text-3xl font-bold mt-8 mb-4 scroll-mt-20">${text}</h1>`;
  });
  
  // Bold and italic
  processedContent = processedContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  processedContent = processedContent.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links
  processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');
  
  // Inline code
  processedContent = processedContent.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">$1</code>');
  
  // Wait for all code blocks to be highlighted
  const highlightedBlocks = await Promise.all(codeBlocks.map(b => b.promise));
  
  // Restore highlighted code blocks
  codeBlocks.forEach((block, index) => {
    processedContent = processedContent.replace(block.placeholder, highlightedBlocks[index]);
  });
  
  // Paragraphs
  processedContent = processedContent
    .split('\n\n')
    .map(para => {
      para = para.trim();
      if (!para) return '';
      if (para.startsWith('<')) return para; // Already HTML
      return `<p class="mb-4">${para}</p>`;
    })
    .join('\n');
  
  return processedContent;
}

// Component to render MDX content as HTML
export function MDXContent({ content, processedHtml }: { content?: string; processedHtml?: string }) {
  // If pre-processed HTML is provided (from server), use it directly
  if (processedHtml) {
    return (
      <div 
        className="prose prose-gray dark:prose-invert max-w-none [&_pre]:my-0"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    );
  }
  
  // Fallback to basic processing without syntax highlighting
  // This should only happen during client-side navigation
  if (!content) return null;
  
  // Basic processing without syntax highlighting
  let processedContent = content;
  processedContent = processedContent.replace(/^---\n[\s\S]*?\n---\n/m, '');
  
  // Basic code blocks
  processedContent = processedContent.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="overflow-x-auto rounded-lg bg-gray-900 p-6 my-4"><code class="text-gray-100">${escapeHtml(code.trim())}</code></pre>`;
  });
  
  // Rest of the processing...
  processedContent = processedContent.replace(/^- (.+)$/gm, '<li>$1</li>');
  processedContent = processedContent.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return `<ul class="list-disc pl-6 space-y-2">${match}</ul>`;
  });
  
  processedContent = processedContent.replace(/^#### (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h4 id="${id}" class="text-lg font-semibold mt-4 mb-2 scroll-mt-20">${text}</h4>`;
  });
  processedContent = processedContent.replace(/^### (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h3 id="${id}" class="text-xl font-semibold mt-6 mb-3 scroll-mt-20">${text}</h3>`;
  });
  processedContent = processedContent.replace(/^## (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h2 id="${id}" class="text-2xl font-semibold mt-8 mb-4 scroll-mt-20">${text}</h2>`;
  });
  processedContent = processedContent.replace(/^# (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h1 id="${id}" class="text-3xl font-bold mt-8 mb-4 scroll-mt-20">${text}</h1>`;
  });
  
  processedContent = processedContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  processedContent = processedContent.replace(/\*(.+?)\*/g, '<em>$1</em>');
  processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');
  processedContent = processedContent.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">$1</code>');
  
  processedContent = processedContent
    .split('\n\n')
    .map(para => {
      para = para.trim();
      if (!para) return '';
      if (para.startsWith('<')) return para; // Already HTML
      return `<p class="mb-4">${para}</p>`;
    })
    .join('\n');
    
  return (
    <div 
      className="prose prose-gray dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}