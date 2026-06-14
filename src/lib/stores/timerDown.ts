import TimerLogic from "$lib/components/TimerLogic";
import { writable, get } from "svelte/store";
import { GlobalConfig } from "./parameters";

export const timerInstance = new TimerLogic();
export const timeMs = writable(GlobalConfig.get<number>("timerDuration") || 0);
export const isRunning = writable(false);
export const downTimerSnap = writable(get(timeMs));

timerInstance.addUpdateListener((ms) => timeMs.set(ms));
timerInstance.addRunningListener((running) => isRunning.set(running));
timerInstance.addTimerSnap((ms) => downTimerSnap.set(ms / 1000));

export function initTimer(): void {
	timerInstance.timeAdd(get(timeMs));
}

export function startTimer(): void {
	timerInstance.launch();
}

export function timeAdd(seconds: number): void {
	timerInstance.timeAdd(seconds);
}

export function timeSubtract(seconds: number): void {
	timerInstance.timeSubtract(seconds);
}

export function toggleTimer(): void {
	timerInstance.toggle();
}

export function toMs(): number {
	return timerInstance.toMs();
}

export function resetTimer(): void {
	timerInstance.pause();
	timerInstance.timeSubtract(timerInstance.toMs() / 1000);
}
