import TimerLogic from '$lib/components/TimerLogic';
import { writable } from 'svelte/store';

export const upTimerInstance = new TimerLogic(true);
export const upTimeMs = writable(0);
export const upIsRunning = writable(false);

upTimerInstance.addUpdateListener(ms => upTimeMs.set(ms));
upTimerInstance.addRunningListener(running => upIsRunning.set(running));

export function startUpTimer() {
    upTimerInstance.launch();
}

export function stopUpTimer() {
    upTimerInstance.pause();
}

export function toggleUpTimer() {
    upTimerInstance.toggle();
}

export function resetUpTimer() {
    upTimerInstance.pause();
    upTimerInstance.timeSubtract(upTimerInstance.toMs() / 1000);
}