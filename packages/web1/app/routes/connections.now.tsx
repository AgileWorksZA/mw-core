import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { 
  Cloud, 
  RefreshCw, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MoreVertical,
  CloudOff
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { MWNowAccount, MWConnection } from "~/db/schema";

interface NowAccountWithConnections extends MWNowAccount {
  connections: MWConnection[];
}

export default function NowAccountsPage() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [accounts, setAccounts] = useState<NowAccountWithConnections[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshingAccount, setRefreshingAccount] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<string | null>(null);
  
  useEffect(() => {
    loadAccounts();
  }, [userId]);
  
  async function loadAccounts() {
    if (!userId) return;
    
    try {
      // Load NOW accounts
      const accountsResponse = await fetch(`/api/now-accounts?userId=${userId}`);
      const accountsData = await accountsResponse.json();
      
      // Load all connections to match with NOW accounts
      const connectionsResponse = await fetch(`/api/connections?userId=${userId}`);
      const connectionsData = await connectionsResponse.json();
      
      // Group connections by NOW account
      const accountsWithConnections = accountsData.accounts.map((account: MWNowAccount) => ({
        ...account,
        connections: connectionsData.connections.filter(
          (conn: MWConnection) => conn.mw_now_account_id === account.id
        ),
      }));
      
      setAccounts(accountsWithConnections);
    } catch (error) {
      console.error("Failed to load NOW accounts:", error);
      toast.error("Failed to load NOW accounts");
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleRefresh(accountId: string) {
    setRefreshingAccount(accountId);
    
    try {
      const formData = new FormData();
      formData.append("clerk_user_id", userId!);
      formData.append("id", accountId);
      formData.append("_action", "refresh");
      
      const response = await fetch("/api/now-accounts", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to refresh");
      }
      
      // Show refresh results
      const { newFiles, missingFileIds, existingConnections } = data;
      
      if (newFiles.length === 0 && missingFileIds.length === 0) {
        toast.success("All connections are up to date");
      } else {
        // Navigate to a refresh UI to handle changes
        navigate(`/connections/now/refresh?accountId=${accountId}`, {
          state: { refreshData: data }
        });
      }
    } catch (error) {
      console.error("Failed to refresh:", error);
      toast.error("Failed to refresh NOW account");
    } finally {
      setRefreshingAccount(null);
    }
  }
  
  async function handleDelete(accountId: string) {
    if (!confirm("Are you sure? This will delete all connections from this NOW account.")) {
      return;
    }
    
    setDeletingAccount(accountId);
    
    try {
      const formData = new FormData();
      formData.append("clerk_user_id", userId!);
      formData.append("id", accountId);
      formData.append("_action", "delete");
      
      const response = await fetch("/api/now-accounts", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete");
      }
      
      toast.success("NOW account deleted");
      await loadAccounts();
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete NOW account");
    } finally {
      setDeletingAccount(null);
    }
  }
  
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <div className="grid gap-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            MoneyWorks NOW Accounts
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your MoneyWorks NOW cloud accounts and refresh connections
          </p>
        </div>
        <Button asChild>
          <Link to="/connections/now/new">
            <Plus className="mr-2 h-4 w-4" />
            Add NOW Account
          </Link>
        </Button>
      </div>
      
      {accounts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Cloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No NOW accounts yet</h3>
            <p className="text-muted-foreground mb-4">
              Connect to MoneyWorks NOW to access your cloud-hosted files
            </p>
            <Button asChild>
              <Link to="/connections/now/new">
                <Plus className="mr-2 h-4 w-4" />
                Add NOW Account
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Cloud className="h-5 w-5" />
                      {account.account_name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {account.mw_now_username}
                      {account.last_synced_at && (
                        <span className="ml-4 flex items-center gap-1 inline-flex">
                          <Clock className="h-3 w-3" />
                          Last synced: {new Date(account.last_synced_at).toLocaleDateString()}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleRefresh(account.id)}
                        disabled={refreshingAccount === account.id}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Files
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(account.id)}
                        className="text-destructive"
                        disabled={deletingAccount === account.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Connected Files:</span>
                    <span className="font-medium">{account.connections.length}</span>
                  </div>
                  
                  {account.connections.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Connections:</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {account.connections.slice(0, 4).map((conn) => (
                          <div 
                            key={conn.id}
                            className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
                          >
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{conn.connection_name}</span>
                          </div>
                        ))}
                        {account.connections.length > 4 && (
                          <div className="text-sm text-muted-foreground p-2">
                            +{account.connections.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRefresh(account.id)}
                      disabled={refreshingAccount === account.id}
                    >
                      {refreshingAccount === account.id ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh & Sync
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link to={`/connections?nowAccount=${account.id}`}>
                        View Connections
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}