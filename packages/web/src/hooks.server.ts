import { redirect, type Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { apiPostPublic } from "$lib/api/client";
import type { AuthTokenResponse } from "$lib/api/types";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Load MW connection config from env vars or mw-config.json fallback.
 * Env vars take precedence; mw-config.json is the dev default.
 */
function loadMWConfig(): {
	host: string;
	port: number;
	dataFile: string;
	username: string;
	password: string;
} {
	const host = env.MW_HOST || "";
	const dataFile = env.MW_DATAFILE || "";
	const username = env.MW_USERNAME || "";

	// If env vars are set, use them
	if (dataFile && username) {
		return {
			host: host || "localhost",
			port: Number(env.MW_PORT) || 6710,
			dataFile,
			username,
			password: env.MW_PASSWORD ?? "",
		};
	}

	// Fallback: read mw-config.json from repo root
	const configPaths = [
		resolve("../../mw-config.json"), // from packages/web
		resolve("../mw-config.json"),
		resolve("mw-config.json"),
	];

	for (const p of configPaths) {
		try {
			const raw = readFileSync(p, "utf-8");
			const cfg = JSON.parse(raw);
			if (cfg.dataFile && cfg.username) {
				return {
					host: cfg.host || "localhost",
					port: Number(cfg.port) || 6710,
					dataFile: cfg.dataFile,
					username: cfg.username,
					password: cfg.password ?? "",
				};
			}
		} catch {
			// try next path
		}
	}

	return { host: "localhost", port: 6710, dataFile: "", username: "", password: "" };
}

const mwConfig = loadMWConfig();

// Cache the API token (refreshed on expiry)
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function ensureToken(): Promise<string> {
	if (cachedToken && Date.now() < tokenExpiry) {
		return cachedToken;
	}

	if (!mwConfig.dataFile || !mwConfig.username) {
		throw new Error(
			"MW connection not configured. Set MW_DATAFILE + MW_USERNAME env vars, or create mw-config.json",
		);
	}

	const result = await apiPostPublic<AuthTokenResponse>("/auth/token", {
		host: mwConfig.host,
		port: mwConfig.port,
		dataFile: mwConfig.dataFile,
		username: mwConfig.username,
		password: mwConfig.password,
	});

	cachedToken = result.accessToken;
	tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // refresh after 23h
	return cachedToken;
}

export const handle: Handle = async ({ event, resolve: resolveEvent }) => {
	// Skip auth for health endpoint
	if (event.url.pathname === "/health") {
		return resolveEvent(event);
	}

	// Auto-connect using config - no login page needed
	try {
		const token = await ensureToken();
		event.locals.token = token;
		// Set the cookie the layout reads for company name
		if (!event.cookies.get("mw_token")) {
			event.cookies.set("mw_token", token, {
				path: "/",
				httpOnly: true,
				secure: env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 60 * 60 * 24,
			});
			// Extract company name from dataFile (strip .moneyworks extension)
			const companyName = mwConfig.dataFile.replace(/\.moneyworks$/i, "");
			event.cookies.set("mw_company", companyName, {
				path: "/",
				httpOnly: false,
				sameSite: "lax",
				maxAge: 60 * 60 * 24,
			});
		}
	} catch (err) {
		console.error("MoneyWorks auto-connect failed:", err);
		event.locals.token = "";
	}

	// Skip login page - redirect to dashboard
	if (event.url.pathname.startsWith("/login")) {
		throw redirect(303, "/dashboard");
	}

	return resolveEvent(event);
};
