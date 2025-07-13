/**
 * CLI Output Formatters
 *
 * Utilities for formatting output in various formats
 */

/**
 * Format data as a table
 */
export function formatTable(
	headers: string[],
	rows: (string | number)[][],
): string {
	// Calculate column widths
	const widths = headers.map((h, i) => {
		const headerWidth = h.length;
		const maxDataWidth = Math.max(
			...rows.map((r) => String(r[i] || "").length),
		);
		return Math.max(headerWidth, maxDataWidth);
	});

	// Format header
	const headerLine = headers.map((h, i) => h.padEnd(widths[i])).join("  ");
	const separator = widths.map((w) => "-".repeat(w)).join("  ");

	// Format rows
	const dataLines = rows.map((row) =>
		row.map((cell, i) => String(cell || "").padEnd(widths[i])).join("  "),
	);

	return [headerLine, separator, ...dataLines].join("\n");
}

/**
 * Format data as JSON
 */
export function formatJson(data: any): string {
	return JSON.stringify(data, null, 2);
}

/**
 * Format data as a simple list
 */
export function formatList(items: string[]): string {
	return items.join("\n");
}

/**
 * Format array output for TSV
 */
export function formatArrayOutput(data: any[][]): string {
	return data
		.map((row) =>
			row
				.map((value) =>
					value === null || value === undefined ? "" : String(value),
				)
				.join("\t"),
		)
		.join("\n");
}
