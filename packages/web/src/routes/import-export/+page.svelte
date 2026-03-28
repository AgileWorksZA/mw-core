<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Import & Export</h1>
		<p class="text-sm text-muted-foreground">Data import and export operations</p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		<div class="grid grid-cols-2 gap-8">
			<!-- Import -->
			<div>
				<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Import</h2>
				<div class="space-y-2">
					{#each data.imports as item}
						<button class="flex w-full items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted/50">
							<div class="flex h-8 w-8 items-center justify-center rounded-md bg-green-500/10">
								<svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
			</div>

			<!-- Export -->
			<div>
				<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Export</h2>
				<div class="space-y-2">
					{#each data.exports as item}
						<button class="flex w-full items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted/50">
							<div class="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10">
								<svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0-14l-7 7m7-7l7 7" />
								</svg>
							</div>
							<div>
								<div class="text-sm font-medium">{item.name}</div>
								<div class="text-xs text-muted-foreground">{item.description}</div>
							</div>
						</button>
					{/each}
				</div>
				<p class="mt-4 text-xs text-center text-muted-foreground">Import/export execution coming soon</p>
			</div>
		</div>
	</div>
</div>
