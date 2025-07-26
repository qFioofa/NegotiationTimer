<script>
	import { timerDisplay } from "$lib/components/utils/TimerUtils";
	import { isPaused } from "$lib/components/Pause";
	import {
		upTimeMs,
		upIsRunning,
		startUpTimer,
		stopUpTimer,
		resetUpTimer,
	} from "$lib/stores/timerUp";

	let displayUpTime = "00:00";

	$: {
		displayUpTime = timerDisplay($upTimeMs);
	}

	$: if (!$isPaused) {
		resetUpTimer();
	}

	function toggleUpTimer() {
		if ($upIsRunning) {
			stopUpTimer();
		} else {
			startUpTimer();
		}
	}
</script>

<div class="pause-overlay" class:active={$isPaused}>
	{#if $isPaused}
		<div class="pause-content">
			<h1 class="pause-title">ПАУЗА</h1>
			<button class="timer" on:click={toggleUpTimer}>
				{displayUpTime}
			</button>
		</div>
	{/if}
</div>

<style>
	.pause-overlay {
		position: fixed;
		inset: 0;
		background: var(--pause-backround);
		backdrop-filter: blur(3px);
		display: none;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		z-index: 999;
		transition: opacity 0.3s ease;
		opacity: 0;
		pointer-events: none;
	}

	.pause-overlay.active {
		display: flex;
		opacity: 1;
		pointer-events: auto;
	}

	.pause-content {
		text-align: center;
		color: var(--accent-light);
	}

	.pause-title {
		transition: opacity 1s ease;
		font-size: 4rem;
		font-weight: 700;
		text-shadow: 0 0 20px var(--accent);
		margin-bottom: 2rem;
		user-select: none;
	}

	.timer {
		background: var(--bg);
		border-radius: 2rem;
		padding: 1.6rem 4rem;
		font-size: 4.2rem;
		font-weight: 700;
		color: var(--accent-light);
		border: 2px solid var(--accent);
		backdrop-filter: blur(14px);
		box-shadow:
			0 0 20px var(--shadow),
			inset 0 0 10px var(--shadow);
		text-align: center;
		user-select: none;
		cursor: pointer;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			background 0.3s ease;
		min-width: 16rem;
		text-shadow: 0 0 8px var(--shadow);
	}

	.timer:hover {
		transform: scale(1.08);
		box-shadow:
			0 0 35px var(--shadow),
			inset 0 0 16px var(--shadow);
	}

	@media (max-width: 768px) {
		.timer {
			font-size: 3.2rem;
			padding: 1.2rem 2.5rem;
			min-width: 12rem;
		}
	}
</style>
