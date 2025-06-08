import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteLoaderData,
} from "react-router";

import "~/modules/ide.register";

import type { Route } from "./+types/root";
import "./app.css";
import { Toaster } from "sonner";
import { DebugConsole } from "~/components/debug-console";
import { loadThemePreferences } from "~/modules/theme-preferences/loader";
import { ThemePreferencesProvider } from "~/modules/theme-preferences/provider";
import { ThemeUpdater } from "~/modules/theme-preferences/theme-updater";
import type { ReactNode } from "react";

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
  const themeContext = await loadThemePreferences(request);
  console.log({ themeContext });
  return { themeContext };
}

export function Layout({ children }: { children: ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>("root");
  // Theme is applied on the server via entry.server.tsx
  return (
    <html
      lang="en"
      className={`min-h-dvh min-w-dvw ${loaderData?.themeContext?.resolvedTheme}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={`min-h-dvh min-w-dvw ${loaderData?.themeContext?.resolvedTheme}`}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ThemePreferencesProvider initialContext={loaderData.themeContext}>
      <ThemeUpdater />
      <Outlet />
      <Toaster />

      <DebugConsole />
    </ThemePreferencesProvider>
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
        ? `The requested page could not be found: ${error.statusText}`
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    // Only show stack trace on client
    if (typeof window !== "undefined") {
      stack = error.stack;
    }
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
