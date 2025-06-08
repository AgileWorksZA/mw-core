import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Keyboard } from "lucide-react";

interface KeyboardShortcut {
  key: string;
  description: string;
  section?: string;
}

const shortcuts: KeyboardShortcut[] = [
  // Editor Navigation
  { section: 'Navigation', key: '↑/↓', description: 'Move cursor up/down' },
  { section: 'Navigation', key: '←/→', description: 'Move cursor left/right' },
  { section: 'Navigation', key: 'Home/End', description: 'Go to beginning/end of line' },
  { section: 'Navigation', key: 'Ctrl+Home/End', description: 'Go to beginning/end of file' },
  { section: 'Navigation', key: 'Ctrl+G', description: 'Go to line' },
  
  // Selection
  { section: 'Selection', key: 'Shift+Arrow', description: 'Extend selection' },
  { section: 'Selection', key: 'Ctrl+A', description: 'Select all' },
  { section: 'Selection', key: 'Ctrl+Shift+Arrow', description: 'Select word/line' },
  
  // Editing
  { section: 'Editing', key: 'Ctrl+X/C/V', description: 'Cut/Copy/Paste' },
  { section: 'Editing', key: 'Ctrl+Z', description: 'Undo' },
  { section: 'Editing', key: 'Ctrl+Shift+Z', description: 'Redo' },
  { section: 'Editing', key: 'Tab', description: 'Indent' },
  { section: 'Editing', key: 'Shift+Tab', description: 'Outdent' },
  { section: 'Editing', key: 'Ctrl+]', description: 'Indent selection' },
  { section: 'Editing', key: 'Ctrl+[', description: 'Outdent selection' },
  
  // Search
  { section: 'Search', key: 'Ctrl+F', description: 'Find' },
  { section: 'Search', key: 'F3', description: 'Find next' },
  { section: 'Search', key: 'Shift+F3', description: 'Find previous' },
  { section: 'Search', key: 'Ctrl+H', description: 'Find and replace' },
  
  // JSON Specific
  { section: 'JSON', key: 'Ctrl+Space', description: 'Trigger suggestions' },
  { section: 'JSON', key: 'Ctrl+Shift+I', description: 'Format document' },
  { section: 'JSON', key: 'Ctrl+/', description: 'Toggle line comment' },
  { section: 'JSON', key: 'Ctrl+S', description: 'Save changes' },
];

export function KeyboardShortcutsButton() {
  const sections = [...new Set(shortcuts.map(s => s.section))];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Keyboard className="h-4 w-4" />
          <span>Keyboard Shortcuts</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4 max-h-96 overflow-y-auto p-1">
          <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
          
          {sections.map(section => (
            <div key={section} className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">{section}</h4>
              <div className="space-y-1">
                {shortcuts
                  .filter(s => s.section === section)
                  .map((shortcut, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <code className="bg-muted px-1 rounded text-xs">{shortcut.key}</code>
                      <span className="text-xs">{shortcut.description}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}