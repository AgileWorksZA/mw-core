import { createCookie } from "react-router";

export const preferencesCookie = createCookie("preferences", {
	path: "/",
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
	httpOnly: true,
	maxAge: 60 * 60 * 24 * 365, // 1 year
});

export type Theme = "light" | "dark" | "system";

export interface Preferences {
	theme: Theme;
	// Future preferences can be added here
}

const defaultPreferences: Preferences = {
	theme: "system",
};

export async function getPreferences(request: Request): Promise<Preferences> {
	const cookieHeader = request.headers.get("Cookie");
	const preferences = await preferencesCookie.parse(cookieHeader);

	if (!preferences || typeof preferences !== "object") {
		return defaultPreferences;
	}

	// Validate theme
	if (
		preferences.theme !== "light" &&
		preferences.theme !== "dark" &&
		preferences.theme !== "system"
	) {
		preferences.theme = "system";
	}

	return { ...defaultPreferences, ...preferences };
}

export async function setPreferences(
	preferences: Partial<Preferences>,
	existingPreferences: Preferences,
) {
	const newPreferences = { ...existingPreferences, ...preferences };
	return preferencesCookie.serialize(newPreferences);
}
