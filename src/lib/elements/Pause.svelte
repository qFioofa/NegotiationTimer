<script>
	import { upTimeMs, upIsRunning, resetUpTimer, toggleUpTimer } from "$lib/stores/timerUp";
	import { timerDisplay } from "$lib/components/utils/TimerUtils";
	import TimerButton from "./Timer/TimerButton.svelte";
	import { isPaused } from "$lib/components/Pause";

	let displayUpTime = "00:00";

	$: {
		displayUpTime = timerDisplay($upTimeMs);
	}

	$: if (!$isPaused) {
		resetUpTimer();
	}
</script>

<div class="pause-overlay" class:active={$isPaused}>
	{#if $isPaused}
		<div class="pause-content">
			<h1 class="pause-title">ПАУЗА</h1>
			<TimerButton displayTime={displayUpTime} onClick={toggleUpTimer} />
		</div>
	{/if}
</div>

<style>
	.pause-overlay {
		position: fixed;
		inset: 0;
		display: none;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		z-index: 999;
	}

	.pause-overlay.active {
		display: flex;
	}

	.pause-content {
		text-align: center;
	}

	.pause-title {
		margin-bottom: 2rem;
	}

	.pause-overlay {
		background: var(--pause-backround);
		backdrop-filter: blur(3px);
		opacity: 0;
		pointer-events: none;
	}

	.pause-overlay.active {
		opacity: 1;
		pointer-events: auto;
	}

	.pause-content {
		color: var(--accent-light);
	}

	.pause-title {
		text-shadow: 0 0 10px var(--accent);
	}

	.pause-title {
		font-family: var(--font-family-accent);
		font-size: 4rem;
		font-weight: var(--font-weight-bold);
		user-select: none;
	}

	.pause-overlay {
		transition: opacity 0.3s ease;
	}

	.pause-title {
		transition: opacity 1s ease;
	}
</style>
