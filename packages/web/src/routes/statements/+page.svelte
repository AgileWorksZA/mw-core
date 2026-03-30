<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let statementDate = $state(new Date().toISOString().split('T')[0]);
	let includeRemittance = $state(false);
	let omitZero = $state(true);
	let omitCredit = $state(false);
	let message = $state('');
	let selectAll = $state(true);
	let selectedCodes = $state<Set<string>>(new Set(data.customers.map((c) => c.code)));
	let generating = $state(false);

	// Preview state
	let statements = $state<Array<{
		code: string; total: number; statementDate: string; message: string;
		transactions: Array<{ ref: string; date: string; dueDate: string; description: string; gross: number; paid: number; outstanding: number }>;
	}>>([]);
	let showPreview = $state(false);

	function toggleAll() {
		if (selectedCodes.size === data.customers.length) {
			selectedCodes = new Set();
			selectAll = false;
		} else {
			selectedCodes = new Set(data.customers.map((c) => c.code));
			selectAll = true;
		}
	}

	function toggleCustomer(code: string) {
		const next = new Set(selectedCodes);
		if (next.has(code)) next.delete(code); else next.add(code);
		selectedCodes = next;
	}

	async function handlePreview() {
		if (selectedCodes.size === 0 || generating) return;
		generating = true;
		try {
			const res = await fetch('/statements', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					customerCodes: Array.from(selectedCodes),
					statementDate, omitZero, omitCredit, message
				})
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Failed to generate statements');
				return;
			}
			statements = result.statements ?? [];
			showPreview = true;
			showToast(`Generated ${result.count} statement(s)`, 'success');
		} catch (err: any) {
			showError(err.message || 'Failed to generate statements');
		} finally {
			generating = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Print Statements" subtitle="Customer statements" />

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-4xl space-y-6">
			{#if !showPreview}
				<!-- Settings -->
				<div class="rounded-xl bg-surface-container-lowest p-5 space-y-4">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="space-y-1.5">
							<label class="text-sm font-medium">Form</label>
							<select class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
								<option>Plain</option>
							</select>
						</div>
						<div class="space-y-1.5">
							<label class="text-sm font-medium">Statement Date</label>
							<input type="date" bind:value={statementDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
						</div>
					</div>

					<div class="flex flex-wrap gap-4">
						<label class="flex items-center gap-2 text-sm cursor-pointer">
							<input type="checkbox" bind:checked={includeRemittance} class="h-4 w-4 rounded accent-primary" />
							Include Remittance Advice
						</label>
						<label class="flex items-center gap-2 text-sm cursor-pointer">
							<input type="checkbox" bind:checked={omitZero} class="h-4 w-4 rounded accent-primary" />
							Omit Zero Balances
						</label>
						<label class="flex items-center gap-2 text-sm cursor-pointer">
							<input type="checkbox" bind:checked={omitCredit} class="h-4 w-4 rounded accent-primary" />
							Omit Credit Balances
						</label>
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Message (optional)</label>
						<textarea bind:value={message} rows="2" placeholder="Message to include on statements..."
							class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring resize-none"></textarea>
					</div>
				</div>

				<!-- Customer selection -->
				<div class="rounded-xl bg-surface-container-lowest">
					<div class="border-b border-outline-variant/15 px-5 py-3 flex items-center justify-between">
						<h3 class="text-sm font-semibold font-headline">Customers ({selectedCodes.size} of {data.customers.length})</h3>
						<button onclick={toggleAll} class="text-sm text-primary hover:underline">
							{selectedCodes.size === data.customers.length ? 'Deselect All' : 'Select All'}
						</button>
					</div>
					<div class="max-h-64 overflow-auto">
						<table class="w-full text-sm">
							<thead class="sticky top-0">
								<tr class="bg-surface-container-low">
									<th class="px-3 py-2 w-10"></th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Code</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Balance</th>
								</tr>
							</thead>
							<tbody>
								{#each data.customers as c}
									<tr class="hover:bg-surface-container-low transition-colors cursor-pointer {selectedCodes.has(c.code) ? 'bg-blue-50 dark:bg-blue-950/20' : ''}"
										onclick={() => toggleCustomer(c.code)}>
										<td class="px-3 py-1.5 text-center">
											<input type="checkbox" checked={selectedCodes.has(c.code)} class="h-4 w-4 rounded accent-primary" />
										</td>
										<td class="px-3 py-1.5 font-mono text-xs">{c.code}</td>
										<td class="px-3 py-1.5">{c.name}</td>
										<td class="px-3 py-1.5 text-right tabular-nums {c.balance > 0 ? 'text-destructive' : 'text-positive'} font-semibold">
											<CurrencyDisplay amount={c.balance} />
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>

				<div class="flex justify-between items-center">
					<p class="text-xs text-muted-foreground">After printing, run Age Debtor Balances to update ageing.</p>
					<button onclick={handlePreview} disabled={selectedCodes.size === 0 || generating}
						class="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
						{generating ? 'Generating...' : 'Preview Statements'}
					</button>
				</div>

			{:else}
				<!-- Preview -->
				<div class="flex items-center justify-between">
					<button onclick={() => { showPreview = false; }} class="text-sm text-muted-foreground hover:text-foreground">&larr; Back to settings</button>
					<span class="text-sm text-muted-foreground">{statements.length} statement(s)</span>
				</div>

				{#each statements as stmt}
					<div class="rounded-xl bg-surface-container-lowest p-5 space-y-3 print:break-before-page">
						<div class="flex justify-between items-start">
							<div>
								<h3 class="font-semibold font-headline text-lg">{stmt.code}</h3>
								<p class="text-sm text-muted-foreground">Statement Date: {stmt.statementDate}</p>
							</div>
							<div class="text-right">
								<div class="text-xs text-muted-foreground uppercase">Amount Due</div>
								<div class="text-xl font-bold text-destructive"><CurrencyDisplay amount={stmt.total} /></div>
							</div>
						</div>

						{#if stmt.message}
							<p class="text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">{stmt.message}</p>
						{/if}

						<table class="w-full text-sm">
							<thead>
								<tr class="bg-surface-container-low">
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Ref</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Due</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Gross</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Paid</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Outstanding</th>
								</tr>
							</thead>
							<tbody>
								{#each stmt.transactions as tx}
									<tr class="hover:bg-surface-container-low transition-colors">
										<td class="px-3 py-1.5 font-mono text-xs">{tx.ref}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{tx.date}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{tx.dueDate}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{tx.description}</td>
										<td class="px-3 py-1.5 text-right tabular-nums"><CurrencyDisplay amount={tx.gross} /></td>
										<td class="px-3 py-1.5 text-right tabular-nums"><CurrencyDisplay amount={tx.paid} /></td>
										<td class="px-3 py-1.5 text-right tabular-nums font-semibold text-destructive"><CurrencyDisplay amount={tx.outstanding} /></td>
									</tr>
								{/each}
							</tbody>
							<tfoot>
								<tr class="bg-surface-container-low">
									<td colspan="6" class="px-3 py-2 text-right text-sm font-medium">Total Due</td>
									<td class="px-3 py-2 text-right text-sm font-bold text-destructive"><CurrencyDisplay amount={stmt.total} /></td>
								</tr>
							</tfoot>
						</table>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
