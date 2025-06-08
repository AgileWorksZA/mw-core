import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { File, Plus, ArrowLeft } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { FileManifest } from "~/modules/ide/types";
import { getAdapter } from "~/modules/ide/adapter/register";
import { useIde } from "~/modules/ide/hooks/use-ide";

export default function IdeByType() {
  const { type } = useParams();
  const navigate = useNavigate();

  // Get the project context
  const ide = useIde();
  const { files, fileOrder } = ide;

  // Get adapter for this type
  const adapter = type ? getAdapter(type) : null;
  const typeMetadata = adapter?.metadata;

  // Filter files by type
  const filesOfType = (fileOrder || [])
    .map((id) => files?.[id])
    .filter((file) => file?.type === type)
    .filter(Boolean) as FileManifest[];

  const handleItemClick = (item: FileManifest) => {
    navigate(`/ide/${item.type}/${item.id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with back button */}
      <div className="mb-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/ide")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {typeMetadata?.name || type} Files
          </h1>
          <p className="text-muted-foreground">
            {filesOfType.length} {filesOfType.length === 1 ? "file" : "files"}
          </p>
          {typeMetadata?.category && (
            <Badge variant="outline" className="mt-2">
              {typeMetadata.category}
            </Badge>
          )}
        </div>
        <Button size="sm" onClick={() => navigate(`/ide/new/${type}`)}>
          <Plus className="h-4 w-4 mr-1" />
          New {typeMetadata?.name || type}
        </Button>
      </div>

      {filesOfType.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <File className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">
              No {typeMetadata?.name || type} files found
            </p>
            <p className="text-sm text-muted-foreground">
              Create your first {typeMetadata?.name || type} file to get started
            </p>
            <Button
              className="mt-4"
              size="sm"
              onClick={() => navigate(`/ide/new/${type}`)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create {typeMetadata?.name || type}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filesOfType.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleItemClick(item)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {adapter?.Icon ? (
                      <adapter.Icon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <File className="h-5 w-5 text-gray-500" />
                    )}
                    <CardTitle className="text-base">
                      {item.path.split("/").pop() || item.path}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary">{item.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">
                  {item.path}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
