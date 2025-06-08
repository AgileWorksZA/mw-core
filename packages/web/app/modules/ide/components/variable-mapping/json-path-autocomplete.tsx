import { Check, ChevronsUpDown, FolderTree, FileJson } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

import { useManifestOutputVariable } from "~/modules/ide/hooks/use-manifest-output-variable";

interface JsonPathAutocompleteProps {
  fileId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type PathOption = {
  value: string;
  label: string;
  hasChildren: boolean;
  depth: number;
  isLeaf: boolean;
};

export function JsonPathAutocomplete({
  fileId,
  value,
  onChange,
  placeholder = "Select a path...",
}: JsonPathAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Get the root variables
  const rootVariables = useManifestOutputVariable(fileId, "");

  // Generate path options based on the current root variables
  const generatePathOptions = useCallback(
    (obj: any, currentPath = "", depth = 0, maxDepth = 5): PathOption[] => {
      if (depth > maxDepth || obj === null || obj === undefined) {
        return [];
      }

      // Skip certain types that might cause issues
      if (typeof obj === "function") {
        return [];
      }

      const options: PathOption[] = [];

      // For primitive values and leaf nodes
      if (typeof obj !== "object" || obj === null) {
        return [
          {
            value: currentPath,
            label: currentPath || "/",
            hasChildren: false,
            isLeaf: true,
            depth,
          },
        ];
      }

      // Special handling for internal types
      if (obj.internal && typeof obj.internal === "string") {
        return [
          {
            value: currentPath,
            label: currentPath || "/",
            hasChildren: false,
            isLeaf: true,
            depth,
          },
        ];
      }

      // For the root path
      if (!currentPath) {
        options.push({
          value: "",
          label: "/",
          hasChildren: Object.keys(obj).length > 0,
          isLeaf: Object.keys(obj).length === 0,
          depth,
        });
      }

      // For objects and arrays, recursively add options for each child
      try {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newPath = currentPath ? `${currentPath}/${key}` : key;
            const value = obj[key];
            const isLeafNode = typeof value !== "object" || value === null;

            // Add the current path as an option
            options.push({
              value: newPath,
              label: key,
              hasChildren: !isLeafNode,
              isLeaf: isLeafNode,
              depth: depth + 1,
            });

            // Recursively add options for children
            if (typeof value === "object" && value !== null) {
              options.push(
                ...generatePathOptions(value, newPath, depth + 1, maxDepth),
              );
            }
          }
        }
      } catch (error) {
        console.error("Error generating path options:", error);
      }

      return options;
    },
    [],
  );

  // Filter and prepare available paths
  const pathOptions = useMemo(() => {
    if (!rootVariables) return [];

    const options = generatePathOptions(rootVariables);

    // Deduplicate options based on value
    const uniqueOptions = [
      ...new Map(options.map((opt) => [opt.value, opt])).values(),
    ];

    // Sort by path length and then alphabetically
    return uniqueOptions.sort((a, b) => {
      const aParts = a.value.split("/").length;
      const bParts = b.value.split("/").length;

      if (aParts === bParts) {
        return a.value.localeCompare(b.value);
      }

      return aParts - bParts;
    });
  }, [rootVariables, generatePathOptions]);

  // Update search value when the component loads
  useEffect(() => {
    if (value) {
      setSearchValue("");
    }
  }, [value]);

  // Format the path for display
  const formatPathForDisplay = (path: string) => {
    if (!path) return "/";
    return path.startsWith("/") ? path : `/${path}`;
  };

  // Handle option selection
  const handleSelect = useCallback(
    (selectedValue: string) => {
      onChange(selectedValue);
      setOpen(false);
    },
    [onChange],
  );

  // Filter options based on search value
  const filteredOptions = useMemo(() => {
    if (!searchValue) return pathOptions;

    return pathOptions.filter(
      (option) =>
        option.value.toLowerCase().includes(searchValue.toLowerCase()) ||
        option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [pathOptions, searchValue]);

  // Get selected option info
  const selectedOption = pathOptions.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedOption ? (
            <span className="flex items-center truncate">
              {selectedOption.isLeaf ? (
                <FileJson className="mr-2 h-4 w-4 text-muted-foreground" />
              ) : (
                <FolderTree className="mr-2 h-4 w-4 text-primary" />
              )}
              {formatPathForDisplay(value)}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search path..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>No path found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value || "root"}
                value={option.value}
                onSelect={handleSelect}
                className="flex items-center"
              >
                <div
                  className="flex items-center"
                  style={{ marginLeft: `${option.depth * 8}px` }}
                >
                  {option.value === value && (
                    <Check className="mr-2 h-4 w-4 text-primary" />
                  )}
                  {!option.isLeaf && option.value !== value && (
                    <FolderTree className="mr-2 h-4 w-4 text-primary opacity-70" />
                  )}
                  {option.isLeaf && option.value !== value && (
                    <FileJson className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      "flex-1",
                      option.value === value ? "font-medium" : "font-normal",
                      option.hasChildren ? "text-primary" : "",
                    )}
                  >
                    {option.label === "/" ? "/" : option.label}
                  </span>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {formatPathForDisplay(option.value)}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
