<script>
	export let icon = null;
	export let title = null;
	export let tooltipText = null;
	export let isToggled = null;
	export let onToggle = null;
	export let options = null;
	export let selectedOption = null;
	export let onOptionSelect = null;

	function toggleSwitch() {
		if (onToggle) onToggle(!isToggled);
	}

	function selectOption(option) {
		if (onOptionSelect) onOptionSelect(option);
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
						<span class="info-icon" tabindex="0" aria-label="Показать подсказку" role="button"
							>?</span
						>
						<div class="tooltip" role="tooltip">{tooltipText}</div>
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
						type="button"
						on:click|stopPropagation={toggleSwitch}
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
							type="button"
							class:option={true}
							class:active={option === selectedOption}
							on:click|stopPropagation={() => selectOption(option)}
							aria-label={`Выбрать ${option}`}
						>
							{option}
						</button>
					{/each}
				</div>
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
		position: relative;
		gap: 1rem;
		display: flexbox;
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
		position: relative;
	}

	.item-title {
		font-size: 1.6rem;
		color: var(--fg);
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: relative;
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
		z-index: 1001;
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
		white-space: normal;
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
		z-index: 100;
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
</style>
