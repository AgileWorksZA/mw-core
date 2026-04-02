<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let description = $state('');
	let transDate = $state(new Date().toISOString().split('T')[0]);
	let colour = $state(0);
	let submitting = $state(false);
	let confirmOpen = $state(false);

	let journalLines = $state<Array<{
		account: string; description: string;
		debit: number; credit: number; taxCode: string;
	}>>([
		{ account: '', description: '', debit: 0, credit: 0, taxCode: '' },
		{ account: '', description: '', debit: 0, credit: 0, taxCode: '' }
	]);

	const totalDebit = $derived(journalLines.reduce((s, l) => s + (l.debit || 0), 0));
	const totalCredit = $derived(journalLines.reduce((s, l) => s + (l.credit || 0), 0));
	const isBalanced = $derived(Math.abs(totalDebit - totalCredit) < 0.01);
	const hasLines = $derived(journalLines.some((l) => l.account && (l.debit > 0 || l.credit > 0)));
	const isValid = $derived(isBalanced && hasLines && totalDebit > 0);

	function addLine() {
		journalLines = [...journalLines, { account: '', description: '', debit: 0, credit: 0, taxCode: '' }];
	}

	function removeLine(index: number) {
		if (journalLines.length > 2) {
			journalLines = journalLines.filter((_, i) => i !== index);
		}
	}

	async function handleSubmit() {
		confirmOpen = false;
		if (!isValid || submitting) return;
		submitting = true;
		try {
			const lines = journalLines.filter((l) => l.account && (l.debit > 0 || l.credit > 0));
			const res = await fetch('/journals/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ transDate, description, colour, journalLines: lines })
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Failed to create journal');
				return;
			}
			showToast('Journal entry created successfully', 'success');
			await goto('/journals');
		} catch (err: any) {
			showError(err.message || 'Failed to create journal');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="New Journal Entry" subtitle="General Journal">
		<a href="/journals" class="text-sm text-muted-foreground hover:text-foreground">&larr; Back to Journals</a>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-4xl space-y-6">
			<!-- Header -->
			<div class="rounded-xl bg-surface-container-lowest p-5">
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Date</label>
						<input type="date" bind:value={transDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Description</label>
						<input type="text" bind:value={description} placeholder="Journal description" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Colour</label>
						<select bind:value={colour} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							<option value={0}>None</option>
							<option value={1}>Red</option><option value={2}>Orange</option><option value={3}>Yellow</option>
							<option value={4}>Green</option><option value={5}>Blue</option><option value={6}>Purple</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Journal Lines -->
			<div class="rounded-xl bg-surface-container-lowest">
				<div class="border-b border-outline-variant/15 px-5 py-3 flex items-center justify-between">
					<h3 class="text-sm font-semibold font-headline">Journal Lines</h3>
					{#if !isBalanced && hasLines}
						<span class="text-xs font-medium text-destructive">
							Out of balance by {Math.abs(totalDebit - totalCredit).toFixed(2)}
						</span>
					{/if}
				</div>
				<div class="p-5 overflow-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="bg-surface-container-low">
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Account</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-28">Debit</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-28">Credit</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-24">Tax Code</th>
								<th class="px-3 py-2.5 w-10"></th>
							</tr>
						</thead>
						<tbody>
							{#each journalLines as line, i}
								<tr class="hover:bg-surface-container-low transition-colors">
									<td class="px-2 py-1.5">
										<select bind:value={line.account} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
											<option value="">Select...</option>
											{#each data.accounts as acct}
												<option value={acct.code}>{acct.code}: {acct.description}</option>
											{/each}
										</select>
									</td>
									<td class="px-2 py-1.5">
										<input type="text" bind:value={line.description} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Line memo" />
									</td>
									<td class="px-2 py-1.5">
										<input type="number" bind:value={line.debit} step="0.01" min="0" class="w-28 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
									</td>
									<td class="px-2 py-1.5">
										<input type="number" bind:value={line.credit} step="0.01" min="0" class="w-28 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
									</td>
									<td class="px-2 py-1.5">
										<select bind:value={line.taxCode} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
											<option value="">None</option>
											{#each data.taxCodes as tc}
												<option value={tc.code}>{tc.code}: {tc.description}</option>
											{/each}
										</select>
									</td>
									<td class="px-2 py-1.5">
										{#if journalLines.length > 2}
											<button onclick={() => removeLine(i)} class="text-muted-foreground hover:text-destructive text-xs">&times;</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
						<tfoot>
							<tr class="bg-surface-container-low">
								<td colspan="2" class="px-3 py-2 text-right text-sm font-medium text-muted-foreground">Totals</td>
								<td class="px-3 py-2 text-right text-sm font-bold tabular-nums"><CurrencyDisplay amount={totalDebit} /></td>
								<td class="px-3 py-2 text-right text-sm font-bold tabular-nums"><CurrencyDisplay amount={totalCredit} /></td>
								<td colspan="2" class="px-3 py-2">
									{#if isBalanced && hasLines}
										<span class="text-xs text-positive font-medium">Balanced</span>
									{/if}
								</td>
							</tr>
						</tfoot>
					</table>
					<button onclick={addLine} class="mt-3 text-sm text-primary hover:underline">+ Add line</button>
				</div>
			</div>

			<!-- Submit -->
			<div class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-5">
				<div class="text-sm text-muted-foreground">
					{#if !isBalanced && hasLines}
						<span class="text-destructive font-medium">Journal must balance before posting</span>
					{:else if totalDebit > 0}
						Journal total: <span class="font-semibold text-foreground"><CurrencyDisplay amount={totalDebit} /></span>
					{/if}
				</div>
				<div class="flex gap-2">
					<a href="/journals" class="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm hover:bg-surface transition-colors">Cancel</a>
					<button
						onclick={() => { confirmOpen = true; }}
						disabled={!isValid || submitting}
						class="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{submitting ? 'Creating...' : 'Create Journal Entry'}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<ConfirmDialog bind:open={confirmOpen} title="Create Journal Entry" confirmLabel="Create" onConfirm={handleSubmit}>
	Create a journal entry for <strong><CurrencyDisplay amount={totalDebit} /></strong>?
	<br /><span class="text-xs text-muted-foreground">Debits and credits are balanced.</span>
</ConfirmDialog>
