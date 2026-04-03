import { apiGet } from '$lib/api/client';
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
