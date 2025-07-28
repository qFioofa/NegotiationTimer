<script>
	import RollingDigit from "./RollingDigit.svelte";

	export let value = "00:05";
	export let fontSize = 64;
	export let padding = 8;

	const height = fontSize + padding;

	function parseDigits(str) {
		return str.split("").map(c => (/\d/.test(c) ? parseInt(c) : c));
	}
</script>

<div class="counter" style="font-size: {fontSize}px; height: {height}px;">
	{#each parseDigits(value) as char, i}
		{#if typeof char === "number"}
			{#if i === 0 || i === 3}
				<div class="digit-wrapper" style="width: 0.6em;">
					<RollingDigit digit={char} {fontSize} maxDigit={6} />
				</div>
			{:else}
				<div class="digit-wrapper" style="width: 0.6em;">
					<RollingDigit digit={char} {fontSize} maxDigit={10} />
				</div>
			{/if}
		{:else}
			<span class="separator">{char}</span>
		{/if}
	{/each}
</div>

<style>
	.counter {
		display: flex;
		align-items: center;
		gap: 0.1em;
		font-family: var(--font-family-accent);
		font-weight: var(--font-weight-bold);
		line-height: 1;
	}

	.digit-wrapper {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.separator {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--accent-light);
		user-select: none;
		font-weight: var(--font-weight-bold);
		height: 100%;
	}
</style>
