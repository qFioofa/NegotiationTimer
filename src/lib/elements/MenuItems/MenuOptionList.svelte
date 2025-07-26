<script>
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import Common from "./Wrappers/Common.svelte";

	export let icon;
	export let title;
	export let tooltipText;
	export let options;
	export let selectedOption;

	export let onOptionSelect = () => {};

	function selectOption(option) {
		selectedOption = option;
		if (onOptionSelect) onOptionSelect(option);
	}
</script>

<Common {icon} {title} {tooltipText}>
	<InputGroup>
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
	</InputGroup>
</Common>

<style>
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
