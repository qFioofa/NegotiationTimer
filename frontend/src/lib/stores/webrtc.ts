import { writable, get } from "svelte/store";
import { members, memberFlags, myId, pushWebrtc } from "./room";
import { cameraStream } from "./camera";

export const remoteStreams = writable<Record<string, MediaStream>>({});

const RTC_CONFIG: RTCConfiguration = {
	iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

type Peer = {
	pc: RTCPeerConnection;
	polite: boolean;
	makingOffer: boolean;
	ignoreOffer: boolean;
	pendingCandidates: RTCIceCandidateInit[];
};

type Signal = {
	to: string;
	from?: string;
	description?: RTCSessionDescriptionInit;
	candidate?: RTCIceCandidateInit;
};

const peers = new Map<string, Peer>();
let active = false;
let unsubs: Array<() => void> = [];

function ensurePeer(id: string): Peer {
	const existing = peers.get(id);
	if (existing) return existing;

	const pc = new RTCPeerConnection(RTC_CONFIG);
	const peer: Peer = { pc, polite: myId() < id, makingOffer: false, ignoreOffer: false, pendingCandidates: [] };
	peers.set(id, peer);

	pc.onnegotiationneeded = async () => {
		try {
			peer.makingOffer = true;
			await pc.setLocalDescription();
			pushWebrtc({ to: id, description: pc.localDescription ?? undefined });
		} catch {
			void 0;
		} finally {
			peer.makingOffer = false;
		}
	};

	pc.onicecandidate = ({ candidate }) => {
		if (candidate) pushWebrtc({ to: id, candidate: candidate.toJSON() });
	};

	pc.ontrack = ({ streams }) => {
		const s = streams[0];
		if (s) remoteStreams.update((m) => ({ ...m, [id]: s }));
	};

	pc.onconnectionstatechange = () => {
		// "disconnected" часто восстанавливается само — рвать поток только на терминальных
		// состояниях, иначе камера исчезает на сетевой блип и не возвращается без перезагрузки.
		if (["failed", "closed"].includes(pc.connectionState)) dropStream(id);
	};

	return peer;
}

function dropStream(id: string): void {
	remoteStreams.update((m) => {
		if (!(id in m)) return m;
		const next = { ...m };
		delete next[id];
		return next;
	});
}

function closePeer(id: string): void {
	const p = peers.get(id);
	if (p) p.pc.close();
	peers.delete(id);
	dropStream(id);
}

function syncLocalTracks(): void {
	// Бан камеры применяется на источнике: перестаём слать трек пирам (replaceTrack
	// мгновенный, без renegotiation), но локальный self-view не трогаем. На снятии бана
	// трек возвращается тем же путём — поэтому всё применяется моментально, без перезагрузки.
	const banned = !!get(memberFlags)[myId()]?.cameraBanned;
	const local = get(cameraStream);
	const track = banned ? null : (local?.getVideoTracks()[0] ?? null);

	for (const [, peer] of peers) {
		const sender = peer.pc.getSenders().find((s) => s.track?.kind === "video" || s.track === null);
		if (sender) sender.replaceTrack(track);
		else if (track && local) peer.pc.addTrack(track, local);
	}
}

function syncPeers(ids: string[]): void {
	if (!active) return;
	const present = new Set(ids.filter((id) => id !== myId()));

	for (const id of present) ensurePeer(id);
	for (const [id] of peers) if (!present.has(id)) closePeer(id);

	syncLocalTracks();
}

export async function handleSignal(msg: Signal): Promise<void> {
	if (!active) return;
	const id = msg.from;
	if (!id || id === myId()) return;

	const peer = ensurePeer(id);
	const pc = peer.pc;

	try {
		if (msg.description) {
			const collision =
				msg.description.type === "offer" &&
				(peer.makingOffer || pc.signalingState !== "stable");
			peer.ignoreOffer = !peer.polite && collision;
			if (peer.ignoreOffer) return;

			await pc.setRemoteDescription(msg.description);

			// Кандидаты, пришедшие раньше описания, иначе терялись (addIceCandidate
			// бросает без remoteDescription) — из-за этого камера иногда не появлялась.
			for (const c of peer.pendingCandidates) {
				try {
					await pc.addIceCandidate(c);
				} catch {
					void 0;
				}
			}
			peer.pendingCandidates = [];

			if (msg.description.type === "offer") {
				await pc.setLocalDescription();
				pushWebrtc({ to: id, description: pc.localDescription ?? undefined });
			}
		} else if (msg.candidate) {
			if (!pc.remoteDescription) {
				peer.pendingCandidates.push(msg.candidate);
			} else {
				try {
					await pc.addIceCandidate(msg.candidate);
				} catch {
					if (!peer.ignoreOffer) void 0;
				}
			}
		}
	} catch {
		void 0;
	}
}

export function initWebrtc(): void {
	if (active || typeof window === "undefined") return;
	active = true;
	unsubs = [
		members.subscribe((list) => syncPeers(list.map((m) => m.id))),
		cameraStream.subscribe(() => active && syncLocalTracks()),
		memberFlags.subscribe(() => active && syncLocalTracks()),
	];
}

export function teardownWebrtc(): void {
	if (!active) return;
	active = false;
	unsubs.forEach((u) => u());
	unsubs = [];
	for (const [id] of peers) closePeer(id);
	remoteStreams.set({});
}
