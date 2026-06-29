import { writable, get } from "svelte/store";
import { canEditTimer } from "$lib/stores/room";

export const isPaused = writable(false);

// Пауза — общее состояние комнаты. Менять его может только управляющий
// (хост/права/canEditTimer); у остальных это no-op, а входящая синхронизация
// (roomSync) выставляет isPaused напрямую, минуя эти функции.
export function setPause(value = false): void {
	if (!get(canEditTimer)) return;
	isPaused.set(value);
}

export function togglePause(): void {
	if (!get(canEditTimer)) return;
	isPaused.update((v) => !v);
}
