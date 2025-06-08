import React, { useState, useCallback } from 'react';
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "~/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "~/components/ui/dialog";
import { Search, HelpCircle } from 'lucide-react';
import { queryJsonPath } from '../utils/json-path';
import type { JsonValue } from '../types';

interface JsonPathQueryProps {
  data: any;
  onPathSelect?: (path: string) => void;
}

export function JsonPathQuery({ data, onPathSelect }: JsonPathQueryProps) {
  const [query, setQuery] = useState<string>('$');
  const [queryResult, setQueryResult] = useState<JsonValue | JsonValue[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showQueryDialog, setShowQueryDialog] = useState<boolean>(false);
  const [showHelpDialog, setShowHelpDialog] = useState<boolean>(false);

  const executeQuery = useCallback(() => {
    try {
      // Clear previous results
      setErrorMessage(null);
      
      // Execute the query
      const result = queryJsonPath(data, query);
      
      // Update the result state
      setQueryResult(result);
      
      // If the result is just null or undefined, show a message
      if (result === null || result === undefined) {
        setErrorMessage('No results found for this query');
      }
      
      // Open the dialog to show results
      setShowQueryDialog(true);
    } catch (error) {
      setErrorMessage(`Error executing query: ${error instanceof Error ? error.message : String(error)}`);
      setQueryResult(null);
      setShowQueryDialog(true);
    }
  }, [data, query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeQuery();
    }
  }, [executeQuery]);
  
  const handleApplyPath = useCallback(() => {
    if (query && onPathSelect) {
      onPathSelect(query);
    }
    setShowQueryDialog(false);
  }, [query, onPathSelect]);

  const helpExamples = [
    { syntax: '$', description: 'Root element' },
    { syntax: '$.property', description: 'Select property at root level' },
    { syntax: '$[0]', description: 'Select first element of root array' },
    { syntax: "$.['property']", description: 'Select property with bracket notation' },
    { syntax: '$.array[*]', description: 'Select all elements in array' },
    { syntax: '$..property', description: 'Select all properties with name "property" at any level' },
    { syntax: '$.*', description: 'Select all properties at root level' },
    { syntax: '$..items[*].name', description: 'Select all name properties inside items arrays at any level' },
  ];

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <Input 
          placeholder="Enter JSON path query (e.g. $.properties.name)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow"
        />
        <Button onClick={executeQuery} size="sm">
          <Search className="h-4 w-4 mr-1" />
          Query
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowHelpDialog(true)}>
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Query Results Dialog */}
      <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>JSON Path Query Results</DialogTitle>
            <DialogDescription>
              Results for path: <code className="bg-muted px-1 rounded">{query}</code>
            </DialogDescription>
          </DialogHeader>
          
          {errorMessage ? (
            <div className="text-red-500 bg-red-50 p-4 rounded-md">
              {errorMessage}
            </div>
          ) : queryResult !== null ? (
            <div className="bg-muted p-4 rounded-md">
              <pre className="whitespace-pre-wrap overflow-x-auto text-sm">
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            </div>
          ) : null}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQueryDialog(false)}>Close</Button>
            {queryResult !== null && onPathSelect && (
              <Button onClick={handleApplyPath}>Apply Path</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>JSON Path Query Help</DialogTitle>
            <DialogDescription>
              JSON Path allows you to query and extract data from JSON documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Supported Syntax</h3>
            
            <div className="bg-muted rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted-foreground/10">
                  <tr>
                    <th className="px-4 py-2 text-left">Syntax</th>
                    <th className="px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {helpExamples.map((example, idx) => (
                    <tr key={idx} className="border-t border-muted-foreground/20">
                      <td className="px-4 py-2">
                        <code className="bg-muted-foreground/20 px-1 rounded">{example.syntax}</code>
                      </td>
                      <td className="px-4 py-2">{example.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <h3 className="text-lg font-medium">Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>All queries must begin with <code className="bg-muted-foreground/20 px-1 rounded">$</code> (representing the root element)</li>
              <li>Use dot notation <code className="bg-muted-foreground/20 px-1 rounded">$.property</code> for accessing object properties</li>
              <li>Use bracket notation <code className="bg-muted-foreground/20 px-1 rounded">$[0]</code> for accessing array elements</li>
              <li>Use <code className="bg-muted-foreground/20 px-1 rounded">..</code> for recursive descent (search at all levels)</li>
              <li>Use <code className="bg-muted-foreground/20 px-1 rounded">*</code> as a wildcard for selecting all elements or properties</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHelpDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}