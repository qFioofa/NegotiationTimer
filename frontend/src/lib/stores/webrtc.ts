import { writable, get } from "svelte/store";
import { members, myId, pushWebrtc } from "./room";
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
	const peer: Peer = { pc, polite: myId() < id, makingOffer: false, ignoreOffer: false };
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
		if (["failed", "closed", "disconnected"].includes(pc.connectionState)) dropStream(id);
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
	const local = get(cameraStream);
	const track = local?.getVideoTracks()[0] ?? null;

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
			if (msg.description.type === "offer") {
				await pc.setLocalDescription();
				pushWebrtc({ to: id, description: pc.localDescription ?? undefined });
			}
		} else if (msg.candidate) {
			try {
				await pc.addIceCandidate(msg.candidate);
			} catch {
				if (!peer.ignoreOffer) void 0;
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
