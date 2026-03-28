import { writable } from 'svelte/store';

export interface ToastItem {
	id: number;
	message: string;
	type: 'error' | 'success' | 'info';
}

let nextId = 0;

export const toasts = writable<ToastItem[]>([]);

export function showToast(message: string, type: ToastItem['type'] = 'info', duration = 5000) {
	const id = nextId++;
	toasts.update((t) => [...t, { id, message, type }]);
	if (duration > 0) {
		setTimeout(() => dismissToast(id), duration);
	}
}

export function dismissToast(id: number) {
	toasts.update((t) => t.filter((item) => item.id !== id));
}

export function showError(message: string) {
	showToast(message, 'error', 8000);
}
