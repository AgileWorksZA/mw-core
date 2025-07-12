import { useConnection } from "~/contexts/connection-context";
import { Navigation } from "~/components/navigation";
import { useAuth } from "~/hooks/use-auth";

export default function TestConnectionContext() {
  const { userId, isSignedIn } = useAuth();
  const { connections, currentConnection, isLoading, error } = useConnection();
  
  return (
    <>
      <Navigation />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Connection Context Debug</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h2 className="font-semibold">Auth State:</h2>
            <pre className="text-sm mt-2">
              {JSON.stringify({ userId, isSignedIn }, null, 2)}
            </pre>
          </div>
          
          <div className="p-4 border rounded">
            <h2 className="font-semibold">Connection State:</h2>
            <pre className="text-sm mt-2">
              {JSON.stringify({ 
                isLoading, 
                error,
                connectionsCount: connections.length,
                currentConnectionId: currentConnection?.id,
                currentConnectionName: currentConnection?.connection_name
              }, null, 2)}
            </pre>
          </div>
          
          <div className="p-4 border rounded">
            <h2 className="font-semibold">All Connections:</h2>
            <pre className="text-sm mt-2">
              {JSON.stringify(connections, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}