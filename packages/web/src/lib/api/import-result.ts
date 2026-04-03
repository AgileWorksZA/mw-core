import { json } from '@sveltejs/kit';

/**
 * Handle the response from apiPost('/tables/transaction/import', ...).
 *
 * The Elysia API may return a 422 response-validation error even when MW
 * successfully created records (schema mismatch in the response layer).
 * This helper parses the raw MW response from the error message to detect
 * true success vs actual import errors.
 */
export function handleImportResult(result: any): Response {
	return json({ success: true, result });
}

export function handleImportError(err: any, entityLabel: string): Response {
	const msg = err.message || '';

	// Check rawResponse for "created: N" where N > 0 (MW succeeded despite API 422)
	const createdMatch = msg.match(/created:\s*(\d+)/);
	if (createdMatch && parseInt(createdMatch[1]) > 0) {
		return json({ success: true, created: parseInt(createdMatch[1]) });
	}

	// Check for actual MW import errors
	const errorMatch = msg.match(/"errors":\s*(\d+)/);
	if (errorMatch && parseInt(errorMatch[1]) > 0) {
		// Extract first MW error message
		const detailMatch = msg.match(/"message":\s*"([^"]+)"/);
		return json({ error: detailMatch ? detailMatch[1] : msg }, { status: 400 });
	}

	return json({ error: msg || `Failed to create ${entityLabel}` }, { status: 500 });
}
