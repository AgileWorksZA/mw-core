import { useAuth } from "~/hooks/use-auth";
import { Navigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  
  // Check if this is a fresh visit (no referrer from within the app)
  const isFreshVisit = searchParams.get("fresh") === "true";
  
  useEffect(() => {
    if (isLoaded) {
      // Add a small delay to ensure Clerk has fully initialized
      setTimeout(() => setShouldNavigate(true), 100);
    }
  }, [isLoaded]);
  
  // Show loading state while Clerk is initializing
  if (!isLoaded || !shouldNavigate) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Loading MoneyWorks...</h1>
        </div>
      </div>
    );
  }
  
  // For fresh visits or unauthenticated users, go to welcome page
  if (isFreshVisit || !isSignedIn) {
    return <Navigate to="/welcome" replace />;
  }
  
  // Only redirect authenticated users to dashboard
  return <Navigate to="/dashboard" replace />;
}