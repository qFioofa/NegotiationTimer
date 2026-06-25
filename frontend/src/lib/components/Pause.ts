import { writable } from "svelte/store";

export const isPaused = writable(false);

export function setPause(value = false): void {
	isPaused.set(value);
}

export function togglePause(): void {
	isPaused.update((v) => !v);
}
