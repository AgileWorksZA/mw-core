import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import { AuthGuard } from "~/components/auth-guard";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Server, Database, FolderOpen, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";

export default function NewConnection() {
  return (
    <AuthGuard>
      <NewConnectionContent />
    </AuthGuard>
  );
}

function NewConnectionContent() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    connection_name: "",
    mw_host: "localhost",
    mw_port: "6710",
    mw_data_file: "",
    mw_username: "",
    mw_password: "",
    mw_folder_name: "",
    mw_folder_password: "",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setTestSuccess(false);
  };
  
  const handleTestConnection = async () => {
    setIsTesting(true);
    setError(null);
    setTestSuccess(false);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("_action", "test");
      formDataToSend.append("clerk_user_id", userId || "");
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      const response = await fetch("/api/connections", {
        method: "POST",
        body: formDataToSend,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTestSuccess(true);
        toast.success("Connection test successful!");
      } else {
        setError(result.error || "Connection test failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Connection test failed";
      setError(errorMessage);
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testSuccess && !confirm("Connection hasn't been tested. Save anyway?")) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("_action", "create");
      formDataToSend.append("clerk_user_id", userId || "");
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      const response = await fetch("/api/connections", {
        method: "POST",
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save connection");
      }
      
      toast.success("Connection added successfully!");
      navigate("/connections");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save connection";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Navigation />
      <main className="container py-8 max-w-2xl">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link to="/connections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Connections
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight">
            Add New Connection
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect to a MoneyWorks server
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Connection Details</CardTitle>
            <CardDescription>
              Enter your MoneyWorks server information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="connection_name">Connection Name *</Label>
                <Input
                  id="connection_name"
                  name="connection_name"
                  value={formData.connection_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Company Books"
                  className="mt-1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mw_host">
                    <Server className="inline h-3 w-3 mr-1" />
                    Server Host *
                  </Label>
                  <Input
                    id="mw_host"
                    name="mw_host"
                    value={formData.mw_host}
                    onChange={handleInputChange}
                    placeholder="localhost or IP address"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mw_port">Port *</Label>
                  <Input
                    id="mw_port"
                    name="mw_port"
                    type="number"
                    value={formData.mw_port}
                    onChange={handleInputChange}
                    placeholder="6710"
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="mw_data_file">
                  <Database className="inline h-3 w-3 mr-1" />
                  Data File *
                </Label>
                <Input
                  id="mw_data_file"
                  name="mw_data_file"
                  value={formData.mw_data_file}
                  onChange={handleInputChange}
                  placeholder="e.g., MyCompany.moneyworks"
                  className="mt-1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mw_username">
                    <Lock className="inline h-3 w-3 mr-1" />
                    Username *
                  </Label>
                  <Input
                    id="mw_username"
                    name="mw_username"
                    type="text"
                    value={formData.mw_username}
                    onChange={handleInputChange}
                    placeholder="MoneyWorks username"
                    className="mt-1"
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mw_password">Password *</Label>
                  <Input
                    id="mw_password"
                    name="mw_password"
                    type="password"
                    value={formData.mw_password}
                    onChange={handleInputChange}
                    placeholder="MoneyWorks password"
                    className="mt-1"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4 border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Optional: Two-level authentication (if your server requires folder authentication)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mw_folder_name">
                      <FolderOpen className="inline h-3 w-3 mr-1" />
                      Folder Name
                    </Label>
                    <Input
                      id="mw_folder_name"
                      name="mw_folder_name"
                      value={formData.mw_folder_name}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mw_folder_password">Folder Password</Label>
                    <Input
                      id="mw_folder_password"
                      name="mw_folder_password"
                      type="password"
                      value={formData.mw_folder_password}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {testSuccess && (
                <Alert>
                  <AlertDescription className="text-green-600">
                    ✓ Connection test successful
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={!formData.mw_data_file || !formData.mw_username || isTesting}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
                
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Connection"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}