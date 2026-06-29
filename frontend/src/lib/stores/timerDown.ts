import TimerLogic from "$lib/components/TimerLogic";
import { writable, get } from "svelte/store";
import { GlobalConfig } from "./parameters";

export const timerInstance = new TimerLogic();
export const timeMs = writable(GlobalConfig.get<number>("timerDuration") || 0);
export const isRunning = writable(false);
export const downTimerSnap = writable(get(timeMs));
// Растёт на каждое естественное истечение таймера (отсчёт дошёл до нуля).
// Подписчики (BlackOut) реагируют на изменение — фантомных срабатываний на сбросе нет.
export const timerExpired = writable(0);

timerInstance.addUpdateListener((ms) => timeMs.set(ms));
timerInstance.addRunningListener((running) => isRunning.set(running));
timerInstance.addTimerSnap((ms) => downTimerSnap.set(ms / 1000));
timerInstance.addExpireListener(() => timerExpired.update((n) => n + 1));

// Хук вызывается ТОЛЬКО на пользовательских действиях (старт/пауза/±время/сброс),
// не на каждом тике — чтобы синхронизация комнаты не слала состояние 4 раза в секунду.
let actionHook: (() => void) | null = null;
export function setTimerActionHook(fn: (() => void) | null): void {
	actionHook = fn;
}
function action(): void {
	actionHook?.();
}

// Применить таймер от другого участника. Не дёргает actionHook → нет эха обратно.
export function applyRemoteTimer(snap: {
	time: number;
	isRunning: boolean;
	ts: number;
}): void {
	timerInstance.syncFrom(snap);
}

export function initTimer(): void {
	timerInstance.timeAdd(get(timeMs));
}

export function startTimer(): void {
	timerInstance.launch();
	action();
}

export function timeAdd(seconds: number): void {
	timerInstance.timeAdd(seconds);
	action();
}

export function timeSubtract(seconds: number): void {
	timerInstance.timeSubtract(seconds);
	action();
}

export function toggleTimer(): void {
	timerInstance.toggle();
	action();
}

export function toMs(): number {
	return timerInstance.toMs();
}

export function resetTimer(): void {
	timerInstance.pause();
	timerInstance.timeSubtract(timerInstance.toMs() / 1000);
	action();
}

// Сброс к стартовому значению одним действием: обнуляем и доводим до seconds,
// затем ОДИН action() → в комнату уходит один снимок с финальным временем, а не
// промежуточный ноль (который у других участников вызывал фантомное «Время вышло!»).
export function resetToStart(seconds: number): void {
	timerInstance.pause();
	timerInstance.timeSubtract(timerInstance.toMs() / 1000);
	timerInstance.timeAdd(seconds);
	action();
}
