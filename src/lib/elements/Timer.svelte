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
		timer.timeAdd(240); // 4 минуты
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
		top: calc(50% + 6rem);
		z-index: 10;
		pointer-events: auto;
	}

	.timer {
		background: rgba(255, 255, 255, 0.07);
		border-radius: 2rem;
		padding: 1.2rem 3rem;
		font-size: 4rem;
		font-weight: 600;
		color: #fff;
		backdrop-filter: blur(8px);
		border: 2px solid rgba(255, 130, 30, 0.2);
		box-shadow: 0 0 35px rgba(255, 150, 50, 0.25);
		cursor: pointer;
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease;
		user-select: none;
		text-align: center;
		min-width: 14rem;
	}

	.timer:hover {
		transform: scale(1.05);
		box-shadow: 0 0 45px rgba(255, 150, 50, 0.4);
	}
</style>
