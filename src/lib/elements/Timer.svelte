<script>
	import ExtraButtonsWrapper from "./Wrappers/ExtraButtonsWrapper.svelte";
	import { GlobalConfig, isBlackout } from "$lib/stores/parameters";
	import { timerDisplay } from "$lib/components/utils/TimerUtils";
	import RollingCounter from "./Timer/RollingCounter.svelte";
	import ExtraButtons from "./General/ExtraButtons.svelte";
	import TimerButton from "./Timer/TimerButton.svelte";
	import { isPaused } from "$lib/components/Pause";
	import BlackOut from "./BlackOut.svelte";
	import { get } from "svelte/store";
	import { onMount } from "svelte";
	import {
		initTimer,
		isRunning,
		toggleTimer,
		startTimer,
		timeAdd,
		timeSubtract,
		timeMs,
		toMs,
		downTimerSnap,
	} from "$lib/stores/timerDown";

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

	let extraButtonsOn = GlobalConfig.get("extraButtonsOn");

	onMount(() => {
		initTimer();
		GlobalConfig.subscribe("extraButtonsOn", v => (extraButtonsOn = v));
	});
</script>

<BlackOut blackoutTitle="Время вышло!" configKey="audioTimerEnd" />

<div class="timer-wrapper">
	<div class="timer-container">
		<TimerButton bind:displayTime onClick={toggleTimer} />
		{#if extraButtonsOn}
			<ExtraButtonsWrapper>
				<ExtraButtons
					icon="🔄"
					onClick={() => {
						timeSubtract(toMs());
						timeAdd(get(downTimerSnap) / 1000);
						GlobalConfig.set("timerDuration", get(downTimerSnap) / 1000);
					}}
				/>
				<ExtraButtons
					icon="⏯️"
					onClick={() => {
						isPaused.set(true);
					}}
				/>
			</ExtraButtonsWrapper>
		{/if}
	</div>
</div>

<style>
	.timer-wrapper {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(66.6% + 6rem);
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: auto;
		z-index: 10;
	}

	.timer-container {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
</style>
