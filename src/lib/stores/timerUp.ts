import TimerLogic from '$lib/components/TimerLogic';
import { writable } from 'svelte/store';

export const upTimerInstance = new TimerLogic(true);
export const upTimeMs = writable(0);
export const upIsRunning = writable(false);

upTimerInstance.addUpdateListener(ms => upTimeMs.set(ms));
upTimerInstance.addRunningListener(running => upIsRunning.set(running));

export function startUpTimer(): void {
    upTimerInstance.launch();
}

export function stopUpTimer(): void {
    upTimerInstance.pause();
}

export function toggleUpTimer(): void {
    upTimerInstance.toggle();
}

export function resetUpTimer(): void {
    upTimerInstance.pause();
    upTimerInstance.timeSubtract(upTimerInstance.toMs() / 1000);
}
