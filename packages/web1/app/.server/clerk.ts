import { createClerkClient } from "@clerk/react-router/ssr.server";

if (!process.env.CLERK_SECRET_KEY) {
	console.error("CLERK_SECRET_KEY is not set!");
}

export const clerk = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY!,
	publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY!,
});
