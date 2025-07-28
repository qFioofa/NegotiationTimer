<script>
	import { upTimeMs, upIsRunning, resetUpTimer, toggleUpTimer } from "$lib/stores/timerUp";
	import ExtraButtonsWrapper from "./Wrappers/ExtraButtonsWrapper.svelte";
	import { GlobalConfig, isPanelOpen } from "$lib/stores/parameters";
	import { timerDisplay } from "$lib/components/utils/TimerUtils";
	import ExtraButtons from "./General/ExtraButtons.svelte";
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
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		z-index: 999;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}

	.pause-overlay.active {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
	}

	.pause-title-wrapper {
		margin: 5rem;
		padding: var(--spacing-md) var(--spacing-xl);
		border-radius: var(--radius-lg);
		border: none;
		transform: scale(0.8);
		opacity: 0;
	}

	.pause-overlay.active .pause-title-wrapper {
		transform: scale(1);
		opacity: 1;
		transition:
			transform 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275),
			opacity 0.9s ease;
	}

	.pause-content {
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		transform: translateY(20px);
		opacity: 0;
	}

	.pause-overlay.active .pause-content {
		transform: translateY(0);
		opacity: 1;
		transition:
			transform 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s,
			opacity 0.9s ease 0.3s;
	}

	.pause-overlay {
		background: var(--pause-backround);
		backdrop-filter: blur(8px);
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
		transition:
			opacity 0.5s ease,
			visibility 0.5s ease;
	}
</style>
