import { type LoaderFunctionArgs, data as json } from "react-router";
import { useAuth } from "~/hooks/use-auth";

export async function loader({ request }: LoaderFunctionArgs) {
	return json({});
}

export default function TestAuth() {
	const { userId, isLoaded, isSignedIn } = useAuth();

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>

			<div className="space-y-2">
				<p>Is Loaded: {isLoaded ? "Yes" : "No"}</p>
				<p>Is Signed In: {isSignedIn ? "Yes" : "No"}</p>
				<p>User ID: {userId || "None"}</p>
			</div>

			<div className="mt-8 space-y-2">
				<h2 className="text-xl font-semibold">Navigation Links:</h2>
				<ul className="list-disc ml-6">
					<li>
						<a href="/sign-in" className="text-blue-600 hover:underline">
							Sign In
						</a>
					</li>
					<li>
						<a href="/onboarding" className="text-blue-600 hover:underline">
							Onboarding
						</a>
					</li>
					<li>
						<a href="/dashboard" className="text-blue-600 hover:underline">
							Dashboard
						</a>
					</li>
					<li>
						<a href="/connections" className="text-blue-600 hover:underline">
							Connections
						</a>
					</li>
				</ul>
			</div>

			{userId && (
				<div className="mt-8 p-4 bg-gray-100 rounded">
					<h3 className="font-semibold mb-2">Debug API Call:</h3>
					<a
						href={`/api/debug/connections?userId=${userId}`}
						target="_blank"
						className="text-blue-600 hover:underline"
						rel="noreferrer"
					>
						Check existing connections for user
					</a>
				</div>
			)}
		</div>
	);
}
