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
    // Return mock auth data for automation
    return {
      isLoaded: true,
      isSignedIn: true,
      userId: AUTOMATION_USER_ID,
      user: {
        id: AUTOMATION_USER_ID,
        emailAddresses: [{ emailAddress: "automation@test.com" }],
        firstName: "Automation",
        lastName: "User",
      },
      signOut: () => Promise.resolve(),
    };
  }
  
  // Use real Clerk auth
  return useClerkAuth();
}