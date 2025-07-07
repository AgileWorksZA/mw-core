import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Command } from "cmdk";
import Fuse from "fuse.js";
import { Search, Package, BookOpen, Code2, FileText } from "lucide-react";
import { cn } from "~/lib/utils";

// Mock search data - in real app, this would be generated from packages
const searchData = [
  // Packages
  { id: "pkg-utilities", type: "package", title: "@moneyworks/utilities", description: "Core utilities and branded types", url: "/packages/utilities", category: "Packages" },
  { id: "pkg-data", type: "package", title: "@moneyworks/data", description: "Data access layer", url: "/packages/data", category: "Packages" },
  { id: "pkg-canonical", type: "package", title: "@moneyworks/canonical", description: "Canonical type definitions", url: "/packages/canonical", category: "Packages" },
  
  // API Methods
  { id: "api-validateYYYYMMDD", type: "api", title: "validateYYYYMMDD", description: "Validate date in YYYYMMDD format", url: "/api/utilities/validateYYYYMMDD", category: "API" },
  { id: "api-smartExport", type: "api", title: "smartExport", description: "Export data with smart formatting", url: "/api/data/smartExport", category: "API" },
  
  // Guides
  { id: "guide-getting-started", type: "guide", title: "Getting Started", description: "Quick start guide for MoneyWorks Core", url: "/guides/getting-started", category: "Guides" },
  { id: "guide-auth", type: "guide", title: "Authentication", description: "Setting up authentication", url: "/guides/authentication", category: "Guides" },
];

const fuse = new Fuse(searchData, {
  keys: ["title", "description"],
  threshold: 0.3,
});

export function SearchCommand() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const results = search ? fuse.search(search).map(r => r.item) : searchData;
  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof searchData>);
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  const getIcon = (type: string) => {
    switch (type) {
      case "package": return <Package className="h-4 w-4" />;
      case "api": return <Code2 className="h-4 w-4" />;
      case "guide": return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 transition-colors w-full max-w-sm mx-auto"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search documentation...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:text-gray-400 opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search documentation"
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      >
        <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
        <div className="relative w-full max-w-2xl overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-2xl">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 dark:[&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="Search documentation..."
                value={search}
                onValueChange={setSearch}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="max-h-[400px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found.
              </Command.Empty>
              
              {Object.entries(groupedResults).map(([category, items]) => (
                <Command.Group key={category} heading={category} className="mb-2">
                  {items.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={item.title}
                      onSelect={() => {
                        navigate(item.url);
                        setOpen(false);
                        setSearch("");
                      }}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                    >
                      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </div>
      </Command.Dialog>
    </>
  );
}