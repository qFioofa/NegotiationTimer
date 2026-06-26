import { writable } from "svelte/store";
import { Socket, Presence } from "phoenix";

export const roomCode = writable("");
export const joined = writable(false);
export const online = writable(0);
export const roomError = writable("");

let socket: Socket | null = null;
let channel: ReturnType<Socket["channel"]> | null = null;
let currentCode = "";

function wsUrl(): string {
	if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
	const proto = location.protocol === "https:" ? "wss:" : "ws:";
	return `${proto}//${location.hostname}:4000/socket`;
}

function clientId(): string {
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

export function connectRoom(code: string): void {
	const trimmed = code.trim().toUpperCase();
	roomError.set("");
	if (!trimmed) {
		roomError.set("Введите код комнаты");
		return;
	}
	// Уже в этой комнате — не пересоздаём соединение (важно для авто-join по ссылке).
	if (trimmed === currentCode && socket) return;

	leaveRoom();
	currentCode = trimmed;

	socket = new Socket(wsUrl());
	socket.connect();

	channel = socket.channel(`room:${trimmed}`, { client_id: clientId() });
	const presence = new Presence(channel);
	presence.onSync(() => online.set(presence.list().length));

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

export function createRoom(): void {
	connectRoom(Math.random().toString(36).slice(2, 8).toUpperCase());
}

export function leaveRoom(): void {
	channel?.leave();
	socket?.disconnect();
	channel = null;
	socket = null;
	currentCode = "";
	joined.set(false);
	online.set(0);
	roomCode.set("");
}
