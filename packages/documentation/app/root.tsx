import type * as React from "react";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useLoaderData,
} from "react-router";

import { SearchCommand } from "~/components/search-command";
import { ThemeToggle } from "~/components/theme-toggle";
import { ThemeProvider } from "~/contexts/theme-context";
import { useHashScroll } from "~/hooks/use-hash-scroll";
import { getPreferences } from "~/lib/theme.server";
import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export async function loader({ request }: Route.LoaderArgs) {
	const preferences = await getPreferences(request);
	return { preferences };
}

export function Layout({ children }: { children: React.ReactNode }) {
	const data = useLoaderData<typeof loader>();
	const theme = data?.preferences?.theme || "system";

	return (
		<html lang="en" className={theme === "system" ? undefined : theme}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<script
					dangerouslySetInnerHTML={{
						__html: `
              // Prevent FOUC on initial load
              (function() {
                const theme = ${JSON.stringify(theme)};
                if (theme === "system") {
                  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  document.documentElement.classList.add(systemTheme);
                } else {
                  document.documentElement.classList.add(theme);
                }
              })();
            `,
					}}
				/>
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const { preferences } = useLoaderData<typeof loader>();

	// Handle hash scrolling for anchor links
	useHashScroll();

	return (
		<ThemeProvider theme={preferences.theme}>
			<Navigation />
			<Outlet />
			<SearchCommand />
		</ThemeProvider>
	);
}

function Navigation() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-8">
						<a
							href="/"
							className="text-xl font-bold text-gray-900 dark:text-white"
						>
							MoneyWorks Docs
						</a>
						<nav className="hidden md:flex items-center gap-6">
							<a
								href="/packages"
								className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							>
								Packages
							</a>
							<a
								href="/guides"
								className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							>
								Guides
							</a>
							<a
								href="/api"
								className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							>
								API
							</a>
						</nav>
					</div>
					<div className="flex items-center gap-4">
						<ThemeToggle />
						<a
							href="https://github.com/moneyworks/core"
							className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							aria-label="GitHub"
						>
							<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									fillRule="evenodd"
									d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
									clipRule="evenodd"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</header>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
