<script>
	import { ShuffleFunction, GlobalConfig } from "$lib/stores/parameters";
	import PlayerNumber from "./Players/Wrappers/PlayerNumber.svelte";
	import NameInput from "./Players/Wrappers/NameInput.svelte";
	import { shuffleMap } from "$lib/components/Shuffle";
	import { nameA, nameB, slot1, slot2 } from "$lib/stores/players";
	import { cameraStream, cameraOn, cameraStates } from "$lib/stores/camera";
	import { remoteStreams } from "$lib/stores/webrtc";
	import { myId } from "$lib/stores/room";
	import { onMount } from "svelte";

	function streamFor(slot, local, on, states, remotes) {
		if (!slot) return null;
		if (slot === myId()) return on ? local : null;
		return states[slot]?.on ? (remotes[slot] ?? null) : null;
	}

	$: cam1 = streamFor($slot1, $cameraStream, $cameraOn, $cameraStates, $remoteStreams);
	$: cam2 = streamFor($slot2, $cameraStream, $cameraOn, $cameraStates, $remoteStreams);
	$: mirror1 = $slot1 === myId();
	$: mirror2 = $slot2 === myId();

	function srcObject(node, stream) {
		node.srcObject = stream;
		return {
			update(s) {
				node.srcObject = s;
			},
		};
	}

	let number1, number2;
	let cam1El, cam2El;
	let input1Ref, input2Ref;
	let ghost1Ref, ghost2Ref;
	let wrapperRef;

	let playerBackground = GlobalConfig.get("playerBackground");

	async function ShufflePlayers() {
		if (
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			const result = Math.round(Math.random());
			number1.textContent = result === 0 ? "1" : "2";
			number2.textContent = result === 0 ? "2" : "1";
			return;
		}

		const el1 = cam1 && cam1El ? cam1El : number1;
		const el2 = cam2 && cam2El ? cam2El : number2;
		const _f = shuffleMap.get(GlobalConfig.get("shuffleAnimation"));
		if (_f) await _f(el1, el2);
	}

	onMount(() => {
		const off = GlobalConfig.subscribe(
			"playerBackground",
			(v) => (playerBackground = v),
		);
		ShuffleFunction.set(ShufflePlayers);
		return off;
	});
</script>

<div class="players-wrapper {playerBackground ? '' : 'transparent'}">
	<div class="grid-container">
		<div class="grid-item" class:has-cam={cam1}>
			<PlayerNumber text="1" bind:ref={number1} />
			{#if cam1}
				<video
					class="cam"
					class:mirror={mirror1}
					bind:this={cam1El}
					use:srcObject={cam1}
					autoplay
					muted
					playsinline
				></video>
			{/if}
		</div>
		<div class="grid-item" class:has-cam={cam2}>
			<PlayerNumber text="2" bind:ref={number2} />
			{#if cam2}
				<video
					class="cam"
					class:mirror={mirror2}
					bind:this={cam2El}
					use:srcObject={cam2}
					autoplay
					muted
					playsinline
				></video>
			{/if}
		</div>
		<div class="grid-item">
			<NameInput bind:playerName={$nameA} />
		</div>
		<div class="grid-item">
			<NameInput bind:playerName={$nameB} />
		</div>
	</div>
</div>

<style>
	.players-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-inline: auto;
		padding-block: clamp(1rem, 2vw, 2rem);
		padding-inline: clamp(1rem, 2vw, 2rem);
		background: var(--bg);
		border-radius: clamp(0.5rem, 1vw, 1rem);
		box-shadow: clamp(3px, 1vw, 6px) clamp(3px, 1vw, 6px) 0
			var(--accent-dark);
		color: var(--fg);
		border: 2px solid var(--accent);
		width: min(90vw, 60.4%);
		max-width: min(95vw, 73.4%);
		transition: var(--transition);
	}

	.transparent {
		background: transparent !important;
		border: none !important;
		box-shadow: none !important;
	}

	.grid-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto;
		gap: clamp(1rem, 2vw, 2rem) clamp(1rem, 8vw, 24rem);
		width: 100%;
		justify-items: center;
		align-items: center;
	}

	.grid-item {
		position: relative;
	}

	.grid-item.has-cam :global(.number) {
		visibility: hidden;
	}

	.cam {
		position: absolute;
		left: 0;
		right: 0;
		bottom: calc(15px - clamp(1rem, 2vw, 2rem));
		margin-inline: auto;
		width: clamp(9rem, 24vw, 20rem);
		height: clamp(9rem, 24vw, 20rem);
		object-fit: cover;
		border-radius: 50%;
		background: transparent;
		pointer-events: none;
	}

	.cam.mirror {
		transform: scaleX(-1);
	}

	.grid-item:nth-child(1) {
		grid-column: 1;
		grid-row: 1;
	}

	.grid-item:nth-child(2) {
		grid-column: 2;
		grid-row: 1;
	}

	.grid-item:nth-child(3) {
		grid-column: 1;
		grid-row: 2;
	}

	.grid-item:nth-child(4) {
		grid-column: 2;
		grid-row: 2;
	}

	@media (max-width: 768px) {
		.grid-container {
			gap: clamp(1rem, 2vw, 1.5rem) clamp(1rem, 4vw, 2rem);
		}
	}

	@media (max-width: 480px) {
		.grid-container {
			gap: clamp(0.75rem, 1.5vw, 1rem) clamp(0.75rem, 3vw, 1.5rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.players-wrapper {
			transition: none !important;
		}
	}
</style>
