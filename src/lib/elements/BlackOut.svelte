<script>
	import { isBlackout, GlobalConfig } from "$lib/stores/parameters";
	import { fade } from "svelte/transition";
	import { onDestroy } from "svelte";

	export let blackoutTitle = "Время вышло!";
	export let exitTip = "Нажми чтобы закрыть";
	export let configKey = "audioTimerEnd";
	let audio;

	$: if ($isBlackout && GlobalConfig.get("timerBlackOut")) {
		loadBlackoutAudio();
	}

	async function loadBlackoutAudio() {
		if (!GlobalConfig.get("afterSound")) return;

		const url = await GlobalConfig.getMedia(configKey);
		if (url) {
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
			}
			audio = new Audio(url);
			audio.loop = true;
			audio.play();
		}
	}

	function hideBlackout() {
		isBlackout.set(false);
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}
	}

	onDestroy(() => {
		if (audio) {
			audio.pause();
			audio = null;
		}
	});
</script>

{#if $isBlackout && GlobalConfig.get("timerBlackOut")}
	<button class="blackout-overlay" on:click={hideBlackout} transition:fade>
		<div class="blackout-content">
			<h1 class="blackout-title">{blackoutTitle}</h1>
			<p class="exit-tip">{exitTip}</p>
		</div>
	</button>
{/if}

<style>
	.blackout-overlay {
		position: fixed;
		inset: 0;
		background: black;
		backdrop-filter: blur(3px);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		z-index: 3000;
		cursor: pointer;
	}

	.blackout-overlay:hover {
		background: var(--blackout-backround);
		box-shadow:
			0 0 35px var(--shadow),
			inset 0 0 16px var(--shadow);
	}

	.blackout-overlay {
		background-color: black;
		transform: none;
		box-shadow: none;

		box-shadow: 0 0 35px var(--shadow);
	}

	.blackout-content {
		text-align: center;
		color: var(--accent);
		transition: var(--transition);
	}

	.blackout-content:hover {
		transform: scale(1.08);
	}

	.blackout-title {
		font-size: 4rem;
		font-weight: 700;
		text-shadow: var(--shadow);
		margin-bottom: 2rem;
		user-select: none;
	}

	.exit-tip {
		color: var(--accent);
		font-size: 1rem;
		font-weight: 700;
		text-shadow: var(--shadow);
		margin-bottom: 2rem;
		user-select: none;
	}
</style>
