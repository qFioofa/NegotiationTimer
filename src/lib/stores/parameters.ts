import { writable, type Writable } from 'svelte/store';
import Config from '$lib/components/Config';
import { dConfig } from './defaultConfig';

export type ShuffleTrigger = () => Promise<void>;

export const GlobalConfig = new Config(dConfig);

export const ShuffleFunction: Writable<ShuffleTrigger | null> = writable(null);

export const IntroGuideVisiable = writable(GlobalConfig.get<boolean>("introGuide"));

export const isBlackout = writable(false);

export const isPanelOpen = writable(false);
