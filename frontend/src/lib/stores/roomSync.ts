import { get, writable } from "svelte/store";
import { GlobalConfig } from "./parameters";
import {
	incomingSync,
	pushSync,
	joined,
	isHost,
	memberFlags,
	myId,
	notify,
	type MemberFlags,
} from "./room";
import {
	isRunning,
	timerInstance,
	setTimerActionHook,
	applyRemoteTimer,
} from "./timerDown";
import { nameA, nameB } from "./players";
import { isPaused } from "$lib/components/Pause";
import { isBlackout } from "./parameters";
import { roomSettings } from "$lib/elements/Settings/roomSettingsRegistry";

const CFG_KEYS = roomSettings
	.map((s) => (s as { configKey?: string }).configKey)
	.filter((k): k is string => !!k);

let applying = false;
let inited = false;

const STYLE_CFG_KEYS = [
	"theme",
	"accentColor",
	"playerBackground",
	"usingBackroundImage",
	"backgroundImage",
	"timerEndSound",
	"afterSound",
	"audioTimerEnd",
];
const STYLE_MEDIA_KEYS = ["backgroundImage", "audioTimerEnd"];

type StyleBundle = {
	cfg: Record<string, unknown>;
	media: Record<string, string>;
};

export const hostStyle = writable<StyleBundle | null>(null);

const blobToDataUrl = (b: Blob): Promise<string> =>
	new Promise((res, rej) => {
		const r = new FileReader();
		r.onload = () => res(r.result as string);
		r.onerror = () => rej(r.error);
		r.readAsDataURL(b);
	});
const dataUrlToBlob = (d: string): Promise<Blob> => fetch(d).then((r) => r.blob());

async function buildStyleBundle(): Promise<StyleBundle> {
	const cfg: Record<string, unknown> = {};
	for (const k of STYLE_CFG_KEYS) cfg[k] = GlobalConfig.get(k);
	const media: Record<string, string> = {};
	for (const k of STYLE_MEDIA_KEYS) {
		const blob = await GlobalConfig.getMedia(k);
		if (blob) media[k] = await blobToDataUrl(blob);
	}
	return { cfg, media };
}

async function publishStyle(): Promise<void> {
	if (!get(isHost)) return;
	pushSync("style", await buildStyleBundle());
}

export async function applyHostStyle(): Promise<void> {
	const b = get(hostStyle);
	if (!b) return;
	applying = true;
	try {
		for (const [k, v] of Object.entries(b.cfg)) GlobalConfig.set(k, v);
		for (const [k, d] of Object.entries(b.media)) {
			await GlobalConfig.setMedia(k, await dataUrlToBlob(d));
		}
	} finally {
		applying = false;
	}
}

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

	joined.subscribe((j) => {
		if (j && get(isHost)) void publishStyle();
	});
	for (const key of STYLE_CFG_KEYS) {
		GlobalConfig.subscribe(key, () => {
			if (!applying && get(isHost)) void publishStyle();
		});
	}

	GlobalConfig.subscribe("autoSyncHost", (v) => {
		if (v && get(hostStyle)) void applyHostStyle();
	});
	isPaused.subscribe((v) => {
		if (!applying && GlobalConfig.get("syncTimerActions")) pushSync("paused", v);
	});
	isBlackout.subscribe((v) => {
		if (!applying && GlobalConfig.get("syncTimerActions"))
			pushSync("blackout", v);
	});

	incomingSync.subscribe((msg) => {
		if (!msg) return;
		applying = true;
		try {
			const { key, value } = msg;
			if (key === "style") {
				hostStyle.set(value as StyleBundle);
				if (GlobalConfig.get("autoSyncHost")) void applyHostStyle();
			} else if (key === "paused") {
				if (GlobalConfig.get("syncTimerActions"))
					isPaused.set(value as boolean);
			} else if (key === "blackout") {
				if (GlobalConfig.get("syncTimerActions"))
					isBlackout.set(value as boolean);
			} else if (key.startsWith("member:")) {
				const id = key.slice(7);
				const flags = value as MemberFlags;
				const prev = get(memberFlags)[id]?.role;
				memberFlags.update((m) => ({ ...m, [id]: flags }));
				if (id === myId()) {
					if (flags.role !== undefined)
						isHost.set(flags.role === "host");
					if (flags.role === "host" && prev !== "host")
						notify("Вы назначены хостом");
					else if (flags.role === "rights" && prev !== "rights")
						notify("Вам выданы права хоста");
				}
			} else if (key.startsWith("cfg:")) {
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
