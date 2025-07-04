import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Building2, Search } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";
import type { MWConnection } from "~/db/schema";
import { useAuth } from "~/hooks/use-auth";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  currentMembers: string[]; // Connection IDs already in the group
}

export function AddCompanyDialog({
  open,
  onOpenChange,
  groupId,
  groupName,
  currentMembers,
}: AddCompanyDialogProps) {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState<MWConnection[]>([]);
  const [selectedConnections, setSelectedConnections] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch available connections
  useEffect(() => {
    if (open && userId) {
      fetch(`/api/connections?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          console.log("[AddCompanyDialog] Fetched connections:", data);
          // Filter out connections already in the group
          const availableConnections = (data.connections || []).filter(
            (conn: MWConnection) => !currentMembers.includes(conn.id)
          );
          console.log("[AddCompanyDialog] Available connections after filtering:", availableConnections);
          setConnections(availableConnections);
        })
        .catch(err => console.error("Failed to fetch connections:", err));
    }
  }, [open, currentMembers, userId]);

  const filteredConnections = connections.filter(conn =>
    conn.connection_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.mw_data_file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedConnections.size === 0) return;

    setLoading(true);

    try {
      // Add each selected connection to the group
      const promises = Array.from(selectedConnections).map(connectionId =>
        fetch("/api/groups/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            group_id: groupId,
            connection_id: connectionId,
          }),
        })
      );

      await Promise.all(promises);
      
      // Reset and close
      setSelectedConnections(new Set());
      setSearchTerm("");
      onOpenChange(false);
      
      // Refresh the page to show new members
      navigate(0);
    } catch (error) {
      console.error("Failed to add companies:", error);
      alert("Failed to add companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleConnection = (connectionId: string) => {
    const newSelected = new Set(selectedConnections);
    if (newSelected.has(connectionId)) {
      newSelected.delete(connectionId);
    } else {
      newSelected.add(connectionId);
    }
    setSelectedConnections(newSelected);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Companies to {groupName}</DialogTitle>
            <DialogDescription>
              Select one or more companies to add to this group.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredConnections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {connections.length === 0 
                    ? "No available companies to add"
                    : "No companies match your search"
                  }
                </div>
              ) : (
                filteredConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50"
                  >
                    <Checkbox
                      id={connection.id}
                      checked={selectedConnections.has(connection.id)}
                      onCheckedChange={() => toggleConnection(connection.id)}
                    />
                    <label
                      htmlFor={connection.id}
                      className="flex-1 cursor-pointer flex items-center gap-3"
                    >
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{connection.connection_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {connection.mw_data_file} • {connection.mw_host}
                        </p>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
            
            {selectedConnections.size > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                {selectedConnections.size} company{selectedConnections.size !== 1 ? 'ies' : 'y'} selected
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || selectedConnections.size === 0}
            >
              {loading ? "Adding..." : `Add ${selectedConnections.size} Company${selectedConnections.size !== 1 ? 'ies' : ''}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}