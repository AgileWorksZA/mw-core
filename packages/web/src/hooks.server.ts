import { redirect, type Handle } from "@sveltejs/kit";
import { apiPostPublic } from "$lib/api/client";
import type { AuthTokenResponse } from "$lib/api/types";

// MoneyWorks connection from env vars - no login form needed
const MW_HOST = process.env["MW_HOST"] || "localhost";
const MW_PORT = Number(process.env["MW_PORT"]) || 6710;
const MW_DATAFILE = process.env["MW_DATAFILE"] || "";
const MW_USERNAME = process.env["MW_USERNAME"] || "";
const MW_PASSWORD = process.env["MW_PASSWORD"] || " ";

// Cache the API token (refreshed on expiry)
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function ensureToken(): Promise<string> {
	if (cachedToken && Date.now() < tokenExpiry) {
		return cachedToken;
	}

	if (!MW_DATAFILE || !MW_USERNAME) {
		throw new Error("MW_DATAFILE and MW_USERNAME env vars required");
	}

	const result = await apiPostPublic<AuthTokenResponse>("/auth/token", {
		host: MW_HOST,
		port: MW_PORT,
		dataFile: MW_DATAFILE,
		username: MW_USERNAME,
		password: MW_PASSWORD,
	});

	cachedToken = result.accessToken;
	tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // refresh after 23h
	return cachedToken;
}

export const handle: Handle = async ({ event, resolve }) => {
	// Skip auth for health endpoint
	if (event.url.pathname === "/health") {
		return resolve(event);
	}

	// Auto-connect using env vars - no login page needed
	// Kapable auth gate handles user authentication externally
	try {
		const token = await ensureToken();
		event.locals.token = token;
	} catch (err) {
		console.error("MoneyWorks auto-connect failed:", err);
		event.locals.token = "";
	}

	// Skip login page - redirect to dashboard
	if (event.url.pathname.startsWith("/login")) {
		throw redirect(303, "/dashboard");
	}

	return resolve(event);
};
