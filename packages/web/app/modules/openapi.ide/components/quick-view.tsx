import type { FileContext } from "~/modules/ide/types";
import type { OpenAPIData } from "../types";
import { FileJson, Link, FileText } from "lucide-react";

export function QuickView({ file }: { file: FileContext }) {
  const data = file.data as OpenAPIData;

  if (!data?.document) {
    return (
      <div className="flex items-center gap-3 p-4">
        <FileJson className="h-8 w-8 text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">No OpenAPI Document</h3>
          <p className="text-sm text-muted-foreground">
            Import a specification to get started
          </p>
        </div>
      </div>
    );
  }

  const doc = data.document;
  const operationCount = doc.paths ? Object.keys(doc.paths).length : 0;

  return (
    <div className="flex items-center gap-3 p-4">
      <FileJson className="h-8 w-8 text-blue-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{doc.info.title}</h3>
        <p className="text-sm text-muted-foreground">
          v{doc.info.version} • {operationCount} endpoints
        </p>
        {data.source && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {data.source.type === "url" && <Link className="h-3 w-3" />}
            {data.source.type === "file" && <FileText className="h-3 w-3" />}
            {data.source.type}
            {data.source.url &&
              (() => {
                try {
                  return ` • ${new URL(data.source.url).hostname}`;
                } catch {
                  return ` • ${data.source.url}`;
                }
              })()}
            {data.source.fileName && ` • ${data.source.fileName}`}
          </p>
        )}
      </div>
    </div>
  );
}
