import { json } from '@sveltejs/kit';
import { apiGet, apiPost } from '$lib/api/client';
import { handleImportError } from '$lib/api/import-result';
import type { ApiResponse } from '$lib/api/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const token = locals.token;
	const exportId = url.searchParams.get('export') || '';
	const table = url.searchParams.get('table') || '';

	if (!token) {
		return new Response('Not authenticated', { status: 401 });
	}

	let tableName = '';
	let filename = '';

	if (exportId === 'export-accounts') {
		tableName = 'account';
		filename = 'accounts.csv';
	} else if (exportId === 'export-names') {
		tableName = 'name';
		filename = 'names.csv';
	} else if (exportId === 'export-items') {
		tableName = 'product';
		filename = 'products.csv';
	} else if (exportId === 'export-transactions') {
		tableName = 'transaction';
		filename = 'transactions.csv';
	} else if (table) {
		tableName = table;
		filename = `${table}.csv`;
	} else {
		return new Response('Invalid export', { status: 400 });
	}

	try {
		const res = await apiGet<ApiResponse<Record<string, any>[]>>(`/tables/${tableName}`, {
			token,
			limit: 5000
		});

		const rows = res.data ?? [];
		if (rows.length === 0) {
			return new Response('No data', { status: 404 });
		}

		// Build CSV
		const headers = Object.keys(rows[0]);
		const csvLines: string[] = [headers.join(',')];

		for (const row of rows) {
			const values = headers.map((h) => {
				const v = row[h];
				if (v === null || v === undefined) return '';
				const s = String(v);
				if (s.includes(',') || s.includes('"') || s.includes('\n')) {
					return `"${s.replace(/"/g, '""')}"`;
				}
				return s;
			});
			csvLines.push(values.join(','));
		}

		const csv = csvLines.join('\n');

		return new Response(csv, {
			headers: {
				'Content-Type': 'text/csv',
				'Content-Disposition': `attachment; filename="${filename}"`,
			}
		});
	} catch (err: any) {
		return new Response(`Export failed: ${err.message}`, { status: 500 });
	}
};

/** Parse CSV text into array of objects keyed by header row */
function parseCSV(text: string): Record<string, string>[] {
	const lines = text.split(/\r?\n/).filter((l) => l.trim());
	if (lines.length < 2) return [];

	// Parse header
	const headers = parseCsvLine(lines[0]);
	const rows: Record<string, string>[] = [];

	for (let i = 1; i < lines.length; i++) {
		const values = parseCsvLine(lines[i]);
		const row: Record<string, string> = {};
		for (let j = 0; j < headers.length; j++) {
			row[headers[j]] = values[j] ?? '';
		}
		rows.push(row);
	}
	return rows;
}

function parseCsvLine(line: string): string[] {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (inQuotes) {
			if (ch === '"' && line[i + 1] === '"') {
				current += '"';
				i++;
			} else if (ch === '"') {
				inQuotes = false;
			} else {
				current += ch;
			}
		} else {
			if (ch === '"') {
				inQuotes = true;
			} else if (ch === ',') {
				result.push(current);
				current = '';
			} else {
				current += ch;
			}
		}
	}
	result.push(current);
	return result;
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	if (!token) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const body = await request.json();
	const { table, csvData, mode } = body as {
		table: string;
		csvData: string;
		mode: 'insert' | 'update' | 'replace';
	};

	if (!table || !csvData) {
		return json({ error: 'Table and CSV data required' }, { status: 400 });
	}

	const records = parseCSV(csvData);
	if (records.length === 0) {
		return json({ error: 'No data rows found in CSV' }, { status: 400 });
	}

	// Filter out internal/read-only fields
	const skipFields = new Set(['_InternalId', '_Timestamp', 'Sequencenumber']);
	const cleanRecords = records.map((r) => {
		const clean: Record<string, any> = {};
		for (const [k, v] of Object.entries(r)) {
			if (skipFields.has(k) || k.startsWith('_')) continue;
			if (v === '') continue;
			// Try to parse numbers
			const num = Number(v);
			clean[k] = !isNaN(num) && v.trim() !== '' ? num : v;
		}
		return clean;
	});

	try {
		const result = await apiPost(`/tables/${table}/import`, {
			records: cleanRecords,
			mode: mode || 'insert',
			validate: true
		}, token);
		return json({ success: true, result, count: cleanRecords.length });
	} catch (err: any) {
		return handleImportError(err, table);
	}
};
