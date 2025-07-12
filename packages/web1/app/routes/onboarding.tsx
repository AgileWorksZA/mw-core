import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import { AuthGuard } from "~/components/auth-guard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Server, Database, FolderOpen, Lock, CheckCircle2, ArrowRight, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useConnection } from "~/contexts/connection-context";

export default function Onboarding() {
  return (
    <AuthGuard>
      <OnboardingContent />
    </AuthGuard>
  );
}

function OnboardingContent() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { refreshConnections, connections, isLoading: isLoadingConnections } = useConnection();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to dashboard if user already has connections
  useEffect(() => {
    if (!isLoadingConnections && connections.length > 0) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoadingConnections, connections, navigate]);
  
  const [formData, setFormData] = useState({
    connection_name: "My MoneyWorks",
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
  };
  
  // Temporary helper for testing
  const handleAutoFill = () => {
    setFormData({
      connection_name: "Test MoneyWorks",
      mw_host: "localhost",
      mw_port: "6710",
      mw_data_file: "acme.moneyworks",
      mw_username: "Herman Geldenhuys",
      mw_password: "",
      mw_folder_name: "",
      mw_folder_password: "",
    });
    toast.info("Form auto-filled with test values");
  };
  
  const handleTestConnection = async () => {
    setIsLoading(true);
    setError(null);
    
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
        toast.success("Connection successful!");
        setStep(2);
      } else {
        setError(result.error || "Connection failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Connection test failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("_action", "create");
      formDataToSend.append("clerk_user_id", userId || "");
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append("is_default", "true");
      
      const response = await fetch("/api/connections", {
        method: "POST",
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 409) {
          throw new Error("A connection with this name already exists. Please use a different name.");
        }
        throw new Error(error.error || "Failed to save connection");
      }
      
      toast.success("Connection saved successfully!");
      
      // Refresh connections before navigating to ensure AuthGuard sees the new connection
      await refreshConnections();
      
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save connection";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Welcome to MoneyWorks Connect</CardTitle>
              <CardDescription>
                Let's set up your first MoneyWorks connection to get started
              </CardDescription>
            </div>
            {/* Temporary button for testing */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoFill}
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" />
              Auto-fill Test Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="connection_name">Connection Name</Label>
                  <Input
                    id="connection_name"
                    name="connection_name"
                    value={formData.connection_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Main Company Books"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mw_host">
                      <Server className="inline h-3 w-3 mr-1" />
                      Server Host
                    </Label>
                    <Input
                      id="mw_host"
                      name="mw_host"
                      value={formData.mw_host}
                      onChange={handleInputChange}
                      placeholder="localhost or IP address"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mw_port">Port</Label>
                    <Input
                      id="mw_port"
                      name="mw_port"
                      value={formData.mw_port}
                      onChange={handleInputChange}
                      placeholder="6710"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="mw_data_file">
                    <Database className="inline h-3 w-3 mr-1" />
                    Data File
                  </Label>
                  <Input
                    id="mw_data_file"
                    name="mw_data_file"
                    value={formData.mw_data_file}
                    onChange={handleInputChange}
                    placeholder="e.g., MyCompany.moneyworks"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mw_username">
                      <Lock className="inline h-3 w-3 mr-1" />
                      Username
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="mw_password">Password</Label>
                    <Input
                      id="mw_password"
                      name="mw_password"
                      type="password"
                      value={formData.mw_password}
                      onChange={handleInputChange}
                      placeholder="MoneyWorks password"
                      className="mt-1"
                      autoComplete="current-password"
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
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  type="button"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleTestConnection}
                  disabled={!formData.mw_data_file || !formData.mw_username || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      Test Connection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Connection Successful!</h3>
                <p className="text-muted-foreground">
                  Your MoneyWorks connection has been verified and is ready to use.
                </p>
              </div>
              
              <div className="rounded-lg border bg-muted/50 p-4">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium">Connection Name:</dt>
                    <dd>{formData.connection_name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Server:</dt>
                    <dd>{formData.mw_host}:{formData.mw_port}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Data File:</dt>
                    <dd>{formData.mw_data_file}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveConnection} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save & Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}