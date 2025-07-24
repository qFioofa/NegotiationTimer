import { writable, derived } from 'svelte/store';
import TimerLogic from '$lib/components/TimerLogic';
import Config from '$lib/components/Config';
import { dConfig } from './defaultConfig';

export const GlobalConfig = new Config(dConfig);

export const parameters = writable({
    ShuffleFunction: null
});

// === Основной таймер ===
export const timerInstance = new TimerLogic();
export const timeMs = writable(0);
export const isRunning = writable(false);

export const displayTime = derived(timeMs, $timeMs => {
    const totalSec = Math.floor($timeMs / 1000);
    const min = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const sec = (totalSec % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
});

timerInstance.addUpdateListener(ms => timeMs.set(ms));
timerInstance.addRunningListener(running => isRunning.set(running));

export function initTimer() {
    const seconds = GlobalConfig.get('timerDuration') || 60;
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

export const IntroGuideVisiable = writable(GlobalConfig.get("introGuide"));
export function setIntroGuideVisiable(value) {
    IntroGuideVisiable.set(value);
}

export const isBlackout = writable(false);

// === Инвертированный таймер для Pause ===
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
export function resetUpTimer() {
    upTimerInstance.pause();
    upTimerInstance.timeSubtract(upTimerInstance.toMs() / 1000);
}