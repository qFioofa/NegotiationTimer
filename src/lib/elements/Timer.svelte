<script>
	import { GlobalConfig, isBlackout } from "$lib/stores/parameters";
	import { timerDisplay } from "$lib/components/utils/TimerUtils";
	import { isPaused } from "$lib/components/Pause";
	import BlackOut from "./BlackOut.svelte";
	import { onMount } from "svelte";
	import TimerButton from "./Timer/TimerButton.svelte";
	import RollingCounter from "./Timer/RollingCounter.svelte";
	import { initTimer, isRunning, toggleTimer, startTimer, timeMs } from "$lib/stores/timerDown";

	let wasRunningBeforePause = false;
	let wasStartedOnce = false;

	let displayTime = GlobalConfig.get("timerDuration") || "00:00";

	$: {
		displayTime = timerDisplay($timeMs);
	}

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
	<TimerButton bind:displayTime onClick={toggleTimer} />
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
</style>
