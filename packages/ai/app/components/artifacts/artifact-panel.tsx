/**
 * Artifact Panel Component
 *
 * Container for displaying multiple artifacts with tabs or stacked cards.
 * Shows artifact type icon, title, and renders via ArtifactRenderer.
 */

import { useState } from "react";
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table2,
  TrendingUp,
  FileSpreadsheet,
  LayoutList,
  Layers,
  LayoutGrid,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { Artifact, ArtifactType } from "~/lib/artifacts/types";
import { ArtifactRenderer } from "./artifact-renderer";

interface ArtifactPanelProps {
  artifacts: Artifact[];
  className?: string;
}

type ViewMode = "tabs" | "stacked";

function getArtifactIcon(type: ArtifactType) {
  switch (type) {
    case "metric":
      return <TrendingUp className="size-4" />;
    case "table":
      return <Table2 className="size-4" />;
    case "pie-chart":
      return <PieChartIcon className="size-4" />;
    case "bar-chart":
      return <BarChart3 className="size-4" />;
    case "line-chart":
      return <LineChartIcon className="size-4" />;
    case "balance-sheet":
      return <FileSpreadsheet className="size-4" />;
    case "trial-balance":
      return <LayoutList className="size-4" />;
    default:
      return <FileSpreadsheet className="size-4" />;
  }
}

function getArtifactTypeLabel(type: ArtifactType): string {
  switch (type) {
    case "metric":
      return "Metric";
    case "table":
      return "Table";
    case "pie-chart":
      return "Pie Chart";
    case "bar-chart":
      return "Bar Chart";
    case "line-chart":
      return "Line Chart";
    case "balance-sheet":
      return "Balance Sheet";
    case "trial-balance":
      return "Trial Balance";
    default:
      return "Artifact";
  }
}

export function ArtifactPanel({ artifacts, className }: ArtifactPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("tabs");

  if (!artifacts || artifacts.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full text-muted-foreground", className)}>
        <div className="text-center p-8">
          <FileSpreadsheet className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No artifacts to display</p>
          <p className="text-xs mt-1">Ask about financial data to generate reports and charts</p>
        </div>
      </div>
    );
  }

  // Single artifact - render directly
  if (artifacts.length === 1) {
    const artifact = artifacts[0];
    return (
      <div className={cn("h-full overflow-auto", className)}>
        <Card className="m-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              {getArtifactIcon(artifact.type)}
              <span>{artifact.title}</span>
              <span className="ml-auto text-xs font-normal text-muted-foreground">
                {getArtifactTypeLabel(artifact.type)}
              </span>
            </CardTitle>
            {artifact.description && (
              <p className="text-xs text-muted-foreground">{artifact.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <ArtifactRenderer artifact={artifact} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Multiple artifacts - tabs or stacked view
  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header with view toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        <span className="text-sm font-medium">
          {artifacts.length} Artifacts
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "tabs" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setViewMode("tabs")}
            aria-label="Tab view"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === "stacked" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setViewMode("stacked")}
            aria-label="Stacked view"
          >
            <Layers className="size-4" />
          </Button>
        </div>
      </div>

      {/* Tab navigation */}
      {viewMode === "tabs" && (
        <div className="flex overflow-x-auto border-b bg-muted/30">
          {artifacts.map((artifact, index) => (
            <button
              key={artifact.id}
              onClick={() => setActiveTab(index)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors",
                activeTab === index
                  ? "border-primary text-primary bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {getArtifactIcon(artifact.type)}
              <span className="max-w-[120px] truncate">{artifact.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === "tabs" ? (
          // Tab view - show single artifact
          <div className="p-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {getArtifactIcon(artifacts[activeTab].type)}
                  <span>{artifacts[activeTab].title}</span>
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {getArtifactTypeLabel(artifacts[activeTab].type)}
                  </span>
                </CardTitle>
                {artifacts[activeTab].description && (
                  <p className="text-xs text-muted-foreground">
                    {artifacts[activeTab].description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ArtifactRenderer artifact={artifacts[activeTab]} />
              </CardContent>
            </Card>
          </div>
        ) : (
          // Stacked view - show all artifacts
          <div className="p-4 space-y-4">
            {artifacts.map((artifact) => (
              <Card key={artifact.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {getArtifactIcon(artifact.type)}
                    <span>{artifact.title}</span>
                    <span className="ml-auto text-xs font-normal text-muted-foreground">
                      {getArtifactTypeLabel(artifact.type)}
                    </span>
                  </CardTitle>
                  {artifact.description && (
                    <p className="text-xs text-muted-foreground">{artifact.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <ArtifactRenderer artifact={artifact} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
