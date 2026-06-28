import { writable, get } from "svelte/store";
import { Socket, Presence } from "phoenix";

export const roomCode = writable("");
export const joined = writable(false);
export const isHost = writable(false);
export const online = writable(0);
export const roomError = writable("");

export const HOST_NICK = "хост";
const NICK_KEY = "server_nick";
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
};
export const memberFlags = writable<Record<string, MemberFlags>>({});

export function myId(): string {
	return clientId();
}

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

function clientId(): string {
	if (typeof localStorage === "undefined") return "";
	let id = localStorage.getItem("server_client_id");
	if (!id) {
		id = crypto.randomUUID();
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

	leaveRoom();
	currentCode = trimmed;

	socket = new Socket(wsUrl());
	socket.connect();

	const nick = asHost ? HOST_NICK : get(myNick);
	channel = socket.channel(`room:${trimmed}`, { client_id: clientId(), nick });
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
		if (!asHost) myNick.set(p.nick);
	});

	channel.on("kick", (p: { client_id: string }) => {
		if (p.client_id === clientId()) leaveRoom();
	});

	channel.on("rename", (p: { client_id: string; nick: string }) => {
		if (p.client_id === clientId()) setMyNick(p.nick);
	});

	channel.on("reaction", (p: { emoji: string; side: "left" | "right" }) =>
		reaction.set({ emoji: p.emoji, side: p.side, id: ++reactionId }),
	);

	channel.on("sync", (p: { key: string; value: unknown }) =>
		incomingSync.set({ key: p.key, value: p.value }),
	);

	channel
		.join()
		.receive("ok", () => {
			roomCode.set(trimmed);
			joined.set(true);
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

export function leaveRoom(): void {
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
}
