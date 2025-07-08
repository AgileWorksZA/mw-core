import { SignIn } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";

export default function SignInPage() {
  const navigate = useNavigate();
  const isAutomation = import.meta.env.VITE_AUTOMATION === "true";

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    // Check if user just logged out
    const isLoggedOut = sessionStorage.getItem("isLoggedOut");
    
    if (isLoggedOut) {
      // Clear the flag so future visits will auto-redirect
      sessionStorage.removeItem("isLoggedOut");
      return; // Don't auto-redirect
    }
    
    // In automation mode, automatically redirect to dashboard
    if (isAutomation) {
      navigate("/dashboard");
    }
  }, [isAutomation, navigate]);

  if (isAutomation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">MoneyWorks Connect</h1>
          <p className="text-muted-foreground">Automation Mode Active</p>
          <Button onClick={() => navigate("/dashboard")}>
            Continue as Automation User
          </Button>
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