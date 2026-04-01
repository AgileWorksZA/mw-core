<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let nameInput = $state(data.nameCode);
	let activeTab = $state<'monthly' | 'graph' | 'movements' | 'orders'>('monthly');

	function search() {
		if (nameInput.trim()) {
			goto(`/enquiry/sales?name=${encodeURIComponent(nameInput.trim())}`, { invalidateAll: true });
		}
	}

	const totalSales = $derived(data.invoices.reduce((sum: number, i: any) => sum + i.gross, 0));
	const totalOutstanding = $derived(data.invoices.reduce((sum: number, i: any) => sum + i.outstanding, 0));

	const summaryCards = $derived([
		{ label: 'Total Sales', value: totalSales, isCurrency: true },
		{ label: 'Invoices', value: data.invoices.length },
		{ label: 'Outstanding', value: totalOutstanding, isCurrency: true, color: (totalOutstanding > 0.01 ? 'red' : 'default') as 'red' | 'default' }
	]);

	// Graph setup
	const chartW = 560;
	const chartH = 180;
	const pad = { top: 16, right: 16, bottom: 28, left: 72 };
	const plotW = chartW - pad.left - pad.right;
	const plotH = chartH - pad.top - pad.bottom;

	const monthlyValues = $derived(data.monthly.map((m: any) => m.value));
	const graphMax = $derived(Math.max(...monthlyValues, 1));

	function gx(i: number): number {
		const n = monthlyValues.length;
		return pad.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
	}

	function gy(v: number): number {
		return pad.top + plotH - (v / graphMax) * plotH;
	}

	const barWidth = $derived(monthlyValues.length > 0 ? (plotW / monthlyValues.length) * 0.7 : 20);
	const barGap = $derived(monthlyValues.length > 0 ? plotW / monthlyValues.length : 20);

	function fmtK(v: number): string {
		if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
		if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`;
		return v.toFixed(0);
	}

	const yTicks = $derived((() => {
		const ticks: { y: number; label: string }[] = [];
		const step = graphMax / 4;
		for (let i = 0; i <= 4; i++) {
			const v = step * i;
			ticks.push({ y: gy(v), label: fmtK(v) });
		}
		return ticks;
	})());
</script>

<div class="flex h-full flex-col">
	<PageHeader
		title="Customer Sales Enquiry"
		subtitle={data.customer ? `${data.customer.name} (${data.customer.code})` : ''}
	>
		<form onsubmit={(e) => { e.preventDefault(); search(); }} class="flex gap-2">
			<input
				type="text"
				placeholder="Customer code..."
				bind:value={nameInput}
				class="w-48 rounded-xl bg-surface-container-low px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			/>
			<button
				type="submit"
				class="rounded-xl bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			>
				Search
			</button>
		</form>
	</PageHeader>

	{#if !data.customer}
		<div class="flex flex-1 items-center justify-center text-muted-foreground">
			Enter a customer code to view sales history
		</div>
	{:else}
		<SummaryCards cards={summaryCards} />

		<!-- Tabs -->
		<div class="border-b border-border px-6">
			<div class="flex gap-0">
				{#each (['monthly', 'graph', 'movements', 'orders'] as const) as tab}
					<button
						onclick={() => { activeTab = tab; }}
						class="border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors {activeTab === tab
							? 'border-primary text-foreground'
							: 'border-transparent text-muted-foreground hover:text-foreground'}"
					>
						{tab === 'movements' ? 'Invoices' : tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				{/each}
			</div>
		</div>

		<div class="flex-1 overflow-auto p-6">

			<!-- MONTHLY TAB -->
			{#if activeTab === 'monthly'}
				{#if data.monthly.length === 0}
					<p class="text-muted-foreground text-sm">No sales data available</p>
				{:else}
					<div class="overflow-auto rounded-xl bg-surface-container-lowest">
						<table class="w-full text-sm">
							<thead class="sticky top-0">
								<tr class="bg-surface-container-low">
									<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Period</th>
									<th class="px-4 py-2.5 text-right font-medium text-muted-foreground">Sales Value</th>
								</tr>
							</thead>
							<tbody>
								{#each data.monthly as m}
									<tr class="hover:bg-surface-container-low transition-colors">
										<td class="px-4 py-2 font-mono text-xs">Period {m.period}</td>
										<td class="px-4 py-2 text-right font-medium"><CurrencyDisplay amount={m.value} /></td>
									</tr>
								{/each}
								<tr class="bg-surface-container-low font-bold">
									<td class="px-4 py-2.5">Total</td>
									<td class="px-4 py-2.5 text-right"><CurrencyDisplay amount={totalSales} /></td>
								</tr>
							</tbody>
						</table>
					</div>
				{/if}

			<!-- GRAPH TAB -->
			{:else if activeTab === 'graph'}
				<div class="rounded-xl bg-surface-container-lowest p-6">
					<h3 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
						Sales by Period — {data.customer.name}
					</h3>
					{#if monthlyValues.length === 0}
						<p class="text-muted-foreground text-sm">No data to chart</p>
					{:else}
						<svg viewBox="0 0 {chartW} {chartH}" class="w-full max-w-3xl">
							<!-- Y-axis ticks + grid -->
							{#each yTicks as tick}
								<line
									x1={pad.left} y1={tick.y}
									x2={chartW - pad.right} y2={tick.y}
									stroke="currentColor" stroke-opacity="0.1" stroke-width="1"
								/>
								<text
									x={pad.left - 6} y={tick.y + 4}
									text-anchor="end" font-size="9" fill="currentColor" opacity="0.5"
								>{tick.label}</text>
							{/each}

							<!-- Bars -->
							{#each data.monthly as m, i}
								{@const bx = pad.left + i * barGap + (barGap - barWidth) / 2}
								{@const bh = (m.value / graphMax) * plotH}
								{@const by = pad.top + plotH - bh}
								<rect
									x={bx} y={by} width={barWidth} height={bh}
									fill="var(--color-primary)" opacity="0.7" rx="2"
								/>
								{#if data.monthly.length <= 12}
									<text
										x={bx + barWidth / 2} y={chartH - 4}
										text-anchor="middle" font-size="8" fill="currentColor" opacity="0.5"
									>{m.period}</text>
								{/if}
							{/each}
						</svg>
					{/if}
				</div>

			<!-- MOVEMENTS (INVOICES) TAB -->
			{:else if activeTab === 'movements'}
				<div class="overflow-auto rounded-xl bg-surface-container-lowest">
					<table class="w-full text-sm">
						<thead class="sticky top-0">
							<tr class="bg-surface-container-low">
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Status</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Ref</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Paid</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
							</tr>
						</thead>
						<tbody>
							{#if data.invoices.length === 0}
								<tr><td colspan="7" class="px-3 py-8 text-center text-muted-foreground">No invoices found</td></tr>
							{:else}
								{#each data.invoices as inv}
									<tr class="hover:bg-surface-container-low transition-colors">
										<td class="px-3 py-2">
											<span class="inline-block h-2 w-2 rounded-full {inv.status === 'P' ? 'bg-positive' : 'bg-amber-500'}"></span>
										</td>
										<td class="px-3 py-2 font-mono text-xs">{inv.ref}</td>
										<td class="px-3 py-2 text-muted-foreground text-xs">{inv.date}</td>
										<td class="px-3 py-2 max-w-xs truncate">{inv.description}</td>
										<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.gross} /></td>
										<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.amtPaid} /></td>
										<td class="px-3 py-2 text-right" class:text-destructive={inv.outstanding > 0.01}>
											{#if inv.outstanding > 0.01}
												<CurrencyDisplay amount={inv.outstanding} />
											{/if}
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>

			<!-- ORDERS TAB -->
			{:else if activeTab === 'orders'}
				<div class="overflow-auto rounded-xl bg-surface-container-lowest">
					<table class="w-full text-sm">
						<thead class="sticky top-0">
							<tr class="bg-surface-container-low">
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Status</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Ref</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Value</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
							</tr>
						</thead>
						<tbody>
							{#if data.orders.length === 0}
								<tr><td colspan="6" class="px-3 py-8 text-center text-muted-foreground">No open orders</td></tr>
							{:else}
								{#each data.orders as o}
									<tr class="hover:bg-surface-container-low transition-colors">
										<td class="px-3 py-2">
											<span class="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs font-mono text-amber-700 dark:text-amber-400">{o.status}</span>
										</td>
										<td class="px-3 py-2 font-mono text-xs">{o.ref}</td>
										<td class="px-3 py-2 text-muted-foreground text-xs">{o.date}</td>
										<td class="px-3 py-2 max-w-xs truncate">{o.description}</td>
										<td class="px-3 py-2 text-right"><CurrencyDisplay amount={o.gross} /></td>
										<td class="px-3 py-2 text-right"><CurrencyDisplay amount={o.outstanding} /></td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			{/if}

		</div>
	{/if}
</div>
