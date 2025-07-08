import { useAuth as useClerkAuth } from "@clerk/clerk-react";

// Mock user ID for automation mode
const AUTOMATION_USER_ID = "automation_user";

/**
 * Custom auth hook that supports automation mode
 * When VITE_AUTOMATION=true, it bypasses Clerk and returns mock auth data
 */
export function useAuth() {
  const isAutomation = import.meta.env.VITE_AUTOMATION === "true";
  
  if (isAutomation) {
    // Check if we're on the client side
    const isClient = typeof window !== "undefined";
    
    // Check if user is logged out (only on client)
    const isLoggedOut = isClient ? sessionStorage.getItem("isLoggedOut") === "true" : false;
    
    // Return mock auth data for automation
    return {
      isLoaded: true,
      isSignedIn: !isLoggedOut,
      userId: !isLoggedOut ? AUTOMATION_USER_ID : null,
      user: !isLoggedOut ? {
        id: AUTOMATION_USER_ID,
        emailAddresses: [{ emailAddress: "automation@test.com" }],
        firstName: "Automation",
        lastName: "User",
      } : null,
      signOut: () => {
        if (isClient) {
          sessionStorage.setItem("isLoggedOut", "true");
          window.location.href = "/sign-in";
        }
        return Promise.resolve();
      },
    };
  }
  
  // Use real Clerk auth
  return useClerkAuth();
}