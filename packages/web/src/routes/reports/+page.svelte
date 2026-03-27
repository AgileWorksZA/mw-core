<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const categoryColors: Record<string, string> = {
		'Financial': 'bg-blue-500/10 text-blue-600',
		'Audit': 'bg-purple-500/10 text-purple-600',
		'Budget': 'bg-green-500/10 text-green-600',
		'Customer / Supplier': 'bg-orange-500/10 text-orange-600',
		'Item': 'bg-amber-500/10 text-amber-600'
	};
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Reports</h1>
		<p class="text-sm text-muted-foreground">{data.totalReports} reports available</p>
	</div>

	<div class="flex-1 overflow-auto p-6 space-y-8">
		{#each data.categories as cat}
			<div>
				<h2 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{cat.name}</h2>
				<div class="grid grid-cols-3 gap-3">
					{#each cat.reports as report}
						<button
							class="rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted/50"
						>
							<div class="flex items-center gap-2">
								<span class="rounded px-1.5 py-0.5 text-[10px] font-semibold {categoryColors[cat.name] || 'bg-muted text-muted-foreground'}">
									{cat.name.split(' ')[0]}
								</span>
								<span class="text-sm font-medium">{report.name}</span>
							</div>
							<div class="mt-1 text-xs text-muted-foreground">{report.description}</div>
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
