import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "~/hooks/use-auth";
import type { MWConnection } from "~/db/schema";

interface ConnectionContextType {
  connections: MWConnection[];
  currentConnection: MWConnection | null;
  isLoading: boolean;
  error: string | null;
  setCurrentConnection: (connection: MWConnection) => void;
  refreshConnections: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const { userId, isSignedIn } = useAuth();
  const [connections, setConnections] = useState<MWConnection[]>([]);
  const [currentConnection, setCurrentConnection] = useState<MWConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const refreshConnections = async () => {
    if (!userId || !isSignedIn) {
      console.log("[ConnectionContext] No userId or not signed in, clearing connections");
      setConnections([]);
      setCurrentConnection(null);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("[ConnectionContext] Loading connections for user:", userId);
      setIsLoading(true);
      setError(null);
      
      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`/api/connections?userId=${userId}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      console.log("[ConnectionContext] Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[ConnectionContext] Response error:", errorText);
        throw new Error(`Failed to load connections: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      const userConnections = data.connections || [];
      console.log("[ConnectionContext] Loaded connections:", userConnections.length);
      setConnections(userConnections);
      
      // Set current connection from session storage or use default
      const savedConnectionId = sessionStorage.getItem("currentConnectionId");
      if (savedConnectionId) {
        const savedConnection = userConnections.find((c: MWConnection) => c.id === savedConnectionId);
        if (savedConnection) {
          setCurrentConnection(savedConnection);
        } else {
          // Saved connection no longer exists, use default
          const defaultConnection = userConnections.find((c: MWConnection) => c.is_default) || userConnections[0];
          setCurrentConnection(defaultConnection || null);
        }
      } else {
        // No saved connection, use default
        const defaultConnection = userConnections.find((c: MWConnection) => c.is_default) || userConnections[0];
        setCurrentConnection(defaultConnection || null);
      }
    } catch (err) {
      console.error("[ConnectionContext] Error loading connections:", err);
      setError(err instanceof Error ? err.message : "Failed to load connections");
      setConnections([]); // Ensure we have an empty array on error
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    refreshConnections();
  }, [userId, isSignedIn]);
  
  const handleSetCurrentConnection = async (connection: MWConnection) => {
    setCurrentConnection(connection);
    sessionStorage.setItem("currentConnectionId", connection.id);
    
    // Update last used timestamp
    try {
      const formData = new FormData();
      formData.append("_action", "update-last-used");
      formData.append("clerk_user_id", userId || "");
      formData.append("id", connection.id);
      
      await fetch("/api/connections", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Failed to update last used:", error);
    }
  };
  
  return (
    <ConnectionContext.Provider
      value={{
        connections,
        currentConnection,
        isLoading,
        error,
        setCurrentConnection: handleSetCurrentConnection,
        refreshConnections,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
}