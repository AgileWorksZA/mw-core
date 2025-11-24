import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function TestCreateConnection() {
	const [result, setResult] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const testUserId = "test_user_123"; // Hardcoded test user ID

	const createTestConnection = async () => {
		setLoading(true);
		setResult("");

		try {
			const formData = new FormData();
			formData.append("_action", "create");
			formData.append("clerk_user_id", testUserId);
			formData.append("connection_name", `Test Connection ${Date.now()}`);
			formData.append("mw_username", "Herman Geldenhuys");
			formData.append("mw_password", "test123");
			formData.append("mw_data_file", "acme.moneyworks");
			formData.append("mw_host", "localhost");
			formData.append("mw_port", "6710");
			formData.append("is_default", "true");

			const response = await fetch("/api/connections", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (response.ok) {
				setResult(
					`Success! Connection created with ID: ${data.connection?.id}`,
				);
			} else {
				setResult(`Error: ${data.error} (Status: ${response.status})`);
			}
		} catch (error) {
			setResult(`Exception: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const checkConnections = async () => {
		window.open(`/api/debug/connections?userId=${testUserId}`, "_blank");
	};

	const clearConnections = async () => {
		setLoading(true);
		try {
			// Since we can't run the script directly, we'll do it via API
			setResult(
				`To clear connections, run: bun run scripts/clear-connections.ts ${testUserId}`,
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Test Connection Creation (No Auth)</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-gray-600">
						This page bypasses authentication to test the connection creation
						directly. Using test user ID:{" "}
						<code className="bg-gray-100 px-1">{testUserId}</code>
					</p>

					<div className="flex gap-4">
						<Button onClick={createTestConnection} disabled={loading}>
							Create Test Connection
						</Button>

						<Button onClick={checkConnections} variant="outline">
							Check Existing Connections
						</Button>

						<Button onClick={clearConnections} variant="outline">
							How to Clear Connections
						</Button>
					</div>

					{result && (
						<div
							className={`p-4 rounded border ${
								result.includes("Success")
									? "bg-green-50 border-green-300"
									: "bg-red-50 border-red-300"
							}`}
						>
							<pre className="whitespace-pre-wrap text-sm">{result}</pre>
						</div>
					)}

					<div className="pt-4 border-t">
						<p className="text-sm text-gray-600 mb-2">Navigation:</p>
						<div className="flex gap-2">
							<Button
								onClick={() => navigate("/test-auth")}
								variant="outline"
								size="sm"
							>
								Auth Debug
							</Button>
							<Button
								onClick={() => navigate("/onboarding")}
								variant="outline"
								size="sm"
							>
								Onboarding
							</Button>
							<Button
								onClick={() => navigate("/sign-in")}
								variant="outline"
								size="sm"
							>
								Sign In
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
