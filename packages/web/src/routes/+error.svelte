<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex h-full items-center justify-center p-8">
	<div class="text-center max-w-md">
		<div class="text-6xl font-bold text-destructive">{page.status}</div>
		<h1 class="mt-4 text-xl font-semibold">{page.status === 404 ? 'Page Not Found' : 'Something Went Wrong'}</h1>
		<p class="mt-2 text-sm text-muted-foreground">{page.error?.message || 'An unexpected error occurred'}</p>
		<div class="mt-6 flex gap-3 justify-center">
			<a href="/dashboard" class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
				Go to Dashboard
			</a>
			<button onclick={() => history.back()} class="rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
				Go Back
			</button>
		</div>
	</div>
</div>
