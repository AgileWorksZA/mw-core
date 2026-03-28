<script lang="ts">
	import { onMount } from 'svelte';
	import { getTheme, toggleTheme, applyTheme } from '$lib/stores/theme.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	onMount(() => applyTheme());
</script>

<div class="relative flex min-h-screen items-center justify-center bg-surface">
	<!-- Dark mode toggle -->
	<button
		onclick={toggleTheme}
		class="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-surface-container-low transition-colors"
		aria-label="Toggle dark mode"
	>
		<span class="material-symbols-outlined text-xl">
			{getTheme() === 'dark' ? 'light_mode' : 'dark_mode'}
		</span>
	</button>
	<div class="w-full max-w-md rounded-xl bg-card p-8">
		<div class="mb-6 text-center">
			<h1 class="font-headline text-2xl font-bold text-foreground">MoneyWorks</h1>
			<p class="mt-1 text-sm text-muted-foreground">Connect to your MoneyWorks server</p>
		</div>

		{#if form?.error}
			<div class="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-4">
			<div class="grid grid-cols-3 gap-3">
				<div class="col-span-2">
					<label for="host" class="mb-1 block text-sm font-medium text-foreground">Host</label>
					<input
						id="host"
						name="host"
						type="text"
						value={form?.host ?? 'localhost'}
						required
						class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					/>
				</div>
				<div>
					<label for="port" class="mb-1 block text-sm font-medium text-foreground">Port</label>
					<input
						id="port"
						name="port"
						type="number"
						value={form?.port ?? 6710}
						required
						class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					/>
				</div>
			</div>

			<div>
				<label for="dataFile" class="mb-1 block text-sm font-medium text-foreground">Data File</label>
				<input
					id="dataFile"
					name="dataFile"
					type="text"
					value={form?.dataFile ?? ''}
					placeholder="Acme Widgets Gold.moneyworks"
					required
					class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
				/>
			</div>

			<div>
				<label for="username" class="mb-1 block text-sm font-medium text-foreground">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					value={form?.username ?? ''}
					required
					class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
				/>
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-foreground">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
			>
				Connect
			</button>
		</form>
	</div>
</div>
