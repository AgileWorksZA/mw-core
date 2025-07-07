import * as React from "react";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'heading' | 'content';
  level?: number;
}

interface DocSearchProps {
  content: string;
  packageName: string;
  className?: string;
}

export function DocSearch({ content, packageName, className }: DocSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Extract searchable content
  const searchableContent = React.useMemo(() => {
    const items: SearchResult[] = [];
    const lines = content.split('\n');
    let currentSection = '';
    
    for (const line of lines) {
      // Check for headers
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const title = headerMatch[2];
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        currentSection = title;
        items.push({
          id,
          title,
          content: line,
          type: 'heading',
          level
        });
      } else if (line.trim() && !line.startsWith('```')) {
        // Add content lines
        items.push({
          id: `content-${items.length}`,
          title: currentSection,
          content: line.trim(),
          type: 'content'
        });
      }
    }
    
    return items;
  }, [content]);

  // Search function
  const performSearch = React.useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const searchResults = searchableContent
      .filter(item => 
        item.content.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query)
      )
      .slice(0, 10); // Limit results

    setResults(searchResults);
    setSelectedIndex(0);
  }, [searchableContent]);

  // Handle search input
  React.useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery("");
        setResults([]);
      }

      // Navigate results
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const result = results[selectedIndex];
          if (result) {
            let targetElement: HTMLElement | null = null;
            
            if (result.type === 'heading') {
              targetElement = document.getElementById(result.id);
            } else {
              // For content, find the nearest heading
              const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
              for (let i = 0; i < allHeadings.length; i++) {
                const heading = allHeadings[i] as HTMLElement;
                const headingText = heading.textContent?.toLowerCase() || '';
                if (headingText.includes(result.title.toLowerCase())) {
                  targetElement = heading;
                  break;
                }
              }
            }
            
            if (targetElement) {
              const offset = 80; // Account for fixed header
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - offset;
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
              
              setIsOpen(false);
              setQuery("");
              setResults([]);
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Focus input when opening
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 rounded-md hover:bg-muted transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          className
        )}
        aria-label="Search documentation"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search</span>
        <kbd className="ml-auto text-xs bg-background px-1.5 py-0.5 rounded border">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div
        className="fixed left-1/2 top-20 -translate-x-1/2 w-full max-w-2xl bg-background border rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${packageName} documentation...`}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            aria-label="Search input"
          />
          <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => {
                  let targetElement: HTMLElement | null = null;
                  
                  if (result.type === 'heading') {
                    targetElement = document.getElementById(result.id);
                  } else {
                    // For content, find the nearest heading
                    const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                    for (let i = 0; i < allHeadings.length; i++) {
                      const heading = allHeadings[i] as HTMLElement;
                      const headingText = heading.textContent?.toLowerCase() || '';
                      if (headingText.includes(result.title.toLowerCase())) {
                        targetElement = heading;
                        break;
                      }
                    }
                  }
                  
                  if (targetElement) {
                    const offset = 80; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                    
                    setIsOpen(false);
                    setQuery("");
                    setResults([]);
                  }
                }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-md transition-colors",
                  "hover:bg-muted focus:bg-muted focus:outline-none",
                  selectedIndex === index && "bg-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  {result.type === 'heading' ? (
                    <span className="text-xs font-medium text-muted-foreground">H{result.level}</span>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">TEXT</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{result.content}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}