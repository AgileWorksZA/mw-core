import { useAuth } from "~/hooks/use-auth";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";

export default function Welcome() {
  const { isLoaded, isSignedIn, user, signOut } = useAuth();
  
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">MoneyWorks Connect</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Enterprise accounting system interface
          </p>
        </div>
        
        {isSignedIn ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'User'}!
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/sign-in">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/sign-up" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}