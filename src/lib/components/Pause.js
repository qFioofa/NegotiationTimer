import { writable } from 'svelte/store';

export const isPaused = writable(false);

export function setPause(value = false) {
    isPaused.update(v => value);
}

export function togglePause() {
    isPaused.update(v => !v);
}