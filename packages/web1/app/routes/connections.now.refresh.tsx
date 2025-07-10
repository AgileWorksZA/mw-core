import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle2, 
  Cloud, 
  FileText, 
  Loader2, 
  Plus, 
  RefreshCw,
  Trash2,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import type { MoneyWorksNOWFile } from "@moneyworks/data";
import type { MWConnection } from "~/db/schema";

interface RefreshData {
  files: MoneyWorksNOWFile[];
  newFiles: MoneyWorksNOWFile[];
  missingFileIds: string[];
  existingConnections: number;
}

export default function RefreshNowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { userId } = useAuth();
  const accountId = searchParams.get("accountId");
  
  const [refreshData, setRefreshData] = useState<RefreshData | null>(null);
  const [existingConnections, setExistingConnections] = useState<MWConnection[]>([]);
  const [selectedNewFiles, setSelectedNewFiles] = useState<Set<string>>(new Set());
  const [selectedMissingConnections, setSelectedMissingConnections] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);
  
  useEffect(() => {
    if (!accountId) {
      navigate("/connections/now");
      return;
    }
    
    // Get refresh data from navigation state or fetch it
    if (location.state?.refreshData) {
      setRefreshData(location.state.refreshData);
      loadExistingConnections();
    } else {
      // If no state, redirect back
      navigate("/connections/now");
    }
  }, [accountId, location.state]);
  
  async function loadExistingConnections() {
    try {
      const response = await fetch(`/api/connections?userId=${userId}`);
      const data = await response.json();
      
      const nowConnections = data.connections.filter(
        (conn: MWConnection) => conn.mw_now_account_id === accountId
      );
      
      setExistingConnections(nowConnections);
    } catch (error) {
      console.error("Failed to load connections:", error);
    }
  }
  
  function toggleNewFile(fileId: string) {
    const newSelection = new Set(selectedNewFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedNewFiles(newSelection);
  }
  
  function toggleMissingConnection(connectionId: string) {
    const newSelection = new Set(selectedMissingConnections);
    if (newSelection.has(connectionId)) {
      newSelection.delete(connectionId);
    } else {
      newSelection.add(connectionId);
    }
    setSelectedMissingConnections(newSelection);
  }
  
  async function handleApplyChanges() {
    setIsApplying(true);
    
    try {
      // 1. Create new connections for selected files
      if (selectedNewFiles.size > 0 && refreshData) {
        const selectedFileData = refreshData.newFiles.filter(f => selectedNewFiles.has(f.id));
        
        const formData = new FormData();
        formData.append("clerk_user_id", userId!);
        formData.append("accountId", accountId!);
        formData.append("selectedFiles", JSON.stringify(selectedFileData));
        formData.append("_action", "create-connections");
        
        const response = await fetch("/api/now-accounts", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error("Failed to create new connections");
        }
      }
      
      // 2. Delete connections for missing files
      if (selectedMissingConnections.size > 0) {
        for (const connectionId of selectedMissingConnections) {
          const formData = new FormData();
          formData.append("clerk_user_id", userId!);
          formData.append("id", connectionId);
          formData.append("_action", "delete");
          
          await fetch("/api/connections", {
            method: "POST",
            body: formData,
          });
        }
      }
      
      toast.success("Changes applied successfully");
      navigate("/connections/now");
    } catch (error) {
      console.error("Failed to apply changes:", error);
      toast.error("Failed to apply some changes");
    } finally {
      setIsApplying(false);
    }
  }
  
  if (!refreshData) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const missingConnections = existingConnections.filter(
    conn => refreshData.missingFileIds.includes(conn.mw_now_file_id!)
  );
  
  const hasChanges = refreshData.newFiles.length > 0 || missingConnections.length > 0;
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Sync MoneyWorks NOW Changes
          </CardTitle>
          <CardDescription>
            Review and apply changes from your MoneyWorks NOW account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasChanges ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>All synced!</AlertTitle>
              <AlertDescription>
                Your connections are up to date with MoneyWorks NOW.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* New Files Section */}
              {refreshData.newFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-600" />
                      New Files Available ({refreshData.newFiles.length})
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (selectedNewFiles.size === refreshData.newFiles.length) {
                          setSelectedNewFiles(new Set());
                        } else {
                          setSelectedNewFiles(new Set(refreshData.newFiles.map(f => f.id)));
                        }
                      }}
                    >
                      {selectedNewFiles.size === refreshData.newFiles.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {refreshData.newFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                        onClick={() => toggleNewFile(file.id)}
                      >
                        <Checkbox
                          checked={selectedNewFiles.has(file.id)}
                          onCheckedChange={() => toggleNewFile(file.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{file.companyName}</p>
                          <p className="text-xs text-muted-foreground">{file.dataFile}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          New
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Missing Files Section */}
              {missingConnections.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Missing Files ({missingConnections.length})
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (selectedMissingConnections.size === missingConnections.length) {
                          setSelectedMissingConnections(new Set());
                        } else {
                          setSelectedMissingConnections(new Set(missingConnections.map(c => c.id)));
                        }
                      }}
                    >
                      {selectedMissingConnections.size === missingConnections.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <Alert variant="destructive" className="text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      These files are no longer available in MoneyWorks NOW. 
                      Select the connections you want to remove.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    {missingConnections.map((connection) => (
                      <div
                        key={connection.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                        onClick={() => toggleMissingConnection(connection.id)}
                      >
                        <Checkbox
                          checked={selectedMissingConnections.has(connection.id)}
                          onCheckedChange={() => toggleMissingConnection(connection.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{connection.connection_name}</p>
                          <p className="text-xs text-muted-foreground">{connection.mw_data_file}</p>
                        </div>
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Missing
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Existing Files Info */}
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  <CheckCircle2 className="inline h-4 w-4 mr-1 text-green-600" />
                  {refreshData.existingConnections} connections are up to date
                </p>
              </div>
            </>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {hasChanges && (
              <Button
                onClick={handleApplyChanges}
                disabled={isApplying || (selectedNewFiles.size === 0 && selectedMissingConnections.size === 0)}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying Changes...
                  </>
                ) : (
                  <>
                    Apply Changes
                    {(selectedNewFiles.size > 0 || selectedMissingConnections.size > 0) && (
                      <span className="ml-2">
                        ({selectedNewFiles.size + selectedMissingConnections.size})
                      </span>
                    )}
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate("/connections/now")}
              disabled={isApplying}
            >
              {hasChanges ? "Cancel" : "Back"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}