<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import TimerLogic from "$lib/components/TimerLogic";

	let timer = new TimerLogic();
	let displayTime = "00:00";

	const formatTime = (ms: number): string => {
		const totalSec = Math.floor(ms / 1000);
		const min = Math.floor(totalSec / 60)
			.toString()
			.padStart(2, "0");
		const sec = (totalSec % 60).toString().padStart(2, "0");
		return `${min}:${sec}`;
	};

	const updateDisplay = () => {
		displayTime = formatTime(timer.toMs());
	};

	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		timer.timeAdd(240);
		updateDisplay();

		interval = setInterval(updateDisplay, 500);
	});

	onDestroy(() => {
		clearInterval(interval);
		timer.pause();
	});

	function toggleTimer() {
		timer.isRunning ? timer.pause() : timer.launch();
	}
</script>

<div class="timer-wrapper">
	<div class="timer" on:click={toggleTimer}>
		{displayTime}
	</div>
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
