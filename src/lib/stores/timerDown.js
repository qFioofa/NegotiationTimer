import TimerLogic from '$lib/components/TimerLogic';
import { writable, get } from 'svelte/store';
import { GlobalConfig } from './parameters';

export const timerInstance = new TimerLogic();
export const timeMs = writable(GlobalConfig.get("timerDuration") || 0);
export const isRunning = writable(false);
export const downTimerSnap = writable(get(timeMs));

timerInstance.addUpdateListener(ms => timeMs.set(ms));
timerInstance.addRunningListener(running => isRunning.set(running));
timerInstance.addTimerSnap(ms => downTimerSnap.set(ms));

export function initTimer() {
    timerInstance.timeAdd(get(timeMs))
}

export function startTimer() {
    timerInstance.launch();
}

export function timeAdd(seconds) {
    timerInstance.timeAdd(seconds);
}

export function timeSubtract(seconds) {
    timerInstance.timeSubtract(seconds);
}

export function toggleTimer() {
    timerInstance.toggle();
}

export function toMs() {
    return timerInstance.toMs();
}

export function resetTimer() {
    timerInstance.pause();
    timerInstance.timeSubtract(timerInstance.toMs() / 1000);
}