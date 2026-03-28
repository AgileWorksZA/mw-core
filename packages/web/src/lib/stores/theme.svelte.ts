import { browser } from '$app/environment';

function getInitialTheme(): 'light' | 'dark' {
	if (!browser) return 'light';
	const stored = localStorage.getItem('theme');
	if (stored === 'dark' || stored === 'light') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

let theme = $state<'light' | 'dark'>(getInitialTheme());

export function getTheme() {
	return theme;
}

export function toggleTheme() {
	theme = theme === 'light' ? 'dark' : 'light';
	applyTheme();
}

export function applyTheme() {
	if (!browser) return;
	const root = document.documentElement;
	if (theme === 'dark') {
		root.classList.add('dark');
	} else {
		root.classList.remove('dark');
	}
	localStorage.setItem('theme', theme);
}
