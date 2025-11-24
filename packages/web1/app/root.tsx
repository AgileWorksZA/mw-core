import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRouteError,
} from "react-router";
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { Toaster } from "sonner";
import { ConnectionProvider } from "./contexts/connection-context";

import i18n from "./lib/i18n";
import globalStyles from "./styles/globals.css?url";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: globalStyles },
];

export async function loader({ request }: LoaderFunctionArgs) {
	// For now, just return the publishable key
	// We'll handle auth in individual routes
	return {
		publishableKey:
			process.env.VITE_CLERK_PUBLISHABLE_KEY ||
			import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
	};
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 10, // 10 minutes
		},
	},
});

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-full">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

	if (!clerkPublishableKey) {
		throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
	}

	return (
		<ClerkProvider
			publishableKey={clerkPublishableKey}
			signInUrl="/sign-in"
			signUpUrl="/sign-up"
			signInFallbackRedirectUrl="/dashboard"
			signUpFallbackRedirectUrl="/dashboard"
			afterSignOutUrl="/sign-in"
		>
			<QueryClientProvider client={queryClient}>
				<I18nextProvider i18n={i18n}>
					<ConnectionProvider>
						<div className="min-h-screen bg-background">
							<Outlet />
						</div>
						<Toaster position="bottom-right" />
					</ConnectionProvider>
				</I18nextProvider>
			</QueryClientProvider>
		</ClerkProvider>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	return (
		<html lang="en" className="h-full">
			<head>
				<title>Error!</title>
				<Meta />
				<Links />
			</head>
			<body className="h-full">
				<div className="flex h-full items-center justify-center">
					<div className="text-center">
						<h1 className="text-4xl font-bold text-destructive">
							{isRouteErrorResponse(error)
								? `${error.status} ${error.statusText}`
								: "Application Error"}
						</h1>
						<p className="mt-4 text-muted-foreground">
							{isRouteErrorResponse(error)
								? error.data
								: error instanceof Error
									? error.message
									: "An unexpected error occurred"}
						</p>
					</div>
				</div>
				<Scripts />
			</body>
		</html>
	);
}
