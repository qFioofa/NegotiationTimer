import { writable, derived } from 'svelte/store';
import TimerLogic from '$lib/components/TimerLogic';
import Config from '$lib/components/Config';
import { dConfig } from './defaultConfig';

export const GlobalConfig = new Config(dConfig);

export const parameters = writable({
    player1Element: null,
    player2Element: null,
    ShuffleFunction: null
});

export const timerInstance = new TimerLogic();
export const timeMs = writable(0);
export const isRunning = writable(false);

export const displayTime = derived(timeMs, $timeMs => {
    const totalSec = Math.floor($timeMs / 1000);
    const min = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const sec = (totalSec % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
});

timerInstance.addUpdateListener(ms => {
    timeMs.set(ms);
});

timerInstance.addRunningListener(running => {
    isRunning.set(running);
});

export function initTimer() {
    const seconds = GlobalConfig.get('timerDuration') || 240;
    timerInstance.timeAdd(seconds);
}

export const {
    toggle: toggleTimer,
    timeAdd,
    timeSubtract,
    launch,
    pause,
    destroy: destroyTimer,
    toMs
} = timerInstance;

export function startTimer() {
    timerInstance.launch();
}

export function resetTimer() {
    const seconds = GlobalConfig.get('timerDuration') || 60;
    timerInstance.pause();
    timerInstance.timeSubtract(timerInstance.toMs() / 1000);
    timerInstance.timeAdd(seconds);
}
