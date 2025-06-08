import React from "react";
import { cn } from "~/lib/utils";

type TypeIconProps = {
  type: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

export function TypeIcon({
  type,
  className,
  size = "md",
  showLabel = false,
}: TypeIconProps) {
  const typeColor = getTypeColor(type);
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span
        className={cn(
          "flex-shrink-0 flex items-center justify-center rounded",
          typeColor.bg,
          sizeClasses[size],
        )}
      >
        {getTypeIcon(type)}
      </span>
      {showLabel && (
        <span className={cn("text-xs font-medium", typeColor.text)}>
          {type}
        </span>
      )}
    </div>
  );
}

function getTypeIcon(type: string) {
  // Handle union types
  const primaryType = type.split(" | ").find((t) => t !== "null") || type;

  switch (primaryType) {
    case "string":
      return <StringIcon />;
    case "number":
    case "integer":
      return <NumberIcon />;
    case "boolean":
      return <BooleanIcon />;
    case "array":
      return <ArrayIcon />;
    case "object":
      return <ObjectIcon />;
    case "calculated":
      return <CalculatedIcon />;
    default:
      return <DefaultIcon />;
  }
}

function getTypeColor(type: string) {
  // Handle union types
  const primaryType = type.split(" | ").find((t) => t !== "null") || type;

  switch (primaryType) {
    case "string":
      return {
        bg: "bg-blue-100 dark:bg-blue-950",
        text: "text-blue-700 dark:text-blue-400",
      };
    case "number":
    case "integer":
      return {
        bg: "bg-green-100 dark:bg-green-950",
        text: "text-green-700 dark:text-green-400",
      };
    case "boolean":
      return {
        bg: "bg-purple-100 dark:bg-purple-950",
        text: "text-purple-700 dark:text-purple-400",
      };
    case "array":
      return {
        bg: "bg-amber-100 dark:bg-amber-950",
        text: "text-amber-700 dark:text-amber-400",
      };
    case "object":
      return {
        bg: "bg-indigo-100 dark:bg-indigo-950",
        text: "text-indigo-700 dark:text-indigo-400",
      };
    case "calculated":
      return {
        bg: "bg-rose-100 dark:bg-rose-950",
        text: "text-rose-700 dark:text-rose-400",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-400",
      };
  }
}

// Icon Components
function StringIcon() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3 h-3 text-blue-700 dark:text-blue-400"
    >
      <path d="M10 2v4a1 1 0 0 1-1 1H5v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-4Z" />
      <path d="M9 2a1 1 0 0 0-1 1v1h1V2Z" />
    </svg>
  );
}

function NumberIcon() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3 h-3 text-green-700 dark:text-green-400"
    >
      <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10 5.5A1.5 1.5 0 0 1 11.5 4a1.5 1.5 0 0 1 0 3A1.5 1.5 0 0 1 10 5.5ZM3.5 10A1.5 1.5 0 0 0 5 8.5a1.5 1.5 0 0 0-3 0A1.5 1.5 0 0 0 3.5 10Zm5 3.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

function BooleanIcon() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3 h-3 text-purple-700 dark:text-purple-400"
    >
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrayIcon() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3 h-3 text-amber-700 dark:text-amber-400"
    >
      <path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v11.5A2.25 2.25 0 0 1 15.75 18H4.25A2.25 2.25 0 0 1 2 15.75V4.25ZM4.25 3.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h11.5a.75.75 0 0 0 .75-.75V4.25a.75.75 0 0 0-.75-.75H4.25Z" />
      <path d="M6 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM6 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

function ObjectIcon() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3 h-3 text-indigo-700 dark:text-indigo-400"
    >
      <path
        fillRule="evenodd"
        d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 0 0-.629.74v13.65a.75.75 0 0 0 .629.74c1.748.286 3.543.435 5.371.435s3.623-.149 5.371-.435a.75.75 0 0 0 .629-.74V2.175a.75.75 0 0 0-.629-.74C13.623 1.149 11.828 1 10 1ZM5.25 4.5h9.5v1h-9.5v-1Zm0 5h9.5v1h-9.5v-1Zm9.5 5h-9.5v-1h9.5v1Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CalculatedIcon() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3 h-3 text-rose-700 dark:text-rose-400"
    >
      <path
        fillRule="evenodd"
        d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DefaultIcon() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3 h-3 text-gray-700 dark:text-gray-400"
    >
      <path d="M5.433 13.917a1.5 1.5 0 0 1 1.5-.833A4 4 0 0 0 10 14a4 4 0 0 0 3.078-1.915 1.5 1.5 0 0 1 1.732.804l1.128 2.256a.75.75 0 1 1-1.342.67L13.6 13.75a.705.705 0 0 0-.174-.147A5.5 5.5 0 0 1 6.53 13.55a.65.65 0 0 0-.24.208l-.963 1.927a.75.75 0 0 1-1.342-.67l1.45-2.9a.75.75 0 0 1 0-.077Z" />
      <path d="M10 8.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 8.5ZM9.25 2.54a.75.75 0 0 1 1.5 0v5.96a.75.75 0 0 1-1.5 0V2.54Z" />
    </svg>
  );
}
