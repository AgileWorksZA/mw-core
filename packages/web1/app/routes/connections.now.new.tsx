import { useState } from "react";
import { useNavigate, useSubmit, Form } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function NewNowAccountPage() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    formData.append("clerk_user_id", userId!);
    formData.append("_action", "create");
    
    try {
      const response = await fetch("/api/now-accounts", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create NOW account");
      }
      
      // Navigate to file selection with the new account ID
      navigate(`/connections/now/select-files?accountId=${data.account.id}`);
    } catch (err) {
      console.error("Failed to create NOW account:", err);
      setError(err instanceof Error ? err.message : "Failed to create NOW account");
      setIsLoading(false);
    }
  }
  
  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Connect to MoneyWorks NOW</CardTitle>
          <CardDescription>
            Enter your MoneyWorks NOW credentials to access your cloud-hosted files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account_name">Account Name</Label>
              <Input
                id="account_name"
                name="account_name"
                placeholder="My MoneyWorks NOW Account"
                required
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                A friendly name to identify this NOW account
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mw_now_username">NOW Username</Label>
              <Input
                id="mw_now_username"
                name="mw_now_username"
                type="email"
                placeholder="user@example.com"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mw_now_password">NOW Password</Label>
              <Input
                id="mw_now_password"
                name="mw_now_password"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect & Select Files"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/connections")}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}