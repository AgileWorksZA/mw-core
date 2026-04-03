<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';

	let { components, parentCode }: {
		components: Array<{
			code: string;
			description: string;
			quantity: number;
			unitCost: number;
			totalCost: number;
		}>;
		parentCode: string;
	} = $props();

	const totalCost = $derived(components.reduce((s, c) => s + c.totalCost, 0));
</script>

<div class="space-y-6">
	{#if components.length > 0}
		<!-- BOM Summary -->
		<div class="grid grid-cols-2 gap-3">
			<div class="rounded-xl bg-surface-container-lowest p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Components</div>
				<div class="mt-1 text-xl font-bold font-headline">{components.length}</div>
			</div>
			<div class="rounded-xl bg-surface-container-lowest p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Total Component Cost</div>
				<div class="mt-1 text-xl font-bold font-headline"><CurrencyDisplay amount={totalCost} /></div>
			</div>
		</div>

		<!-- Component list -->
		<div class="overflow-auto rounded-xl bg-surface-container-lowest">
			<table class="w-full text-sm">
				<thead class="sticky top-0">
					<tr class="bg-surface-container-low">
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Quantity</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Unit Cost</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Total Cost</th>
					</tr>
				</thead>
				<tbody>
					{#each components as comp}
						<tr class="hover:bg-surface-container-low transition-colors">
							<td class="px-3 py-2">
								<a href="/items/{comp.code}" class="font-mono text-xs text-primary hover:underline">{comp.code}</a>
							</td>
							<td class="px-3 py-2">{comp.description}</td>
							<td class="px-3 py-2 text-right font-mono text-xs">{comp.quantity}</td>
							<td class="px-3 py-2 text-right"><CurrencyDisplay amount={comp.unitCost} /></td>
							<td class="px-3 py-2 text-right font-semibold"><CurrencyDisplay amount={comp.totalCost} /></td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr class="bg-surface-container-low font-semibold">
						<td class="px-3 py-2" colspan="4">Total</td>
						<td class="px-3 py-2 text-right"><CurrencyDisplay amount={totalCost} /></td>
					</tr>
				</tfoot>
			</table>
		</div>
	{:else}
		<div class="rounded-xl bg-surface-container-lowest p-8 text-center">
			<div class="text-muted-foreground">
				<svg class="mx-auto h-12 w-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
					<polyline points="3.27,6.96 12,12.01 20.73,6.96" />
					<line x1="12" y1="22.08" x2="12" y2="12" />
				</svg>
				<p class="text-sm">No bill of materials defined for <strong>{parentCode}</strong></p>
				<p class="text-xs mt-1 text-muted-foreground/60">BOM components are configured in MoneyWorks desktop</p>
			</div>
		</div>
	{/if}
</div>
