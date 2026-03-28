<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import RefreshIndicator from '$lib/components/RefreshIndicator.svelte';
	import { createAutoRefresh } from '$lib/stores/autoRefresh.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const refresh = createAutoRefresh(30_000);
	onMount(() => refresh.start());
	onDestroy(() => refresh.stop());

	const { periods, balances, debtors, currentRatio, profitChart } = data;
	const totalDebtors = $derived(debtors.current + debtors.oneCycle + debtors.twoCycles + debtors.threeOrMore);

	// Chart dimensions
	const chartW = 400;
	const chartH = 200;
	const pad = { top: 20, right: 20, bottom: 30, left: 60 };
	const plotW = chartW - pad.left - pad.right;
	const plotH = chartH - pad.top - pad.bottom;

	// Profit chart scales
	const profitValues = $derived(profitChart.flatMap((m: any) => [m.income, m.expenses, m.profit]));
	const profitMax = $derived(Math.max(...profitValues, 1));
	const profitMin = $derived(Math.min(...profitValues, 0));
	const profitRange = $derived(profitMax - profitMin || 1);

	function profitY(v: number): number {
		return pad.top + plotH - ((v - profitMin) / profitRange) * plotH;
	}

	const barWidth = $derived(profitChart.length > 0 ? plotW / profitChart.length * 0.6 : 10);
	const barGap = $derived(profitChart.length > 0 ? plotW / profitChart.length : 10);

	// Build SVG line path from array of {x, y} points
	function linePath(points: { x: number; y: number }[]): string {
		if (points.length === 0) return '';
		let d = `M ${points[0].x} ${points[0].y}`;
		for (let i = 1; i < points.length; i++) {
			d += ` L ${points[i].x} ${points[i].y}`;
		}
		return d;
	}

	// Expense line points
	const expenseLine = $derived(
		profitChart.map((m: any, i: number) => ({
			x: pad.left + i * barGap + barGap / 2,
			y: profitY(m.expenses)
		}))
	);

	// Profit line points
	const profitLine = $derived(
		profitChart.map((m: any, i: number) => ({
			x: pad.left + i * barGap + barGap / 2,
			y: profitY(m.profit)
		}))
	);

	// Debtors chart
	const debtorBuckets = $derived([
		{ label: '3 months+', value: debtors.threeOrMore, color: 'var(--color-destructive)' },
		{ label: '2 months', value: debtors.twoCycles, color: '#f97316' },
		{ label: '1 month', value: debtors.oneCycle, color: '#f59e0b' },
		{ label: 'Current', value: debtors.current, color: '#22c55e' }
	]);
	const debtorMax = $derived(Math.max(...debtorBuckets.map((b: any) => Math.abs(b.value)), 1));

	// Bank balance chart
	const bankMax = $derived(Math.max(...balances.bankAccounts.map((b: any) => Math.abs(b.balance)), 1));

	// Format currency for axis labels
	function fmtK(v: number): string {
		if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`;
		return v.toFixed(0);
	}

	// Y-axis ticks (5 ticks)
	function yTicks(min: number, max: number): number[] {
		const range = max - min || 1;
		const step = range / 4;
		const ticks: number[] = [];
		for (let i = 0; i <= 4; i++) {
			ticks.push(min + step * i);
		}
		return ticks;
	}
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="bg-surface-container-lowest px-6 py-4">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-xl font-bold font-headline">Dashboard</h1>
				<p class="text-sm text-muted-foreground">Company Overview — {data.date}</p>
			</div>
			<RefreshIndicator enabled={refresh.enabled} refreshing={refresh.refreshing} onToggle={refresh.toggle} onRefresh={refresh.refreshNow} />
		</div>
	</div>

	<div class="flex-1 overflow-auto p-6 space-y-12">
		<!-- Charts 2x2 Grid -->
		<div class="grid grid-cols-2 gap-6">
			<!-- Profit Chart (bar + line) -->
			<div class="rounded-xl bg-surface-container-lowest p-6">
				<h3 class="mb-2 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">Profit</h3>
				{#if profitChart.length > 0}
					<svg viewBox="0 0 {chartW} {chartH}" class="w-full" preserveAspectRatio="xMidYMid meet">
						<!-- Y axis ticks -->
						{#each yTicks(profitMin, profitMax) as tick}
							{@const y = profitY(tick)}
							<line x1={pad.left} y1={y} x2={chartW - pad.right} y2={y} stroke="currentColor" stroke-opacity="0.1" />
							<text x={pad.left - 6} y={y + 3} text-anchor="end" fill="currentColor" opacity="0.5" font-size="9">{fmtK(tick)}</text>
						{/each}
						<!-- Zero line if range spans zero -->
						{#if profitMin < 0 && profitMax > 0}
							<line x1={pad.left} y1={profitY(0)} x2={chartW - pad.right} y2={profitY(0)} stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4,3" />
						{/if}
						<!-- Income bars -->
						{#each profitChart as m, i}
							{@const x = pad.left + i * barGap + (barGap - barWidth) / 2}
							{@const y = profitY(Math.max(m.income, 0))}
							{@const h = Math.abs(profitY(m.income) - profitY(0))}
							<rect x={x} y={y} width={barWidth} height={h} fill="#f87171" rx="2" opacity="0.7" />
						{/each}
						<!-- Expenses line -->
						<path d={linePath(expenseLine)} fill="none" stroke="#3b82f6" stroke-width="2" />
						{#each expenseLine as pt}
							<circle cx={pt.x} cy={pt.y} r="3" fill="#3b82f6" />
						{/each}
						<!-- Profit line -->
						<path d={linePath(profitLine)} fill="none" stroke="#eab308" stroke-width="2" />
						{#each profitLine as pt}
							<circle cx={pt.x} cy={pt.y} r="3" fill="#eab308" />
						{/each}
						<!-- X labels -->
						{#each profitChart as m, i}
							<text x={pad.left + i * barGap + barGap / 2} y={chartH - 6} text-anchor="middle" fill="currentColor" opacity="0.5" font-size="9">{m.label}</text>
						{/each}
					</svg>
					<div class="mt-2 flex gap-4 text-xs text-muted-foreground">
						<span class="flex items-center gap-1"><span class="inline-block h-2 w-3 rounded bg-red-400"></span>Income</span>
						<span class="flex items-center gap-1"><span class="inline-block h-2 w-3 rounded bg-blue-500"></span>Expenses</span>
						<span class="flex items-center gap-1"><span class="inline-block h-2 w-3 rounded bg-yellow-500"></span>Profit</span>
					</div>
				{:else}
					<div class="flex h-40 items-center justify-center text-muted-foreground text-sm">No data</div>
				{/if}
			</div>

			<!-- Current Ratio -->
			<div class="rounded-xl bg-surface-container-lowest p-6">
				<h3 class="mb-2 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">Current Ratio</h3>
				<div class="flex items-center justify-center">
					<div class="text-center">
						<div class="text-5xl font-bold tabular-nums" class:text-positive={currentRatio >= 1.5} class:text-amber-500={currentRatio >= 1 && currentRatio < 1.5} class:text-destructive={currentRatio < 1}>
							{currentRatio.toFixed(2)}
						</div>
						<div class="mt-2 text-sm text-muted-foreground">Current Assets / Current Liabilities</div>
						<div class="mt-1 text-xs text-muted-foreground">
							{#if currentRatio >= 2}
								Strong liquidity
							{:else if currentRatio >= 1.5}
								Healthy
							{:else if currentRatio >= 1}
								Adequate
							{:else}
								Below 1.0 — review
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Bank Balances Chart -->
			<div class="rounded-xl bg-surface-container-lowest p-6">
				<h3 class="mb-2 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">Bank Balances</h3>
				{#if balances.bankAccounts.length > 0}
					{@const bW = 320}
					{@const bH = 160}
					{@const bPad = { top: 10, right: 10, bottom: 30, left: 60 }}
					{@const bPlotW = bW - bPad.left - bPad.right}
					{@const bPlotH = bH - bPad.top - bPad.bottom}
					{@const bBarW = Math.min(40, bPlotW / balances.bankAccounts.length * 0.7)}
					{@const bBarGap = bPlotW / balances.bankAccounts.length}
					<svg viewBox="0 0 {bW} {bH}" class="w-full" preserveAspectRatio="xMidYMid meet">
						<!-- Y axis -->
						{#each yTicks(0, bankMax) as tick}
							{@const y = bPad.top + bPlotH - (tick / bankMax) * bPlotH}
							<line x1={bPad.left} y1={y} x2={bW - bPad.right} y2={y} stroke="currentColor" stroke-opacity="0.1" />
							<text x={bPad.left - 6} y={y + 3} text-anchor="end" fill="currentColor" opacity="0.5" font-size="9">{fmtK(tick)}</text>
						{/each}
						<!-- Bars -->
						{#each balances.bankAccounts as bank, i}
							{@const x = bPad.left + i * bBarGap + (bBarGap - bBarW) / 2}
							{@const h = (Math.abs(bank.balance) / bankMax) * bPlotH}
							{@const y = bank.balance >= 0 ? bPad.top + bPlotH - h : bPad.top + bPlotH}
							<rect x={x} y={y} width={bBarW} height={h} fill={bank.balance >= 0 ? '#3b82f6' : '#ef4444'} rx="2" opacity="0.8" />
							<text x={x + bBarW / 2} y={bH - 6} text-anchor="middle" fill="currentColor" opacity="0.5" font-size="8">{bank.code}</text>
						{/each}
					</svg>
					<div class="mt-1 space-y-1 tabular-nums">
						{#each balances.bankAccounts as bank}
							<div class="flex justify-between text-xs hover:bg-surface-container-low transition-colors">
								<span class="text-muted-foreground">{bank.description} ({bank.code})</span>
								<span class="font-medium" class:text-destructive={bank.balance < 0}><CurrencyDisplay amount={bank.balance} /></span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex h-40 items-center justify-center text-muted-foreground text-sm">No bank accounts</div>
				{/if}
			</div>

			<!-- Debtors Aging Chart -->
			<div class="rounded-xl bg-surface-container-lowest p-6">
				<h3 class="mb-2 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">Debtors</h3>
				{#if totalDebtors > 0}
					{@const dW = 320}
					{@const dH = 160}
					{@const dPad = { top: 10, right: 10, bottom: 30, left: 60 }}
					{@const dPlotW = dW - dPad.left - dPad.right}
					{@const dPlotH = dH - dPad.top - dPad.bottom}
					{@const dBarW = Math.min(50, dPlotW / 4 * 0.7)}
					{@const dBarGap = dPlotW / 4}
					<svg viewBox="0 0 {dW} {dH}" class="w-full" preserveAspectRatio="xMidYMid meet">
						<!-- Y axis -->
						{#each yTicks(0, debtorMax) as tick}
							{@const y = dPad.top + dPlotH - (tick / debtorMax) * dPlotH}
							<line x1={dPad.left} y1={y} x2={dW - dPad.right} y2={y} stroke="currentColor" stroke-opacity="0.1" />
							<text x={dPad.left - 6} y={y + 3} text-anchor="end" fill="currentColor" opacity="0.5" font-size="9">{fmtK(tick)}</text>
						{/each}
						<!-- Bars -->
						{#each debtorBuckets as bucket, i}
							{@const x = dPad.left + i * dBarGap + (dBarGap - dBarW) / 2}
							{@const h = (Math.abs(bucket.value) / debtorMax) * dPlotH}
							{@const y = dPad.top + dPlotH - h}
							<rect x={x} y={y} width={dBarW} height={h} fill={bucket.color} rx="2" opacity="0.8" />
							<text x={x + dBarW / 2} y={dH - 6} text-anchor="middle" fill="currentColor" opacity="0.5" font-size="8">{bucket.label}</text>
						{/each}
					</svg>
					<div class="mt-2 flex justify-between text-xs tabular-nums">
						<span class="text-muted-foreground">Total Debtors</span>
						<span class="font-semibold"><CurrencyDisplay amount={totalDebtors} /></span>
					</div>
				{:else}
					<div class="flex h-40 items-center justify-center text-muted-foreground text-sm">No debtors</div>
				{/if}
			</div>
		</div>

		<!-- Transactions Entered Table -->
		<div>
			<h2 class="mb-4 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">
				Value of Transactions Entered
			</h2>
			<div class="overflow-auto rounded-xl bg-surface-container-lowest">
				<table class="w-full text-sm tabular-nums">
					<thead>
						<tr class="bg-surface-container-low">
							<th class="px-4 py-3 text-left font-medium text-muted-foreground"></th>
							<th class="px-4 py-3 text-right font-medium text-muted-foreground">Today</th>
							<th class="px-4 py-3 text-right font-medium text-muted-foreground">Previous 7 Days</th>
							<th class="px-4 py-3 text-right font-medium text-muted-foreground">Previous 30 Days</th>
						</tr>
					</thead>
					<tbody>
						<tr class="hover:bg-surface-container-low transition-colors">
							<td class="px-4 py-2 font-medium">Sales</td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.today.sales} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.sevenDay.sales} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.thirtyDay.sales} /></td>
						</tr>
						<tr class="hover:bg-surface-container-low transition-colors">
							<td class="px-4 py-2 font-medium">Cost of Sales</td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.today.cogs} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.sevenDay.cogs} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.thirtyDay.cogs} /></td>
						</tr>
						<tr class="bg-surface-container-low">
							<td class="px-4 py-2 font-semibold">Gross Margin</td>
							<td class="px-4 py-2 text-right font-semibold"><CurrencyDisplay amount={periods.today.grossMargin} /></td>
							<td class="px-4 py-2 text-right font-semibold"><CurrencyDisplay amount={periods.sevenDay.grossMargin} /></td>
							<td class="px-4 py-2 text-right font-semibold"><CurrencyDisplay amount={periods.thirtyDay.grossMargin} /></td>
						</tr>
						<tr class="hover:bg-surface-container-low transition-colors">
							<td class="px-4 py-2 text-muted-foreground">Gross Margin %</td>
							<td class="px-4 py-2 text-right">{periods.today.marginPct.toFixed(1)}%</td>
							<td class="px-4 py-2 text-right">{periods.sevenDay.marginPct.toFixed(1)}%</td>
							<td class="px-4 py-2 text-right">{periods.thirtyDay.marginPct.toFixed(1)}%</td>
						</tr>
						<tr class="hover:bg-surface-container-low transition-colors">
							<td class="px-4 py-2 text-muted-foreground">Invoices</td>
							<td class="px-4 py-2 text-right">{periods.today.invoiceCount}</td>
							<td class="px-4 py-2 text-right">{periods.sevenDay.invoiceCount}</td>
							<td class="px-4 py-2 text-right">{periods.thirtyDay.invoiceCount}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Balances & Aging -->
		<div class="grid grid-cols-2 gap-6">
			<!-- Balances -->
			<div>
				<h2 class="mb-4 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">
					Balances
				</h2>
				<div class="space-y-3 tabular-nums">
					<div class="rounded-xl bg-surface-container-lowest p-4">
						<div class="flex justify-between">
							<span class="text-muted-foreground">Receivables</span>
							<span class="text-lg font-bold"><CurrencyDisplay amount={balances.receivables} /></span>
						</div>
					</div>
					<div class="rounded-xl bg-surface-container-lowest p-4">
						<div class="flex justify-between">
							<span class="text-muted-foreground">Payables</span>
							<span class="text-lg font-bold"><CurrencyDisplay amount={balances.payables} /></span>
						</div>
					</div>
				</div>
			</div>

			<!-- Debtors Aging Detail -->
			<div>
				<h2 class="mb-4 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">
					Debtors Aging
				</h2>
				<div class="rounded-xl bg-surface-container-lowest p-4 tabular-nums">
					<div class="space-y-3">
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">Current</span>
							<CurrencyDisplay amount={debtors.current} />
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">1 cycle (30+ days)</span>
							<CurrencyDisplay amount={debtors.oneCycle} />
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">2 cycles (60+ days)</span>
							<CurrencyDisplay amount={debtors.twoCycles} />
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">3+ cycles (90+ days)</span>
							<CurrencyDisplay amount={debtors.threeOrMore} />
						</div>
						<div class="flex justify-between pt-2 font-semibold">
							<span>Total Debtors</span>
							<CurrencyDisplay amount={totalDebtors} />
						</div>
					</div>

					<!-- Stacked bar -->
					{#if totalDebtors > 0}
						<div class="mt-4 flex h-8 overflow-hidden rounded">
							<div class="bg-positive" style="width: {(debtors.current / totalDebtors) * 100}%" title="Current"></div>
							<div class="bg-amber-400" style="width: {(debtors.oneCycle / totalDebtors) * 100}%" title="30+"></div>
							<div class="bg-orange-500" style="width: {(debtors.twoCycles / totalDebtors) * 100}%" title="60+"></div>
							<div class="bg-red-500" style="width: {(debtors.threeOrMore / totalDebtors) * 100}%" title="90+"></div>
						</div>
						<div class="mt-1 flex justify-between text-xs text-muted-foreground">
							<span class="flex items-center gap-1"><span class="h-2 w-2 rounded bg-positive"></span>Current</span>
							<span class="flex items-center gap-1"><span class="h-2 w-2 rounded bg-amber-400"></span>30+</span>
							<span class="flex items-center gap-1"><span class="h-2 w-2 rounded bg-orange-500"></span>60+</span>
							<span class="flex items-center gap-1"><span class="h-2 w-2 rounded bg-red-500"></span>90+</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
