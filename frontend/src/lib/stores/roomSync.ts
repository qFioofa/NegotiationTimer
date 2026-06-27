import { get } from "svelte/store";
import { GlobalConfig } from "./parameters";
import { incomingSync, pushSync } from "./room";
import {
	isRunning,
	timerInstance,
	setTimerActionHook,
	applyRemoteTimer,
} from "./timerDown";
import { nameA, nameB } from "./players";
import { roomSettings } from "$lib/elements/Settings/roomSettingsRegistry";

const CFG_KEYS = roomSettings
	.map((s) => (s as { configKey?: string }).configKey)
	.filter((k): k is string => !!k);

let applying = false;
let inited = false;

function timerSnap() {
	return {
		time: timerInstance.toMs(),
		isRunning: get(isRunning),
		ts: Date.now(),
	};
}

export function initRoomSync(): void {
	if (inited || typeof window === "undefined") return;
	inited = true;

	for (const key of CFG_KEYS) {
		GlobalConfig.subscribe(key, (v) => {
			if (!applying) pushSync(`cfg:${key}`, v);
		});
	}
	nameA.subscribe((v) => {
		if (!applying) pushSync("name:a", v);
	});
	nameB.subscribe((v) => {
		if (!applying) pushSync("name:b", v);
	});
	setTimerActionHook(() => {
		if (!applying) pushSync("timer", timerSnap());
	});

	incomingSync.subscribe((msg) => {
		if (!msg) return;
		applying = true;
		try {
			const { key, value } = msg;
			if (key.startsWith("cfg:")) {
				GlobalConfig.set(key.slice(4), value);
			} else if (key === "timer") {
				applyRemoteTimer(
					value as { time: number; isRunning: boolean; ts: number },
				);
			} else if (key === "name:a") {
				nameA.set(value as string);
			} else if (key === "name:b") {
				nameB.set(value as string);
			}
		} finally {
			applying = false;
		}
	});
}
