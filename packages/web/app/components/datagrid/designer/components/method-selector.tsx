import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type GetMethod } from "../types/openApiTypes";

interface MethodSelectorProps {
  methods: GetMethod[];
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
}

export function MethodSelector({
  methods,
  selectedMethod,
  onMethodSelect,
}: MethodSelectorProps) {
  return (
    <Select
      value={selectedMethod}
      onValueChange={onMethodSelect}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an API endpoint" />
      </SelectTrigger>
      <SelectContent>
        {methods.map((method) => (
          <SelectItem
            key={method.fullPath}
            value={method.fullPath}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              <div className="font-medium">
                {method.fullPath}
              </div>
              <div className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {method.modelName}
              </div>
              {method.deprecated && (
                <div className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                  Deprecated
                </div>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}