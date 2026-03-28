<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const W = 500;
	const H = 250;
	const pad = { top: 20, right: 20, bottom: 30, left: 60 };
	const plotW = W - pad.left - pad.right;
	const plotH = H - pad.top - pad.bottom;

	const allValues = $derived(data.years.flatMap((y: any) => y.data));
	const maxVal = $derived(Math.max(...allValues, 1));

	function x(i: number): number { return pad.left + (i / 11) * plotW; }
	function y(v: number): number { return pad.top + plotH - (v / maxVal) * plotH; }

	function fmtK(v: number): string {
		if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`;
		return v.toFixed(0);
	}

	function linePath(pts: number[]): string {
		if (pts.length === 0) return '';
		let d = `M ${x(0)} ${y(pts[0])}`;
		for (let i = 1; i < pts.length; i++) d += ` L ${x(i)} ${y(pts[i])}`;
		return d;
	}
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Year over Year Income</h1>
		<p class="text-sm text-muted-foreground">Cumulative income comparison by fiscal year</p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.years.length > 0}
			<div class="rounded-lg border border-border p-4">
				<svg viewBox="0 0 {W} {H}" class="w-full" preserveAspectRatio="xMidYMid meet">
					<!-- Grid -->
					{#each [0, 0.25, 0.5, 0.75, 1] as pct}
						{@const yv = maxVal * pct}
						{@const yp = y(yv)}
						<line x1={pad.left} y1={yp} x2={W - pad.right} y2={yp} stroke="currentColor" stroke-opacity="0.1" />
						<text x={pad.left - 6} y={yp + 3} text-anchor="end" fill="currentColor" opacity="0.5" font-size="9">{fmtK(yv)}</text>
					{/each}
					<!-- Lines per year -->
					{#each data.years as yr}
						<path d={linePath(yr.data)} fill="none" stroke={yr.color} stroke-width="2.5" />
						{#each yr.data as v, i}
							<circle cx={x(i)} cy={y(v)} r="3" fill={yr.color} />
						{/each}
					{/each}
					<!-- X labels -->
					{#each data.months as m, i}
						<text x={x(i)} y={H - 6} text-anchor="middle" fill="currentColor" opacity="0.5" font-size="9">{m}</text>
					{/each}
				</svg>
				<div class="mt-3 flex gap-4 justify-center">
					{#each data.years as yr}
						<span class="flex items-center gap-1.5 text-xs">
							<span class="inline-block h-2 w-4 rounded" style="background: {yr.color}"></span>
							{yr.label}
						</span>
					{/each}
				</div>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No income data available</div>
		{/if}
	</div>
</div>
