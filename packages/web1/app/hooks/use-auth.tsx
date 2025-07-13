import { useAuth as useClerkAuth } from "@clerk/clerk-react";

/**
 * Auth hook that uses Clerk authentication
 */
export function useAuth() {
  return useClerkAuth();
}