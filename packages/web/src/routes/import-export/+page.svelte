<script lang="ts">
	import { showToast, showError } from '$lib/stores/toast';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let exporting = $state('');

	// Import state
	let importTable = $state('name');
	let importMode = $state<'insert' | 'update' | 'replace'>('insert');
	let csvText = $state('');
	let previewRows = $state<Record<string, string>[]>([]);
	let previewHeaders = $state<string[]>([]);
	let importing = $state(false);
	let confirmOpen = $state(false);

	const tableOptions = [
		{ value: 'name', label: 'Names (Customers/Suppliers)' },
		{ value: 'product', label: 'Products / Items' },
		{ value: 'account', label: 'Chart of Accounts' },
		{ value: 'taxrate', label: 'Tax Codes / Rates' },
	];

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			csvText = reader.result as string;
			parsePreview();
		};
		reader.readAsText(file);
	}

	function parsePreview() {
		const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
		if (lines.length < 2) {
			previewHeaders = [];
			previewRows = [];
			return;
		}
		previewHeaders = parseCsvLine(lines[0]);
		const rows: Record<string, string>[] = [];
		for (let i = 1; i < Math.min(lines.length, 6); i++) {
			const values = parseCsvLine(lines[i]);
			const row: Record<string, string> = {};
			for (let j = 0; j < previewHeaders.length; j++) {
				row[previewHeaders[j]] = values[j] ?? '';
			}
			rows.push(row);
		}
		previewRows = rows;
	}

	function parseCsvLine(line: string): string[] {
		const result: string[] = [];
		let current = '';
		let inQuotes = false;
		for (let i = 0; i < line.length; i++) {
			const ch = line[i];
			if (inQuotes) {
				if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
				else if (ch === '"') { inQuotes = false; }
				else { current += ch; }
			} else {
				if (ch === '"') { inQuotes = true; }
				else if (ch === ',') { result.push(current); current = ''; }
				else { current += ch; }
			}
		}
		result.push(current);
		return result;
	}

	const totalRows = $derived(csvText ? csvText.split(/\r?\n/).filter((l) => l.trim()).length - 1 : 0);

	async function handleImport() {
		confirmOpen = false;
		if (!csvText || importing) return;
		importing = true;
		try {
			const res = await fetch('/import-export', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ table: importTable, csvData: csvText, mode: importMode })
			});
			const result = await res.json();
			if (!res.ok || result.error) {
				showError(result.error || 'Import failed');
				return;
			}
			showToast(`Imported ${result.count ?? totalRows} records into ${importTable}`, 'success');
			csvText = '';
			previewRows = [];
			previewHeaders = [];
		} catch (err: any) {
			showError(err.message || 'Import failed');
		} finally {
			importing = false;
		}
	}

	async function handleExport(id: string) {
		exporting = id;
		try {
			const res = await fetch(`/import-export?export=${id}`);
			if (!res.ok) {
				showError(await res.text() || 'Export failed');
				return;
			}
			const blob = await res.blob();
			const disposition = res.headers.get('Content-Disposition') || '';
			const match = disposition.match(/filename="?([^"]+)"?/);
			const filename = match ? match[1] : `${id}.csv`;
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			a.click();
			URL.revokeObjectURL(url);
			showToast(`Exported ${filename}`, 'success');
		} catch (err: any) {
			showError(err.message || 'Export failed');
		} finally {
			exporting = '';
		}
	}
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-4">
		<h1 class="font-headline text-xl font-bold">Import & Export</h1>
		<p class="text-sm text-muted-foreground">Data import and export operations</p>
	</div>

	<div class="flex-1 overflow-auto p-3 md:p-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
			<!-- Export -->
			<div>
				<h2 class="font-headline mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Export</h2>
				<div class="space-y-2">
					{#each data.exports as item}
						<button
							onclick={() => item.enabled && handleExport(item.id)}
							disabled={!item.enabled || exporting === item.id}
							class="flex w-full items-center gap-3 rounded-xl bg-surface-container-lowest p-4 text-left transition-colors {item.enabled ? 'hover:bg-surface-container-low' : 'opacity-50 cursor-not-allowed'}"
						>
							<div class="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
								{#if exporting === item.id}
									<svg class="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
										<path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" class="opacity-75" />
									</svg>
								{:else}
									<svg class="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
									</svg>
								{/if}
							</div>
							<div>
								<div class="text-sm font-medium">{item.name}</div>
								<div class="text-xs text-muted-foreground">{item.description}</div>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Import -->
			<div>
				<h2 class="font-headline mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Import</h2>

				<div class="rounded-xl bg-surface-container-lowest p-4 space-y-4">
					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label class="text-xs font-medium text-muted-foreground">Table</label>
							<select bind:value={importTable} class="w-full rounded-lg bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
								{#each tableOptions as opt}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
						</div>
						<div class="space-y-1.5">
							<label class="text-xs font-medium text-muted-foreground">Mode</label>
							<select bind:value={importMode} class="w-full rounded-lg bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
								<option value="insert">Insert new</option>
								<option value="update">Update existing</option>
								<option value="replace">Replace (upsert)</option>
							</select>
						</div>
					</div>

					<!-- File upload -->
					<div>
						<label class="text-xs font-medium text-muted-foreground">CSV File</label>
						<input
							type="file"
							accept=".csv,.tsv,.txt"
							onchange={handleFileSelect}
							class="mt-1 block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground file:border-none hover:file:bg-primary/90 file:cursor-pointer"
						/>
					</div>

					<!-- Preview -->
					{#if previewHeaders.length > 0}
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs font-medium text-muted-foreground">Preview ({totalRows} rows, {previewHeaders.length} columns)</span>
							</div>
							<div class="overflow-auto max-h-48 rounded-lg border border-outline-variant/20">
								<table class="w-full text-xs">
									<thead class="sticky top-0">
										<tr class="bg-surface-container-low">
											{#each previewHeaders as h}
												<th class="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
											{/each}
										</tr>
									</thead>
									<tbody>
										{#each previewRows as row}
											<tr class="hover:bg-surface-container-low">
												{#each previewHeaders as h}
													<td class="px-2 py-1 whitespace-nowrap max-w-32 truncate">{row[h] ?? ''}</td>
												{/each}
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>

						<button
							onclick={() => { confirmOpen = true; }}
							disabled={importing}
							class="w-full rounded-xl bg-positive px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
						>
							{importing ? 'Importing...' : `Import ${totalRows} rows into ${importTable}`}
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<ConfirmDialog bind:open={confirmOpen} title="Confirm Import" confirmLabel="Import" onConfirm={handleImport}>
	Import <strong>{totalRows}</strong> rows into <strong>{importTable}</strong> using <strong>{importMode}</strong> mode?
</ConfirmDialog>
