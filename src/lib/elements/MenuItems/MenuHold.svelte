<script>
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import Common from "./Wrappers/Common.svelte";
	import { tick } from "svelte";

	export let icon;
	export let title;
	export let tooltipText;

	export let onHoldComplete = () => {};
	export let holdDuration = 3000;

	let holdProgress = 0;
	let holding = false;
	let holdTimeout;
	let progressInterval;
	let holdText = "";

	async function handleHoldStart() {
		holding = true;
		holdProgress = 0;
		holdText = "Зажимай...";

		progressInterval = setInterval(async () => {
			holdProgress += 100 / (holdDuration / 100);
			if (holdProgress >= 100) {
				holdProgress = 100;
				holdText = "Готово!";
				clearInterval(progressInterval);

				await tick();
				setTimeout(() => {
					if (onHoldComplete) onHoldComplete();
					clearHold();
				}, 1500);
			}
			await tick();
		}, 100);
	}

	function handleHoldCancel() {
		clearHold();
	}

	function clearHold() {
		clearTimeout(holdTimeout);
		clearInterval(progressInterval);
		holding = false;
		holdProgress = 0;
		holdText = "";
	}
</script>

<Common {icon} {title} {tooltipText}>
	<InputGroup>
		<div
			class="progress-bar"
			role="button"
			tabindex="0"
			on:mousedown={handleHoldStart}
			on:mouseup={handleHoldCancel}
			on:mouseleave={handleHoldCancel}
		>
			<div class="bar" style="width: {holdProgress}%"></div>
			<span class="bar-text">
				{#if holdText}
					{holdText}
				{:else}
					Зажми на {Math.ceil(holdDuration / 1000)} сек
				{/if}
			</span>
		</div>
	</InputGroup>
</Common>

<style>
	.progress-bar {
		width: 100%;
		height: 5vh;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
	}

	.bar {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 0%;
	}

	.bar-text {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.progress-bar {
		background: var(--input-bg);
		box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		user-select: none;
	}

	.bar {
		background: var(--accent);
	}

	.bar-text {
		color: var(--accent-light);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	.bar-text {
		font-size: 1.3rem;
		font-family: var(--font-family-base);
		font-weight: var(--font-weight-medium);
		line-height: var(--line-height-base);
		letter-spacing: var(--letter-spacing-normal);
	}

	.bar {
		transition: width 0.1s linear;
	}

	.progress-bar:active {
		transform: scale(0.98);
		transition: transform 0.1s ease;
	}
</style>
