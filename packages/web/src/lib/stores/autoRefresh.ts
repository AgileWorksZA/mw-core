import { invalidateAll } from '$app/navigation';

/**
 * Auto-refresh controller for dashboard pages.
 * Calls invalidateAll() on a timer to re-run server loaders.
 * Returns controls to start/stop and track state.
 */
export function createAutoRefresh(intervalMs: number = 30_000) {
	let timer: ReturnType<typeof setInterval> | null = null;
	let enabled = $state(true);
	let lastRefresh = $state(Date.now());
	let refreshing = $state(false);

	function start() {
		stop();
		if (!enabled) return;
		timer = setInterval(async () => {
			if (!enabled) return;
			refreshing = true;
			try {
				await invalidateAll();
				lastRefresh = Date.now();
			} finally {
				refreshing = false;
			}
		}, intervalMs);
	}

	function stop() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function toggle() {
		enabled = !enabled;
		if (enabled) start();
		else stop();
	}

	async function refreshNow() {
		refreshing = true;
		try {
			await invalidateAll();
			lastRefresh = Date.now();
		} finally {
			refreshing = false;
		}
	}

	return {
		get enabled() { return enabled; },
		get refreshing() { return refreshing; },
		get lastRefresh() { return lastRefresh; },
		start,
		stop,
		toggle,
		refreshNow
	};
}
