import { writable, get, derived } from "svelte/store";
import { Socket, Presence } from "phoenix";
import { initWebrtc, teardownWebrtc, handleSignal } from "./webrtc";

type WebrtcSignal = {
	to: string;
	from?: string;
	description?: RTCSessionDescriptionInit;
	candidate?: RTCIceCandidateInit;
};

export const roomCode = writable("");
export const joined = writable(false);
export const isHost = writable(false);
export const online = writable(0);
export const roomError = writable("");

export const HOST_NICK = "хост";
const NICK_KEY = "server_nick";
const LAST_ROOM_KEY = "server_last_room";

export const lastRoom = (): string =>
	(typeof localStorage !== "undefined" && localStorage.getItem(LAST_ROOM_KEY)) || "";
const loadNick = () =>
	(typeof localStorage !== "undefined" && localStorage.getItem(NICK_KEY)) || "";
export const myNick = writable(loadNick());
myNick.subscribe((v) => {
	if (typeof localStorage !== "undefined") localStorage.setItem(NICK_KEY, v);
});

export type Member = { id: string; nick: string };
export const members = writable<Member[]>([]);

export type MemberFlags = {
	role?: "host" | "rights" | "guest";
	bannedReactions?: boolean;
	canEditTimer?: boolean;
	cameraBanned?: boolean;
};
export const memberFlags = writable<Record<string, MemberFlags>>({});

export type Notification = { id: number; text: string };
export const notifications = writable<Notification[]>([]);
let notifId = 0;
let notifyReady = false;

export function notify(text: string): void {
	if (!notifyReady) return;
	const id = ++notifId;
	notifications.update((n) => [...n, { id, text }]);
	setTimeout(
		() => notifications.update((n) => n.filter((x) => x.id !== id)),
		5000,
	);
}

export function myId(): string {
	return clientId();
}

export const canEditTimer = derived(
	[joined, isHost, memberFlags],
	([$joined, $isHost, $flags]) => {
		if (!$joined) return true;
		if ($isHost) return true;
		const f = $flags[clientId()] ?? {};
		return f.role === "host" || f.role === "rights" || !!f.canEditTimer;
	},
);

export const reaction = writable<{ emoji: string; side: "left" | "right"; id: number } | null>(null);
let reactionId = 0;

export const incomingSync = writable<{ key: string; value: unknown } | null>(null);

let socket: Socket | null = null;
let channel: ReturnType<Socket["channel"]> | null = null;
let currentCode = "";

function wsUrl(): string {
	if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
	const proto = location.protocol === "https:" ? "wss:" : "ws:";
	return `${proto}//${location.hostname}:4000/socket`;
}

function newId(): string {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
		return crypto.randomUUID();
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function clientId(): string {
	if (typeof localStorage === "undefined") return "";
	let id = localStorage.getItem("server_client_id");
	if (!id) {
		id = newId();
		localStorage.setItem("server_client_id", id);
	}
	return id;
}

export function roomLink(code: string): string {
	return `${location.origin}/server?room=${encodeURIComponent(code)}`;
}

export function connectRoom(code: string, asHost = false): void {
	const trimmed = code.trim().toUpperCase();
	roomError.set("");
	isHost.set(asHost);
	if (!trimmed) {
		roomError.set("Введите код комнаты");
		return;
	}
	if (trimmed === currentCode && socket) return;

	leaveRoom(false);
	currentCode = trimmed;

	socket = new Socket(wsUrl());
	socket.connect();

	const nick = get(myNick);
	channel = socket.channel(`room:${trimmed}`, { client_id: clientId(), nick, host: asHost });
	const presence = new Presence(channel);
	presence.onSync(() => {
		const list = presence.list((id, { metas }) => ({
			id,
			nick: (metas[0] as { nick?: string })?.nick ?? "",
		}));
		online.set(list.length);
		members.set(list);
	});

	channel.on("nick", (p: { nick: string }) => {
		myNick.set(p.nick);
	});

	channel.on("kick", (p: { client_id: string }) => {
		if (p.client_id === clientId()) leaveRoom();
	});

	channel.on("rename", (p: { client_id: string; nick: string }) => {
		if (p.client_id === clientId()) setMyNick(p.nick);
	});

	channel.on("host_changed", (p: { client_id: string }) => {
		isHost.set(p.client_id === clientId());
	});

	channel.on("synced", () => {
		notifyReady = true;
	});

	channel.on("reaction", (p: { emoji: string; side: "left" | "right" }) =>
		reaction.set({ emoji: p.emoji, side: p.side, id: ++reactionId }),
	);

	channel.on("sync", (p: { key: string; value: unknown }) =>
		incomingSync.set({ key: p.key, value: p.value }),
	);

	channel.on("webrtc", (msg: WebrtcSignal) => {
		if (msg.to === clientId()) void handleSignal(msg);
	});

	channel
		.join()
		.receive("ok", () => {
			roomCode.set(trimmed);
			joined.set(true);
			initWebrtc();
			void import("./camera").then((m) => m.resumeCamera());
			if (typeof localStorage !== "undefined")
				localStorage.setItem(LAST_ROOM_KEY, trimmed);
		})
		.receive("error", (resp: { reason?: string }) => {
			roomError.set(resp?.reason ?? "Не удалось подключиться");
			leaveRoom();
		});
}

export function sendReaction(emoji: string, side: "left" | "right"): void {
	channel?.push("reaction", { emoji, side });
}

export function pushSync(key: string, value: unknown): void {
	channel?.push("sync", { key, value });
}

export function pushWebrtc(payload: WebrtcSignal): void {
	channel?.push("webrtc", payload);
}

export function setMemberFlag(id: string, patch: MemberFlags): void {
	const next = { ...(get(memberFlags)[id] ?? {}), ...patch };
	memberFlags.update((m) => ({ ...m, [id]: next }));
	if (id === clientId() && patch.role !== undefined)
		isHost.set(patch.role === "host");
	pushSync(`member:${id}`, next);
}

export function kickMember(id: string): void {
	channel?.push("kick", { client_id: id });
}

export function renameMember(id: string, nick: string): void {
	if (id === clientId()) setMyNick(nick);
	else channel?.push("rename", { client_id: id, nick });
}

export function setMyNick(nick: string): void {
	channel?.push("set_nick", { nick });
}

export function createRoom(): void {
	connectRoom(Math.random().toString(36).slice(2, 8).toUpperCase(), true);
}

export function leaveRoom(forget = true): void {
	teardownWebrtc();
	notifyReady = false;
	notifications.set([]);
	channel?.leave();
	socket?.disconnect();
	channel = null;
	socket = null;
	currentCode = "";
	joined.set(false);
	isHost.set(false);
	online.set(0);
	members.set([]);
	memberFlags.set({});
	roomCode.set("");
	if (forget && typeof localStorage !== "undefined")
		localStorage.removeItem(LAST_ROOM_KEY);
}
