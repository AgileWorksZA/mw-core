import { SignIn } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const navigate = useNavigate();
  const isAutomation = import.meta.env.VITE_AUTOMATION === "true";
  
  // Check logout status immediately (client-side only)
  const [isLoggedOut, setIsLoggedOut] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("isLoggedOut") === "true";
    }
    return false;
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    // Check if user just logged out
    const loggedOutFlag = sessionStorage.getItem("isLoggedOut");
    
    if (loggedOutFlag) {
      setIsLoggedOut(true);
      // Clear the flag so future visits will auto-redirect
      sessionStorage.removeItem("isLoggedOut");
      return; // Don't auto-redirect - stay on sign-in page
    }
    
    // In automation mode, automatically redirect to dashboard only if not logged out
    if (isAutomation && !loggedOutFlag) {
      navigate("/dashboard");
    }
  }, [isAutomation, navigate]);

  if (isAutomation) {
    if (isLoggedOut) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
          <div className="w-full max-w-md space-y-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">MoneyWorks Connect</h1>
            <p className="text-muted-foreground">You have been logged out successfully</p>
            <Button onClick={() => {
              setIsLoggedOut(false);
              navigate("/dashboard");
            }}>
              Sign In Again
            </Button>
          </div>
        </div>
      );
    }
    
    // Loading state while checking logout status
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">MoneyWorks Connect</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">MoneyWorks Connect</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your MoneyWorks data
          </p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none border rounded-lg",
            },
          }}
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
        
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/sign-up" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}