/**
 * Client-side fetch wrapper with toast notifications.
 * Use this from Svelte components for interactive operations
 * (form submissions, actions, etc.) — NOT from +page.server.ts.
 */
import { showError, showToast } from '$lib/stores/toast';

export async function clientFetch<T>(
	path: string,
	options: RequestInit = {}
): Promise<T | null> {
	try {
		const res = await fetch(path, {
			headers: { 'Content-Type': 'application/json', ...options.headers },
			...options
		});

		if (!res.ok) {
			const text = await res.text();
			let message = `Error ${res.status}`;
			try {
				const json = JSON.parse(text);
				message = json.error?.message || json.message || message;
			} catch {
				message = text || message;
			}
			showError(message);
			return null;
		}

		return res.json();
	} catch (err) {
		showError(err instanceof Error ? err.message : 'Network error');
		return null;
	}
}

export async function clientPost<T>(path: string, body: unknown): Promise<T | null> {
	return clientFetch<T>(path, {
		method: 'POST',
		body: JSON.stringify(body)
	});
}
