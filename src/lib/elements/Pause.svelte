<script>
	import { upTimeMs, upIsRunning, resetUpTimer, toggleUpTimer } from "$lib/stores/timerUp";
	import ExtraButtonsWrapper from "./Wrappers/ExtraButtonsWrapper.svelte";
	import { timerDisplay } from "$lib/components/utils/TimerUtils";
	import ExtraButtons from "./General/ExtraButtons.svelte";
	import { GlobalConfig, isPanelOpen } from "$lib/stores/parameters";
	import TimerButton from "./Timer/TimerButton.svelte";
	import { isPaused } from "$lib/components/Pause";
	import { onMount } from "svelte";

	let displayUpTime = "00:00";

	$: {
		displayUpTime = timerDisplay($upTimeMs);
	}

	$: if (!$isPaused) {
		resetUpTimer();
	}

	let panelAutoOpen = GlobalConfig.get("panelAutoOpen");
	let extraButtonsPauseOn = GlobalConfig.get("extraButtonsPauseOn");

	onMount(() => {
		GlobalConfig.subscribe("panelAutoOpen", v => (panelAutoOpen = v));
		GlobalConfig.subscribe("extraButtonsPauseOn", v => (extraButtonsPauseOn = v));
	});
</script>

<div class="pause-overlay" class:active={$isPaused}>
	{#if $isPaused}
		<div class="pause-title-wrapper">
			<h1 class="pause-title">ПАУЗА</h1>
		</div>
		{#if !$isPanelOpen || ($isPanelOpen && !panelAutoOpen)}
			<div class="pause-content">
				<TimerButton displayTime={displayUpTime} onClick={toggleUpTimer} />
				{#if extraButtonsPauseOn}
					<ExtraButtonsWrapper>
						<ExtraButtons icon="🔃" onClick={resetUpTimer} />
						<ExtraButtons
							icon="❌"
							onClick={() => {
								isPaused.set(false);
							}}
						/>
					</ExtraButtonsWrapper>
				{/if}
			</div>
		{/if}
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

	.pause-title-wrapper {
		margin: 5rem;
		padding: var(--spacing-md) var(--spacing-xl);
		border-radius: var(--radius-lg);
		border: none;
	}

	.pause-content {
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.pause-overlay {
		background: var(--pause-backround);
		backdrop-filter: blur(8px);
		opacity: 0;
		pointer-events: none;
	}

	.pause-overlay.active {
		opacity: 1;
		pointer-events: auto;
	}

	.pause-title {
		color: var(--accent-light);
	}

	.pause-title {
		font-family: var(--font-family-accent);
		font-size: 8rem;
		font-weight: var(--font-weight-black);
		line-height: var(--line-height-tight);
		letter-spacing: var(--letter-spacing-wide);
		text-align: center;
		user-select: none;
		margin: 0;
	}

	.pause-overlay {
		transition: opacity 0.5s ease;
	}

	.pause-title {
		transition: opacity 1s ease;
		animation: pulse 2s infinite;
	}
</style>
