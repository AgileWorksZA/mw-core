import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Diff, Eye, EyeOff } from "lucide-react";
import { jsonArtifactLogger } from '../utils/logger';

interface JsonDiffProps {
  currentJson: any;
  originalJson: any;
}

interface DiffResult {
  type: 'added' | 'removed' | 'changed' | 'unchanged';
  path: string;
  oldValue?: any;
  newValue?: any;
  children?: DiffResult[];
}

export function JsonDiffViewer({ currentJson, originalJson }: JsonDiffProps) {
  const [diffResults, setDiffResults] = useState<DiffResult[]>([]);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(true);

  // Calculate diff when inputs change
  useEffect(() => {
    try {
      const results = compareJson(originalJson, currentJson);
      setDiffResults(results);
    } catch (error) {
      jsonArtifactLogger.error('Error calculating JSON diff:', error);
    }
  }, [currentJson, originalJson]);

  // Compare two JSON objects and build the diff
  const compareJson = (oldJson: any, newJson: any, path: string = '', results: DiffResult[] = []): DiffResult[] => {
    // Handle case where both are undefined
    if (oldJson === undefined && newJson === undefined) {
      return results;
    }
    
    // If one is undefined, the other was added or removed
    if (oldJson === undefined) {
      results.push({
        type: 'added',
        path,
        newValue: newJson
      });
      return results;
    }
    
    if (newJson === undefined) {
      results.push({
        type: 'removed',
        path,
        oldValue: oldJson
      });
      return results;
    }
    
    // Both are primitive types but different
    if (typeof oldJson !== 'object' && typeof newJson !== 'object') {
      if (oldJson !== newJson) {
        results.push({
          type: 'changed',
          path,
          oldValue: oldJson,
          newValue: newJson
        });
      } else if (!showOnlyDifferences) {
        results.push({
          type: 'unchanged',
          path,
          oldValue: oldJson,
          newValue: newJson
        });
      }
      return results;
    }
    
    // If one is object and the other is not
    if (typeof oldJson !== 'object' || typeof newJson !== 'object') {
      results.push({
        type: 'changed',
        path,
        oldValue: oldJson,
        newValue: newJson
      });
      return results;
    }
    
    // If one is array and the other is not
    if (Array.isArray(oldJson) !== Array.isArray(newJson)) {
      results.push({
        type: 'changed',
        path,
        oldValue: oldJson,
        newValue: newJson
      });
      return results;
    }
    
    // Both are arrays
    if (Array.isArray(oldJson)) {
      const difResult: DiffResult = {
        type: 'unchanged',
        path,
        children: []
      };
      
      // Check array length
      if (oldJson.length !== newJson.length) {
        difResult.type = 'changed';
      }
      
      // Compare array elements
      const maxLength = Math.max(oldJson.length, newJson.length);
      for (let i = 0; i < maxLength; i++) {
        const itemPath = `${path}[${i}]`;
        
        if (i >= oldJson.length) {
          // Added item
          difResult.children?.push({
            type: 'added',
            path: itemPath,
            newValue: newJson[i]
          });
          difResult.type = 'changed';
        } else if (i >= newJson.length) {
          // Removed item
          difResult.children?.push({
            type: 'removed',
            path: itemPath,
            oldValue: oldJson[i]
          });
          difResult.type = 'changed';
        } else {
          // Compare existing items
          const itemResults: DiffResult[] = [];
          compareJson(oldJson[i], newJson[i], itemPath, itemResults);
          
          // Check if any differences in children
          if (itemResults.some(r => r.type !== 'unchanged')) {
            difResult.type = 'changed';
          }
          
          // Add child results
          difResult.children?.push(...itemResults);
        }
      }
      
      // Only add to results if there are differences or we want to show all
      if (difResult.type !== 'unchanged' || !showOnlyDifferences) {
        results.push(difResult);
      }
      
      return results;
    }
    
    // Both are objects
    const diffResult: DiffResult = {
      type: 'unchanged',
      path,
      children: []
    };
    
    // Get all keys from both objects
    const allKeys = new Set([...Object.keys(oldJson), ...Object.keys(newJson)]);
    
    for (const key of allKeys) {
      const propPath = path ? `${path}.${key}` : key;
      
      if (!(key in oldJson)) {
        // Added property
        diffResult.children?.push({
          type: 'added',
          path: propPath,
          newValue: newJson[key]
        });
        diffResult.type = 'changed';
      } else if (!(key in newJson)) {
        // Removed property
        diffResult.children?.push({
          type: 'removed',
          path: propPath,
          oldValue: oldJson[key]
        });
        diffResult.type = 'changed';
      } else {
        // Compare existing properties
        const propResults: DiffResult[] = [];
        compareJson(oldJson[key], newJson[key], propPath, propResults);
        
        // Check if any differences in children
        if (propResults.some(r => r.type !== 'unchanged')) {
          diffResult.type = 'changed';
        }
        
        // Add child results
        diffResult.children?.push(...propResults);
      }
    }
    
    // Only add to results if there are differences or we want to show all
    if (diffResult.type !== 'unchanged' || !showOnlyDifferences) {
      results.push(diffResult);
    }
    
    return results;
  };

  // Renders a diff item
  const renderDiffItem = (diff: DiffResult, index: number): React.ReactNode => {
    // Skip unchanged if only showing differences
    if (showOnlyDifferences && diff.type === 'unchanged') {
      return null;
    }
    
    // Get text color class based on diff type
    const getColorClass = (type: string): string => {
      switch (type) {
        case 'added': return 'text-green-600';
        case 'removed': return 'text-red-600';
        case 'changed': return 'text-blue-600';
        default: return 'text-gray-600';
      }
    };
    
    const colorClass = getColorClass(diff.type);
    
    // Format value for display
    const formatValue = (value: any): string => {
      if (value === undefined) return 'undefined';
      if (value === null) return 'null';
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
      }
      return String(value);
    };
    
    return (
      <div key={index} className="mb-2">
        <div className={`flex items-start gap-2 ${colorClass}`}>
          <div className="font-semibold">{diff.path || 'root'}</div>
          <div className="text-xs mt-1">({diff.type})</div>
        </div>
        
        {(diff.type === 'changed' || diff.type === 'removed') && diff.oldValue !== undefined && (
          <div className="bg-red-50 p-2 rounded mb-1 text-sm">
            <span className="text-xs text-red-600 font-semibold">Old:</span>
            <pre className="whitespace-pre-wrap overflow-x-auto">{formatValue(diff.oldValue)}</pre>
          </div>
        )}
        
        {(diff.type === 'changed' || diff.type === 'added') && diff.newValue !== undefined && (
          <div className="bg-green-50 p-2 rounded mb-1 text-sm">
            <span className="text-xs text-green-600 font-semibold">New:</span>
            <pre className="whitespace-pre-wrap overflow-x-auto">{formatValue(diff.newValue)}</pre>
          </div>
        )}
        
        {diff.children && diff.children.length > 0 && (
          <div className="ml-4 pl-2 border-l-2 border-gray-200">
            {diff.children.map((child, childIndex) => renderDiffItem(child, childIndex))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Diff className="h-4 w-4" />
          <span>Compare Changes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>JSON Diff Viewer</DialogTitle>
          <DialogDescription>
            Comparing current JSON with original data
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
            className="flex items-center gap-1"
          >
            {showOnlyDifferences ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showOnlyDifferences ? 'Show All' : 'Show Differences Only'}
          </Button>
        </div>
        
        <div className="bg-muted p-4 rounded">
          {diffResults.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No differences found
            </div>
          ) : (
            diffResults.map((diff, index) => renderDiffItem(diff, index))
          )}
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}