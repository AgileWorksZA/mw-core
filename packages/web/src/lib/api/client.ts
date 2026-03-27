const API_BASE = process.env.API_URL || 'http://localhost:3400/api/v1';

export class ApiError extends Error {
	constructor(
		public status: number,
		public body: string
	) {
		super(`API ${status}: ${body}`);
	}
}

interface GetOptions {
	token: string;
	filter?: string;
	format?: 'full' | 'compact' | 'compact-headers' | 'schema';
	limit?: number;
	offset?: number;
	orderBy?: string;
}

export async function apiGet<T>(path: string, options: GetOptions): Promise<T> {
	const url = new URL(`${API_BASE}${path}`);
	if (options.filter) url.searchParams.set('filter', options.filter);
	if (options.format) url.searchParams.set('format', options.format);
	if (options.limit) url.searchParams.set('limit', String(options.limit));
	if (options.offset) url.searchParams.set('offset', String(options.offset));
	if (options.orderBy) url.searchParams.set('orderBy', options.orderBy);

	const res = await fetch(url.toString(), {
		headers: { Authorization: `Bearer ${options.token}` }
	});

	if (!res.ok) {
		throw new ApiError(res.status, await res.text());
	}

	return res.json();
}

export async function apiPost<T>(path: string, body: unknown, token: string): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	if (!res.ok) {
		throw new ApiError(res.status, await res.text());
	}

	return res.json();
}

/** Evaluate a MWScript expression via the eval API */
export async function apiEval(expression: string, token: string): Promise<string> {
	try {
		const result = await apiPost<{ data: { result: string } }>('/eval', { expression }, token);
		return result.data.result;
	} catch {
		return '';
	}
}

/** Evaluate multiple MWScript expressions in parallel, returning results keyed by label */
export async function apiEvalBatch(
	expressions: Record<string, string>,
	token: string
): Promise<Record<string, string>> {
	const keys = Object.keys(expressions);
	const results = await Promise.all(
		keys.map((key) => apiEval(expressions[key], token))
	);
	const out: Record<string, string> = {};
	for (let i = 0; i < keys.length; i++) {
		out[keys[i]] = results[i];
	}
	return out;
}

/** Unauthenticated POST (for login) */
export async function apiPostPublic<T>(path: string, body: unknown): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});

	if (!res.ok) {
		throw new ApiError(res.status, await res.text());
	}

	return res.json();
}
