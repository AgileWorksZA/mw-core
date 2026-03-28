import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "svelte/elements";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithElementRef<T extends HTMLAttributes<HTMLElement> = HTMLAttributes<HTMLElement>> = T & {
	ref?: HTMLElement | null;
};

export type WithoutChild<T> = Omit<T, "child">;
export type WithoutChildrenOrChild<T> = Omit<T, "children" | "child">;
