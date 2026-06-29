import { writable, get } from "svelte/store";
import { pushSync, myId } from "./room";
import {
	startProcessing,
	stopProcessing,
	setProcessingMode,
	type BgMode,
} from "./backgroundRemoval";

export const cameraStream = writable<MediaStream | null>(null);
export const cameraOn = writable(false);
export const cameraError = writable("");
export const cameraDevices = writable<MediaDeviceInfo[]>([]);
export const cameraDeviceId = writable("");
export const bgMode = writable<BgMode>("off");

export const cameraStates = writable<Record<string, { on: boolean }>>({});

let rawStream: MediaStream | null = null;
let processing = false;

const CAM_KEY = "server_camera_on";
const rememberCam = (on: boolean) => {
	if (typeof sessionStorage === "undefined") return;
	if (on) sessionStorage.setItem(CAM_KEY, "1");
	else sessionStorage.removeItem(CAM_KEY);
};

function stopRaw(): void {
	if (processing) {
		stopProcessing();
		processing = false;
	}
	if (rawStream) rawStream.getTracks().forEach((t) => t.stop());
	rawStream = null;
	cameraStream.set(null);
}

async function applyBg(mode: BgMode): Promise<void> {
	if (!rawStream || !get(cameraOn)) return;

	if (mode === "off") {
		if (processing) {
			stopProcessing();
			processing = false;
		}
		cameraStream.set(rawStream);
		return;
	}

	if (processing) {
		setProcessingMode(mode);
		return;
	}

	try {
		const processed = await startProcessing(rawStream, mode);
		processing = true;
		cameraStream.set(processed);
	} catch {
		cameraError.set("Не удалось включить обработку фона");
		bgMode.set("off");
		cameraStream.set(rawStream);
	}
}

export async function startCamera(deviceId?: string): Promise<void> {
	stopRaw();
	cameraError.set("");

	if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
		cameraError.set("Камера недоступна в этом браузере");
		return;
	}

	try {
		rawStream = await navigator.mediaDevices.getUserMedia({
			video: deviceId ? { deviceId: { exact: deviceId } } : true,
			audio: false,
		});
		cameraOn.set(true);
		cameraStream.set(rawStream);

		const id = deviceId || rawStream.getVideoTracks()[0]?.getSettings().deviceId;
		if (id) cameraDeviceId.set(id);

		await applyBg(get(bgMode));
		rememberCam(true);
		pushSync(`camera:${myId()}`, { on: true });
		await refreshDevices();
	} catch {
		cameraError.set("Не удалось включить камеру — проверь разрешение");
		cameraOn.set(false);
	}
}

export function stopCamera(): void {
	stopRaw();
	rememberCam(false);
	if (get(cameraOn)) {
		cameraOn.set(false);
		pushSync(`camera:${myId()}`, { on: false });
	}
}

export async function refreshDevices(): Promise<void> {
	if (typeof navigator === "undefined" || !navigator.mediaDevices) return;
	try {
		const all = await navigator.mediaDevices.enumerateDevices();
		cameraDevices.set(all.filter((d) => d.kind === "videoinput"));
	} catch {
		cameraDevices.set([]);
	}
}

export function resumeCamera(): void {
	if (typeof sessionStorage === "undefined") return;
	if (!get(cameraOn) && sessionStorage.getItem(CAM_KEY) === "1")
		void startCamera(get(cameraDeviceId) || undefined);
}

if (typeof window !== "undefined") {
	bgMode.subscribe((mode) => void applyBg(mode));
}
