<script>
	import ExtraButtonsWrapper from "./Wrappers/ExtraButtonsWrapper.svelte";
	import { timerDisplay } from "$lib/components/utils/TimerUtils";
	import RollingCounter from "./Timer/RollingCounter.svelte";
	import ExtraButtons from "./General/ExtraButtons.svelte";
	import TimerButton from "./Timer/TimerButton.svelte";
	import { RotateCcw, Pause, Shuffle } from "lucide-svelte";
	import { isPaused } from "$lib/components/Pause";
	import { canEditTimer } from "$lib/stores/room";
	import BlackOut from "./BlackOut.svelte";
	import { get } from "svelte/store";
	import { onMount } from "svelte";
	import {
		ShuffleFunction,
		GlobalConfig,
		isPanelOpen,
		isBlackout,
	} from "$lib/stores/parameters";
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

	async function handleShuffle() {
		const ShufflePlayers = await $ShuffleFunction;
		if (ShufflePlayers) await ShufflePlayers();
	}

	let wasRunningBeforePause = $state(false);
	let wasStartedOnce = $state(false);

	let displayTime = $derived(timerDisplay($timeMs));

	$effect(() => {
		if ($isPaused) {
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
	});

	$effect(() => {
		if ($isRunning) {
			wasStartedOnce = true;
		}
	});

	$effect(() => {
		if (wasStartedOnce && $timeMs === 0 && $isRunning === false) {
			isBlackout.set(true);
		}
	});

	let extraButtonsOn = $state(GlobalConfig.get("extraButtonsOn"));

	onMount(() => {
		// initTimer();
		return GlobalConfig.subscribe(
			"extraButtonsOn",
			(v) => (extraButtonsOn = v),
		);
	});
</script>

<BlackOut blackoutTitle="Время вышло!" configKey="audioTimerEnd" />

<div class="timer-wrapper">
	<div class="timer-container">
		<TimerButton
			{displayTime}
			disabled={!$canEditTimer}
			onClick={$canEditTimer ? toggleTimer : () => {}}
		/>
		{#if extraButtonsOn && $canEditTimer}
			<ExtraButtonsWrapper>
				<ExtraButtons
					icon={RotateCcw}
					tooltip="Сбросить время к стартовому"
					onClick={() => {
						timeSubtract(toMs());
						timeAdd($downTimerSnap);
						GlobalConfig.set("timerDuration", $downTimerSnap);
					}}
				/>
				<ExtraButtons
					icon={Pause}
					tooltip="Поставить на паузу"
					onClick={() => {
						isPaused.set(true);
					}}
				/>
				<ExtraButtons
					icon={Shuffle}
					tooltip="Жеребьёвка игроков"
					onClick={() => {
						handleShuffle();
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
		/* На высоких экранах — нижняя треть (как задумано); на низких/landscape
		   окнах min() не даёт таймеру уехать за нижний край. */
		top: min(calc(66.6% + 6rem), calc(100vh - 13rem));
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
