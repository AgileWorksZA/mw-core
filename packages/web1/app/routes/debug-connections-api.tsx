import { useState } from "react";
import { useAuth } from "~/hooks/use-auth";

export default function DebugConnectionsAPI() {
	const { userId } = useAuth();
	const [response, setResponse] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const testFetch = async () => {
		setLoading(true);
		setError(null);
		setResponse(null);

		try {
			const url = `/api/connections?userId=${userId}`;
			console.log("Fetching:", url);

			const res = await fetch(url);
			const text = await res.text();

			let data;
			try {
				data = JSON.parse(text);
			} catch {
				data = { rawText: text };
			}

			setResponse({
				status: res.status,
				statusText: res.statusText,
				headers: Object.fromEntries(res.headers.entries()),
				data,
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container py-8">
			<h1 className="text-2xl font-bold mb-4">Debug Connections API</h1>

			<div className="space-y-4">
				<div className="p-4 border rounded">
					<p>User ID: {userId || "Not available"}</p>
					<button
						onClick={testFetch}
						disabled={loading || !userId}
						className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
					>
						{loading ? "Loading..." : "Test Fetch Connections"}
					</button>
				</div>

				{error && (
					<div className="p-4 border border-red-500 rounded">
						<h2 className="font-semibold text-red-600">Error:</h2>
						<pre className="text-sm mt-2">{error}</pre>
					</div>
				)}

				{response && (
					<div className="p-4 border rounded">
						<h2 className="font-semibold">Response:</h2>
						<pre className="text-sm mt-2 overflow-x-auto">
							{JSON.stringify(response, null, 2)}
						</pre>
					</div>
				)}
			</div>
		</div>
	);
}
