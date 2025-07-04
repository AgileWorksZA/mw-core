import { useAuth } from "~/hooks/use-auth";
import { Navigate, useLocation } from "react-router";
import { Skeleton } from "./ui/skeleton";
import { useConnection } from "~/contexts/connection-context";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireConnection?: boolean;
}

export function AuthGuard({ children, requireConnection = false }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const { connections, isLoading: isLoadingConnections } = useConnection();
  
  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }
  
  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  
  // Show loading state while connections are loading
  if (requireConnection && isLoadingConnections) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }
  
  // Check for connections if required
  if (requireConnection && !isLoadingConnections) {
    // Don't redirect from onboarding or connections pages
    const isOnboardingOrConnections = 
      location.pathname === "/onboarding" || 
      location.pathname.startsWith("/connections");
    
    if (connections.length === 0 && !isOnboardingOrConnections) {
      return <Navigate to="/onboarding" replace />;
    }
  }
  
  return <>{children}</>;
}