import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { GetMethod } from "../types/openApiTypes";

interface MethodHeaderProps {
  method: GetMethod | undefined;
}

export function MethodHeader({ method }: MethodHeaderProps) {
  if (!method) return null;
  // elipses for overflow
  return (
    <div className="overflow-hidden flex flex-row flex-grow whitespace-nowrap text-ellipsis">
      {method.deprecated && (
        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
          Deprecated
        </span>
      )}
      {method.description && (
        <span className="text-sm mt-2 text-foreground font-medium">
          {method.description}
        </span>
      )}
    </div>
  );
}
