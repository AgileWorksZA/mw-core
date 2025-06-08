import * as React from "react";
import { ChevronDown, FileIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { useIdeSelector } from "../hooks/use-ide-selector";

interface SelectFileByTypeProps {
  fileType: string;
  value?: string;
  onValueChange: (fileId: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
}

export function SelectFileByType({
  fileType,
  value,
  onValueChange,
  placeholder = "Select a file...",
  className,
  disabled = false,
  required = false,
  label,
}: SelectFileByTypeProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Get all files of the specified type
  const files = useIdeSelector((state) => {
    // The state structure depends on the IDE implementation
    // This is a simplified version - adjust based on actual state structure
    const allFiles = state.files || [];
    return allFiles
      .filter((file) => file.type === fileType)
      .map((file) => ({
        id: file.id,
        name: file.name || file.path?.split('/').pop() || file.id,
        description: file.description || "",
        updatedAt: file.updatedAt || file.createdAt,
      }))
      .sort((a, b) => {
        // Sort by updated date, most recent first
        const dateA = new Date(a.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || 0).getTime();
        return dateB - dateA;
      });
  });

  // Filter files based on search query
  const filteredFiles = React.useMemo(() => {
    if (!searchQuery) return files;
    
    const query = searchQuery.toLowerCase();
    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(query) ||
        file.description.toLowerCase().includes(query)
    );
  }, [files, searchQuery]);

  // Get selected file details
  const selectedFile = files.find((file) => file.id === value);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={`Select ${fileType} file`}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <span className="flex items-center gap-2 truncate">
              <FileIcon className="h-4 w-4" />
              {selectedFile ? selectedFile.name : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Search ${fileType} files...`}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No {fileType} files found.</CommandEmpty>
              <CommandGroup heading={`${fileType} Files`}>
                {filteredFiles.map((file) => (
                  <CommandItem
                    key={file.id}
                    value={file.id}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4" />
                        <span className="font-medium">{file.name}</span>
                      </div>
                      {file.description && (
                        <span className="text-xs text-muted-foreground ml-6">
                          {file.description}
                        </span>
                      )}
                    </div>
                    {value === file.id && (
                      <div className="ml-auto h-4 w-4 rounded-full bg-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedFile?.description && (
        <p className="text-xs text-muted-foreground">{selectedFile.description}</p>
      )}
    </div>
  );
}