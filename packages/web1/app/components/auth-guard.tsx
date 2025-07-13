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
  
  // Check if we're in automation mode and user just logged out
  const isAutomation = import.meta.env.VITE_AUTOMATION === "true";
  const isLoggedOut = typeof window !== "undefined" ? 
    sessionStorage.getItem("isLoggedOut") === "true" : false;
  
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
  
  // Redirect to sign-in if not authenticated (but not if user just logged out)
  if (!isSignedIn) {
    // In automation mode, if user is logged out and on sign-in page, let them stay
    if (isAutomation && isLoggedOut && location.pathname === "/sign-in") {
      // Let them stay on sign-in page, don't redirect
      return <>{children}</>;
    }
    // In automation mode, if user is logged out, redirect to sign-in
    if (isAutomation && isLoggedOut && location.pathname !== "/sign-in") {
      return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }
    // Normal mode or not logged out - redirect to sign-in
    if (!isAutomation) {
      return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }
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
    // Don't redirect from onboarding, connections, or chat pages
    const isAllowedWithoutConnection = 
      location.pathname === "/onboarding" || 
      location.pathname.startsWith("/connections") ||
      location.pathname === "/chat";
    
    if (connections.length === 0 && !isAllowedWithoutConnection) {
      return <Navigate to="/onboarding" replace />;
    }
  }
  
  return <>{children}</>;
}