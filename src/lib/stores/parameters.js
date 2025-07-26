import { timerDisplay } from '$lib/components/utils/TimerUtils';
import TimerLogic from '$lib/components/TimerLogic';
import { writable, derived } from 'svelte/store';
import Config from '$lib/components/Config';
import { dConfig } from './defaultConfig';

export const GlobalConfig = new Config(dConfig);

export let ShuffleFunction = writable(null);

export const IntroGuideVisiable = writable(GlobalConfig.get("introGuide"));

export const isBlackout = writable(false);
