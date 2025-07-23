<script>
	import { tick } from "svelte";

	export let icon = null;
	export let title = null;
	export let tooltipText = null;
	export let onToggle = null;
	export let onOptionSelect = null;
	export let options = null;
	export let selectedOption = null;
	export let isToggled = undefined;

	export let mode = null;
	export let onClick = null;
	export let onHoldComplete = null;
	export let holdDuration = 3000;

	let holdProgress = 0;
	let holding = false;
	let holdTimeout;
	let progressInterval;
	let holdText = "";

	function toggleSwitch() {
		isToggled = !isToggled;
		if (onToggle) onToggle(isToggled);
	}

	function selectOption(option) {
		selectedOption = option;
		if (onOptionSelect) onOptionSelect(option);
	}

	function handleClick() {
		if (onClick) onClick();
	}

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

{#if title}
	<div class="menu-item">
		{#if icon}
			<div class="item-icon">{icon}</div>
		{/if}

		<div class="item-content">
			<div class="item-title">
				<span>{title}</span>
				{#if tooltipText}
					<div class="tooltip-wrapper">
						<span class="info-icon" tabindex="0" role="button">?</span>
						<div class="tooltip">{tooltipText}</div>
					</div>
				{/if}
			</div>

			{#if typeof isToggled === "boolean"}
				<div class="toggle-wrapper">
					<span class:label-active={!isToggled}>Выкл</span>
					<button
						class="toggle"
						class:toggle-on={isToggled}
						aria-label={isToggled ? "Отключить" : "Включить"}
						on:click={toggleSwitch}
					>
						<div class="circle"></div>
					</button>
					<span class:label-active={isToggled}>Вкл</span>
				</div>
			{/if}

			{#if options && options.length}
				<div class="option-list">
					{#each options as option}
						<button
							class:option
							class:active={option === selectedOption}
							on:click={() => selectOption(option)}
						>
							{option}
						</button>
					{/each}
				</div>
			{/if}

			{#if mode === "hold"}
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
							Зажми {Math.ceil(holdDuration / 1000)} сек
						{/if}
					</span>
				</div>
			{/if}

			{#if mode === "click"}
				<button class="option active" on:click={handleClick}> Нажми </button>
			{/if}
		</div>
	</div>
{/if}

<style>
	.menu-item {
		padding: 20px;
		margin: 12px 0;
		background: var(--bg);
		border-radius: 14px;
		border: 1px solid var(--accent);
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.menu-item:hover {
		box-shadow: 0 0 20px var(--shadow);
	}

	.item-icon {
		font-size: 2rem;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--input-bg);
		border-radius: 50%;
		color: var(--accent);
	}

	.item-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.item-title {
		font-size: 1.6rem;
		color: var(--fg);
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.tooltip-wrapper {
		position: relative;
		display: inline-block;
	}

	.info-icon {
		font-size: 1rem;
		background: var(--accent);
		color: var(--input-bg);
		border-radius: 50%;
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: help;
		position: relative;
		z-index: 1;
	}

	.tooltip {
		opacity: 0;
		visibility: hidden;
		position: absolute;
		bottom: 140%;
		left: 50%;
		transform: translateX(-50%);
		background: var(--tooltip-bg, #222);
		color: var(--tooltip-fg, #fff);
		padding: 6px 10px;
		border-radius: 8px;
		font-size: 1.2rem;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		transition: opacity 0.2s ease;
		z-index: 1000;
		max-width: 300px;
		text-align: center;
		pointer-events: none;
	}

	.tooltip-wrapper:hover .tooltip,
	.tooltip-wrapper:focus-within .tooltip {
		opacity: 1;
		visibility: visible;
	}

	.toggle-wrapper {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 1.2rem;
		color: var(--fg-muted, #888);
		user-select: none;
	}

	.label-active {
		color: var(--accent);
		font-weight: bold;
	}

	.toggle {
		width: 42px;
		height: 24px;
		border-radius: 999px;
		background: var(--input-bg);
		border: 1px solid var(--accent);
		padding: 2px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.toggle.toggle-on {
		justify-content: flex-end;
	}

	.toggle .circle {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--fg);
		transition: background 0.3s ease;
	}

	.toggle.toggle-on .circle {
		background: var(--accent);
	}

	.option-list {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.option {
		padding: 6px 12px;
		background: var(--input-bg);
		color: var(--fg);
		border: 1px solid var(--accent);
		border-radius: 8px;
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease;
		font-size: 1.3rem;
	}

	.option.active {
		background: var(--accent);
		color: var(--input-bg);
		font-weight: bold;
		box-shadow: 0 0 10px var(--shadow);
	}

	.progress-bar {
		width: 100%;
		height: 5vh;
		position: relative;
		background: var(--input-bg);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
	}

	.progress-bar .bar {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 0%;
		background: var(--accent);
		transition: width 0.1s linear;
		z-index: 1;
	}

	.bar-text {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 1.3rem;
		color: white;
		user-select: none;
		pointer-events: none;
		font-weight: 500;
	}
</style>
