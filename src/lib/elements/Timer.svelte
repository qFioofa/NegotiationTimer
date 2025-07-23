<script>
	import { onMount } from "svelte";
	import { isPaused } from "$lib/components/Pause";
	import BlackOut from "./BlackOut.svelte";
	import {
		displayTime,
		isRunning,
		toggleTimer,
		startTimer,
		initTimer,
		timeMs,
		isBlackout,
	} from "$lib/stores/parameters";

	let wasRunningBeforePause = false;
	let wasStartedOnce = false;

	$: if ($isPaused) {
		if ($isRunning) {
			wasRunningBeforePause = true;
			toggleTimer();
		}
	} else {
		if (wasRunningBeforePause) {
			startTimer();
			wasRunningBeforePause = false;
		}
	}

	$: if ($isRunning) {
		wasStartedOnce = true;
	}

	$: if (wasStartedOnce && $timeMs === 0 && $isRunning === false) {
		isBlackout.set(true);
	}

	onMount(() => {
		initTimer();
	});
</script>

<BlackOut blackoutTitle="Время вышло!" configKey="audioTimerEnd" />

<div class="timer-wrapper">
	<button class="timer" on:click={toggleTimer}>
		{$displayTime}
	</button>
</div>

<style>
	.timer-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		right: 0;
		top: calc(66.6% + 6rem);
		z-index: 10;
		pointer-events: auto;
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
