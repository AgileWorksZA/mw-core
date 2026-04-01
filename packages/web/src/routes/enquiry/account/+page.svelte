<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedCode = $state(data.accountCode || '');
	let activeTab = $state<'balances' | 'graph' | 'movements'>('balances');

	function search() {
		if (selectedCode.trim()) {
			goto(`/enquiry/account?account=${encodeURIComponent(selectedCode.trim())}`, {
				invalidateAll: true
			});
		}
	}

	const txTypeLabels: Record<string, string> = {
		DI: 'Invoice', CI: 'Bill', CR: 'Receipt', CP: 'Payment',
		JN: 'Journal', SO: 'Order', PO: 'PO', QU: 'Quote'
	};

	// Graph: use closing balances across periods
	const chartW = 560;
	const chartH = 180;
	const pad = { top: 16, right: 16, bottom: 28, left: 72 };
	const plotW = chartW - pad.left - pad.right;
	const plotH = chartH - pad.top - pad.bottom;

	const closingValues = $derived(data.periods.map((p: any) => p.closing));
	const graphMax = $derived(Math.max(...closingValues, 1));
	const graphMin = $derived(Math.min(...closingValues, 0));
	const graphRange = $derived(graphMax - graphMin || 1);

	function gx(i: number): number {
		return pad.left + (i / Math.max(closingValues.length - 1, 1)) * plotW;
	}

	function gy(v: number): number {
		return pad.top + plotH - ((v - graphMin) / graphRange) * plotH;
	}

	const linePath = $derived((() => {
		if (closingValues.length === 0) return '';
		let d = `M ${gx(0)} ${gy(closingValues[0])}`;
		for (let i = 1; i < closingValues.length; i++) {
			d += ` L ${gx(i)} ${gy(closingValues[i])}`;
		}
		return d;
	})());

	const areaPath = $derived((() => {
		if (closingValues.length === 0) return '';
		const baseline = gy(Math.max(graphMin, 0));
		let d = `M ${gx(0)} ${baseline}`;
		d += ` L ${gx(0)} ${gy(closingValues[0])}`;
		for (let i = 1; i < closingValues.length; i++) {
			d += ` L ${gx(i)} ${gy(closingValues[i])}`;
		}
		d += ` L ${gx(closingValues.length - 1)} ${baseline} Z`;
		return d;
	})());

	function fmtK(v: number): string {
		if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
		if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`;
		return v.toFixed(0);
	}

	// Y-axis ticks
	const yTicks = $derived((() => {
		const ticks: { y: number; label: string }[] = [];
		const step = graphRange / 4;
		for (let i = 0; i <= 4; i++) {
			const v = graphMin + step * i;
			ticks.push({ y: gy(v), label: fmtK(v) });
		}
		return ticks;
	})());

	// Show every 4th period label on x-axis
	const xLabels = $derived(
		data.periods
			.map((p: any, i: number) => ({ label: p.label, x: gx(i), i }))
			.filter((_: any, i: number) => i % 4 === 0 || i === data.periods.length - 1)
	);
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Account Enquiry" subtitle={data.account ? `${data.account.code} — ${data.account.description}` : 'Select an account'}>
		<form onsubmit={(e) => { e.preventDefault(); search(); }} class="flex gap-2">
			<select
				bind:value={selectedCode}
				class="w-64 rounded-xl bg-surface-container-low px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			>
				<option value="">— Select account —</option>
				{#each data.accounts as a}
					<option value={a.code}>{a.code} — {a.description}</option>
				{/each}
			</select>
			<button
				type="submit"
				class="rounded-xl bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			>
				Calculate
			</button>
		</form>
	</PageHeader>

	{#if !data.account}
		<div class="flex flex-1 items-center justify-center text-muted-foreground">
			Select an account above to view its enquiry
		</div>
	{:else}
		<!-- Tabs -->
		<div class="border-b border-border px-6">
			<div class="flex gap-0">
				{#each (['balances', 'graph', 'movements'] as const) as tab}
					<button
						onclick={() => { activeTab = tab; }}
						class="border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors {activeTab === tab
							? 'border-primary text-foreground'
							: 'border-transparent text-muted-foreground hover:text-foreground'}"
					>
						{tab}
					</button>
				{/each}
			</div>
		</div>

		<div class="flex-1 overflow-auto p-6">

			<!-- BALANCES TAB -->
			{#if activeTab === 'balances'}
				<div class="overflow-auto rounded-xl bg-surface-container-lowest">
					<table class="w-full text-sm">
						<thead class="sticky top-0">
							<tr class="bg-surface-container-low">
								<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Period</th>
								<th class="px-4 py-2.5 text-right font-medium text-muted-foreground">Opening</th>
								<th class="px-4 py-2.5 text-right font-medium text-muted-foreground">Movement</th>
								<th class="px-4 py-2.5 text-right font-medium text-muted-foreground">Closing</th>
							</tr>
						</thead>
						<tbody>
							{#if data.periods.length === 0}
								<tr><td colspan="4" class="px-4 py-8 text-center text-muted-foreground">No period data</td></tr>
							{:else}
								{#each data.periods as p}
									<tr class="hover:bg-surface-container-low transition-colors">
										<td class="px-4 py-2 font-mono text-xs">{p.label}</td>
										<td class="px-4 py-2 text-right"><CurrencyDisplay amount={p.opening} /></td>
										<td class="px-4 py-2 text-right {p.movement > 0 ? 'text-positive' : p.movement < 0 ? 'text-destructive' : ''}">
											<CurrencyDisplay amount={p.movement} />
										</td>
										<td class="px-4 py-2 text-right font-medium"><CurrencyDisplay amount={p.closing} /></td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>

			<!-- GRAPH TAB -->
			{:else if activeTab === 'graph'}
				<div class="rounded-xl bg-surface-container-lowest p-6">
					<h3 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
						Balance Over Time — {data.account.code}
					</h3>
					{#if closingValues.length === 0}
						<p class="text-muted-foreground text-sm">No data to display</p>
					{:else}
						<svg viewBox="0 0 {chartW} {chartH}" class="w-full max-w-3xl">
							<!-- Y-axis ticks + grid lines -->
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

							<!-- Zero line -->
							{#if graphMin < 0 && graphMax > 0}
								<line
									x1={pad.left} y1={gy(0)}
									x2={chartW - pad.right} y2={gy(0)}
									stroke="currentColor" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="4,2"
								/>
							{/if}

							<!-- Area fill -->
							<path d={areaPath} fill="var(--color-primary)" opacity="0.1" />

							<!-- Line -->
							<path d={linePath} fill="none" stroke="var(--color-primary)" stroke-width="2" />

							<!-- X-axis labels -->
							{#each xLabels as xl}
								<text
									x={xl.x} y={chartH - 4}
									text-anchor="middle" font-size="9" fill="currentColor" opacity="0.5"
								>{xl.label}</text>
							{/each}

							<!-- Dots at each data point -->
							{#each closingValues as v, i}
								<circle cx={gx(i)} cy={gy(v)} r="2.5" fill="var(--color-primary)" />
							{/each}
						</svg>
					{/if}
				</div>

			<!-- MOVEMENTS TAB -->
			{:else if activeTab === 'movements'}
				<div class="overflow-auto rounded-xl bg-surface-container-lowest">
					<table class="w-full text-sm">
						<thead class="sticky top-0">
							<tr class="bg-surface-container-low">
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Ref</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Type</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Status</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Name</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
							</tr>
						</thead>
						<tbody>
							{#if data.movements.length === 0}
								<tr><td colspan="7" class="px-3 py-8 text-center text-muted-foreground">No movements</td></tr>
							{:else}
								{#each data.movements as m}
									<tr class="hover:bg-surface-container-low transition-colors">
										<td class="px-3 py-2 font-mono text-xs text-muted-foreground">{m.date}</td>
										<td class="px-3 py-2 font-mono text-xs">{m.ref}</td>
										<td class="px-3 py-2">
											<span class="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{m.type}</span>
											<span class="ml-1 text-xs text-muted-foreground">{txTypeLabels[m.type] ?? ''}</span>
										</td>
										<td class="px-3 py-2">
											<span class="inline-block h-2 w-2 rounded-full {m.status === 'P' ? 'bg-positive' : 'bg-amber-500'}"></span>
										</td>
										<td class="px-3 py-2 text-xs">{m.nameCode}</td>
										<td class="px-3 py-2 max-w-xs truncate text-xs">{m.description}</td>
										<td class="px-3 py-2 text-right">
											<CurrencyDisplay amount={m.gross} />
										</td>
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
