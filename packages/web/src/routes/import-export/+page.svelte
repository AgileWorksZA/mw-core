<script lang="ts">
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let exporting = $state('');

	async function handleExport(id: string) {
		exporting = id;
		try {
			const res = await fetch(`/import-export?export=${id}`);
			if (!res.ok) {
				const text = await res.text();
				showError(text || 'Export failed');
				return;
			}
			// Download the file
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
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0-14l-7 7m7-7l7 7" />
									</svg>
								{/if}
							</div>
							<div>
								<div class="text-sm font-medium">{item.name}</div>
								<div class="text-xs text-muted-foreground">{item.description}</div>
							</div>
							{#if item.enabled}
								<svg class="ml-auto h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
								</svg>
							{/if}
						</button>
					{/each}
				</div>
			</div>

			<!-- Import -->
			<div>
				<h2 class="font-headline mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Import</h2>
				<div class="space-y-2">
					{#each data.imports as item}
						<button
							disabled
							class="flex w-full items-center gap-3 rounded-xl bg-surface-container-lowest p-4 text-left opacity-50 cursor-not-allowed"
						>
							<div class="flex h-8 w-8 items-center justify-center rounded-xl bg-positive/10">
								<svg class="h-4 w-4 text-positive" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 14l-7-7m7 7l7-7" />
								</svg>
							</div>
							<div>
								<div class="text-sm font-medium">{item.name}</div>
								<div class="text-xs text-muted-foreground">{item.description}</div>
							</div>
						</button>
					{/each}
				</div>
				<p class="mt-4 text-xs text-center text-muted-foreground">Import functionality coming soon</p>
			</div>
		</div>
	</div>
</div>
