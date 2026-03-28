<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	interface TaskItem {
		label: string;
		href: string;
		badge?: number;
		badgeColor?: string;
		status?: string;
	}

	const dailyTasks: TaskItem[] = $derived([
		{ label: 'Receivables Due', href: '/receivables', badge: data.overdueReceivables, badgeColor: 'bg-destructive' },
		{ label: 'Payables Due', href: '/payables', badge: data.overduePayables, badgeColor: 'bg-destructive' }
	]);

	const regularTasks: TaskItem[] = [
		{ label: 'Bank Reconciliation', href: '/bank-reconciliation' },
		{ label: 'Banking (Deposits)', href: '/banking' }
	];

	const monthlyTasks: TaskItem[] = [
		{ label: 'Aged Receivables', href: '/receivables', status: 'Review aging' },
		{ label: 'Aged Payables', href: '/payables', status: 'Review aging' },
		{ label: 'Income & Expenses', href: '/dashboard/income-expenses', status: 'Review P&L' }
	];

	const reportTasks: TaskItem[] = [
		{ label: 'Financial Reports', href: '/reports', status: 'Profit, Balance Sheet' },
		{ label: 'Sales Reports', href: '/reports', status: 'Customer analysis' }
	];
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-4">
		<h1 class="font-headline text-xl font-bold">To Do</h1>
		<p class="text-sm text-muted-foreground">Workflow task board — {data.today}</p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		<div class="grid grid-cols-4 gap-6">
			<!-- Daily -->
			<div>
				<h2 class="font-headline mb-3 rounded-xl bg-blue-500/10 px-3 py-2 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Daily</h2>
				<div class="space-y-2">
					{#each dailyTasks as task}
						<a href={task.href} class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-3 transition-colors hover:bg-surface-container-low">
							<span class="text-sm font-medium">{task.label}</span>
							{#if task.badge && task.badge > 0}
								<span class="rounded-full {task.badgeColor} px-2 py-0.5 text-xs font-bold text-white">{task.badge}</span>
							{:else}
								<span class="rounded-full bg-positive px-2 py-0.5 text-xs font-bold text-white">0</span>
							{/if}
						</a>
					{/each}
				</div>
			</div>

			<!-- Regular -->
			<div>
				<h2 class="font-headline mb-3 rounded-xl bg-amber-500/10 px-3 py-2 text-center text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Regular</h2>
				<div class="space-y-2">
					{#each regularTasks as task}
						<a href={task.href} class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-3 transition-colors hover:bg-surface-container-low">
							<span class="text-sm font-medium">{task.label}</span>
							<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<polyline points="9,18 15,12 9,6" />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<!-- Monthly -->
			<div>
				<h2 class="font-headline mb-3 rounded-xl bg-purple-500/10 px-3 py-2 text-center text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Monthly</h2>
				<div class="space-y-2">
					{#each monthlyTasks as task}
						<a href={task.href} class="rounded-xl bg-surface-container-lowest p-3 block transition-colors hover:bg-surface-container-low">
							<div class="text-sm font-medium">{task.label}</div>
							{#if task.status}
								<div class="mt-0.5 text-xs text-muted-foreground">{task.status}</div>
							{/if}
						</a>
					{/each}
				</div>
			</div>

			<!-- Reports -->
			<div>
				<h2 class="font-headline mb-3 rounded-xl bg-positive/10 px-3 py-2 text-center text-xs font-semibold text-positive uppercase tracking-wider">Reports</h2>
				<div class="space-y-2">
					{#each reportTasks as task}
						<a href={task.href} class="rounded-xl bg-surface-container-lowest p-3 block transition-colors hover:bg-surface-container-low">
							<div class="text-sm font-medium">{task.label}</div>
							{#if task.status}
								<div class="mt-0.5 text-xs text-muted-foreground">{task.status}</div>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
