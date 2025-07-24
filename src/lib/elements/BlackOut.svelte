<script>
	import { derived } from "svelte/store";
	import { isBlackout, GlobalConfig } from "$lib/stores/parameters";
	import { fade } from "svelte/transition";
	import { onDestroy } from "svelte";

	let blackoutTitle = "Время вышло!";
	let configKey = "audioTimerEnd";
	let audio;

	$: if ($isBlackout && GlobalConfig.get("timerBlackOut")) {
		loadBlackoutAudio();
	}

	async function loadBlackoutAudio() {
		const url = await GlobalConfig.getMedia(configKey);
		if (url) {
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
			}
			audio = new Audio(url);
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
		z-index: 2000;
		cursor: pointer;
	}

	.blackout-content {
		text-align: center;
		color: var(--accent);
	}

	.blackout-title {
		font-size: 4rem;
		font-weight: 700;
		text-shadow: var(--shadow);
		margin-bottom: 2rem;
		user-select: none;
	}
</style>
