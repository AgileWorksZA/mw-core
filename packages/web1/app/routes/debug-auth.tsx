import { useConnection } from "~/contexts/connection-context";
import { useAuth } from "~/hooks/use-auth";

export default function DebugAuth() {
	const { isLoaded, isSignedIn, userId } = useAuth();
	const { connections, isLoading: isLoadingConnections } = useConnection();

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Auth Debug Info</h1>

			<div className="space-y-4">
				<div className="border rounded p-4">
					<h2 className="font-semibold mb-2">Clerk Auth State</h2>
					<pre className="text-sm">
						{JSON.stringify(
							{
								isLoaded,
								isSignedIn,
								userId,
								automation: import.meta.env.VITE_AUTOMATION,
							},
							null,
							2,
						)}
					</pre>
				</div>

				<div className="border rounded p-4">
					<h2 className="font-semibold mb-2">Connections</h2>
					<pre className="text-sm">
						{JSON.stringify(
							{
								isLoadingConnections,
								connectionsCount: connections.length,
								connections: connections.map((c) => ({
									id: c.id,
									name: c.connection_name,
								})),
							},
							null,
							2,
						)}
					</pre>
				</div>

				<div className="border rounded p-4">
					<h2 className="font-semibold mb-2">Environment</h2>
					<pre className="text-sm">
						{JSON.stringify(
							{
								VITE_AUTOMATION: import.meta.env.VITE_AUTOMATION,
								VITE_CLERK_PUBLISHABLE_KEY: import.meta.env
									.VITE_CLERK_PUBLISHABLE_KEY
									? "Set"
									: "Not set",
								NODE_ENV: import.meta.env.NODE_ENV,
								MODE: import.meta.env.MODE,
							},
							null,
							2,
						)}
					</pre>
				</div>
			</div>
		</div>
	);
}
