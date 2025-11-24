import { Link } from "react-router";

export default function TestRoutes() {
	const routes = [
		{ path: "/", label: "Home" },
		{ path: "/sign-in", label: "Sign In" },
		{ path: "/sign-up", label: "Sign Up" },
		{ path: "/dashboard", label: "Dashboard" },
		{ path: "/onboarding", label: "Onboarding" },
		{ path: "/connections", label: "Connections" },
		{ path: "/connections/new", label: "New Connection" },
	];

	return (
		<div className="container py-8">
			<h1 className="text-2xl font-bold mb-4">Available Routes</h1>
			<ul className="space-y-2">
				{routes.map((route) => (
					<li key={route.path}>
						<Link to={route.path} className="text-blue-600 hover:underline">
							{route.label} ({route.path})
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
